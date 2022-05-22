import { DOCUMENT } from '@angular/common';
import { createPlatform, destroyPlatform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';

function createRootElement() {
  const document = TestBed.inject(DOCUMENT);
  const root = getDOM().createElement('app-root', document);
  document.body.appendChild(root);
}

function removeRootElement() {
  const root: Element = document.getElementsByTagName('app-root').item(0)!;
  try {
    document.body.removeChild(root);
  } catch {}
}

function destroyPlatformBeforeBootstrappingTheNewOne(freshUrl: string) {
  destroyPlatform();
  resetLocationToUrl(freshUrl);
  createRootElement();
}

function resetLocationToUrl(freshUrl: string) {
  window.history.replaceState({}, 'Test', freshUrl);
}

// As we create our custom platform via `bootstrapModule`
// we have to destroy it after assetions and revert
// the previous one
function resetPlatformAfterBootstrapping() {
  removeRootElement();
  destroyPlatform();
  createPlatform(TestBed);
}

type TestWithAFreshPlatformFn = () => Promise<void>;

export function freshPlatform(
  fn: () => Promise<void>
): TestWithAFreshPlatformFn;

export function freshPlatform(
  fn: (done: VoidFunction) => Promise<void>
): TestWithAFreshPlatformFn;

export function freshPlatform(
  fn: (() => Promise<void>) | ((done: VoidFunction) => Promise<void>)
): TestWithAFreshPlatformFn {
  let done: VoidFunction | null = null,
    whenDoneIsCalledPromise: Promise<void> | null = null;

  const hasDoneArgument = fn.length === 1;

  if (hasDoneArgument) {
    whenDoneIsCalledPromise = new Promise<void>((resolve) => {
      done = resolve;
    });
  }

  return async function testWithAFreshPlatform() {
    try {
      const freshUrl = '/';
      destroyPlatformBeforeBootstrappingTheNewOne(freshUrl);

      if (done !== null) {
        await fn(done);
        await whenDoneIsCalledPromise!;
      } else {
        await (fn as () => Promise<void>)();
      }
    } finally {
      resetPlatformAfterBootstrapping();
    }
  };
}
