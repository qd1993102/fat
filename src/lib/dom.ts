export function _$<K extends keyof HTMLElementTagNameMap | string> (selector: K) {
  return document.querySelector(selector)
}
