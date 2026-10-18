import { Resource } from '@angular/core';

/** The resource's value, or undefined while it loads or after it fails (where value() throws). */
export function valueOrUndefined<T>(resource: Resource<T>): T | undefined {
  return resource.hasValue() ? resource.value() : undefined;
}
