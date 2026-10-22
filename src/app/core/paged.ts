import { DestroyRef, computed, inject, linkedSignal, untracked } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Prefetch } from './prefetch';
import { Paged } from './tmdb.models';

/** TMDB refuses pages past 500, whatever total_pages says. */
const MAX_PAGE = 500;

/**
 * A TMDB list that grows with "Load more". Page 1 is a regular resource (so the page shows its
 * usual loading and error states); later pages are appended below it and start over whenever
 * the params change.
 */
export function pagedResource<P, T extends { id: number }>(options: {
  params: () => P;
  load: (params: P, page: number) => Observable<Paged<T>>;
  /** Poster or profile path, so prefetching the next page can warm its first images too. */
  imagePath: (item: T) => string | null;
}) {
  const destroyRef = inject(DestroyRef);
  const prefetch = inject(Prefetch);
  const first = rxResource({
    params: options.params,
    stream: ({ params }) => options.load(params, 1),
  });
  // Reset to an empty state whenever the params change.
  const more = linkedSignal({
    source: options.params,
    computation: () => ({ items: [] as T[], page: 1, loading: false, failed: false }),
  });

  // TMDB lists shift while you page through them, so the same item can show up twice.
  const items = computed(() => {
    if (!first.hasValue()) return [];
    const seen = new Set<number>();
    return [...first.value().results, ...more().items].filter(
      (item) => !seen.has(item.id) && !!seen.add(item.id),
    );
  });
  const hasMore = computed(
    () => first.hasValue() && more().page < Math.min(first.value().total_pages, MAX_PAGE),
  );

  function loadMore() {
    const state = more();
    if (state.loading || !hasMore()) return;
    const page = state.page + 1;
    more.set({ ...state, loading: true, failed: false });
    const current = more();
    options
      .load(untracked(options.params), page)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (response) => {
          // Params changed while this page was loading: it belongs to the old list.
          if (more() !== current) return;
          more.set({
            items: [...state.items, ...response.results],
            page,
            loading: false,
            failed: false,
          });
        },
        error: () => {
          if (more() === current) more.set({ ...state, failed: true });
        },
      });
  }

  /** Loads the next page into the cache, so "Load more" shows it instantly. */
  function prefetchNext() {
    const state = untracked(more);
    if (state.loading || !untracked(hasMore)) return;
    prefetch.list(options.load(untracked(options.params), state.page + 1), options.imagePath);
  }

  return {
    first,
    items,
    hasMore,
    loadingMore: computed(() => more().loading),
    loadMoreFailed: computed(() => more().failed),
    loadMore,
    prefetchNext,
  };
}
