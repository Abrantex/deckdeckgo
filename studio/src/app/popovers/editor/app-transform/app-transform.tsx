import {Component, Element, h, Prop} from '@stencil/core';

import {SlotType} from '../../../utils/editor/slot-type';

@Component({
  tag: 'app-transform',
  styleUrl: 'app-transform.scss',
})
export class AppTransform {
  @Element() el: HTMLElement;

  @Prop()
  selectedElement: HTMLElement;

  private async closePopover(type?: SlotType) {
    await (this.el.closest('ion-popover') as HTMLIonPopoverElement).dismiss({
      type: type,
    });
  }

  render() {
    return [
      <ion-toolbar>
        <h2>Transform element</h2>
        <ion-router-link slot="end" onClick={() => this.closePopover()}>
          <ion-icon aria-label="Close" src="/assets/icons/ionicons/close.svg"></ion-icon>
        </ion-router-link>
      </ion-toolbar>,

      <app-slot-type selectedElement={this.selectedElement} onSelectType={($event: CustomEvent<SlotType>) => this.closePopover($event.detail)}></app-slot-type>,
    ];
  }
}
