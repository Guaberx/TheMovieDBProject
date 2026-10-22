import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { pagedResource } from './paged';
import { Paged } from './tmdb.models';

type Item = { id: number };
const page = (ids: number[], total_pages = 3): Paged<Item> => ({
  page: 1,
  results: ids.map((id) => ({ id })),
  total_pages,
  total_results: total_pages * ids.length,
});

describe('pagedResource', () => {
  let requests: { query: string; page: number; response: Subject<Paged<Item>> }[];
  let query: ReturnType<typeof signal<string>>;
  let list: ReturnType<typeof pagedResource<string, Item>>;

  // Resources publish their value asynchronously, so let that settle before checking.
  const respond = async (index: number, data: Paged<Item>) => {
    requests[index].response.next(data);
    requests[index].response.complete();
    await TestBed.inject(ApplicationRef).whenStable();
  };

  beforeEach(() => {
    requests = [];
    query = signal('a');
    list = TestBed.runInInjectionContext(() =>
      pagedResource({
        params: () => query(),
        load: (q, p) => {
          const response = new Subject<Paged<Item>>();
          requests.push({ query: q, page: p, response });
          return response;
        },
      }),
    );
    TestBed.tick();
  });

  it('appends the next page and drops repeats', async () => {
    await respond(0, page([1, 2]));
    list.loadMore();
    expect(requests[1].page).toBe(2);
    expect(list.loadingMore()).toBe(true);
    await respond(1, page([2, 3]));
    expect(list.items().map((i) => i.id)).toEqual([1, 2, 3]);
    expect(list.hasMore()).toBe(true);
  });

  it('stops at the last page', async () => {
    await respond(0, page([1], 1));
    expect(list.hasMore()).toBe(false);
  });

  it('starts over when the params change', async () => {
    await respond(0, page([1]));
    list.loadMore();
    query.set('b');
    TestBed.tick();
    // The old list's page 2 arrives late and must be ignored.
    requests[1].response.next(page([9]));
    await respond(2, page([5]));
    expect(requests[2]).toMatchObject({ query: 'b', page: 1 });
    expect(list.items().map((i) => i.id)).toEqual([5]);
  });
});
