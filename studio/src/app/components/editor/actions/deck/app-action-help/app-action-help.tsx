import {Component, h, Element, Prop, Event, EventEmitter} from '@stencil/core';

import {popoverController} from '@ionic/core';

@Component({
  tag: 'app-action-help'
})
export class AppActionHelp {
  @Element() el: HTMLElement;

  @Prop()
  link: boolean = false;

  @Event()
  private helpSelected: EventEmitter<void>;

  private async openGetHelp() {
    this.helpSelected.emit();

    const popover: HTMLIonPopoverElement = await popoverController.create({
      component: 'app-get-help',
      mode: 'ios',
      cssClass: 'info'
    });

    await popover.present();
  }

  render() {
    if (this.link) {
      return (
        <a onClick={() => this.openGetHelp()} aria-label="Help">
          <p>Help</p>
        </a>
      );
    } else {
      return (
        <ion-tab-button onClick={() => this.openGetHelp()} color="primary" mode="md" class="get-help-action">
          <ion-icon src="/assets/icons/ionicons/help.svg"></ion-icon>
          <ion-label>Help</ion-label>
        </ion-tab-button>
      );
    }
  }
}
