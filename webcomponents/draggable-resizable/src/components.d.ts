/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface DeckgoDnr {
    'drag': 'x-axis' | 'y-axis' | 'all' | 'none';
    'lazyLoadContent': () => Promise<void>;
    'resize': boolean;
    'rotation': boolean;
    'unit': 'percentage' | 'viewport' | 'px';
  }
}

declare global {


  interface HTMLDeckgoDnrElement extends Components.DeckgoDnr, HTMLStencilElement {}
  var HTMLDeckgoDnrElement: {
    prototype: HTMLDeckgoDnrElement;
    new (): HTMLDeckgoDnrElement;
  };
  interface HTMLElementTagNameMap {
    'deckgo-dnr': HTMLDeckgoDnrElement;
  }
}

declare namespace LocalJSX {
  interface DeckgoDnr {
    'drag'?: 'x-axis' | 'y-axis' | 'all' | 'none';
    'onDnrDidChange'?: (event: CustomEvent<HTMLElement | undefined>) => void;
    'onDnrSelect'?: (event: CustomEvent<HTMLElement | undefined>) => void;
    'resize'?: boolean;
    'rotation'?: boolean;
    'unit'?: 'percentage' | 'viewport' | 'px';
  }

  interface IntrinsicElements {
    'deckgo-dnr': DeckgoDnr;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'deckgo-dnr': LocalJSX.DeckgoDnr & JSXBase.HTMLAttributes<HTMLDeckgoDnrElement>;
    }
  }
}


