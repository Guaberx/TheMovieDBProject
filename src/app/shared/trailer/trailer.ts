import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/** A "Watch trailer" button that plays a YouTube video in a modal. */
@Component({
  selector: 'app-trailer',
  template: `
    <button class="searchButton trailer-button" type="button" (click)="open()">
      <span aria-hidden="true">▶</span> Watch trailer
    </button>
    <dialog
      #dialog
      class="trailer-dialog"
      [attr.aria-label]="title()"
      (close)="playing.set(false)"
      (click)="onBackdrop($event)"
    >
      <button
        class="trailer-close"
        type="button"
        aria-label="Close trailer"
        (click)="dialog.close()"
      >
        ✕
      </button>
      @if (playing()) {
        <div class="trailer-frame">
          <iframe
            [src]="embedUrl()"
            [title]="title()"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen
          ></iframe>
        </div>
      }
    </dialog>
  `,
})
export class Trailer {
  private readonly sanitizer = inject(DomSanitizer);

  /** The YouTube video key. */
  readonly videoKey = input.required<string>();
  readonly title = input('Trailer');

  // The iframe only exists while the dialog is open, so closing it stops the video.
  protected readonly playing = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected embedUrl(): SafeResourceUrl {
    const key = encodeURIComponent(this.videoKey());
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0`,
    );
  }

  protected open() {
    this.playing.set(true);
    this.dialog().nativeElement.showModal();
  }

  /** Clicks on the dialog element itself (not its content) land on the backdrop. */
  protected onBackdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) this.dialog().nativeElement.close();
  }
}
