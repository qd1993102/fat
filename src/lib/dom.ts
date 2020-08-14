export function _$<K extends keyof HTMLElementTagNameMap> (selector: K) {
  return document.querySelector(selector)
}
