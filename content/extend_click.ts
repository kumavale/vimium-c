"VimiumInjector" in window || (function(this: void): void {
  if (!window.VSettings) { return; }
  let d: Document | Document["documentElement"] = document
    , script = d.createElement("script") as HTMLScriptElement | Element
    , box: EventTarget | null | false = null
    , secret = "" + ((Math.random() * 1e6 + 1) | 0);
  if (!(script instanceof HTMLScriptElement)) { return; }

  function installer(event: Event): void {
    const t = event.target;
    if (!(t instanceof Element) || t.getAttribute("data-vimium-secret") !== secret) { return; }
    event.stopImmediatePropagation();
    removeEventListener("VimiumHook", installer, true);
    if (box === null) {
      t.removeAttribute("data-vimium-secret");
      t.addEventListener("VimiumOnclick", onclick, true);
      box = t;
    }
  }
  addEventListener("VimiumHook", installer, true);
  function onclick(event: Event): void {
    (event.target as Element).vimiumHasOnclick = true;
    event.stopPropagation();
  }
  addEventListener("VimiumOnclick", onclick, true);
  function destroy() {
    const r = removeEventListener;
    /** this function should keep idempotent */
    r("VimiumOnclick", onclick, true);
    if (box) {
      r.call(box, "VimiumOnclick", onclick, true);
      box.dispatchEvent(new CustomEvent("VimiumUnhook", {detail: secret}));
    }
    if (box === null) {
      setTimeout(function(): void { r("VimiumHook", installer, true); }, 1000);
    }
    box = false;
    VSettings && (VSettings.uninit = null);
  }
  VSettings.uninit = destroy;

  script.type = "text/javascript";
  let str = func.toString(), appInfo = navigator.appVersion.match(<RegExpSearchable<1>> /\bChrom(?:e|ium)\/(\d+)/)
    , appVer = appInfo && +appInfo[1] || 0;
  // the block below is also correct on Edge
  if (appVer && appVer >= BrowserVer.Min$addEventListener$IsInStrictMode) {
    str = str.replace(<RegExpG> /: ?function \w+/g, "");
  }
  script.async = false;
  script.textContent = `"use strict";(${str})(${secret});`;
  d = (d as Document).documentElement || d;
  d.insertBefore(script, d.firstChild);
  script.remove();
  VDom.documentReady(function() { box === null && setTimeout(function() { box || destroy(); }, 17); });
  const safeRAF = appVer !== BrowserVer.NoRAForRICOnSandboxedPage;
  VDom.allowRAF = safeRAF;
  if (script.hasAttribute("data-vimium-hook")) {
    safeRAF || requestAnimationFrame(() => { VDom.allowRAF = true; });
    return;
  } // It succeeded to hook.
  console.info("Some functions of Vimium C may not work because %o is sandboxed.", window.location.pathname.replace(<RegExpOne> /^.*(\/[^\/]+\/?)$/, "$1"));
  VDom.allowScripts = false;
  interface TimerLib extends Window { setInterval: typeof setInterval; setTimeout: typeof setTimeout; }
  (window as TimerLib).setTimeout = (window as TimerLib).setInterval =
  function (func: (info: TimerType.fake | undefined) => void, timeout: number): number {
    let f = timeout > 10 ? window.requestIdleCallback : null, cb = () => func(TimerType.fake);
    return VDom.allowRAF ? f ? f(cb, { timeout }) : requestAnimationFrame(cb) : (Promise.resolve(1).then(cb), 1);
  } as any;

function func(this: void, sec: number): void {
type ApplyArgs<T, ArgParent, R> = (this: (this: T, ...a: ArgParent[]) => R, thisArg: T, a: ArgParent[]) => R;
type Call1<T, A, R> = (this: (this: T, a: A) => R, thisArg: T, a: A) => R;
type Call3o<T, A, B, C, R> = (this: (this: T, a: A, b: B, c?: C) => R, thisArg: T, a: A, b: B, c?: C) => R;

const ETP = EventTarget.prototype, _listen = ETP.addEventListener, toRegister: Element[] = [],
_apply = _listen.apply, _call = _listen.call,
call = _call.bind(_call) as <T, R, A, B, C>(func: (this: T, a?: A, b?: B, c?: C) => R, self: T, a?: A, b?: B, c?: C) => R,
dispatch = (_call as Call1<EventTarget, Event, boolean>).bind(ETP.dispatchEvent),
append = (_call as Call1<Node, Node, Node>).bind(document.appendChild),
Contains = document.contains, contains = Contains.bind(document),
Insert = document.insertBefore,
CE: typeof Event = typeof CustomEvent === "function" ? CustomEvent as any : Event,
HA = HTMLAnchorElement, DF = DocumentFragment, SR = (window.ShadowRoot || CE as any) as typeof ShadowRoot,
HF = HTMLFormElement, E = typeof Element === "function" ? Element : HTMLElement,
FP = Function.prototype, funcToString = FP.toString,
toStringApply = (_apply as ApplyArgs<Function, any, string>).bind(funcToString),
listenA = (_apply as ApplyArgs<EventTarget, any, void>).bind(_listen),
listen = (_call as Call3o<EventTarget, string, null | ((e: Event) => void), boolean, void>).bind(_listen) as (this: void
  , T: EventTarget, a: string, b: null | ((e: Event) => void), c?: boolean) => void,
Create = document.createElement as Document["createElement"],
Attr = E.prototype.setAttribute, GetAttr = E.prototype.getAttribute, remove = _call.bind(E.prototype.remove),
rel = removeEventListener, ct = clearTimeout,
hooks = {
  toString: function toString(this: Function): string {
    const a = this;
    return toStringApply(a === hooks.addEventListener ? _listen : a === hooks.toString ? funcToString : a, arguments as any);
  },
  addEventListener: function addEventListener(this: EventTarget, type: string, listener: EventListenerOrEventListenerObject): any {
    const a = this;
    if (type === "click" && listener && !(a instanceof HA || a instanceof HF) && a instanceof E) {
      toRegister.push(a as Element);
      if (timer === 0) { timer = next(); }
    }
    const len = arguments.length;
    return len === 2 ? listen(a, type, listener) : len === 3 ? listen(a, type, listener, arguments[2]) : listenA(a, arguments as any);
  }
}
;
toRegister.push = [].push, toRegister.splice = [].splice;
document.currentScript && call(Attr, document.currentScript, "data-vimium-hook", "");

let handler = function(this: void): void {
  rel("DOMContentLoaded", handler, true);
  ct(timer);
  handler = null as never;
  const docEl = document.documentElement as HTMLElement | SVGElement;
  if (!docEl) { return destroy(); }
  const el = call(Create, document, "div") as HTMLDivElement, key = "data-vimium-secret";
  call(Attr, el, key, "" + sec);
  listen(el, "VimiumUnhook", destroy as (e: CustomEvent) => void, true);
  append(docEl, el), dispatch(el, new CE("VimiumHook")), remove(el);
  if (call(GetAttr, el, key) != null) {
    destroy();
  } else {
    box = el;
    timer = toRegister.length > 0 ? next() : 0;
  }
},
box: HTMLDivElement, timer = setTimeout(handler, 1000),
next = setTimeout.bind(null as never, function(): void {
  const len = toRegister.length, start = len > 9 ? len - 10 : 0, delta = len - start;
  timer = start > 0 ? next() : 0;
  if (len > 0) {
    // skip some nodes if only crashing, so that there would be less crash logs in console
    for (const i of toRegister.splice(start, delta)) { reg(i); }
  }
}, 1);
function reg(this: void, element: Element): void {
  const event = new CE("VimiumOnclick");
  if (contains(element)) {
    dispatch(element, event);
    return;
  }
  let e1: Element | null = element, e2: Node | null;
  for (; e2 = e1.parentElement; e1 = e2 as Element) {
    if (e2 instanceof HF && (e1 = e2.parentElement) && !call(Contains, e1, e2)) {
      e1 = e2.parentNode as Element | null;
      if (!e1 || !call(Contains, e1, e2)) { return; }
      e2 = e1;
    }
  }
  // note: the below changes DOM trees,
  // so `dispatch` MUST NEVER throw. Otherwises a page might break
  if ((e2 = e1.parentNode) == null) {
    append(box, e1);
    dispatch(element, event);
    remove(e1);
  } else if (!(e2 instanceof SR) && e2 instanceof DF && !(e1 instanceof HF)) {
    // NOTE: ignore nodes belonging to a shadowRoot,
    // in case of `<html> -> ... -> <div> -> #shadow-root -> ... -> <iframe>`,
    // because `<iframe>` will destroy if removed
    const after = e1.nextSibling;
    append(box, e1);
    dispatch(element, event);
    call<Node, Node, Node, Node | null, 1>(Insert, e2, e1, after);
  }
}
function destroy(e?: CustomEvent): void {
  if (e && e.detail !== "" + sec) { return; }
  next = toRegister.push = function() { return 1; };
  toRegister.length = 0;
  ct(timer);
  box = null as never;
}
// only the below can affect outsides
if (typeof E !== "function") {
  return destroy();
}
ETP.addEventListener = hooks.addEventListener;
FP.toString = hooks.toString;
_listen("DOMContentLoaded", handler, true);
}
})();
