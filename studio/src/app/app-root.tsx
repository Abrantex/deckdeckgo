import {Build, Component, Element, h, Listen} from '@stencil/core';

import {toastController} from '@ionic/core';

import {Subscription} from 'rxjs';

import {ErrorService} from './services/core/error/error.service';
import {AuthService} from './services/auth/auth.service';

import {NavDirection, NavParams, NavService} from './services/core/nav/nav.service';

import {ThemeService} from './services/theme/theme.service';
import {OfflineService} from './services/editor/offline/offline.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  @Element() el: HTMLElement;

  private errorSubscription: Subscription;
  private errorService: ErrorService;

  private authService: AuthService;

  private navSubscription: Subscription;
  private navService: NavService;

  private themeSubscription: Subscription;
  private themeService: ThemeService;

  private offlineService: OfflineService;

  private domBodyClassList: DOMTokenList = document.body.classList;

  constructor() {
    this.errorService = ErrorService.getInstance();
    this.authService = AuthService.getInstance();
    this.navService = NavService.getInstance();
    this.themeService = ThemeService.getInstance();
    this.offlineService = OfflineService.getInstance();
  }

  async componentWillLoad() {
    if (Build.isBrowser) {
      await this.authService.init();
      await this.themeService.initDarkModePreference();
      await this.offlineService.init();
    }
  }

  async componentDidLoad() {
    this.errorSubscription = this.errorService.watch().subscribe(async (error: string) => {
      await this.toastError(error);
    });

    this.navSubscription = this.navService.watch().subscribe(async (params: NavParams) => {
      await this.navigate(params);
    });

    this.themeSubscription = this.themeService.watch().subscribe((dark: boolean) => {
      this.updateDarkModePreferences(dark);
    });
  }

  async componentDidUnload() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }

    if (this.navSubscription) {
      this.navSubscription.unsubscribe();
    }

    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private async toastError(error: string) {
    const popover: HTMLIonToastElement = await toastController.create({
      message: error,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
      position: 'top',
      color: 'danger',
      duration: 6000,
    });

    await popover.present();
  }

  private updateDarkModePreferences(dark: boolean) {
    dark ? this.domBodyClassList.add('dark') : this.domBodyClassList.remove('dark');
  }

  private async navigate(params: NavParams) {
    if (!params) {
      return;
    }

    const router: HTMLIonRouterElement = this.el.querySelector('ion-router');

    if (!router) {
      return;
    }

    if (params.direction === NavDirection.ROOT) {
      window.location.assign(params.url);
    } else if (params.direction === NavDirection.BACK) {
      await router.back();
    } else {
      await router.push(params.url);
    }
  }

  @Listen('openShare', {target: 'document'})
  async openShare() {
    const shareDeck: HTMLElement = this.el.querySelector('app-share-deck');

    if (!shareDeck) {
      return;
    }

    await (shareDeck as any).openShare();
  }

  render() {
    return [
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-welcome" />

          <ion-route url="/home" component="app-home" />

          <ion-route url="/discover" component="app-discover" />

          <ion-route url="/enterprise" component="app-enterprise" />

          <ion-route url="/editor" component="app-editor" />
          <ion-route url="/editor/:deckId" component="app-editor" />

          <ion-route url="/settings" component="app-settings" />

          <ion-route url="/dashboard" component="app-dashboard" />

          <ion-route url="/signin" component="app-signin" />
          <ion-route url="/signin/:redirect" component="app-signin" />

          <ion-route url="/about" component="app-about" />
          <ion-route url="/faq" component="app-faq" />
          <ion-route url="/team" component="app-team" />
          <ion-route url="/opensource" component="app-opensource" />
          <ion-route url="/privacy" component="app-privacy" />
          <ion-route url="/terms" component="app-terms" />
          <ion-route url="/services" component="app-services" />
          <ion-route url="/developer" component="app-developer" />
          <ion-route url="/contact" component="app-contact" />
          <ion-route url="/newsletter" component="app-newsletter" />
          <ion-route url="/press" component="app-press" />

          <ion-route url="/remote" component="app-remote" />

          <ion-route url="/poll" component="app-poll" />
          <ion-route url="/poll/:pollKey" component="app-poll" />
        </ion-router>

        <ion-menu id="ion-menu" side="start" type="overlay" swipeGesture={false} content-id="menu-content">
          <ion-content>
            <ion-menu-toggle autoHide={false}>
              <app-menu></app-menu>

              <app-footer></app-footer>
            </ion-menu-toggle>
          </ion-content>
        </ion-menu>

        <ion-nav id="menu-content" />

        <app-share-deck></app-share-deck>
      </ion-app>,
    ];
  }
}
