import {Component, Element, Listen, State, h} from '@stencil/core';

import {ListResult, Reference} from '@firebase/storage-types';

import {ImageHistoryService} from '../../../services/editor/image-history/image-history.service';
import {StorageService} from '../../../services/storage/storage.service';

@Component({
    tag: 'app-custom-images',
    styleUrl: 'app-custom-images.scss'
})
export class AppCustomImages {

    @Element() el: HTMLElement;

    private storageService: StorageService;

    private imageHistoryService: ImageHistoryService;

    @State()
    private imagesOdd: Reference[];

    @State()
    private imagesEven: Reference[];

    @State()
    private disableInfiniteScroll = false;

    private paginationNext: string | null;

    constructor() {
        this.imageHistoryService = ImageHistoryService.getInstance();
        this.storageService = StorageService.getInstance();
    }

    async componentDidLoad() {
        history.pushState({modal: true}, null);

        await this.search();
    }

    @Listen('popstate', { target: 'window' })
    async handleHardwareBackButton(_e: PopStateEvent) {
        await this.closeModal();
    }

    async closeModal() {
        await (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss();
    }

    private selectPhoto($event: CustomEvent): Promise<void> {
        return new Promise<void>(async (resolve) => {
            if (!$event || !$event.detail) {
                resolve();
                return;
            }

            const photo: Reference = $event.detail;

            await this.imageHistoryService.push(photo);

            await (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss(photo);

            resolve();
        });
    }

    private search(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const list: ListResult = await this.storageService.getImages(this.paginationNext);

            if (!list) {
                resolve();
                return;
            }

            if (!list.items || list.items.length <= 0) {
                this.emptyImages();

                resolve();
                return;
            }

            if (!this.imagesOdd) {
                this.imagesOdd = [];
            }

            if (!this.imagesEven) {
                this.imagesEven = [];
            }

            this.imagesOdd = [...this.imagesOdd, ...list.items.filter((_a, i) => !(i % 2))];
            this.imagesEven = [...this.imagesEven, ...list.items.filter((_a, i) => i % 2)];

            this.paginationNext = list.nextPageToken;

            this.disableInfiniteScroll = list.items.length < this.storageService.maxQueryResults;

            resolve();
        });
    }

    private emptyImages() {
        this.imagesOdd = [];
        this.imagesEven = [];

        this.disableInfiniteScroll = true;
    }

    private searchNext(e: CustomEvent<void>): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.search();

            (e.target as HTMLIonInfiniteScrollElement).complete();

            resolve();
        });
    }

    private openFilePicker(): Promise<void> {
        return new Promise<void>((resolve) => {
            const filePicker: HTMLInputElement = this.el.querySelector('input');

            if (!filePicker) {
                resolve();
                return;
            }

            filePicker.click();

            resolve();
        });
    }

    private upload(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const filePicker: HTMLInputElement = this.el.querySelector('input');

            if (!filePicker) {
                resolve();
                return;
            }

            if (filePicker.files && filePicker.files.length > 0) {
                await this.storageService.uploadImage(filePicker.files[0]);
            }

            resolve();
        });
    }

    render() {
        return [
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-buttons slot="start">
                        <ion-button onClick={() => this.closeModal()}>
                            <ion-icon name="close"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                    <ion-title class="ion-text-uppercase">Pick one of your images</ion-title>
                </ion-toolbar>
            </ion-header>,
            <ion-content class="ion-padding">
                <app-image-columns imagesOdd={this.imagesOdd} imagesEven={this.imagesEven}
                                  onSelectImage={($event: CustomEvent) => this.selectPhoto($event)}>
                </app-image-columns>

                <ion-button onClick={() => this.openFilePicker()}>Upload</ion-button>

                <input type="file" accept="image/x-png,image/jpeg,image/gif" onChange={() => this.upload()}/>

                <ion-infinite-scroll threshold="100px" disabled={this.disableInfiniteScroll}
                                     onIonInfinite={(e: CustomEvent<void>) => this.searchNext(e)}>
                    <ion-infinite-scroll-content
                        loadingSpinner="bubbles"
                        loadingText="Loading more data...">
                    </ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        ];
    }

}
