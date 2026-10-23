import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Runs `appPrefetch` when the user looks likely to click: after a short hover (so a pointer just
 * passing over doesn't count), right away on focus or press, and optionally as soon as the
 * element scrolls near the viewport (which also covers touch screens, where there's no hover).
 */
@Directive({
  selector: '[appPrefetch]',
  host: {
    '(pointerenter)': 'hoverStart()',
    '(pointerleave)': 'hoverEnd()',
    '(pointerdown)': 'now()',
    '(focus)': 'now()',
  },
})
export class PrefetchOn {
  readonly appPrefetch = input.required<() => void>();
  readonly prefetchWhenVisible = input(false);

  private hoverTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const element: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.hoverEnd());

    afterNextRender(() => {
      if (!this.prefetchWhenVisible() || typeof IntersectionObserver === 'undefined') return;
      // Fires each time the element comes back into view, e.g. a "Load more" button that moved
      // down after loading a page. Repeat calls are cheap since TmdbApi caches responses.
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) this.now();
        },
        { rootMargin: '400px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected hoverStart() {
    this.hoverTimer ??= setTimeout(() => this.now(), 100);
  }

  protected hoverEnd() {
    clearTimeout(this.hoverTimer);
    this.hoverTimer = undefined;
  }

  protected now() {
    this.hoverEnd();
    this.appPrefetch()();
  }
}
