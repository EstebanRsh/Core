export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
export function html(strings, ...values) { return String.raw({ raw: strings }, ...values); }
export function mount(el, content) { el.innerHTML = typeof content === 'string' ? content : ''; if (content instanceof Node) el.appendChild(content); }
export function on(el, event, handler, opts) { el.addEventListener(event, handler, opts); return () => el.removeEventListener(event, handler, opts); }
