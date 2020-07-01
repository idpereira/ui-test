import {of} from "rxjs";

Object.defineProperty(window, 'CSS', {value: null});
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

export const mockUsername = 'Test User';
export const mockUsers = [{name: 'John Doe'}, {name: 'Jane Doe'}];
export const mockUserService = {
  getUsers: () => of([{name: 'John Doe'}, {name: 'Jane Doe'}])
}
