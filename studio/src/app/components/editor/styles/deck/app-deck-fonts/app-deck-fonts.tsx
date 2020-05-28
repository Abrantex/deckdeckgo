import {Component, Event, EventEmitter, h, Prop, State} from '@stencil/core';

import {FontsService} from '../../../../../services/editor/fonts/fonts.service';

@Component({
  tag: 'app-deck-fonts',
  styleUrl: 'app-deck-fonts.scss',
})
export class AppDeckFonts {
  @Prop()
  deckElement: HTMLElement;

  @Event() fontsChange: EventEmitter<void>;

  @State()
  private selectedFont: string | undefined;

  @State()
  private fonts: GoogleFont[];

  private fontsService: FontsService;

  constructor() {
    this.fontsService = FontsService.getInstance();
  }

  async componentWillLoad() {
    await this.initSelectedFont();

    this.fonts = await this.fontsService.loadAllGoogleFonts();
  }

  private initSelectedFont(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.deckElement || !this.deckElement.style || !this.deckElement.style.getPropertyValue('font-family')) {
        this.selectedFont = undefined;
        resolve();
        return;
      }

      this.selectedFont = this.deckElement.style.getPropertyValue('font-family').replace(/\'/g, '').replace(/"/g, '');

      resolve();
    });
  }

  private selectFont(font: GoogleFont | null): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.deckElement) {
        resolve();
        return;
      }

      if (!font) {
        this.deckElement.style.removeProperty('font-family');
      } else {
        this.deckElement.style.setProperty('font-family', font.family);
      }

      this.fontsChange.emit();

      resolve();
    });
  }

  render() {
    return (
      <div class="container ion-margin-bottom">
        {this.renderDefaultFont(this.selectedFont === undefined)}
        {this.renderFonts()}
      </div>
    );
  }

  private renderFonts() {
    if (this.fonts === undefined) {
      return undefined;
    }

    return this.fonts.map((font: GoogleFont) => {
      return this.renderFont(font, this.selectedFont === font.family.replace(/\'/g, ''));
    });
  }

  private renderDefaultFont(selected: boolean) {
    return (
      <div class={`item ${selected ? 'selected' : ''}`} custom-tappable onClick={() => this.selectFont(null)}>
        <deckgo-slide-title class="showcase">
          <p slot="title">Default</p>
        </deckgo-slide-title>
      </div>
    );
  }

  private renderFont(font: GoogleFont, selected: boolean) {
    return (
      <div class={`item ${selected ? 'selected' : ''}`} custom-tappable onClick={() => this.selectFont(font)}>
        <deckgo-slide-title class="showcase">
          <p slot="title" style={{'font-family': font.family}}>
            {font.name}
          </p>
        </deckgo-slide-title>
      </div>
    );
  }
}
