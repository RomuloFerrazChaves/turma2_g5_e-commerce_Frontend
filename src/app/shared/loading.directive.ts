import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  standalone: true,
})
export class LoadingDirective {
  private spinnerEl: HTMLElement | null = null;
  private previousDisabled: string | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input('appLoading')
  set loading(value: boolean) {
    const host: HTMLElement = this.el.nativeElement;

    if (value) {
      // mark as busy
      this.renderer.setAttribute(host, 'aria-busy', 'true');

      // if host is a button or has disabled property, disable it
      if (host instanceof HTMLButtonElement) {
        // store previous
        this.previousDisabled = host.getAttribute('disabled');
        this.renderer.setAttribute(host, 'disabled', 'true');
      } else {
        // for non-button elements, prevent pointer events
        this.renderer.setStyle(host, 'pointerEvents', 'none');
        this.renderer.setStyle(host, 'opacity', '0.6');
      }

      // add spinner
      if (!this.spinnerEl) {
        this.spinnerEl = this.renderer.createElement('span');
        this.renderer.addClass(this.spinnerEl, 'app-loading-spinner');
        // simple inline styles for spinner
        this.renderer.setStyle(this.spinnerEl, 'display', 'inline-block');
        this.renderer.setStyle(this.spinnerEl, 'width', '16px');
        this.renderer.setStyle(this.spinnerEl, 'height', '16px');
        this.renderer.setStyle(this.spinnerEl, 'marginLeft', '8px');
        this.renderer.setStyle(this.spinnerEl, 'verticalAlign', 'middle');
        this.renderer.setStyle(this.spinnerEl, 'border', '2px solid rgba(0,0,0,0.2)');
        this.renderer.setStyle(this.spinnerEl, 'borderTop', '2px solid rgba(0,0,0,0.7)');
        this.renderer.setStyle(this.spinnerEl, 'borderRadius', '50%');
        this.renderer.setStyle(this.spinnerEl, 'animation', 'app-loading-spin 0.8s linear infinite');

        // insert spinner after host content
        this.renderer.appendChild(host, this.spinnerEl);
      }
    } else {
      // remove busy mark
      this.renderer.removeAttribute(host, 'aria-busy');

      if (host instanceof HTMLButtonElement) {
        if (this.previousDisabled === null) {
          this.renderer.removeAttribute(host, 'disabled');
        } else {
          this.renderer.setAttribute(host, 'disabled', this.previousDisabled);
        }
      } else {
        this.renderer.removeStyle(host, 'pointerEvents');
        this.renderer.removeStyle(host, 'opacity');
      }

      if (this.spinnerEl) {
        try {
          this.renderer.removeChild(host, this.spinnerEl);
        } catch (e) {
          // ignore
        }
        this.spinnerEl = null;
      }
    }
  }
}

// append small keyframes to document head (only once)
const styleId = 'app-loading-directive-style';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `@keyframes app-loading-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
  document.head.appendChild(style);
}
