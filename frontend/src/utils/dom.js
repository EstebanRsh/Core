// src/utils/dom.js
// Mini toolbox para manipular el DOM sin framework.
// La idea: que los Controllers sean limpios y expresivos.

// 1) Selección de nodos -----------------------------------------------

// $: querySelector corto
export const $ = (sel, root = document) => root.querySelector(sel);

// $$: querySelectorAll que devuelve array (no NodeList)
export const $$ = (sel, root = document) =>
  Array.from(root.querySelectorAll(sel));

// 2) Templates y montaje ----------------------------------------------

// html: tagged template que concatena strings/valores sin escapar.
// Uso: html`<div>${nombre}</div>`
export const html = (strings, ...values) =>
  strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");

// mount: “pinta” contenido en un root.
// - Si content es string => innerHTML.
// - Si es Node/Fragment => lo inserta.
export function mount(root, content) {
  root.innerHTML = "";
  if (typeof content === "string") {
    root.innerHTML = content;
  } else if (content instanceof Node) {
    root.appendChild(content);
  }
  return root;
}

// 3) Eventos -----------------------------------------------------------

// on: azúcar para addEventListener (con null-check)
export const on = (el, type, handler, opts) =>
  el && el.addEventListener(type, handler, opts);

// once: escucha una sola vez (útil para animaciones, cierres, etc.)
export function once(el, type, handler, opts) {
  const h = (e) => {
    el.removeEventListener(type, h, opts);
    handler(e);
  };
  el.addEventListener(type, h, opts);
  return h;
}

// delegate: delegación de eventos (ideal para listas que se re-renderizan)
export function delegate(root, selector, type, handler) {
  root.addEventListener(type, (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  });
}

// 4) Helpers varios ----------------------------------------------------

// frag: crea un DocumentFragment desde HTML string
export function frag(markup) {
  const tpl = document.createElement("template");
  tpl.innerHTML = markup.trim();
  return tpl.content;
}

// setText: setea texto seguro (sin HTML)
export function setText(el, text) {
  if (el) el.textContent = text ?? "";
}

// setHTML: setea HTML (cuando vos controlás el markup)
export function setHTML(el, markup) {
  if (el) el.innerHTML = markup ?? "";
}
