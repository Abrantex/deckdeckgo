import {Component, Element, EventEmitter, Prop, State, h} from '@stencil/core';

@Component({
  tag: 'app-math',
  styleUrl: 'app-math.scss',
})
export class AppMath {
  @Element() el: HTMLElement;

  @Prop()
  selectedElement: HTMLElement;

  @Prop()
  mathDidChange: EventEmitter<HTMLElement>;

  @State()
  private macros: string | undefined;

  constructor() {}

  async componentWillLoad() {
    await this.initCurrent();
  }

  private async closePopover() {
    await (this.el.closest('ion-popover') as HTMLIonPopoverElement).dismiss();
  }

  private async initCurrent(): Promise<void> {
    this.macros = this.selectedElement ? this.selectedElement.getAttribute('macros') : undefined;
  }

  private emitMathDidChange() {
    this.mathDidChange.emit(this.selectedElement);
  }

  private handleMacrosInput($event: CustomEvent<KeyboardEvent>) {
    this.macros = ($event.target as InputTargetEvent).value;
  }

  private async applyMacrosInput(): Promise<void> {
    if (!this.selectedElement) {
      return;
    }

    if (this.macros && this.macros !== '') {
      this.selectedElement.setAttribute('macros', this.macros);
    } else {
      this.selectedElement.removeAttribute('macros');
    }

    this.emitMathDidChange();
  }

  render() {
    return [
      <ion-toolbar>
        <h2>Math options</h2>
        <button slot="end" class="close-options" onClick={() => this.closePopover()} tabindex={0}>
          <ion-icon aria-label="Close" src="/assets/icons/ionicons/close.svg"></ion-icon>
        </button>
      </ion-toolbar>,
      <ion-list class="article">
        <ion-item-divider>
          <ion-label>Macros</ion-label>
        </ion-item-divider>

        <ion-item class="select">
          <ion-textarea
            rows={5}
            value={this.macros}
            debounce={500}
            maxlength={254}
            placeholder="A collection of custom macros. Property with a name like \\name which maps to a string that describes the expansion."
            onIonInput={($event: CustomEvent<KeyboardEvent>) => this.handleMacrosInput($event)}
            onIonChange={() => this.applyMacrosInput()}></ion-textarea>
        </ion-item>
      </ion-list>,
    ];
  }
}
