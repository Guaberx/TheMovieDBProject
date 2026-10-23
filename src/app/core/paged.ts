import { DestroyRef, Injectable, computed, inject, linkedSignal, untracked } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Prefetch } from './prefetch';
import { Paged } from './tmdb.models';

/** TMDB refuses pages past 500, whatever total_pages says. */
const MAX_PAGE = 500;

/** The extra pages each list had loaded, so Back can bring them back. */
@Injectable({ providedIn: 'root' })
export class ListMemory {
  private readonly lists = new Map<string, { items: unknown[]; page: number }>();

  get<T>(key: string) {
    return this.lists.get(key) as { items: T[]; page: number } | undefined;
  }

  set(key: string, items: unknown[], page: number) {
    this.lists.set(key, { items, page });
  }

  delete(key: string) {
    this.lists.delete(key);
  }
}

/**
 * A TMDB list that grows with "Load more". Page 1 is a regular resource (so the page shows its
 * usual loading and error states); later pages are appended below it and start over whenever
 * the params change. Coming back with the Back button restores the pages loaded before, so the
 * router can put the scroll position back where it was.
 */
export function pagedResource<P, T extends { id: number }>(options: {
  /** Names the list in ListMemory, e.g. "movies". */
  key: string;
  params: () => P;
  load: (params: P, page: number) => Observable<Paged<T>>;
  /** Poster or profile path, so prefetching the next page can warm its first images too. */
  imagePath: (item: T) => string | null;
}) {
  const destroyRef = inject(DestroyRef);
  const prefetch = inject(Prefetch);
  const memory = inject(ListMemory);
  const keyOf = (params: P) => `${options.key}:${JSON.stringify(params)}`;
  const isBack = untracked(inject(Router).currentNavigation)?.trigger === 'popstate';
  const first = rxResource({
    params: options.params,
    stream: ({ params }) => options.load(params, 1),
  });
  // Reset to an empty state whenever the params change, except when the page was opened with
  // Back: then start from the pages that were loaded last time.
  const more = linkedSignal<P, { items: T[]; page: number; loading: boolean; failed: boolean }>({
    source: options.params,
    computation: (params, previous) => {
      const key = keyOf(params);
      const saved = !previous && isBack ? memory.get<T>(key) : undefined;
      if (!saved) memory.delete(key);
      return { items: saved?.items ?? [], page: saved?.page ?? 1, loading: false, failed: false };
    },
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
    const key = keyOf(untracked(options.params));
    more.set({ ...state, loading: true, failed: false });
    const current = more();
    options
      .load(untracked(options.params), page)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (response) => {
          // Params changed while this page was loading: it belongs to the old list.
          if (more() !== current) return;
          const items = [...state.items, ...response.results];
          more.set({ items, page, loading: false, failed: false });
          memory.set(key, items, page);
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
