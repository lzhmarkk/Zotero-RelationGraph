(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver((i) => {
    for (const o of i)
      if (o.type === "childList")
        for (const l of o.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && r(l);
  }).observe(document, { childList: !0, subtree: !0 });

  function n(i) {
    const o = {};
    return (
      i.integrity && (o.integrity = i.integrity),
      i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : i.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }

  function r(i) {
    if (i.ep) return;
    i.ep = !0;
    const o = n(i);
    fetch(i.href, o);
  }
})();

function On(e, t) {
  const n = Object.create(null),
    r = e.split(",");
  for (let i = 0; i < r.length; i++) n[r[i]] = !0;
  return t ? (i) => !!n[i.toLowerCase()] : (i) => !!n[i];
}

function Ln(e) {
  if (W(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n],
        i = le(r) ? Ei(r) : Ln(r);
      if (i) for (const o in i) t[o] = i[o];
    }
    return t;
  } else {
    if (le(e)) return e;
    if (ie(e)) return e;
  }
}

const bi = /;(?![^(]*\))/g,
  xi = /:([^]+)/,
  _i = new RegExp("\\/\\*[\s\S]*?\\*\\/", "g");

function Ei(e) {
  const t = {};
  return (
    e
      .replace(_i, "")
      .split(bi)
      .forEach((n) => {
        if (n) {
          const r = n.split(xi);
          r.length > 1 && (t[r[0].trim()] = r[1].trim());
        }
      }),
    t
  );
}

function Nn(e) {
  let t = "";
  if (le(e)) t = e;
  else if (W(e))
    for (let n = 0; n < e.length; n++) {
      const r = Nn(e[n]);
      r && (t += r + " ");
    }
  else if (ie(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}

const Ci =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Ti = On(Ci);

function Ar(e) {
  return !!e || e === "";
}

const ne = {},
  ht = [],
  Re = () => {},
  Mi = () => !1,
  Pi = /^on[^a-z]/,
  $t = (e) => Pi.test(e),
  In = (e) => e.startsWith("onUpdate:"),
  ue = Object.assign,
  Fn = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  Ai = Object.prototype.hasOwnProperty,
  V = (e, t) => Ai.call(e, t),
  W = Array.isArray,
  Ct = (e) => Gt(e) === "[object Map]",
  Si = (e) => Gt(e) === "[object Set]",
  G = (e) => typeof e == "function",
  le = (e) => typeof e == "string",
  kn = (e) => typeof e == "symbol",
  ie = (e) => e !== null && typeof e == "object",
  Sr = (e) => ie(e) && G(e.then) && G(e.catch),
  Oi = Object.prototype.toString,
  Gt = (e) => Oi.call(e),
  Li = (e) => Gt(e).slice(8, -1),
  Ni = (e) => Gt(e) === "[object Object]",
  Rn = (e) =>
    le(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Bt = On(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted",
  ),
  Vt = (e) => {
    const t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  },
  Ii = /-(\w)/g,
  gt = Vt((e) => e.replace(Ii, (t, n) => (n ? n.toUpperCase() : ""))),
  Fi = /\B([A-Z])/g,
  yt = Vt((e) => e.replace(Fi, "-$1").toLowerCase()),
  Or = Vt((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  on = Vt((e) => (e ? `on${Or(e)}` : "")),
  Yt = (e, t) => !Object.is(e, t),
  sn = (e, t) => {
    for (let n = 0; n < e.length; n++) e[n](t);
  },
  Wt = (e, t, n) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n });
  },
  ki = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
let er;
const Ri = () =>
  er ||
  (er =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : {});
let Ne;

class Hi {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this.effects = []),
      (this.cleanups = []),
      (this.parent = Ne),
      !t && Ne && (this.index = (Ne.scopes || (Ne.scopes = [])).push(this) - 1);
  }

  get active() {
    return this._active;
  }

  run(t) {
    if (this._active) {
      const n = Ne;
      try {
        return (Ne = this), t();
      } finally {
        Ne = n;
      }
    }
  }

  on() {
    Ne = this;
  }

  off() {
    Ne = this.parent;
  }

  stop(t) {
    if (this._active) {
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop();
      for (n = 0, r = this.cleanups.length; n < r; n++) this.cleanups[n]();
      if (this.scopes)
        for (n = 0, r = this.scopes.length; n < r; n++) this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i &&
          i !== this &&
          ((this.parent.scopes[this.index] = i), (i.index = this.index));
      }
      (this.parent = void 0), (this._active = !1);
    }
  }
}

function zi(e, t = Ne) {
  t && t.active && t.effects.push(e);
}

function Bi() {
  return Ne;
}

const Hn = (e) => {
    const t = new Set(e);
    return (t.w = 0), (t.n = 0), t;
  },
  Lr = (e) => (e.w & Ze) > 0,
  Nr = (e) => (e.n & Ze) > 0,
  ji = ({ deps: e }) => {
    if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= Ze;
  },
  Di = (e) => {
    const { deps: t } = e;
    if (t.length) {
      let n = 0;
      for (let r = 0; r < t.length; r++) {
        const i = t[r];
        Lr(i) && !Nr(i) ? i.delete(e) : (t[n++] = i),
          (i.w &= ~Ze),
          (i.n &= ~Ze);
      }
      t.length = n;
    }
  },
  pn = new WeakMap();
let Et = 0,
  Ze = 1;
const gn = 30;
let Ie;
const lt = Symbol(""),
  mn = Symbol("");

class zn {
  constructor(t, n = null, r) {
    (this.fn = t),
      (this.scheduler = n),
      (this.active = !0),
      (this.deps = []),
      (this.parent = void 0),
      zi(this, r);
  }

  run() {
    if (!this.active) return this.fn();
    let t = Ie,
      n = Ve;
    for (; t; ) {
      if (t === this) return;
      t = t.parent;
    }
    try {
      return (
        (this.parent = Ie),
        (Ie = this),
        (Ve = !0),
        (Ze = 1 << ++Et),
        Et <= gn ? ji(this) : tr(this),
        this.fn()
      );
    } finally {
      Et <= gn && Di(this),
        (Ze = 1 << --Et),
        (Ie = this.parent),
        (Ve = n),
        (this.parent = void 0),
        this.deferStop && this.stop();
    }
  }

  stop() {
    Ie === this
      ? (this.deferStop = !0)
      : this.active &&
        (tr(this), this.onStop && this.onStop(), (this.active = !1));
  }
}

function tr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++) t[n].delete(e);
    t.length = 0;
  }
}

let Ve = !0;
const Ir = [];

function vt() {
  Ir.push(Ve), (Ve = !1);
}

function wt() {
  const e = Ir.pop();
  Ve = e === void 0 ? !0 : e;
}

function _e(e, t, n) {
  if (Ve && Ie) {
    let r = pn.get(e);
    r || pn.set(e, (r = new Map()));
    let i = r.get(n);
    i || r.set(n, (i = Hn())), Fr(i);
  }
}

function Fr(e, t) {
  let n = !1;
  Et <= gn ? Nr(e) || ((e.n |= Ze), (n = !Lr(e))) : (n = !e.has(Ie)),
    n && (e.add(Ie), Ie.deps.push(e));
}

function We(e, t, n, r, i, o) {
  const l = pn.get(e);
  if (!l) return;
  let c = [];
  if (t === "clear") c = [...l.values()];
  else if (n === "length" && W(e)) {
    const u = Number(r);
    l.forEach((d, p) => {
      (p === "length" || p >= u) && c.push(d);
    });
  } else
    switch ((n !== void 0 && c.push(l.get(n)), t)) {
      case "add":
        W(e)
          ? Rn(n) && c.push(l.get("length"))
          : (c.push(l.get(lt)), Ct(e) && c.push(l.get(mn)));
        break;
      case "delete":
        W(e) || (c.push(l.get(lt)), Ct(e) && c.push(l.get(mn)));
        break;
      case "set":
        Ct(e) && c.push(l.get(lt));
        break;
    }
  if (c.length === 1) c[0] && yn(c[0]);
  else {
    const u = [];
    for (const d of c) d && u.push(...d);
    yn(Hn(u));
  }
}

function yn(e, t) {
  const n = W(e) ? e : [...e];
  for (const r of n) r.computed && nr(r);
  for (const r of n) r.computed || nr(r);
}

function nr(e, t) {
  (e !== Ie || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}

const Xi = On("__proto__,__v_isRef,__isVue"),
  kr = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(kn),
  ),
  Ui = Bn(),
  Yi = Bn(!1, !0),
  Wi = Bn(!0),
  rr = Ki();

function Ki() {
  const e = {};
  return (
    ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
      e[t] = function (...n) {
        const r = J(this);
        for (let o = 0, l = this.length; o < l; o++) _e(r, "get", o + "");
        const i = r[t](...n);
        return i === -1 || i === !1 ? r[t](...n.map(J)) : i;
      };
    }),
    ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
      e[t] = function (...n) {
        vt();
        const r = J(this)[t].apply(this, n);
        return wt(), r;
      };
    }),
    e
  );
}

function qi(e) {
  const t = J(this);
  return _e(t, "has", e), t.hasOwnProperty(e);
}

function Bn(e = !1, t = !1) {
  return function (r, i, o) {
    if (i === "__v_isReactive") return !e;
    if (i === "__v_isReadonly") return e;
    if (i === "__v_isShallow") return t;
    if (i === "__v_raw" && o === (e ? (t ? co : jr) : t ? Br : zr).get(r))
      return r;
    const l = W(r);
    if (!e) {
      if (l && V(rr, i)) return Reflect.get(rr, i, o);
      if (i === "hasOwnProperty") return qi;
    }
    const c = Reflect.get(r, i, o);
    return (kn(i) ? kr.has(i) : Xi(i)) || (e || _e(r, "get", i), t)
      ? c
      : ge(c)
        ? l && Rn(i)
          ? c
          : c.value
        : ie(c)
          ? e
            ? Dr(c)
            : Xn(c)
          : c;
  };
}

const $i = Rr(),
  Gi = Rr(!0);

function Rr(e = !1) {
  return function (n, r, i, o) {
    let l = n[r];
    if (Pt(l) && ge(l) && !ge(i)) return !1;
    if (
      !e &&
      (!vn(i) && !Pt(i) && ((l = J(l)), (i = J(i))), !W(n) && ge(l) && !ge(i))
    )
      return (l.value = i), !0;
    const c = W(n) && Rn(r) ? Number(r) < n.length : V(n, r),
      u = Reflect.set(n, r, i, o);
    return (
      n === J(o) && (c ? Yt(i, l) && We(n, "set", r, i) : We(n, "add", r, i)), u
    );
  };
}

function Vi(e, t) {
  const n = V(e, t);
  e[t];
  const r = Reflect.deleteProperty(e, t);
  return r && n && We(e, "delete", t, void 0), r;
}

function Ji(e, t) {
  const n = Reflect.has(e, t);
  return (!kn(t) || !kr.has(t)) && _e(e, "has", t), n;
}

function Zi(e) {
  return _e(e, "iterate", W(e) ? "length" : lt), Reflect.ownKeys(e);
}

const Hr = { get: Ui, set: $i, deleteProperty: Vi, has: Ji, ownKeys: Zi },
  Qi = {
    get: Wi,
    set(e, t) {
      return !0;
    },
    deleteProperty(e, t) {
      return !0;
    },
  },
  eo = ue({}, Hr, { get: Yi, set: Gi }),
  jn = (e) => e,
  Jt = (e) => Reflect.getPrototypeOf(e);

function Nt(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const i = J(e),
    o = J(t);
  n || (t !== o && _e(i, "get", t), _e(i, "get", o));
  const { has: l } = Jt(i),
    c = r ? jn : n ? Wn : Yn;
  if (l.call(i, t)) return c(e.get(t));
  if (l.call(i, o)) return c(e.get(o));
  e !== i && e.get(t);
}

function It(e, t = !1) {
  const n = this.__v_raw,
    r = J(n),
    i = J(e);
  return (
    t || (e !== i && _e(r, "has", e), _e(r, "has", i)),
    e === i ? n.has(e) : n.has(e) || n.has(i)
  );
}

function Ft(e, t = !1) {
  return (
    (e = e.__v_raw), !t && _e(J(e), "iterate", lt), Reflect.get(e, "size", e)
  );
}

function ir(e) {
  e = J(e);
  const t = J(this);
  return Jt(t).has.call(t, e) || (t.add(e), We(t, "add", e, e)), this;
}

function or(e, t) {
  t = J(t);
  const n = J(this),
    { has: r, get: i } = Jt(n);
  let o = r.call(n, e);
  o || ((e = J(e)), (o = r.call(n, e)));
  const l = i.call(n, e);
  return (
    n.set(e, t), o ? Yt(t, l) && We(n, "set", e, t) : We(n, "add", e, t), this
  );
}

function sr(e) {
  const t = J(this),
    { has: n, get: r } = Jt(t);
  let i = n.call(t, e);
  i || ((e = J(e)), (i = n.call(t, e))), r && r.call(t, e);
  const o = t.delete(e);
  return i && We(t, "delete", e, void 0), o;
}

function lr() {
  const e = J(this),
    t = e.size !== 0,
    n = e.clear();
  return t && We(e, "clear", void 0, void 0), n;
}

function kt(e, t) {
  return function (r, i) {
    const o = this,
      l = o.__v_raw,
      c = J(l),
      u = t ? jn : e ? Wn : Yn;
    return (
      !e && _e(c, "iterate", lt), l.forEach((d, p) => r.call(i, u(d), u(p), o))
    );
  };
}

function Rt(e, t, n) {
  return function (...r) {
    const i = this.__v_raw,
      o = J(i),
      l = Ct(o),
      c = e === "entries" || (e === Symbol.iterator && l),
      u = e === "keys" && l,
      d = i[e](...r),
      p = n ? jn : t ? Wn : Yn;
    return (
      !t && _e(o, "iterate", u ? mn : lt),
      {
        next() {
          const { value: _, done: P } = d.next();
          return P
            ? { value: _, done: P }
            : { value: c ? [p(_[0]), p(_[1])] : p(_), done: P };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}

function $e(e) {
  return function (...t) {
    return e === "delete" ? !1 : this;
  };
}

function to() {
  const e = {
      get(o) {
        return Nt(this, o);
      },
      get size() {
        return Ft(this);
      },
      has: It,
      add: ir,
      set: or,
      delete: sr,
      clear: lr,
      forEach: kt(!1, !1),
    },
    t = {
      get(o) {
        return Nt(this, o, !1, !0);
      },
      get size() {
        return Ft(this);
      },
      has: It,
      add: ir,
      set: or,
      delete: sr,
      clear: lr,
      forEach: kt(!1, !0),
    },
    n = {
      get(o) {
        return Nt(this, o, !0);
      },
      get size() {
        return Ft(this, !0);
      },
      has(o) {
        return It.call(this, o, !0);
      },
      add: $e("add"),
      set: $e("set"),
      delete: $e("delete"),
      clear: $e("clear"),
      forEach: kt(!0, !1),
    },
    r = {
      get(o) {
        return Nt(this, o, !0, !0);
      },
      get size() {
        return Ft(this, !0);
      },
      has(o) {
        return It.call(this, o, !0);
      },
      add: $e("add"),
      set: $e("set"),
      delete: $e("delete"),
      clear: $e("clear"),
      forEach: kt(!0, !0),
    };
  return (
    ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
      (e[o] = Rt(o, !1, !1)),
        (n[o] = Rt(o, !0, !1)),
        (t[o] = Rt(o, !1, !0)),
        (r[o] = Rt(o, !0, !0));
    }),
    [e, n, t, r]
  );
}

const [no, ro, io, oo] = to();

function Dn(e, t) {
  const n = t ? (e ? oo : io) : e ? ro : no;
  return (r, i, o) =>
    i === "__v_isReactive"
      ? !e
      : i === "__v_isReadonly"
        ? e
        : i === "__v_raw"
          ? r
          : Reflect.get(V(n, i) && i in r ? n : r, i, o);
}

const so = { get: Dn(!1, !1) },
  lo = { get: Dn(!1, !0) },
  ao = { get: Dn(!0, !1) },
  zr = new WeakMap(),
  Br = new WeakMap(),
  jr = new WeakMap(),
  co = new WeakMap();

function fo(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}

function uo(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : fo(Li(e));
}

function Xn(e) {
  return Pt(e) ? e : Un(e, !1, Hr, so, zr);
}

function ho(e) {
  return Un(e, !1, eo, lo, Br);
}

function Dr(e) {
  return Un(e, !0, Qi, ao, jr);
}

function Un(e, t, n, r, i) {
  if (!ie(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const o = i.get(e);
  if (o) return o;
  const l = uo(e);
  if (l === 0) return e;
  const c = new Proxy(e, l === 2 ? r : n);
  return i.set(e, c), c;
}

function dt(e) {
  return Pt(e) ? dt(e.__v_raw) : !!(e && e.__v_isReactive);
}

function Pt(e) {
  return !!(e && e.__v_isReadonly);
}

function vn(e) {
  return !!(e && e.__v_isShallow);
}

function Xr(e) {
  return dt(e) || Pt(e);
}

function J(e) {
  const t = e && e.__v_raw;
  return t ? J(t) : e;
}

function Ur(e) {
  return Wt(e, "__v_skip", !0), e;
}

const Yn = (e) => (ie(e) ? Xn(e) : e),
  Wn = (e) => (ie(e) ? Dr(e) : e);

function po(e) {
  Ve && Ie && ((e = J(e)), Fr(e.dep || (e.dep = Hn())));
}

function go(e, t) {
  e = J(e);
  const n = e.dep;
  n && yn(n);
}

function ge(e) {
  return !!(e && e.__v_isRef === !0);
}

function mo(e) {
  return ge(e) ? e.value : e;
}

const yo = {
  get: (e, t, n) => mo(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const i = e[t];
    return ge(i) && !ge(n) ? ((i.value = n), !0) : Reflect.set(e, t, n, r);
  },
};

function Yr(e) {
  return dt(e) ? e : new Proxy(e, yo);
}

var Wr;

class vo {
  constructor(t, n, r, i) {
    (this._setter = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this[Wr] = !1),
      (this._dirty = !0),
      (this.effect = new zn(t, () => {
        this._dirty || ((this._dirty = !0), go(this));
      })),
      (this.effect.computed = this),
      (this.effect.active = this._cacheable = !i),
      (this.__v_isReadonly = r);
  }

  get value() {
    const t = J(this);
    return (
      po(t),
      (t._dirty || !t._cacheable) &&
        ((t._dirty = !1), (t._value = t.effect.run())),
      t._value
    );
  }

  set value(t) {
    this._setter(t);
  }
}

Wr = "__v_isReadonly";

function wo(e, t, n = !1) {
  let r, i;
  const o = G(e);
  return (
    o ? ((r = e), (i = Re)) : ((r = e.get), (i = e.set)),
    new vo(r, i, o || !i, n)
  );
}

function Je(e, t, n, r) {
  let i;
  try {
    i = r ? e(...r) : e();
  } catch (o) {
    Zt(o, t, n);
  }
  return i;
}

function Oe(e, t, n, r) {
  if (G(e)) {
    const o = Je(e, t, n, r);
    return (
      o &&
        Sr(o) &&
        o.catch((l) => {
          Zt(l, t, n);
        }),
      o
    );
  }
  const i = [];
  for (let o = 0; o < e.length; o++) i.push(Oe(e[o], t, n, r));
  return i;
}

function Zt(e, t, n, r = !0) {
  const i = t ? t.vnode : null;
  if (t) {
    let o = t.parent;
    const l = t.proxy,
      c = n;
    for (; o; ) {
      const d = o.ec;
      if (d) {
        for (let p = 0; p < d.length; p++) if (d[p](e, l, c) === !1) return;
      }
      o = o.parent;
    }
    const u = t.appContext.config.errorHandler;
    if (u) {
      Je(u, null, 10, [e, l, c]);
      return;
    }
  }
  bo(e, n, i, r);
}

function bo(e, t, n, r = !0) {
  console.error(e);
}

let At = !1,
  wn = !1;
const fe = [];
let De = 0;
const pt = [];
let Ue = null,
  it = 0;
const Kr = Promise.resolve();
let Kn = null;

function xo(e) {
  const t = Kn || Kr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}

function _o(e) {
  let t = De + 1,
    n = fe.length;
  for (; t < n; ) {
    const r = (t + n) >>> 1;
    St(fe[r]) < e ? (t = r + 1) : (n = r);
  }
  return t;
}

function qn(e) {
  (!fe.length || !fe.includes(e, At && e.allowRecurse ? De + 1 : De)) &&
    (e.id == null ? fe.push(e) : fe.splice(_o(e.id), 0, e), qr());
}

function qr() {
  !At && !wn && ((wn = !0), (Kn = Kr.then(Gr)));
}

function Eo(e) {
  const t = fe.indexOf(e);
  t > De && fe.splice(t, 1);
}

function Co(e) {
  W(e)
    ? pt.push(...e)
    : (!Ue || !Ue.includes(e, e.allowRecurse ? it + 1 : it)) && pt.push(e),
    qr();
}

function ar(e, t = At ? De + 1 : 0) {
  for (; t < fe.length; t++) {
    const n = fe[t];
    n && n.pre && (fe.splice(t, 1), t--, n());
  }
}

function $r(e) {
  if (pt.length) {
    const t = [...new Set(pt)];
    if (((pt.length = 0), Ue)) {
      Ue.push(...t);
      return;
    }
    for (Ue = t, Ue.sort((n, r) => St(n) - St(r)), it = 0; it < Ue.length; it++)
      Ue[it]();
    (Ue = null), (it = 0);
  }
}

const St = (e) => (e.id == null ? 1 / 0 : e.id),
  To = (e, t) => {
    const n = St(e) - St(t);
    if (n === 0) {
      if (e.pre && !t.pre) return -1;
      if (t.pre && !e.pre) return 1;
    }
    return n;
  };

function Gr(e) {
  (wn = !1), (At = !0), fe.sort(To);
  const t = Re;
  try {
    for (De = 0; De < fe.length; De++) {
      const n = fe[De];
      n && n.active !== !1 && Je(n, null, 14);
    }
  } finally {
    (De = 0),
      (fe.length = 0),
      $r(),
      (At = !1),
      (Kn = null),
      (fe.length || pt.length) && Gr();
  }
}

function Mo(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || ne;
  let i = n;
  const o = t.startsWith("update:"),
    l = o && t.slice(7);
  if (l && l in r) {
    const p = `${l === "modelValue" ? "model" : l}Modifiers`,
      { number: _, trim: P } = r[p] || ne;
    P && (i = n.map((O) => (le(O) ? O.trim() : O))), _ && (i = n.map(ki));
  }
  let c,
    u = r[(c = on(t))] || r[(c = on(gt(t)))];
  !u && o && (u = r[(c = on(yt(t)))]), u && Oe(u, e, 6, i);
  const d = r[c + "Once"];
  if (d) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[c]) return;
    (e.emitted[c] = !0), Oe(d, e, 6, i);
  }
}

function Vr(e, t, n = !1) {
  const r = t.emitsCache,
    i = r.get(e);
  if (i !== void 0) return i;
  const o = e.emits;
  let l = {},
    c = !1;
  if (!G(e)) {
    const u = (d) => {
      const p = Vr(d, t, !0);
      p && ((c = !0), ue(l, p));
    };
    !n && t.mixins.length && t.mixins.forEach(u),
      e.extends && u(e.extends),
      e.mixins && e.mixins.forEach(u);
  }
  return !o && !c
    ? (ie(e) && r.set(e, null), null)
    : (W(o) ? o.forEach((u) => (l[u] = null)) : ue(l, o),
      ie(e) && r.set(e, l),
      l);
}

function Qt(e, t) {
  return !e || !$t(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      V(e, t[0].toLowerCase() + t.slice(1)) || V(e, yt(t)) || V(e, t));
}

let Fe = null,
  Jr = null;

function Kt(e) {
  const t = Fe;
  return (Fe = e), (Jr = (e && e.type.__scopeId) || null), t;
}

function Po(e, t = Fe, n) {
  if (!t || e._n) return e;
  const r = (...i) => {
    r._d && yr(-1);
    const o = Kt(t);
    let l;
    try {
      l = e(...i);
    } finally {
      Kt(o), r._d && yr(1);
    }
    return l;
  };
  return (r._n = !0), (r._c = !0), (r._d = !0), r;
}

function ln(e) {
  const {
    type: t,
    vnode: n,
    proxy: r,
    withProxy: i,
    props: o,
    propsOptions: [l],
    slots: c,
    attrs: u,
    emit: d,
    render: p,
    renderCache: _,
    data: P,
    setupState: O,
    ctx: a,
    inheritAttrs: s,
  } = e;
  let g, m;
  const w = Kt(e);
  try {
    if (n.shapeFlag & 4) {
      const A = i || r;
      (g = je(p.call(A, A, _, o, O, P, a))), (m = u);
    } else {
      const A = t;
      (g = je(
        A.length > 1 ? A(o, { attrs: u, slots: c, emit: d }) : A(o, null),
      )),
        (m = t.props ? u : Ao(u));
    }
  } catch (A) {
    (Mt.length = 0), Zt(A, e, 1), (g = at(Ye));
  }
  let v = g;
  if (m && s !== !1) {
    const A = Object.keys(m),
      { shapeFlag: R } = v;
    A.length && R & 7 && (l && A.some(In) && (m = So(m, l)), (v = Qe(v, m)));
  }
  return (
    n.dirs && ((v = Qe(v)), (v.dirs = v.dirs ? v.dirs.concat(n.dirs) : n.dirs)),
    n.transition && (v.transition = n.transition),
    (g = v),
    Kt(w),
    g
  );
}

const Ao = (e) => {
    let t;
    for (const n in e)
      (n === "class" || n === "style" || $t(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  So = (e, t) => {
    const n = {};
    for (const r in e) (!In(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
    return n;
  };

function Oo(e, t, n) {
  const { props: r, children: i, component: o } = e,
    { props: l, children: c, patchFlag: u } = t,
    d = o.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && u >= 0) {
    if (u & 1024) return !0;
    if (u & 16) return r ? cr(r, l, d) : !!l;
    if (u & 8) {
      const p = t.dynamicProps;
      for (let _ = 0; _ < p.length; _++) {
        const P = p[_];
        if (l[P] !== r[P] && !Qt(d, P)) return !0;
      }
    }
  } else
    return (i || c) && (!c || !c.$stable)
      ? !0
      : r === l
        ? !1
        : r
          ? l
            ? cr(r, l, d)
            : !0
          : !!l;
  return !1;
}

function cr(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length) return !0;
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (t[o] !== e[o] && !Qt(n, o)) return !0;
  }
  return !1;
}

function Lo({ vnode: e, parent: t }, n) {
  for (; t && t.subTree === e; ) ((e = t.vnode).el = n), (t = t.parent);
}

const No = (e) => e.__isSuspense;

function Io(e, t) {
  t && t.pendingBranch
    ? W(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : Co(e);
}

function Fo(e, t) {
  if (re) {
    let n = re.provides;
    const r = re.parent && re.parent.provides;
    r === n && (n = re.provides = Object.create(r)), (n[e] = t);
  }
}

function jt(e, t, n = !1) {
  const r = re || Fe;
  if (r) {
    const i =
      r.parent == null
        ? r.vnode.appContext && r.vnode.appContext.provides
        : r.parent.provides;
    if (i && e in i) return i[e];
    if (arguments.length > 1) return n && G(t) ? t.call(r.proxy) : t;
  }
}

const Ht = {};

function an(e, t, n) {
  return Zr(e, t, n);
}

function Zr(
  e,
  t,
  { immediate: n, deep: r, flush: i, onTrack: o, onTrigger: l } = ne,
) {
  const c = Bi() === (re == null ? void 0 : re.scope) ? re : null;
  let u,
    d = !1,
    p = !1;
  if (
    (ge(e)
      ? ((u = () => e.value), (d = vn(e)))
      : dt(e)
        ? ((u = () => e), (r = !0))
        : W(e)
          ? ((p = !0),
            (d = e.some((v) => dt(v) || vn(v))),
            (u = () =>
              e.map((v) => {
                if (ge(v)) return v.value;
                if (dt(v)) return ut(v);
                if (G(v)) return Je(v, c, 2);
              })))
          : G(e)
            ? t
              ? (u = () => Je(e, c, 2))
              : (u = () => {
                  if (!(c && c.isUnmounted)) return _ && _(), Oe(e, c, 3, [P]);
                })
            : (u = Re),
    t && r)
  ) {
    const v = u;
    u = () => ut(v());
  }
  let _,
    P = (v) => {
      _ = m.onStop = () => {
        Je(v, c, 4);
      };
    },
    O;
  if (Lt)
    if (
      ((P = Re),
      t ? n && Oe(t, c, 3, [u(), p ? [] : void 0, P]) : u(),
      i === "sync")
    ) {
      const v = Is();
      O = v.__watcherHandles || (v.__watcherHandles = []);
    } else return Re;
  let a = p ? new Array(e.length).fill(Ht) : Ht;
  const s = () => {
    if (m.active)
      if (t) {
        const v = m.run();
        (r || d || (p ? v.some((A, R) => Yt(A, a[R])) : Yt(v, a))) &&
          (_ && _(),
          Oe(t, c, 3, [v, a === Ht ? void 0 : p && a[0] === Ht ? [] : a, P]),
          (a = v));
      } else m.run();
  };
  s.allowRecurse = !!t;
  let g;
  i === "sync"
    ? (g = s)
    : i === "post"
      ? (g = () => xe(s, c && c.suspense))
      : ((s.pre = !0), c && (s.id = c.uid), (g = () => qn(s)));
  const m = new zn(u, g);
  t
    ? n
      ? s()
      : (a = m.run())
    : i === "post"
      ? xe(m.run.bind(m), c && c.suspense)
      : m.run();
  const w = () => {
    m.stop(), c && c.scope && Fn(c.scope.effects, m);
  };
  return O && O.push(w), w;
}

function ko(e, t, n) {
  const r = this.proxy,
    i = le(e) ? (e.includes(".") ? Qr(r, e) : () => r[e]) : e.bind(r, r);
  let o;
  G(t) ? (o = t) : ((o = t.handler), (n = t));
  const l = re;
  mt(this);
  const c = Zr(i, o.bind(r), n);
  return l ? mt(l) : ct(), c;
}

function Qr(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let i = 0; i < n.length && r; i++) r = r[n[i]];
    return r;
  };
}

function ut(e, t) {
  if (!ie(e) || e.__v_skip || ((t = t || new Set()), t.has(e))) return e;
  if ((t.add(e), ge(e))) ut(e.value, t);
  else if (W(e)) for (let n = 0; n < e.length; n++) ut(e[n], t);
  else if (Si(e) || Ct(e))
    e.forEach((n) => {
      ut(n, t);
    });
  else if (Ni(e)) for (const n in e) ut(e[n], t);
  return e;
}

function Ro() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: new Map(),
  };
  return (
    ri(() => {
      e.isMounted = !0;
    }),
    ii(() => {
      e.isUnmounting = !0;
    }),
    e
  );
}

const Se = [Function, Array],
  Ho = {
    name: "BaseTransition",
    props: {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      onBeforeEnter: Se,
      onEnter: Se,
      onAfterEnter: Se,
      onEnterCancelled: Se,
      onBeforeLeave: Se,
      onLeave: Se,
      onAfterLeave: Se,
      onLeaveCancelled: Se,
      onBeforeAppear: Se,
      onAppear: Se,
      onAfterAppear: Se,
      onAppearCancelled: Se,
    },
    setup(e, { slots: t }) {
      const n = Ts(),
        r = Ro();
      let i;
      return () => {
        const o = t.default && ti(t.default(), !0);
        if (!o || !o.length) return;
        let l = o[0];
        if (o.length > 1) {
          for (const s of o)
            if (s.type !== Ye) {
              l = s;
              break;
            }
        }
        const c = J(e),
          { mode: u } = c;
        if (r.isLeaving) return cn(l);
        const d = fr(l);
        if (!d) return cn(l);
        const p = bn(d, c, r, n);
        xn(d, p);
        const _ = n.subTree,
          P = _ && fr(_);
        let O = !1;
        const { getTransitionKey: a } = d.type;
        if (a) {
          const s = a();
          i === void 0 ? (i = s) : s !== i && ((i = s), (O = !0));
        }
        if (P && P.type !== Ye && (!ot(d, P) || O)) {
          const s = bn(P, c, r, n);
          if ((xn(P, s), u === "out-in"))
            return (
              (r.isLeaving = !0),
              (s.afterLeave = () => {
                (r.isLeaving = !1), n.update.active !== !1 && n.update();
              }),
              cn(l)
            );
          u === "in-out" &&
            d.type !== Ye &&
            (s.delayLeave = (g, m, w) => {
              const v = ei(r, P);
              (v[String(P.key)] = P),
                (g._leaveCb = () => {
                  m(), (g._leaveCb = void 0), delete p.delayedLeave;
                }),
                (p.delayedLeave = w);
            });
        }
        return l;
      };
    },
  },
  zo = Ho;

function ei(e, t) {
  const { leavingVNodes: n } = e;
  let r = n.get(t.type);
  return r || ((r = Object.create(null)), n.set(t.type, r)), r;
}

function bn(e, t, n, r) {
  const {
      appear: i,
      mode: o,
      persisted: l = !1,
      onBeforeEnter: c,
      onEnter: u,
      onAfterEnter: d,
      onEnterCancelled: p,
      onBeforeLeave: _,
      onLeave: P,
      onAfterLeave: O,
      onLeaveCancelled: a,
      onBeforeAppear: s,
      onAppear: g,
      onAfterAppear: m,
      onAppearCancelled: w,
    } = t,
    v = String(e.key),
    A = ei(n, e),
    R = (E, I) => {
      E && Oe(E, r, 9, I);
    },
    N = (E, I) => {
      const F = I[1];
      R(E, I),
        W(E) ? E.every((D) => D.length <= 1) && F() : E.length <= 1 && F();
    },
    j = {
      mode: o,
      persisted: l,
      beforeEnter(E) {
        let I = c;
        if (!n.isMounted)
          if (i) I = s || c;
          else return;
        E._leaveCb && E._leaveCb(!0);
        const F = A[v];
        F && ot(e, F) && F.el._leaveCb && F.el._leaveCb(), R(I, [E]);
      },
      enter(E) {
        let I = u,
          F = d,
          D = p;
        if (!n.isMounted)
          if (i) (I = g || u), (F = m || d), (D = w || p);
          else return;
        let U = !1;
        const $ = (E._enterCb = (ae) => {
          U ||
            ((U = !0),
            ae ? R(D, [E]) : R(F, [E]),
            j.delayedLeave && j.delayedLeave(),
            (E._enterCb = void 0));
        });
        I ? N(I, [E, $]) : $();
      },
      leave(E, I) {
        const F = String(e.key);
        if ((E._enterCb && E._enterCb(!0), n.isUnmounting)) return I();
        R(_, [E]);
        let D = !1;
        const U = (E._leaveCb = ($) => {
          D ||
            ((D = !0),
            I(),
            $ ? R(a, [E]) : R(O, [E]),
            (E._leaveCb = void 0),
            A[F] === e && delete A[F]);
        });
        (A[F] = e), P ? N(P, [E, U]) : U();
      },
      clone(E) {
        return bn(E, t, n, r);
      },
    };
  return j;
}

function cn(e) {
  if (en(e)) return (e = Qe(e)), (e.children = null), e;
}

function fr(e) {
  return en(e) ? (e.children ? e.children[0] : void 0) : e;
}

function xn(e, t) {
  e.shapeFlag & 6 && e.component
    ? xn(e.component.subTree, t)
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t);
}

function ti(e, t = !1, n) {
  let r = [],
    i = 0;
  for (let o = 0; o < e.length; o++) {
    let l = e[o];
    const c = n == null ? l.key : String(n) + String(l.key != null ? l.key : o);
    l.type === Be
      ? (l.patchFlag & 128 && i++, (r = r.concat(ti(l.children, t, c))))
      : (t || l.type !== Ye) && r.push(c != null ? Qe(l, { key: c }) : l);
  }
  if (i > 1) for (let o = 0; o < r.length; o++) r[o].patchFlag = -2;
  return r;
}

const Dt = (e) => !!e.type.__asyncLoader,
  en = (e) => e.type.__isKeepAlive;

function Bo(e, t) {
  ni(e, "a", t);
}

function jo(e, t) {
  ni(e, "da", t);
}

function ni(e, t, n = re) {
  const r =
    e.__wdc ||
    (e.__wdc = () => {
      let i = n;
      for (; i; ) {
        if (i.isDeactivated) return;
        i = i.parent;
      }
      return e();
    });
  if ((tn(t, r, n), n)) {
    let i = n.parent;
    for (; i && i.parent; )
      en(i.parent.vnode) && Do(r, t, n, i), (i = i.parent);
  }
}

function Do(e, t, n, r) {
  const i = tn(t, e, r, !0);
  oi(() => {
    Fn(r[t], i);
  }, n);
}

function tn(e, t, n = re, r = !1) {
  if (n) {
    const i = n[e] || (n[e] = []),
      o =
        t.__weh ||
        (t.__weh = (...l) => {
          if (n.isUnmounted) return;
          vt(), mt(n);
          const c = Oe(t, n, e, l);
          return ct(), wt(), c;
        });
    return r ? i.unshift(o) : i.push(o), o;
  }
}

const Ke =
    (e) =>
    (t, n = re) =>
      (!Lt || e === "sp") && tn(e, (...r) => t(...r), n),
  Xo = Ke("bm"),
  ri = Ke("m"),
  Uo = Ke("bu"),
  Yo = Ke("u"),
  ii = Ke("bum"),
  oi = Ke("um"),
  Wo = Ke("sp"),
  Ko = Ke("rtg"),
  qo = Ke("rtc");

function $o(e, t = re) {
  tn("ec", e, t);
}

function tt(e, t, n, r) {
  const i = e.dirs,
    o = t && t.dirs;
  for (let l = 0; l < i.length; l++) {
    const c = i[l];
    o && (c.oldValue = o[l].value);
    let u = c.dir[r];
    u && (vt(), Oe(u, n, 8, [e.el, c, e, t]), wt());
  }
}

const Go = Symbol(),
  _n = (e) => (e ? (gi(e) ? Zn(e) || e.proxy : _n(e.parent)) : null),
  Tt = ue(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => _n(e.parent),
    $root: (e) => _n(e.root),
    $emit: (e) => e.emit,
    $options: (e) => $n(e),
    $forceUpdate: (e) => e.f || (e.f = () => qn(e.update)),
    $nextTick: (e) => e.n || (e.n = xo.bind(e.proxy)),
    $watch: (e) => ko.bind(e),
  }),
  fn = (e, t) => e !== ne && !e.__isScriptSetup && V(e, t),
  Vo = {
    get({ _: e }, t) {
      const {
        ctx: n,
        setupState: r,
        data: i,
        props: o,
        accessCache: l,
        type: c,
        appContext: u,
      } = e;
      let d;
      if (t[0] !== "$") {
        const O = l[t];
        if (O !== void 0)
          switch (O) {
            case 1:
              return r[t];
            case 2:
              return i[t];
            case 4:
              return n[t];
            case 3:
              return o[t];
          }
        else {
          if (fn(r, t)) return (l[t] = 1), r[t];
          if (i !== ne && V(i, t)) return (l[t] = 2), i[t];
          if ((d = e.propsOptions[0]) && V(d, t)) return (l[t] = 3), o[t];
          if (n !== ne && V(n, t)) return (l[t] = 4), n[t];
          En && (l[t] = 0);
        }
      }
      const p = Tt[t];
      let _, P;
      if (p) return t === "$attrs" && _e(e, "get", t), p(e);
      if ((_ = c.__cssModules) && (_ = _[t])) return _;
      if (n !== ne && V(n, t)) return (l[t] = 4), n[t];
      if (((P = u.config.globalProperties), V(P, t))) return P[t];
    },
    set({ _: e }, t, n) {
      const { data: r, setupState: i, ctx: o } = e;
      return fn(i, t)
        ? ((i[t] = n), !0)
        : r !== ne && V(r, t)
          ? ((r[t] = n), !0)
          : V(e.props, t) || (t[0] === "$" && t.slice(1) in e)
            ? !1
            : ((o[t] = n), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: n,
          ctx: r,
          appContext: i,
          propsOptions: o,
        },
      },
      l,
    ) {
      let c;
      return (
        !!n[l] ||
        (e !== ne && V(e, l)) ||
        fn(t, l) ||
        ((c = o[0]) && V(c, l)) ||
        V(r, l) ||
        V(Tt, l) ||
        V(i.config.globalProperties, l)
      );
    },
    defineProperty(e, t, n) {
      return (
        n.get != null
          ? (e._.accessCache[t] = 0)
          : V(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      );
    },
  };
let En = !0;

function Jo(e) {
  const t = $n(e),
    n = e.proxy,
    r = e.ctx;
  (En = !1), t.beforeCreate && ur(t.beforeCreate, e, "bc");
  const {
    data: i,
    computed: o,
    methods: l,
    watch: c,
    provide: u,
    inject: d,
    created: p,
    beforeMount: _,
    mounted: P,
    beforeUpdate: O,
    updated: a,
    activated: s,
    deactivated: g,
    beforeDestroy: m,
    beforeUnmount: w,
    destroyed: v,
    unmounted: A,
    render: R,
    renderTracked: N,
    renderTriggered: j,
    errorCaptured: E,
    serverPrefetch: I,
    expose: F,
    inheritAttrs: D,
    components: U,
    directives: $,
    filters: ae,
  } = t;
  if ((d && Zo(d, r, null, e.appContext.config.unwrapInjectedRef), l))
    for (const K in l) {
      const q = l[K];
      G(q) && (r[K] = q.bind(n));
    }
  if (i) {
    const K = i.call(n, n);
    ie(K) && (e.data = Xn(K));
  }
  if (((En = !0), o))
    for (const K in o) {
      const q = o[K],
        me = G(q) ? q.bind(n, n) : G(q.get) ? q.get.bind(n, n) : Re,
        Ee = !G(q) && G(q.set) ? q.set.bind(n) : Re,
        ce = Ls({ get: me, set: Ee });
      Object.defineProperty(r, K, {
        enumerable: !0,
        configurable: !0,
        get: () => ce.value,
        set: (ee) => (ce.value = ee),
      });
    }
  if (c) for (const K in c) si(c[K], r, n, K);
  if (u) {
    const K = G(u) ? u.call(n) : u;
    Reflect.ownKeys(K).forEach((q) => {
      Fo(q, K[q]);
    });
  }
  p && ur(p, e, "c");

  function Q(K, q) {
    W(q) ? q.forEach((me) => K(me.bind(n))) : q && K(q.bind(n));
  }

  if (
    (Q(Xo, _),
    Q(ri, P),
    Q(Uo, O),
    Q(Yo, a),
    Q(Bo, s),
    Q(jo, g),
    Q($o, E),
    Q(qo, N),
    Q(Ko, j),
    Q(ii, w),
    Q(oi, A),
    Q(Wo, I),
    W(F))
  )
    if (F.length) {
      const K = e.exposed || (e.exposed = {});
      F.forEach((q) => {
        Object.defineProperty(K, q, {
          get: () => n[q],
          set: (me) => (n[q] = me),
        });
      });
    } else e.exposed || (e.exposed = {});
  R && e.render === Re && (e.render = R),
    D != null && (e.inheritAttrs = D),
    U && (e.components = U),
    $ && (e.directives = $);
}

function Zo(e, t, n = Re, r = !1) {
  W(e) && (e = Cn(e));
  for (const i in e) {
    const o = e[i];
    let l;
    ie(o)
      ? "default" in o
        ? (l = jt(o.from || i, o.default, !0))
        : (l = jt(o.from || i))
      : (l = jt(o)),
      ge(l) && r
        ? Object.defineProperty(t, i, {
            enumerable: !0,
            configurable: !0,
            get: () => l.value,
            set: (c) => (l.value = c),
          })
        : (t[i] = l);
  }
}

function ur(e, t, n) {
  Oe(W(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
}

function si(e, t, n, r) {
  const i = r.includes(".") ? Qr(n, r) : () => n[r];
  if (le(e)) {
    const o = t[e];
    G(o) && an(i, o);
  } else if (G(e)) an(i, e.bind(n));
  else if (ie(e))
    if (W(e)) e.forEach((o) => si(o, t, n, r));
    else {
      const o = G(e.handler) ? e.handler.bind(n) : t[e.handler];
      G(o) && an(i, o, e);
    }
}

function $n(e) {
  const t = e.type,
    { mixins: n, extends: r } = t,
    {
      mixins: i,
      optionsCache: o,
      config: { optionMergeStrategies: l },
    } = e.appContext,
    c = o.get(t);
  let u;
  return (
    c
      ? (u = c)
      : !i.length && !n && !r
        ? (u = t)
        : ((u = {}),
          i.length && i.forEach((d) => qt(u, d, l, !0)),
          qt(u, t, l)),
    ie(t) && o.set(t, u),
    u
  );
}

function qt(e, t, n, r = !1) {
  const { mixins: i, extends: o } = t;
  o && qt(e, o, n, !0), i && i.forEach((l) => qt(e, l, n, !0));
  for (const l in t)
    if (!(r && l === "expose")) {
      const c = Qo[l] || (n && n[l]);
      e[l] = c ? c(e[l], t[l]) : t[l];
    }
  return e;
}

const Qo = {
  data: hr,
  props: rt,
  emits: rt,
  methods: rt,
  computed: rt,
  beforeCreate: pe,
  created: pe,
  beforeMount: pe,
  mounted: pe,
  beforeUpdate: pe,
  updated: pe,
  beforeDestroy: pe,
  beforeUnmount: pe,
  destroyed: pe,
  unmounted: pe,
  activated: pe,
  deactivated: pe,
  errorCaptured: pe,
  serverPrefetch: pe,
  components: rt,
  directives: rt,
  watch: ts,
  provide: hr,
  inject: es,
};

function hr(e, t) {
  return t
    ? e
      ? function () {
          return ue(
            G(e) ? e.call(this, this) : e,
            G(t) ? t.call(this, this) : t,
          );
        }
      : t
    : e;
}

function es(e, t) {
  return rt(Cn(e), Cn(t));
}

function Cn(e) {
  if (W(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}

function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}

function rt(e, t) {
  return e ? ue(ue(Object.create(null), e), t) : t;
}

function ts(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ue(Object.create(null), e);
  for (const r in t) n[r] = pe(e[r], t[r]);
  return n;
}

function ns(e, t, n, r = !1) {
  const i = {},
    o = {};
  Wt(o, rn, 1), (e.propsDefaults = Object.create(null)), li(e, t, i, o);
  for (const l in e.propsOptions[0]) l in i || (i[l] = void 0);
  n ? (e.props = r ? i : ho(i)) : e.type.props ? (e.props = i) : (e.props = o),
    (e.attrs = o);
}

function rs(e, t, n, r) {
  const {
      props: i,
      attrs: o,
      vnode: { patchFlag: l },
    } = e,
    c = J(i),
    [u] = e.propsOptions;
  let d = !1;
  if ((r || l > 0) && !(l & 16)) {
    if (l & 8) {
      const p = e.vnode.dynamicProps;
      for (let _ = 0; _ < p.length; _++) {
        let P = p[_];
        if (Qt(e.emitsOptions, P)) continue;
        const O = t[P];
        if (u)
          if (V(o, P)) O !== o[P] && ((o[P] = O), (d = !0));
          else {
            const a = gt(P);
            i[a] = Tn(u, c, a, O, e, !1);
          }
        else O !== o[P] && ((o[P] = O), (d = !0));
      }
    }
  } else {
    li(e, t, i, o) && (d = !0);
    let p;
    for (const _ in c)
      (!t || (!V(t, _) && ((p = yt(_)) === _ || !V(t, p)))) &&
        (u
          ? n &&
            (n[_] !== void 0 || n[p] !== void 0) &&
            (i[_] = Tn(u, c, _, void 0, e, !0))
          : delete i[_]);
    if (o !== c) for (const _ in o) (!t || !V(t, _)) && (delete o[_], (d = !0));
  }
  d && We(e, "set", "$attrs");
}

function li(e, t, n, r) {
  const [i, o] = e.propsOptions;
  let l = !1,
    c;
  if (t)
    for (let u in t) {
      if (Bt(u)) continue;
      const d = t[u];
      let p;
      i && V(i, (p = gt(u)))
        ? !o || !o.includes(p)
          ? (n[p] = d)
          : ((c || (c = {}))[p] = d)
        : Qt(e.emitsOptions, u) ||
          ((!(u in r) || d !== r[u]) && ((r[u] = d), (l = !0)));
    }
  if (o) {
    const u = J(n),
      d = c || ne;
    for (let p = 0; p < o.length; p++) {
      const _ = o[p];
      n[_] = Tn(i, u, _, d[_], e, !V(d, _));
    }
  }
  return l;
}

function Tn(e, t, n, r, i, o) {
  const l = e[n];
  if (l != null) {
    const c = V(l, "default");
    if (c && r === void 0) {
      const u = l.default;
      if (l.type !== Function && G(u)) {
        const { propsDefaults: d } = i;
        n in d ? (r = d[n]) : (mt(i), (r = d[n] = u.call(null, t)), ct());
      } else r = u;
    }
    l[0] &&
      (o && !c ? (r = !1) : l[1] && (r === "" || r === yt(n)) && (r = !0));
  }
  return r;
}

function ai(e, t, n = !1) {
  const r = t.propsCache,
    i = r.get(e);
  if (i) return i;
  const o = e.props,
    l = {},
    c = [];
  let u = !1;
  if (!G(e)) {
    const p = (_) => {
      u = !0;
      const [P, O] = ai(_, t, !0);
      ue(l, P), O && c.push(...O);
    };
    !n && t.mixins.length && t.mixins.forEach(p),
      e.extends && p(e.extends),
      e.mixins && e.mixins.forEach(p);
  }
  if (!o && !u) return ie(e) && r.set(e, ht), ht;
  if (W(o))
    for (let p = 0; p < o.length; p++) {
      const _ = gt(o[p]);
      dr(_) && (l[_] = ne);
    }
  else if (o)
    for (const p in o) {
      const _ = gt(p);
      if (dr(_)) {
        const P = o[p],
          O = (l[_] = W(P) || G(P) ? { type: P } : Object.assign({}, P));
        if (O) {
          const a = mr(Boolean, O.type),
            s = mr(String, O.type);
          (O[0] = a > -1),
            (O[1] = s < 0 || a < s),
            (a > -1 || V(O, "default")) && c.push(_);
        }
      }
    }
  const d = [l, c];
  return ie(e) && r.set(e, d), d;
}

function dr(e) {
  return e[0] !== "$";
}

function pr(e) {
  const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
  return t ? t[2] : e === null ? "null" : "";
}

function gr(e, t) {
  return pr(e) === pr(t);
}

function mr(e, t) {
  return W(t) ? t.findIndex((n) => gr(n, e)) : G(t) && gr(t, e) ? 0 : -1;
}

const ci = (e) => e[0] === "_" || e === "$stable",
  Gn = (e) => (W(e) ? e.map(je) : [je(e)]),
  is = (e, t, n) => {
    if (t._n) return t;
    const r = Po((...i) => Gn(t(...i)), n);
    return (r._c = !1), r;
  },
  fi = (e, t, n) => {
    const r = e._ctx;
    for (const i in e) {
      if (ci(i)) continue;
      const o = e[i];
      if (G(o)) t[i] = is(i, o, r);
      else if (o != null) {
        const l = Gn(o);
        t[i] = () => l;
      }
    }
  },
  ui = (e, t) => {
    const n = Gn(t);
    e.slots.default = () => n;
  },
  os = (e, t) => {
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n ? ((e.slots = J(t)), Wt(t, "_", n)) : fi(t, (e.slots = {}));
    } else (e.slots = {}), t && ui(e, t);
    Wt(e.slots, rn, 1);
  },
  ss = (e, t, n) => {
    const { vnode: r, slots: i } = e;
    let o = !0,
      l = ne;
    if (r.shapeFlag & 32) {
      const c = t._;
      c
        ? n && c === 1
          ? (o = !1)
          : (ue(i, t), !n && c === 1 && delete i._)
        : ((o = !t.$stable), fi(t, i)),
        (l = t);
    } else t && (ui(e, t), (l = { default: 1 }));
    if (o) for (const c in i) !ci(c) && !(c in l) && delete i[c];
  };

function hi() {
  return {
    app: null,
    config: {
      isNativeTag: Mi,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}

let ls = 0;

function as(e, t) {
  return function (r, i = null) {
    G(r) || (r = Object.assign({}, r)), i != null && !ie(i) && (i = null);
    const o = hi(),
      l = new Set();
    let c = !1;
    const u = (o.app = {
      _uid: ls++,
      _component: r,
      _props: i,
      _container: null,
      _context: o,
      _instance: null,
      version: Fs,
      get config() {
        return o.config;
      },
      set config(d) {},
      use(d, ...p) {
        return (
          l.has(d) ||
            (d && G(d.install)
              ? (l.add(d), d.install(u, ...p))
              : G(d) && (l.add(d), d(u, ...p))),
          u
        );
      },
      mixin(d) {
        return o.mixins.includes(d) || o.mixins.push(d), u;
      },
      component(d, p) {
        return p ? ((o.components[d] = p), u) : o.components[d];
      },
      directive(d, p) {
        return p ? ((o.directives[d] = p), u) : o.directives[d];
      },
      mount(d, p, _) {
        if (!c) {
          const P = at(r, i);
          return (
            (P.appContext = o),
            p && t ? t(P, d) : e(P, d, _),
            (c = !0),
            (u._container = d),
            (d.__vue_app__ = u),
            Zn(P.component) || P.component.proxy
          );
        }
      },
      unmount() {
        c && (e(null, u._container), delete u._container.__vue_app__);
      },
      provide(d, p) {
        return (o.provides[d] = p), u;
      },
    });
    return u;
  };
}

function Mn(e, t, n, r, i = !1) {
  if (W(e)) {
    e.forEach((P, O) => Mn(P, t && (W(t) ? t[O] : t), n, r, i));
    return;
  }
  if (Dt(r) && !i) return;
  const o = r.shapeFlag & 4 ? Zn(r.component) || r.component.proxy : r.el,
    l = i ? null : o,
    { i: c, r: u } = e,
    d = t && t.r,
    p = c.refs === ne ? (c.refs = {}) : c.refs,
    _ = c.setupState;
  if (
    (d != null &&
      d !== u &&
      (le(d)
        ? ((p[d] = null), V(_, d) && (_[d] = null))
        : ge(d) && (d.value = null)),
    G(u))
  )
    Je(u, c, 12, [l, p]);
  else {
    const P = le(u),
      O = ge(u);
    if (P || O) {
      const a = () => {
        if (e.f) {
          const s = P ? (V(_, u) ? _[u] : p[u]) : u.value;
          i
            ? W(s) && Fn(s, o)
            : W(s)
              ? s.includes(o) || s.push(o)
              : P
                ? ((p[u] = [o]), V(_, u) && (_[u] = p[u]))
                : ((u.value = [o]), e.k && (p[e.k] = u.value));
        } else
          P
            ? ((p[u] = l), V(_, u) && (_[u] = l))
            : O && ((u.value = l), e.k && (p[e.k] = l));
      };
      l ? ((a.id = -1), xe(a, n)) : a();
    }
  }
}

const xe = Io;

function cs(e) {
  return fs(e);
}

function fs(e, t) {
  const n = Ri();
  n.__VUE__ = !0;
  const {
      insert: r,
      remove: i,
      patchProp: o,
      createElement: l,
      createText: c,
      createComment: u,
      setText: d,
      setElementText: p,
      parentNode: _,
      nextSibling: P,
      setScopeId: O = Re,
      insertStaticContent: a,
    } = e,
    s = (
      f,
      h,
      y,
      x = null,
      b = null,
      T = null,
      L = !1,
      M = null,
      S = !!h.dynamicChildren,
    ) => {
      if (f === h) return;
      f && !ot(f, h) && ((x = Te(f)), ee(f, b, T, !0), (f = null)),
        h.patchFlag === -2 && ((S = !1), (h.dynamicChildren = null));
      const { type: C, ref: H, shapeFlag: k } = h;
      switch (C) {
        case nn:
          g(f, h, y, x);
          break;
        case Ye:
          m(f, h, y, x);
          break;
        case un:
          f == null && w(h, y, x, L);
          break;
        case Be:
          U(f, h, y, x, b, T, L, M, S);
          break;
        default:
          k & 1
            ? R(f, h, y, x, b, T, L, M, S)
            : k & 6
              ? $(f, h, y, x, b, T, L, M, S)
              : (k & 64 || k & 128) && C.process(f, h, y, x, b, T, L, M, S, we);
      }
      H != null && b && Mn(H, f && f.ref, T, h || f, !h);
    },
    g = (f, h, y, x) => {
      if (f == null) r((h.el = c(h.children)), y, x);
      else {
        const b = (h.el = f.el);
        h.children !== f.children && d(b, h.children);
      }
    },
    m = (f, h, y, x) => {
      f == null ? r((h.el = u(h.children || "")), y, x) : (h.el = f.el);
    },
    w = (f, h, y, x) => {
      [f.el, f.anchor] = a(f.children, h, y, x, f.el, f.anchor);
    },
    v = ({ el: f, anchor: h }, y, x) => {
      let b;
      for (; f && f !== h; ) (b = P(f)), r(f, y, x), (f = b);
      r(h, y, x);
    },
    A = ({ el: f, anchor: h }) => {
      let y;
      for (; f && f !== h; ) (y = P(f)), i(f), (f = y);
      i(h);
    },
    R = (f, h, y, x, b, T, L, M, S) => {
      (L = L || h.type === "svg"),
        f == null ? N(h, y, x, b, T, L, M, S) : I(f, h, b, T, L, M, S);
    },
    N = (f, h, y, x, b, T, L, M) => {
      let S, C;
      const { type: H, props: k, shapeFlag: z, transition: B, dirs: Y } = f;
      if (
        ((S = f.el = l(f.type, T, k && k.is, k)),
        z & 8
          ? p(S, f.children)
          : z & 16 &&
            E(f.children, S, null, x, b, T && H !== "foreignObject", L, M),
        Y && tt(f, null, x, "created"),
        j(S, f, f.scopeId, L, x),
        k)
      ) {
        for (const X in k)
          X !== "value" &&
            !Bt(X) &&
            o(S, X, null, k[X], T, f.children, x, b, oe);
        "value" in k && o(S, "value", null, k.value),
          (C = k.onVnodeBeforeMount) && ze(C, x, f);
      }
      Y && tt(f, null, x, "beforeMount");
      const Z = (!b || (b && !b.pendingBranch)) && B && !B.persisted;
      Z && B.beforeEnter(S),
        r(S, h, y),
        ((C = k && k.onVnodeMounted) || Z || Y) &&
          xe(() => {
            C && ze(C, x, f), Z && B.enter(S), Y && tt(f, null, x, "mounted");
          }, b);
    },
    j = (f, h, y, x, b) => {
      if ((y && O(f, y), x)) for (let T = 0; T < x.length; T++) O(f, x[T]);
      if (b) {
        let T = b.subTree;
        if (h === T) {
          const L = b.vnode;
          j(f, L, L.scopeId, L.slotScopeIds, b.parent);
        }
      }
    },
    E = (f, h, y, x, b, T, L, M, S = 0) => {
      for (let C = S; C < f.length; C++) {
        const H = (f[C] = M ? Ge(f[C]) : je(f[C]));
        s(null, H, h, y, x, b, T, L, M);
      }
    },
    I = (f, h, y, x, b, T, L) => {
      const M = (h.el = f.el);
      let { patchFlag: S, dynamicChildren: C, dirs: H } = h;
      S |= f.patchFlag & 16;
      const k = f.props || ne,
        z = h.props || ne;
      let B;
      y && nt(y, !1),
        (B = z.onVnodeBeforeUpdate) && ze(B, y, h, f),
        H && tt(h, f, y, "beforeUpdate"),
        y && nt(y, !0);
      const Y = b && h.type !== "foreignObject";
      if (
        (C
          ? F(f.dynamicChildren, C, M, y, x, Y, T)
          : L || q(f, h, M, null, y, x, Y, T, !1),
        S > 0)
      ) {
        if (S & 16) D(M, h, k, z, y, x, b);
        else if (
          (S & 2 && k.class !== z.class && o(M, "class", null, z.class, b),
          S & 4 && o(M, "style", k.style, z.style, b),
          S & 8)
        ) {
          const Z = h.dynamicProps;
          for (let X = 0; X < Z.length; X++) {
            const te = Z[X],
              be = k[te],
              He = z[te];
            (He !== be || te === "value") &&
              o(M, te, be, He, b, f.children, y, x, oe);
          }
        }
        S & 1 && f.children !== h.children && p(M, h.children);
      } else !L && C == null && D(M, h, k, z, y, x, b);
      ((B = z.onVnodeUpdated) || H) &&
        xe(() => {
          B && ze(B, y, h, f), H && tt(h, f, y, "updated");
        }, x);
    },
    F = (f, h, y, x, b, T, L) => {
      for (let M = 0; M < h.length; M++) {
        const S = f[M],
          C = h[M],
          H =
            S.el && (S.type === Be || !ot(S, C) || S.shapeFlag & 70)
              ? _(S.el)
              : y;
        s(S, C, H, null, x, b, T, L, !0);
      }
    },
    D = (f, h, y, x, b, T, L) => {
      if (y !== x) {
        if (y !== ne)
          for (const M in y)
            !Bt(M) && !(M in x) && o(f, M, y[M], null, L, h.children, b, T, oe);
        for (const M in x) {
          if (Bt(M)) continue;
          const S = x[M],
            C = y[M];
          S !== C && M !== "value" && o(f, M, C, S, L, h.children, b, T, oe);
        }
        "value" in x && o(f, "value", y.value, x.value);
      }
    },
    U = (f, h, y, x, b, T, L, M, S) => {
      const C = (h.el = f ? f.el : c("")),
        H = (h.anchor = f ? f.anchor : c(""));
      let { patchFlag: k, dynamicChildren: z, slotScopeIds: B } = h;
      B && (M = M ? M.concat(B) : B),
        f == null
          ? (r(C, y, x), r(H, y, x), E(h.children, y, H, b, T, L, M, S))
          : k > 0 && k & 64 && z && f.dynamicChildren
            ? (F(f.dynamicChildren, z, y, b, T, L, M),
              (h.key != null || (b && h === b.subTree)) && di(f, h, !0))
            : q(f, h, y, H, b, T, L, M, S);
    },
    $ = (f, h, y, x, b, T, L, M, S) => {
      (h.slotScopeIds = M),
        f == null
          ? h.shapeFlag & 512
            ? b.ctx.activate(h, y, x, L, S)
            : ae(h, y, x, b, T, L, S)
          : Pe(f, h, S);
    },
    ae = (f, h, y, x, b, T, L) => {
      const M = (f.component = Cs(f, x, b));
      if ((en(f) && (M.ctx.renderer = we), Ms(M), M.asyncDep)) {
        if ((b && b.registerDep(M, Q), !f.el)) {
          const S = (M.subTree = at(Ye));
          m(null, S, h, y);
        }
        return;
      }
      Q(M, f, h, y, b, T, L);
    },
    Pe = (f, h, y) => {
      const x = (h.component = f.component);
      if (Oo(f, h, y))
        if (x.asyncDep && !x.asyncResolved) {
          K(x, h, y);
          return;
        } else (x.next = h), Eo(x.update), x.update();
      else (h.el = f.el), (x.vnode = h);
    },
    Q = (f, h, y, x, b, T, L) => {
      const M = () => {
          if (f.isMounted) {
            let { next: H, bu: k, u: z, parent: B, vnode: Y } = f,
              Z = H,
              X;
            nt(f, !1),
              H ? ((H.el = Y.el), K(f, H, L)) : (H = Y),
              k && sn(k),
              (X = H.props && H.props.onVnodeBeforeUpdate) && ze(X, B, H, Y),
              nt(f, !0);
            const te = ln(f),
              be = f.subTree;
            (f.subTree = te),
              s(be, te, _(be.el), Te(be), f, b, T),
              (H.el = te.el),
              Z === null && Lo(f, te.el),
              z && xe(z, b),
              (X = H.props && H.props.onVnodeUpdated) &&
                xe(() => ze(X, B, H, Y), b);
          } else {
            let H;
            const { el: k, props: z } = h,
              { bm: B, m: Y, parent: Z } = f,
              X = Dt(h);
            if (
              (nt(f, !1),
              B && sn(B),
              !X && (H = z && z.onVnodeBeforeMount) && ze(H, Z, h),
              nt(f, !0),
              k && Me)
            ) {
              const te = () => {
                (f.subTree = ln(f)), Me(k, f.subTree, f, b, null);
              };
              X
                ? h.type.__asyncLoader().then(() => !f.isUnmounted && te())
                : te();
            } else {
              const te = (f.subTree = ln(f));
              s(null, te, y, x, f, b, T), (h.el = te.el);
            }
            if ((Y && xe(Y, b), !X && (H = z && z.onVnodeMounted))) {
              const te = h;
              xe(() => ze(H, Z, te), b);
            }
            (h.shapeFlag & 256 ||
              (Z && Dt(Z.vnode) && Z.vnode.shapeFlag & 256)) &&
              f.a &&
              xe(f.a, b),
              (f.isMounted = !0),
              (h = y = x = null);
          }
        },
        S = (f.effect = new zn(M, () => qn(C), f.scope)),
        C = (f.update = () => S.run());
      (C.id = f.uid), nt(f, !0), C();
    },
    K = (f, h, y) => {
      h.component = f;
      const x = f.vnode.props;
      (f.vnode = h),
        (f.next = null),
        rs(f, h.props, x, y),
        ss(f, h.children, y),
        vt(),
        ar(),
        wt();
    },
    q = (f, h, y, x, b, T, L, M, S = !1) => {
      const C = f && f.children,
        H = f ? f.shapeFlag : 0,
        k = h.children,
        { patchFlag: z, shapeFlag: B } = h;
      if (z > 0) {
        if (z & 128) {
          Ee(C, k, y, x, b, T, L, M, S);
          return;
        } else if (z & 256) {
          me(C, k, y, x, b, T, L, M, S);
          return;
        }
      }
      B & 8
        ? (H & 16 && oe(C, b, T), k !== C && p(y, k))
        : H & 16
          ? B & 16
            ? Ee(C, k, y, x, b, T, L, M, S)
            : oe(C, b, T, !0)
          : (H & 8 && p(y, ""), B & 16 && E(k, y, x, b, T, L, M, S));
    },
    me = (f, h, y, x, b, T, L, M, S) => {
      (f = f || ht), (h = h || ht);
      const C = f.length,
        H = h.length,
        k = Math.min(C, H);
      let z;
      for (z = 0; z < k; z++) {
        const B = (h[z] = S ? Ge(h[z]) : je(h[z]));
        s(f[z], B, y, null, b, T, L, M, S);
      }
      C > H ? oe(f, b, T, !0, !1, k) : E(h, y, x, b, T, L, M, S, k);
    },
    Ee = (f, h, y, x, b, T, L, M, S) => {
      let C = 0;
      const H = h.length;
      let k = f.length - 1,
        z = H - 1;
      for (; C <= k && C <= z; ) {
        const B = f[C],
          Y = (h[C] = S ? Ge(h[C]) : je(h[C]));
        if (ot(B, Y)) s(B, Y, y, null, b, T, L, M, S);
        else break;
        C++;
      }
      for (; C <= k && C <= z; ) {
        const B = f[k],
          Y = (h[z] = S ? Ge(h[z]) : je(h[z]));
        if (ot(B, Y)) s(B, Y, y, null, b, T, L, M, S);
        else break;
        k--, z--;
      }
      if (C > k) {
        if (C <= z) {
          const B = z + 1,
            Y = B < H ? h[B].el : x;
          for (; C <= z; )
            s(null, (h[C] = S ? Ge(h[C]) : je(h[C])), y, Y, b, T, L, M, S), C++;
        }
      } else if (C > z) for (; C <= k; ) ee(f[C], b, T, !0), C++;
      else {
        const B = C,
          Y = C,
          Z = new Map();
        for (C = Y; C <= z; C++) {
          const de = (h[C] = S ? Ge(h[C]) : je(h[C]));
          de.key != null && Z.set(de.key, C);
        }
        let X,
          te = 0;
        const be = z - Y + 1;
        let He = !1,
          bt = 0;
        const qe = new Array(be);
        for (C = 0; C < be; C++) qe[C] = 0;
        for (C = B; C <= k; C++) {
          const de = f[C];
          if (te >= be) {
            ee(de, b, T, !0);
            continue;
          }
          let Ae;
          if (de.key != null) Ae = Z.get(de.key);
          else
            for (X = Y; X <= z; X++)
              if (qe[X - Y] === 0 && ot(de, h[X])) {
                Ae = X;
                break;
              }
          Ae === void 0
            ? ee(de, b, T, !0)
            : ((qe[Ae - Y] = C + 1),
              Ae >= bt ? (bt = Ae) : (He = !0),
              s(de, h[Ae], y, null, b, T, L, M, S),
              te++);
        }
        const et = He ? us(qe) : ht;
        for (X = et.length - 1, C = be - 1; C >= 0; C--) {
          const de = Y + C,
            Ae = h[de],
            Xe = de + 1 < H ? h[de + 1].el : x;
          qe[C] === 0
            ? s(null, Ae, y, Xe, b, T, L, M, S)
            : He && (X < 0 || C !== et[X] ? ce(Ae, y, Xe, 2) : X--);
        }
      }
    },
    ce = (f, h, y, x, b = null) => {
      const { el: T, type: L, transition: M, children: S, shapeFlag: C } = f;
      if (C & 6) {
        ce(f.component.subTree, h, y, x);
        return;
      }
      if (C & 128) {
        f.suspense.move(h, y, x);
        return;
      }
      if (C & 64) {
        L.move(f, h, y, we);
        return;
      }
      if (L === Be) {
        r(T, h, y);
        for (let k = 0; k < S.length; k++) ce(S[k], h, y, x);
        r(f.anchor, h, y);
        return;
      }
      if (L === un) {
        v(f, h, y);
        return;
      }
      if (x !== 2 && C & 1 && M)
        if (x === 0) M.beforeEnter(T), r(T, h, y), xe(() => M.enter(T), b);
        else {
          const { leave: k, delayLeave: z, afterLeave: B } = M,
            Y = () => r(T, h, y),
            Z = () => {
              k(T, () => {
                Y(), B && B();
              });
            };
          z ? z(T, Y, Z) : Z();
        }
      else r(T, h, y);
    },
    ee = (f, h, y, x = !1, b = !1) => {
      const {
        type: T,
        props: L,
        ref: M,
        children: S,
        dynamicChildren: C,
        shapeFlag: H,
        patchFlag: k,
        dirs: z,
      } = f;
      if ((M != null && Mn(M, null, y, f, !0), H & 256)) {
        h.ctx.deactivate(f);
        return;
      }
      const B = H & 1 && z,
        Y = !Dt(f);
      let Z;
      if ((Y && (Z = L && L.onVnodeBeforeUnmount) && ze(Z, h, f), H & 6))
        Ce(f.component, y, x);
      else {
        if (H & 128) {
          f.suspense.unmount(y, x);
          return;
        }
        B && tt(f, null, h, "beforeUnmount"),
          H & 64
            ? f.type.remove(f, h, y, b, we, x)
            : C && (T !== Be || (k > 0 && k & 64))
              ? oe(C, h, y, !1, !0)
              : ((T === Be && k & 384) || (!b && H & 16)) && oe(S, h, y),
          x && Le(f);
      }
      ((Y && (Z = L && L.onVnodeUnmounted)) || B) &&
        xe(() => {
          Z && ze(Z, h, f), B && tt(f, null, h, "unmounted");
        }, y);
    },
    Le = (f) => {
      const { type: h, el: y, anchor: x, transition: b } = f;
      if (h === Be) {
        ye(y, x);
        return;
      }
      if (h === un) {
        A(f);
        return;
      }
      const T = () => {
        i(y), b && !b.persisted && b.afterLeave && b.afterLeave();
      };
      if (f.shapeFlag & 1 && b && !b.persisted) {
        const { leave: L, delayLeave: M } = b,
          S = () => L(y, T);
        M ? M(f.el, T, S) : S();
      } else T();
    },
    ye = (f, h) => {
      let y;
      for (; f !== h; ) (y = P(f)), i(f), (f = y);
      i(h);
    },
    Ce = (f, h, y) => {
      const { bum: x, scope: b, update: T, subTree: L, um: M } = f;
      x && sn(x),
        b.stop(),
        T && ((T.active = !1), ee(L, f, h, y)),
        M && xe(M, h),
        xe(() => {
          f.isUnmounted = !0;
        }, h),
        h &&
          h.pendingBranch &&
          !h.isUnmounted &&
          f.asyncDep &&
          !f.asyncResolved &&
          f.suspenseId === h.pendingId &&
          (h.deps--, h.deps === 0 && h.resolve());
    },
    oe = (f, h, y, x = !1, b = !1, T = 0) => {
      for (let L = T; L < f.length; L++) ee(f[L], h, y, x, b);
    },
    Te = (f) =>
      f.shapeFlag & 6
        ? Te(f.component.subTree)
        : f.shapeFlag & 128
          ? f.suspense.next()
          : P(f.anchor || f.el),
    ve = (f, h, y) => {
      f == null
        ? h._vnode && ee(h._vnode, null, null, !0)
        : s(h._vnode || null, f, h, null, null, null, y),
        ar(),
        $r(),
        (h._vnode = f);
    },
    we = {
      p: s,
      um: ee,
      m: ce,
      r: Le,
      mt: ae,
      mc: E,
      pc: q,
      pbc: F,
      n: Te,
      o: e,
    };
  let he, Me;
  return (
    t && ([he, Me] = t(we)), { render: ve, hydrate: he, createApp: as(ve, he) }
  );
}

function nt({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}

function di(e, t, n = !1) {
  const r = e.children,
    i = t.children;
  if (W(r) && W(i))
    for (let o = 0; o < r.length; o++) {
      const l = r[o];
      let c = i[o];
      c.shapeFlag & 1 &&
        !c.dynamicChildren &&
        ((c.patchFlag <= 0 || c.patchFlag === 32) &&
          ((c = i[o] = Ge(i[o])), (c.el = l.el)),
        n || di(l, c)),
        c.type === nn && (c.el = l.el);
    }
}

function us(e) {
  const t = e.slice(),
    n = [0];
  let r, i, o, l, c;
  const u = e.length;
  for (r = 0; r < u; r++) {
    const d = e[r];
    if (d !== 0) {
      if (((i = n[n.length - 1]), e[i] < d)) {
        (t[r] = i), n.push(r);
        continue;
      }
      for (o = 0, l = n.length - 1; o < l; )
        (c = (o + l) >> 1), e[n[c]] < d ? (o = c + 1) : (l = c);
      d < e[n[o]] && (o > 0 && (t[r] = n[o - 1]), (n[o] = r));
    }
  }
  for (o = n.length, l = n[o - 1]; o-- > 0; ) (n[o] = l), (l = t[l]);
  return n;
}

const hs = (e) => e.__isTeleport,
  Be = Symbol(void 0),
  nn = Symbol(void 0),
  Ye = Symbol(void 0),
  un = Symbol(void 0),
  Mt = [];
let ke = null;

function ds(e = !1) {
  Mt.push((ke = e ? null : []));
}

function ps() {
  Mt.pop(), (ke = Mt[Mt.length - 1] || null);
}

let Ot = 1;

function yr(e) {
  Ot += e;
}

function gs(e) {
  return (
    (e.dynamicChildren = Ot > 0 ? ke || ht : null),
    ps(),
    Ot > 0 && ke && ke.push(e),
    e
  );
}

function ms(e, t, n, r, i, o) {
  return gs(Vn(e, t, n, r, i, o, !0));
}

function ys(e) {
  return e ? e.__v_isVNode === !0 : !1;
}

function ot(e, t) {
  return e.type === t.type && e.key === t.key;
}

const rn = "__vInternal",
  pi = ({ key: e }) => (e != null ? e : null),
  Xt = ({ ref: e, ref_key: t, ref_for: n }) =>
    e != null
      ? le(e) || ge(e) || G(e)
        ? {
            i: Fe,
            r: e,
            k: t,
            f: !!n,
          }
        : e
      : null;

function Vn(
  e,
  t = null,
  n = null,
  r = 0,
  i = null,
  o = e === Be ? 0 : 1,
  l = !1,
  c = !1,
) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && pi(t),
    ref: t && Xt(t),
    scopeId: Jr,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: r,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Fe,
  };
  return (
    c
      ? (Jn(u, n), o & 128 && e.normalize(u))
      : n && (u.shapeFlag |= le(n) ? 8 : 16),
    Ot > 0 &&
      !l &&
      ke &&
      (u.patchFlag > 0 || o & 6) &&
      u.patchFlag !== 32 &&
      ke.push(u),
    u
  );
}

const at = vs;

function vs(e, t = null, n = null, r = 0, i = null, o = !1) {
  if (((!e || e === Go) && (e = Ye), ys(e))) {
    const c = Qe(e, t, !0);
    return (
      n && Jn(c, n),
      Ot > 0 &&
        !o &&
        ke &&
        (c.shapeFlag & 6 ? (ke[ke.indexOf(e)] = c) : ke.push(c)),
      (c.patchFlag |= -2),
      c
    );
  }
  if ((Os(e) && (e = e.__vccOpts), t)) {
    t = ws(t);
    let { class: c, style: u } = t;
    c && !le(c) && (t.class = Nn(c)),
      ie(u) && (Xr(u) && !W(u) && (u = ue({}, u)), (t.style = Ln(u)));
  }
  const l = le(e) ? 1 : No(e) ? 128 : hs(e) ? 64 : ie(e) ? 4 : G(e) ? 2 : 0;
  return Vn(e, t, n, r, i, l, o, !0);
}

function ws(e) {
  return e ? (Xr(e) || rn in e ? ue({}, e) : e) : null;
}

function Qe(e, t, n = !1) {
  const { props: r, ref: i, patchFlag: o, children: l } = e,
    c = t ? xs(r || {}, t) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && pi(c),
    ref:
      t && t.ref ? (n && i ? (W(i) ? i.concat(Xt(t)) : [i, Xt(t)]) : Xt(t)) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== Be ? (o === -1 ? 16 : o | 16) : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Qe(e.ssContent),
    ssFallback: e.ssFallback && Qe(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
  };
}

function bs(e = " ", t = 0) {
  return at(nn, null, e, t);
}

function je(e) {
  return e == null || typeof e == "boolean"
    ? at(Ye)
    : W(e)
      ? at(Be, null, e.slice())
      : typeof e == "object"
        ? Ge(e)
        : at(nn, null, String(e));
}

function Ge(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : Qe(e);
}

function Jn(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null) t = null;
  else if (W(t)) n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), Jn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !(rn in t)
        ? (t._ctx = Fe)
        : i === 3 &&
          Fe &&
          (Fe.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    G(t)
      ? ((t = { default: t, _ctx: Fe }), (n = 32))
      : ((t = String(t)), r & 64 ? ((n = 16), (t = [bs(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}

function xs(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const i in r)
      if (i === "class")
        t.class !== r.class && (t.class = Nn([t.class, r.class]));
      else if (i === "style") t.style = Ln([t.style, r.style]);
      else if ($t(i)) {
        const o = t[i],
          l = r[i];
        l &&
          o !== l &&
          !(W(o) && o.includes(l)) &&
          (t[i] = o ? [].concat(o, l) : l);
      } else i !== "" && (t[i] = r[i]);
  }
  return t;
}

function ze(e, t, n, r = null) {
  Oe(e, t, 7, [n, r]);
}

const _s = hi();
let Es = 0;

function Cs(e, t, n) {
  const r = e.type,
    i = (t ? t.appContext : e.appContext) || _s,
    o = {
      uid: Es++,
      vnode: e,
      type: r,
      parent: t,
      appContext: i,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new Hi(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(i.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: ai(r, i),
      emitsOptions: Vr(r, i),
      emit: null,
      emitted: null,
      propsDefaults: ne,
      inheritAttrs: r.inheritAttrs,
      ctx: ne,
      data: ne,
      props: ne,
      attrs: ne,
      slots: ne,
      refs: ne,
      setupState: ne,
      setupContext: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (o.ctx = { _: o }),
    (o.root = t ? t.root : o),
    (o.emit = Mo.bind(null, o)),
    e.ce && e.ce(o),
    o
  );
}

let re = null;
const Ts = () => re || Fe,
  mt = (e) => {
    (re = e), e.scope.on();
  },
  ct = () => {
    re && re.scope.off(), (re = null);
  };

function gi(e) {
  return e.vnode.shapeFlag & 4;
}

let Lt = !1;

function Ms(e, t = !1) {
  Lt = t;
  const { props: n, children: r } = e.vnode,
    i = gi(e);
  ns(e, n, i, t), os(e, r);
  const o = i ? Ps(e, t) : void 0;
  return (Lt = !1), o;
}

function Ps(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = Ur(new Proxy(e.ctx, Vo)));
  const { setup: r } = n;
  if (r) {
    const i = (e.setupContext = r.length > 1 ? Ss(e) : null);
    mt(e), vt();
    const o = Je(r, e, 0, [e.props, i]);
    if ((wt(), ct(), Sr(o))) {
      if ((o.then(ct, ct), t))
        return o
          .then((l) => {
            vr(e, l, t);
          })
          .catch((l) => {
            Zt(l, e, 0);
          });
      e.asyncDep = o;
    } else vr(e, o, t);
  } else mi(e, t);
}

function vr(e, t, n) {
  G(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : ie(t) && (e.setupState = Yr(t)),
    mi(e, n);
}

let wr;

function mi(e, t, n) {
  const r = e.type;
  if (!e.render) {
    if (!t && wr && !r.render) {
      const i = r.template || $n(e).template;
      if (i) {
        const { isCustomElement: o, compilerOptions: l } = e.appContext.config,
          { delimiters: c, compilerOptions: u } = r,
          d = ue(ue({ isCustomElement: o, delimiters: c }, l), u);
        r.render = wr(i, d);
      }
    }
    e.render = r.render || Re;
  }
  mt(e), vt(), Jo(e), wt(), ct();
}

function As(e) {
  return new Proxy(e.attrs, {
    get(t, n) {
      return _e(e, "get", "$attrs"), t[n];
    },
  });
}

function Ss(e) {
  const t = (r) => {
    e.exposed = r || {};
  };
  let n;
  return {
    get attrs() {
      return n || (n = As(e));
    },
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}

function Zn(e) {
  if (e.exposed)
    return (
      e.exposeProxy ||
      (e.exposeProxy = new Proxy(Yr(Ur(e.exposed)), {
        get(t, n) {
          if (n in t) return t[n];
          if (n in Tt) return Tt[n](e);
        },
        has(t, n) {
          return n in t || n in Tt;
        },
      }))
    );
}

function Os(e) {
  return G(e) && "__vccOpts" in e;
}

const Ls = (e, t) => wo(e, t, Lt),
  Ns = Symbol(""),
  Is = () => jt(Ns),
  Fs = "3.2.47",
  ks = "http://www.w3.org/2000/svg",
  st = typeof document < "u" ? document : null,
  br = st && st.createElement("template"),
  Rs = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, r) => {
      const i = t
        ? st.createElementNS(ks, e)
        : st.createElement(e, n ? { is: n } : void 0);
      return (
        e === "select" &&
          r &&
          r.multiple != null &&
          i.setAttribute("multiple", r.multiple),
        i
      );
    },
    createText: (e) => st.createTextNode(e),
    createComment: (e) => st.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => st.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, r, i, o) {
      const l = n ? n.previousSibling : t.lastChild;
      if (i && (i === o || i.nextSibling))
        for (
          ;
          t.insertBefore(i.cloneNode(!0), n),
            !(i === o || !(i = i.nextSibling));

        );
      else {
        br.innerHTML = r ? `<svg>${e}</svg>` : e;
        const c = br.content;
        if (r) {
          const u = c.firstChild;
          for (; u.firstChild; ) c.appendChild(u.firstChild);
          c.removeChild(u);
        }
        t.insertBefore(c, n);
      }
      return [
        l ? l.nextSibling : t.firstChild,
        n ? n.previousSibling : t.lastChild,
      ];
    },
  };

function Hs(e, t, n) {
  const r = e._vtc;
  r && (t = (t ? [t, ...r] : [...r]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : n
        ? e.setAttribute("class", t)
        : (e.className = t);
}

function zs(e, t, n) {
  const r = e.style,
    i = le(n);
  if (n && !i) {
    if (t && !le(t)) for (const o in t) n[o] == null && Pn(r, o, "");
    for (const o in n) Pn(r, o, n[o]);
  } else {
    const o = r.display;
    i ? t !== n && (r.cssText = n) : t && e.removeAttribute("style"),
      "_vod" in e && (r.display = o);
  }
}

const xr = /\s*!important$/;

function Pn(e, t, n) {
  if (W(n)) n.forEach((r) => Pn(e, t, r));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
    const r = Bs(e, t);
    xr.test(n)
      ? e.setProperty(yt(r), n.replace(xr, ""), "important")
      : (e[r] = n);
  }
}

const _r = ["Webkit", "Moz", "ms"],
  hn = {};

function Bs(e, t) {
  const n = hn[t];
  if (n) return n;
  let r = gt(t);
  if (r !== "filter" && r in e) return (hn[t] = r);
  r = Or(r);
  for (let i = 0; i < _r.length; i++) {
    const o = _r[i] + r;
    if (o in e) return (hn[t] = o);
  }
  return t;
}

const Er = "http://www.w3.org/1999/xlink";

function js(e, t, n, r, i) {
  if (r && t.startsWith("xlink:"))
    n == null
      ? e.removeAttributeNS(Er, t.slice(6, t.length))
      : e.setAttributeNS(Er, t, n);
  else {
    const o = Ti(t);
    n == null || (o && !Ar(n))
      ? e.removeAttribute(t)
      : e.setAttribute(t, o ? "" : n);
  }
}

function Ds(e, t, n, r, i, o, l) {
  if (t === "innerHTML" || t === "textContent") {
    r && l(r, i, o), (e[t] = n == null ? "" : n);
    return;
  }
  if (t === "value" && e.tagName !== "PROGRESS" && !e.tagName.includes("-")) {
    e._value = n;
    const u = n == null ? "" : n;
    (e.value !== u || e.tagName === "OPTION") && (e.value = u),
      n == null && e.removeAttribute(t);
    return;
  }
  let c = !1;
  if (n === "" || n == null) {
    const u = typeof e[t];
    u === "boolean"
      ? (n = Ar(n))
      : n == null && u === "string"
        ? ((n = ""), (c = !0))
        : u === "number" && ((n = 0), (c = !0));
  }
  try {
    e[t] = n;
  } catch {}
  c && e.removeAttribute(t);
}

function Xs(e, t, n, r) {
  e.addEventListener(t, n, r);
}

function Us(e, t, n, r) {
  e.removeEventListener(t, n, r);
}

function Ys(e, t, n, r, i = null) {
  const o = e._vei || (e._vei = {}),
    l = o[t];
  if (r && l) l.value = r;
  else {
    const [c, u] = Ws(t);
    if (r) {
      const d = (o[t] = $s(r, i));
      Xs(e, c, d, u);
    } else l && (Us(e, c, l, u), (o[t] = void 0));
  }
}

const Cr = /(?:Once|Passive|Capture)$/;

function Ws(e) {
  let t;
  if (Cr.test(e)) {
    t = {};
    let r;
    for (; (r = e.match(Cr)); )
      (e = e.slice(0, e.length - r[0].length)), (t[r[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : yt(e.slice(2)), t];
}

let dn = 0;
const Ks = Promise.resolve(),
  qs = () => dn || (Ks.then(() => (dn = 0)), (dn = Date.now()));

function $s(e, t) {
  const n = (r) => {
    if (!r._vts) r._vts = Date.now();
    else if (r._vts <= n.attached) return;
    Oe(Gs(r, n.value), t, 5, [r]);
  };
  return (n.value = e), (n.attached = qs()), n;
}

function Gs(e, t) {
  if (W(t)) {
    const n = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        n.call(e), (e._stopped = !0);
      }),
      t.map((r) => (i) => !i._stopped && r && r(i))
    );
  } else return t;
}

const Tr = /^on[a-z]/,
  Vs = (e, t, n, r, i = !1, o, l, c, u) => {
    t === "class"
      ? Hs(e, r, i)
      : t === "style"
        ? zs(e, n, r)
        : $t(t)
          ? In(t) || Ys(e, t, n, r, l)
          : (
                t[0] === "."
                  ? ((t = t.slice(1)), !0)
                  : t[0] === "^"
                    ? ((t = t.slice(1)), !1)
                    : Js(e, t, r, i)
              )
            ? Ds(e, t, r, o, l, c, u)
            : (t === "true-value"
                ? (e._trueValue = r)
                : t === "false-value" && (e._falseValue = r),
              js(e, t, r, i));
  };

function Js(e, t, n, r) {
  return r
    ? !!(
        t === "innerHTML" ||
        t === "textContent" ||
        (t in e && Tr.test(t) && G(n))
      )
    : t === "spellcheck" ||
        t === "draggable" ||
        t === "translate" ||
        t === "form" ||
        (t === "list" && e.tagName === "INPUT") ||
        (t === "type" && e.tagName === "TEXTAREA") ||
        (Tr.test(t) && le(n))
      ? !1
      : t in e;
}

const Zs = {
  name: String,
  type: String,
  css: { type: Boolean, default: !0 },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String,
};
zo.props;
const Qs = ue({ patchProp: Vs }, Rs);
let Mr;

function el() {
  return Mr || (Mr = cs(Qs));
}

const tl = (...e) => {
  const t = el().createApp(...e),
    { mount: n } = t;
  return (
    (t.mount = (r) => {
      const i = nl(r);
      if (!i) return;
      const o = t._component;
      !G(o) && !o.render && !o.template && (o.template = i.innerHTML),
        (i.innerHTML = "");
      const l = n(i, !1, i instanceof SVGElement);
      return (
        i instanceof Element &&
          (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")),
        l
      );
    }),
    t
  );
};

function nl(e) {
  return le(e) ? document.querySelector(e) : e;
}

const rl = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, i] of t) n[r] = i;
  return n;
};
(() => {
  function e() {
    function t(a, s, g) {
      Object.defineProperty(a, s, {
        value: g,
        enumerable: !1,
        configurable: !0,
        writable: !0,
      });
    }

    function n(a, s, g) {
      Object.defineProperty(a, s, { get: g, enumerable: !1, configurable: !0 });
    }

    for (var r = window, i = 0, o = ["TouchEvent"]; i < o.length; i++) {
      var l = o[i];
      r[l] === void 0 && (r[l] = function () {});
    }
    try {
      var c = window.matchMedia;
      c &&
        !c("(prefers-color-scheme: dark)").addEventListener &&
        (window.matchMedia = function (a) {
          var s = c(a);
          return (
            s.addEventListener ||
              (s.addEventListener = function (g, m) {
                this.addListener(m);
              }),
            s.removeEventListener ||
              (s.removeEventListener = function (g, m) {
                this.removeListener(m);
              }),
            s
          );
        });
    } catch (a) {
      console.error(a);
    }
    window.ResizeObserver ||
      (window.ResizeObserver = (function () {
        function a() {}

        return (
          (a.prototype.observe = function () {}),
          (a.prototype.unobserve = function () {}),
          (a.prototype.disconnect = function () {}),
          a
        );
      })()),
      Object.isEmpty ||
        t(Object, "isEmpty", function (a) {
          for (var s in a) if (a.hasOwnProperty(s)) return !1;
          return !0;
        }),
      Object.each ||
        (Object.each = function (a, s, g) {
          for (var m in a)
            if (a.hasOwnProperty(m) && s.call(g, a[m], m) === !1) return !1;
          return !0;
        }),
      Array.combine ||
        (Array.combine = function (a) {
          for (var s = 0, g = 0, m = a; g < m.length; g++) s += m[g].length;
          for (var w = new Array(s), v = 0, A = 0, R = a; A < R.length; A++)
            for (var N = 0, j = R[A]; N < j.length; N++) {
              var E = j[N];
              (w[v] = E), v++;
            }
          return w;
        }),
      Array.prototype.first ||
        t(Array.prototype, "first", function () {
          if (this.length !== 0) return this[0];
        }),
      Array.prototype.last ||
        t(Array.prototype, "last", function () {
          if (this.length !== 0) return this[this.length - 1];
        }),
      Array.prototype.contains ||
        t(Array.prototype, "contains", function (a) {
          return this.indexOf(a) !== -1;
        }),
      Array.prototype.remove ||
        t(Array.prototype, "remove", function (a) {
          for (var s = this.length - 1; s >= 0; s--)
            this[s] === a && this.splice(s, 1);
        }),
      Array.prototype.shuffle ||
        t(Array.prototype, "shuffle", function () {
          for (var a, s, g = this.length; g !== 0; )
            (s = Math.floor(Math.random() * g)),
              (a = this[(g -= 1)]),
              (this[g] = this[s]),
              (this[s] = a);
          return this;
        }),
      Array.prototype.unique ||
        t(Array.prototype, "unique", function () {
          return Array.from(new Set(this).values());
        }),
      Math.clamp ||
        (Math.clamp = function (a, s, g) {
          return Math.min(Math.max(a, s), g);
        }),
      Math.square ||
        (Math.square = function (a) {
          return a * a;
        }),
      String.isString ||
        (String.isString = function (a) {
          return typeof a == "string" || a instanceof String;
        }),
      String.prototype.contains ||
        (String.prototype.contains = function (a) {
          return this.indexOf(a) !== -1;
        }),
      String.prototype.startsWith ||
        (String.prototype.startsWith = function (a, s) {
          return this.substr(!s || s < 0 ? 0 : +s, a.length) === a;
        }),
      String.prototype.endsWith ||
        (String.prototype.endsWith = function (a, s) {
          var g = s === void 0 || s > this.length ? this.length : s;
          return this.substring(g - a.length, g) === a;
        }),
      String.prototype.format ||
        (String.prototype.format = function () {
          for (var a = [], s = 0; s < arguments.length; s++)
            a[s] = arguments[s];
          return this.replace(/{(\d+)}/g, function (g, m) {
            return a[m] !== void 0 ? a[m] : g;
          });
        }),
      Number.isNumber ||
        t(Number, "isNumber", function (a) {
          return typeof a == "number";
        }),
      t(window, "isBoolean", function (a) {
        return typeof a == "boolean";
      });
    var u = function (a) {
      var s = a.nodeType;
      if (s === 1 || s === 9 || s === 11) {
        if (typeof a.textContent == "string") return a.textContent;
        for (var g = [], m = a.firstChild; m; m = m.nextSibling) g.push(u(m));
        return g.join("");
      }
      return ((s === 3 || s === 4) && a.nodeValue) || "";
    };

    function d(a) {
      var s = this.style;
      for (var g in a) a.hasOwnProperty(g) && (s[g] = a[g]);
    }

    function p(a) {
      var s = this.style;
      for (var g in a) a.hasOwnProperty(g) && s.setProperty(g, a[g]);
    }

    (Element.prototype.getText = function () {
      return u(this);
    }),
      (Element.prototype.setText = function (a) {
        (function (s, g) {
          if (g instanceof DocumentFragment || g instanceof Node)
            return s.empty(), void s.appendChild(g);
          String.isString(g) || (g = String(g));
          var m = s.nodeType;
          (m !== 1 && m !== 9 && m !== 11) || (s.textContent = g);
        })(this, a);
      }),
      (Element.prototype.addClass = function () {
        for (var a = [], s = 0; s < arguments.length; s++) a[s] = arguments[s];
        this.addClasses(a);
      }),
      (Element.prototype.addClasses = function (a) {
        for (var s = 0; s < a.length; s++) this.classList.add(a[s]);
      }),
      (Element.prototype.removeClass = function () {
        for (var a = [], s = 0; s < arguments.length; s++) a[s] = arguments[s];
        this.removeClasses(a);
      }),
      (Element.prototype.removeClasses = function (a) {
        for (var s = 0; s < a.length; s++) this.classList.remove(a[s]);
      }),
      (Element.prototype.toggleClass = function (a, s) {
        a instanceof Array || (a = [a]),
          s ? this.addClasses(a) : this.removeClasses(a);
      }),
      (Element.prototype.hasClass = function (a) {
        return this.classList.contains(a);
      }),
      [
        Element.prototype,
        Document.prototype,
        DocumentFragment.prototype,
      ].forEach(function (a) {
        t(a, "prepend", function () {
          for (var s = [], g = 0; g < arguments.length; g++)
            s[g] = arguments[g];
          for (
            var m = document.createDocumentFragment(), w = 0, v = s;
            w < v.length;
            w++
          ) {
            var A = v[w];
            m.appendChild(
              A instanceof Node ? A : document.createTextNode(String(A)),
            );
          }
          this.insertBefore(m, this.firstChild);
        });
      }),
      (Node.prototype.detach = function () {
        this.parentNode && this.parentNode.removeChild(this);
      }),
      (Node.prototype.empty = function () {
        for (; this.lastChild; ) this.removeChild(this.lastChild);
      }),
      (Node.prototype.insertAfter = function (a, s) {
        return (
          s
            ? this.insertBefore(a, s.nextSibling)
            : this.insertBefore(a, this.firstChild),
          a
        );
      }),
      (Node.prototype.indexOf = function (a) {
        return Array.prototype.indexOf.call(this.childNodes, a);
      }),
      (Node.prototype.setChildrenInPlace = function (a) {
        for (
          var s = this.firstChild, g = new Set(a), m = 0, w = a;
          m < w.length;
          m++
        ) {
          for (var v = w[m]; s && !g.has(s); ) {
            var A = s;
            (s = s.nextSibling), this.removeChild(A);
          }
          v !== s ? this.insertBefore(v, s) : (s = s.nextSibling);
        }
        for (; s; ) (A = s), (s = s.nextSibling), this.removeChild(A);
      }),
      (Node.prototype.appendText = function (a) {
        this.appendChild(document.createTextNode(a));
      }),
      (Node.prototype.instanceOf = function (a) {
        if (this instanceof a) return !0;
        var s = this.win[a.name];
        return (
          !!(s && this instanceof s) ||
          !!((s = this.constructorWin[a.name]) && this instanceof s)
        );
      }),
      n(Node.prototype, "doc", function () {
        return this.ownerDocument || document;
      }),
      n(Node.prototype, "win", function () {
        return this.doc.defaultView || window;
      }),
      (Node.prototype.constructorWin = window),
      (Element.prototype.setAttr = function (a, s) {
        s === null ? this.removeAttribute(a) : this.setAttribute(a, String(s));
      }),
      (Element.prototype.setAttrs = function (a) {
        for (var s in a)
          if (a.hasOwnProperty(s)) {
            var g = a[s];
            this.setAttr(s, g);
          }
      }),
      (Element.prototype.getAttr = Element.prototype.getAttribute),
      t(Element.prototype, "matchParent", function (a, s) {
        if (this.matches(a)) return this;
        if (this === s) return null;
        var g = this.parentElement;
        return g ? g.matchParent(a, s) : null;
      }),
      (Element.prototype.getCssPropertyValue = function (a, s) {
        return getComputedStyle(this, s).getPropertyValue(a).trim();
      }),
      t(Element.prototype, "isActiveElement", function () {
        for (var a = this; a; ) {
          if (a.doc.activeElement !== a) return !1;
          var s = a.win.frameElement;
          if (!s) return a.win === activeWindow;
          a = s;
        }
        return !1;
      }),
      HTMLElement.prototype.show ||
        (HTMLElement.prototype.show = function () {
          this.style.display === "none" &&
            ((this.style.display = this.getAttribute("data-display") || ""),
            this.removeAttribute("data-display"));
        }),
      HTMLElement.prototype.hide ||
        (HTMLElement.prototype.hide = function () {
          var a = this.style.display;
          a !== "none" &&
            ((this.style.display = "none"),
            a
              ? this.setAttribute("data-display", a)
              : this.removeAttribute("data-display"));
        }),
      HTMLElement.prototype.toggle ||
        (HTMLElement.prototype.toggle = function (a) {
          a ? this.show() : this.hide();
        }),
      HTMLElement.prototype.toggleVisibility ||
        (HTMLElement.prototype.toggleVisibility = function (a) {
          this.style.visibility = a ? "" : "hidden";
        }),
      t(HTMLElement.prototype, "isShown", function () {
        return !!this.offsetParent;
      }),
      n(HTMLElement.prototype, "innerWidth", function () {
        var a = getComputedStyle(this),
          s = parseFloat(a.paddingLeft),
          g = parseFloat(a.paddingRight);
        return (
          isNaN(s) && (s = 0), isNaN(g) && (g = 0), this.scrollWidth - s - g
        );
      }),
      n(HTMLElement.prototype, "innerHeight", function () {
        var a = getComputedStyle(this),
          s = parseFloat(a.paddingTop),
          g = parseFloat(a.paddingBottom);
        return (
          isNaN(s) && (s = 0), isNaN(g) && (g = 0), this.scrollHeight - s - g
        );
      }),
      t(HTMLElement.prototype, "setCssStyles", d),
      t(SVGElement.prototype, "setCssStyles", d),
      t(HTMLElement.prototype, "setCssProps", p),
      t(SVGElement.prototype, "setCssProps", p),
      (window.fish = function (a) {
        return document.querySelector(a);
      }),
      (window.fishAll = function (a) {
        return Array.prototype.slice.call(document.querySelectorAll(a));
      }),
      (Element.prototype.find = function (a) {
        return this.querySelector(a);
      }),
      (Element.prototype.findAll = function (a) {
        return Array.prototype.slice.call(this.querySelectorAll(a));
      }),
      (Element.prototype.findAllSelf = function (a) {
        var s = Array.prototype.slice.call(this.querySelectorAll(a));
        return this.matches(a) && s.unshift(this), s;
      }),
      (DocumentFragment.prototype.find = function (a) {
        return this.querySelector(a);
      }),
      (DocumentFragment.prototype.findAll = function (a) {
        return Array.prototype.slice.call(this.querySelectorAll(a));
      }),
      (Node.prototype.createEl = function (a, s, g) {
        return (
          typeof s == "string" && (s = { cls: s }),
          ((s = s || {}).parent = this),
          createEl(a, s, g)
        );
      }),
      (Node.prototype.createDiv = function (a, s) {
        return this.createEl("div", a, s);
      }),
      (Node.prototype.createSpan = function (a, s) {
        return this.createEl("span", a, s);
      }),
      (Node.prototype.createSvg = function (a, s, g) {
        return (
          typeof s == "string" && (s = { cls: s }),
          ((s = s || {}).parent = this),
          createSvg(a, s, g)
        );
      }),
      (window.createEl = function (a, s, g) {
        var m = document.createElement(a);
        typeof s == "string" && (s = { cls: s });
        var w = s || {},
          v = w.cls,
          A = w.text,
          R = w.attr,
          N = w.title,
          j = w.value,
          E = w.placeholder,
          I = w.type,
          F = w.parent,
          D = w.prepend,
          U = w.href;
        return (
          v &&
            (Array.isArray(v)
              ? (m.className = v.join(" "))
              : (m.className = v)),
          A && m.setText(A),
          R && m.setAttrs(R),
          N !== void 0 && (m.title = N),
          j !== void 0 &&
            (m instanceof HTMLInputElement ||
              m instanceof HTMLSelectElement ||
              m instanceof HTMLOptionElement) &&
            (m.value = j),
          I && m instanceof HTMLInputElement && (m.type = I),
          I && m instanceof HTMLStyleElement && m.setAttribute("type", I),
          E && m instanceof HTMLInputElement && (m.placeholder = E),
          U &&
            (m instanceof HTMLAnchorElement ||
              m instanceof HTMLLinkElement ||
              m instanceof HTMLBaseElement) &&
            (m.href = U),
          g && g(m),
          F && (D ? F.insertBefore(m, F.firstChild) : F.appendChild(m)),
          m
        );
      }),
      (window.createDiv = function (a, s) {
        return createEl("div", a, s);
      }),
      (window.createSpan = function (a, s) {
        return createEl("span", a, s);
      }),
      (window.createSvg = function (a, s, g) {
        var m,
          w = document.createElementNS("http://www.w3.org/2000/svg", a);
        typeof s == "string" && (s = { cls: s });
        var v = s || {},
          A = v.cls,
          R = v.attr,
          N = v.parent,
          j = v.prepend;
        return (
          A &&
            (Array.isArray(A)
              ? (m = w.classList).add.apply(m, A)
              : w.classList.add(A)),
          R && w.setAttrs(R),
          g && g(w),
          N && (j ? N.insertBefore(w, N.firstChild) : N.appendChild(w)),
          w
        );
      }),
      (window.createFragment = function (a) {
        var s = document.createDocumentFragment();
        return a && a(s), s;
      });
    var _ = function (a, s, g, m) {
        var w = this._EVENTS;
        w || ((w = {}), (this._EVENTS = w));
        var v = w[a];
        v || ((v = []), (w[a] = v));
        var A = function (R) {
          var N = R.target;
          if (N.matchParent) {
            var j = N.matchParent(s, R.currentTarget);
            j && g.call(this, R, j);
          }
        };
        v.push({ selector: s, listener: g, options: m, callback: A }),
          this.addEventListener(a, A, m);
      },
      P = function (a, s, g, m) {
        var w = this,
          v = this._EVENTS;
        if (v) {
          var A = v[a];
          A &&
            (v[a] = A.filter(function (R) {
              if (R.selector === s && R.listener === g && R.options === m) {
                var N = R.callback;
                return w.removeEventListener(a, N, m), !1;
              }
              return !0;
            }));
        }
      };
    (HTMLElement.prototype.on = _),
      (HTMLElement.prototype.off = P),
      (Document.prototype.on = _),
      (Document.prototype.off = P),
      (HTMLElement.prototype.onClickEvent = function (a, s) {
        this.addEventListener("click", a, s),
          this.addEventListener("auxclick", a, s);
      }),
      (HTMLElement.prototype.trigger = function (a) {
        var s = document.createEvent("HTMLEvents");
        s.initEvent(a, !0, !1), this.dispatchEvent(s);
      }),
      n(UIEvent.prototype, "targetNode", function () {
        return this.target;
      }),
      n(UIEvent.prototype, "win", function () {
        return this.view || window;
      }),
      n(UIEvent.prototype, "doc", function () {
        return this.win.document;
      }),
      (UIEvent.prototype.instanceOf = function (a) {
        if (this instanceof a) return !0;
        var s = this.view;
        if (!s) return !1;
        var g = s[a.name];
        return !(!g || g === a) && this instanceof g;
      });
    var O = new WeakMap();
    (HTMLElement.prototype.onNodeInserted = function (a, s) {
      var g = this,
        m = function (v) {
          g.isShown() && (s && w(), v.animationName === "node-inserted" && a());
        },
        w = function () {
          g.removeEventListener("animationstart", m);
          var v = (O.get(g) || 0) - 1;
          v <= 0
            ? (O.delete(g), g.removeClass("node-insert-event"))
            : O.set(g, v);
        };
      return (
        O.set(this, (O.get(this) || 0) + 1),
        this.addClass("node-insert-event"),
        this.addEventListener("animationstart", m),
        w
      );
    }),
      (HTMLElement.prototype.onWindowMigrated = function (a) {
        var s = this,
          g = this.win;
        return this.onNodeInserted(function () {
          var m = s.win;
          m !== g && a((g = m));
        });
      }),
      (window.ajax = function (a) {
        var s = a.method,
          g = a.url,
          m = a.success,
          w = a.error,
          v = a.data,
          A = a.headers,
          R = a.withCredentials;
        s = s || "GET";
        var N = new XMLHttpRequest();
        if (
          ((a.req = N),
          N.open(s, g, !0),
          (N.onload = function () {
            var E = N.status,
              I = N.response;
            E >= 200 && E < 400 ? m && m(I, N) : w && w(I, N);
          }),
          (N.onerror = function (E) {
            w && w(E, N);
          }),
          A)
        )
          for (var j in A) A.hasOwnProperty(j) && N.setRequestHeader(j, A[j]);
        (N.withCredentials = R || !1),
          v
            ? (R === void 0 && (N.withCredentials = !0),
              String.isString(v)
                ? N.send(v)
                : v instanceof ArrayBuffer
                  ? (N.setRequestHeader(
                      "Content-Type",
                      "application/octet-stream",
                    ),
                    N.send(v))
                  : (N.setRequestHeader(
                      "Content-Type",
                      "application/json; charset=utf-8",
                    ),
                    N.send(JSON.stringify(v))))
            : N.send();
      }),
      (window.ajaxPromise = function (a) {
        return new Promise(function (s, g) {
          (a.success = s),
            (a.error = function (m, w) {
              return g(w);
            }),
            ajax(a);
        });
      }),
      (window.ready = function (a) {
        document.readyState !== "loading"
          ? a()
          : document.addEventListener("DOMContentLoaded", a);
      }),
      (window.sleep = function (a) {
        return new Promise(function (s) {
          return window.setTimeout(s, a);
        });
      }),
      (window.nextFrame = function () {
        return new Promise(function (a) {
          return window.requestAnimationFrame(function () {
            return a();
          });
        });
      }),
      (window.activeWindow = window),
      (window.activeDocument = document),
      (window.jsx = function (a, s) {
        for (var g = [], m = 2; m < arguments.length; m++)
          g[m - 2] = arguments[m];
        if (typeof a == "function") return a(s != null ? s : {}, g);
        var w = createEl(a);
        if (s) {
          for (var v in s)
            if (s.hasOwnProperty(v)) {
              var A = s[v];
              A &&
                (v === "class"
                  ? (w.className = A)
                  : v === "style"
                    ? w.setAttr("style", A)
                    : v.startsWith("on") && typeof A == "function"
                      ? w.addEventListener(v.substr(2).toLowerCase(), A)
                      : (w[v] = s[v]));
            }
        }
        if (g)
          for (var R = 0, N = g; R < N.length; R++) {
            var j = N[R];
            String.isString(j)
              ? w.appendText(j)
              : Array.isArray(j)
                ? w.append.apply(w, j)
                : w.appendChild(j);
          }
        return w;
      }),
      (window.jsxFragment = function (a) {
        for (var s = [], g = 1; g < arguments.length; g++)
          s[g - 1] = arguments[g];
        var m = document.createDocumentFragment();
        if (s)
          for (var w = 0, v = s; w < v.length; w++) {
            var A = v[w];
            String.isString(A)
              ? m.appendText(A)
              : Array.isArray(A)
                ? m.append.apply(m, A)
                : m.appendChild(A);
          }
        return m;
      });
  }

  e(), (window.globalEnhance = e);
})();

function il(e, t) {
  return ll(e) === t;
}

function ol(e) {
  var t = e.lastIndexOf("/");
  return t === -1 ? e : e.slice(t + 1);
}

function sl(e) {
  var t = ol(e),
    n = t.lastIndexOf(".");
  return n === -1 || n === t.length - 1 || n === 0 ? t : t.substr(0, n);
}

function ll(e) {
  var t = e.lastIndexOf(".");
  return t === -1 || t === e.length - 1 || t === 0
    ? ""
    : e.substr(t + 1).toLowerCase();
}

var zt,
  al =
    (zt = navigator.appVersion).indexOf("Win") !== -1
      ? "Windows"
      : zt.indexOf("Mac") !== -1
        ? "MacOS"
        : zt.indexOf("X11") !== -1 || zt.indexOf("Linux") !== -1
          ? "Linux"
          : "Unknown OS",
  cl = navigator.userAgent.toLowerCase(),
  fl = al === "MacOS";
cl.indexOf("firefox") > -1;

function Pr(e) {
  return fl && e.button === 0 && e.ctrlKey;
}

var Ut = 0.2,
  se = function (e, t, n) {
    return n === void 0 && (n = 0.9), e * n + t * (1 - n);
  },
  yi = function (e, t) {
    return (
      (se((e >> 16) & 255, (t >> 16) & 255) << 16) +
      (se((e >> 8) & 255, (t >> 8) & 255) << 8) +
      (0 | se(255 & e, 255 & t))
    );
  },
  An = function (e, t) {
    return (
      t.right < e.left ||
      t.left > e.right ||
      t.bottom < e.top ||
      t.top > e.bottom
    );
  },
  Sn = function (e, t, n) {
    return { left: e - n, right: e + n, top: t - n, bottom: t + n };
  },
  xt = function (e) {
    (e.style.margin = "0"),
      (e.style.padding = "0"),
      (e.style.border = "0"),
      (e.style.width = "100%"),
      (e.style.height = "100%"),
      (e.style.overflow = "hidden");
  },
  _t = 100;
window.Nz = (function () {
  function e(t, n, r) {
    (this.x = null),
      (this.y = null),
      (this.fx = null),
      (this.fy = null),
      (this.forward = {}),
      (this.reverse = {}),
      (this.weight = 0),
      (this.color = null),
      (this.rendered = !1),
      (this.fadeAlpha = 0),
      (this.moveText = 0),
      (this.fontDirty = !1),
      (this.renderer = t),
      (this.id = n),
      (this.type = r);
  }

  return (
    (e.prototype.initGraphics = function () {
      if (this.rendered) return !1;
      this.rendered = !0;
      var t,
        n = this.renderer;
      (t = this.circle = new PIXI.Graphics()).beginFill(16777215),
        t.drawCircle(_t, _t, _t),
        t.endFill(),
        (t.pivot.x = _t),
        (t.pivot.y = _t),
        (t.interactive = !0),
        (t.buttonMode = !0),
        (t.zIndex = 1),
        t
          .on("pointerdown", n.onPointerDown)
          .on("pointerup", n.onPointerUp)
          .on("pointerupoutside", n.onPointerUp)
          .on("pointermove", n.onPointerMove)
          .on("pointerover", n.onPointerOver)
          .on("pointerout", n.onPointerOut)
          .on("click", n.onClick)
          .on("rightclick", n.onClick);
      var r = this.getFillColor();
      (t.alpha = r.a),
        (t.tint = r.rgb),
        n.hanger.addChild(t),
        n.nodePxLookup.set(t, this);
      var i = new PIXI.TextStyle(this.getTextStyle()),
        o = (this.text = new PIXI.Text(this.getDisplayText(), i));
      return (
        (o.resolution = 2),
        o.anchor.set(0.5, 0),
        (o.zIndex = 2),
        n.hanger.addChild(o),
        (this.fadeAlpha = 0),
        !0
      );
    }),
    (e.prototype.clearGraphics = function () {
      if (this.rendered) {
        this.rendered = !1;
        var t = this,
          n = t.renderer,
          r = t.circle,
          i = t.highlight,
          o = t.text;
        r &&
          ((this.circle = null),
          n.nodePxLookup.delete(r),
          r.parent && r.parent.removeChild(r),
          r.destroy()),
          i &&
            ((this.highlight = null),
            i.parent && i.parent.removeChild(i),
            i.destroy()),
          o &&
            ((this.text = null),
            o.parent && o.parent.removeChild(o),
            o.destroy());
      }
    }),
    (e.prototype.getTextStyle = function () {
      var t = this.renderer,
        n = this.getSize();
      return new PIXI.TextStyle({
        fontSize: 14 + n / 4,
        fill: t.colors.text.rgb,
        fontFamily:
          'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif',
        wordWrap: !0,
        wordWrapWidth: 300,
        align: "center",
      });
    }),
    (e.prototype.render = function () {
      if (this.rendered) {
        var t = this,
          n = t.renderer,
          r = t.x,
          i = t.y,
          o = t.circle,
          l = t.highlight,
          c = t.text,
          u = t.fadeAlpha,
          d = t.moveText,
          p = this.getSize(),
          _ = this.getFillColor(),
          P = n.colors.text,
          O = n.getHighlightNode(),
          a = O === this,
          s = n.nodeScale,
          g = c.visible,
          m = Ut;
        (!O ||
          a ||
          this.forward.hasOwnProperty(O.id) ||
          this.reverse.hasOwnProperty(O.id)) &&
          (m = 1);
        var w = (u = this.fadeAlpha = se(u, m)) * _.a,
          v = n.textAlpha;
        (v *= u), a && (v = 1), (v *= P.a);
        var A = a ? 15 : 0;
        d = this.moveText = g ? se(d, A) : A;
        var R = v > 0.001,
          N = n.viewport,
          j = a || !An(N, Sn(r, i, p * s + 1));
        if (
          (R &&
            (R =
              a ||
              !An(N, {
                left: r - 300,
                right: r + 300,
                top: i,
                bottom: i + 200,
              })),
          (o.tint = yi(o.tint, _.rgb)),
          (o.visible = j),
          j &&
            ((o.x = r),
            (o.y = i),
            (o.scale.x = o.scale.y = (p / 100) * s),
            (o.alpha = w)),
          (c.visible = R),
          R &&
            ((c.x = r),
            (c.y = i + (p + 5) * s + d / n.scale),
            (c.scale.x = c.scale.y = s),
            a && n.scale < 1 && (c.scale.x = c.scale.y = 1 / n.scale),
            (c.alpha = v)),
          a)
        ) {
          l ||
            (((l = this.highlight = new PIXI.Graphics()).zIndex = 1),
            n.hanger.addChild(l)),
            (l.x = r),
            (l.y = i),
            (l.scale.x = l.scale.y = s),
            l.clear();
          var E = Math.max(1, 1 / n.scale / s),
            I = n.colors.circle;
          (l.alpha = I.a),
            l.lineStyle(E, I.rgb, 1),
            l.drawCircle(0, 0, p + E / 2);
        } else
          l && (l.parent.removeChild(l), l.destroy(), (this.highlight = null));
        this.fontDirty &&
          ((this.fontDirty = !1), (c.style = this.getTextStyle()));
      }
    }),
    (e.prototype.getFillColor = function () {
      var t = this,
        n = t.renderer,
        r = t.type,
        i = t.color;
      if (n.getHighlightNode() === this) return n.colors.fillHighlight;
      if (r === "focused") {
        var o = n.colors.fillFocused;
        if (o.a > 0) return o;
      } else {
        if (i) return i;
        if (r === "tag") return n.colors.fillTag;
        if (r === "unresolved") return n.colors.fillUnresolved;
        if (r === "attachment") return n.colors.fillAttachment;
      }
      return n.colors.fill;
    }),
    (e.prototype.getSize = function () {
      return (
        this.renderer.fNodeSizeMult *
        Math.max(8, Math.min(3 * Math.sqrt(this.weight + 1), 30))
      );
    }),
    (e.prototype.getDisplayText = function () {
      var t = this.id;
      return il(t, "md") && (t = sl(t)), t;
    }),
    (e.prototype.getRelated = function () {
      return Object.keys(this.forward).concat(Object.keys(this.reverse));
    }),
    e
  );
})();
window.Rz = (function () {
  function e(t, n, r) {
    (this.rendered = !1),
      (this.renderer = t),
      (this.source = n),
      (this.target = r);
  }

  return (
    (e.prototype.initGraphics = function () {
      if (!this.rendered && this.source.rendered && this.target.rendered) {
        this.rendered = !0;
        var t = this.renderer,
          n = (this.px = new PIXI.Container());
        t.hanger.addChild(n);
        var r = (this.line = new PIXI.Sprite(PIXI.Texture.WHITE)),
          i = t.colors.line;
        (r.alpha = Ut * i.a), (r.tint = i.rgb), n.addChild(r);
        var o = (this.arrow = new PIXI.Graphics()),
          l = t.colors.text;
        (o.alpha = Ut * l.a),
          (o.tint = l.rgb),
          o.beginFill(16777215),
          o.moveTo(0, 0),
          o.lineTo(-4, -2),
          o.lineTo(-3, 0),
          o.lineTo(-4, 2),
          o.lineTo(0, 0),
          o.endFill(),
          (o.zIndex = 1),
          t.hanger.addChild(o);
      }
    }),
    (e.prototype.clearGraphics = function () {
      if (this.rendered) {
        this.rendered = !1;
        var t = this,
          n = t.px,
          r = t.line,
          i = t.arrow;
        n &&
          ((this.px = null),
          n.parent && n.parent.removeChild(n),
          n.destroy(),
          (n.visible = !1)),
          r && ((this.line = null), r.destroy(), (r.visible = !1)),
          i &&
            ((this.arrow = null),
            i.parent && i.parent.removeChild(i),
            i.destroy(),
            (i.visible = !1));
      }
    }),
    (e.prototype.render = function () {
      if (this.rendered) {
        var t = this,
          n = t.px,
          r = t.line,
          i = t.arrow,
          o = t.renderer,
          l = t.source,
          c = t.target,
          u = o.getHighlightNode(),
          d = l === u || c === u,
          p = Ut;
        (u && !d) || (p = 1);
        var _ = p * Math.clamp(2 * (o.scale - 0.3), 0, 1),
          P = o.colors.line;
        d && (P = o.colors.lineHighlight);
        var O,
          a,
          s = o.colors.arrow,
          g = !(l.reverse.hasOwnProperty(c.id) && l.id.localeCompare(c.id) < 0),
          m = o.fShowArrow,
          w = o.fLineSizeMult / o.scale,
          v = o.viewport,
          A = Sn(l.x, l.y, w),
          R = Sn(c.x, c.y, w),
          N = !An(
            v,
            ((O = A),
            (a = R),
            {
              left: Math.min(O.left, a.left),
              right: Math.max(O.right, a.right),
              top: Math.min(O.top, a.top),
              bottom: Math.max(O.bottom, a.bottom),
            }),
          );
        if (
          ((p *= P.a),
          (_ *= s.a),
          (r.alpha = se(r.alpha, p)),
          (i.alpha = se(i.alpha, _)),
          (g = g && N),
          (m = m && N && i.alpha > 0.001),
          (r.visible = g),
          (i.visible = m),
          g || m)
        ) {
          var j = c.x - l.x,
            E = c.y - l.y,
            I = Math.sqrt(j * j + E * E),
            F = l.getSize() * o.nodeScale,
            D = c.getSize() * o.nodeScale;
          (i.visible = m = m && I > w),
            g &&
              ((n.x = l.x + (j * F) / I),
              (n.y = l.y + (E * F) / I),
              n.pivot.set(0, 0),
              (n.rotation = Math.atan2(E, j)),
              (r.x = 0),
              (r.y = -w / 2),
              (r.width = Math.max(0, I - F - D)),
              (r.height = w),
              (r.tint = yi(r.tint, P.rgb))),
            (i.visible = m),
            m &&
              ((D += 1),
              (i.x = c.x - (j * D) / I),
              (i.y = c.y - (E * D) / I),
              i.pivot.set(0, 0),
              (i.rotation = Math.atan2(E, j)),
              (i.scale.x = i.scale.y =
                (2 * Math.sqrt(o.fLineSizeMult)) / o.scale),
              (i.tint = s.rgb));
        }
      }
    }),
    e
  );
})();
window.Hz = (function () {
  function e(t) {
    (this.rendered = !1), (this.renderer = t);
  }

  return (
    (e.prototype.initGraphics = function () {
      this.renderer;
    }),
    (e.prototype.clearGraphics = function () {
      var t = this.text;
      t &&
        t.parent &&
        ((this.text = null), t.parent.removeChild(t), t.destroy()),
        (this.rendered = !1);
    }),
    (e.prototype.render = function () {
      var t = this.renderer,
        n = this.text;
      if (n) {
        (n.visible = !t.hidePowerTag), (n.alpha = t.colors.text.a);
        var r = t.px.renderer;
        (n.x = r.width / r.resolution),
          (n.y = r.height / r.resolution),
          this.rendered ||
            ((this.rendered = !0), (this.text.style = this.getTextStyle()));
      }
    }),
    (e.prototype.getTextStyle = function () {
      return new PIXI.TextStyle({
        fontSize: 12,
        fill: this.renderer.colors.text.rgb,
        fontFamily: "Inter",
        wordWrap: !1,
        align: "right",
      });
    }),
    e
  );
})();
window.Vz = (function () {
  function e(t, n, r, i) {
    var o = this;
    (this.interactiveEl = null),
      (this.onNodeClick = null),
      (this.onNodeRightClick = null),
      (this.onNodeHover = null),
      (this.onNodeUnhover = null),
      (this.workerResults = null),
      (this.nodeLookup = {}),
      (this.nodes = []),
      (this.links = []),
      (this.dragNode = null),
      (this.highlightNode = null),
      (this.px = null),
      (this.hanger = null),
      (this.nodePxLookup = new Map()),
      (this.powerTag = null),
      (this.scale = 1),
      (this.nodeScale = 1),
      (this.textAlpha = 1),
      (this.targetScale = 1),
      (this.panX = 0),
      (this.panY = 0),
      (this.panvX = 0),
      (this.panvY = 0),
      (this.keyboardActions = {}),
      (this.panning = !1),
      (this.width = 0),
      (this.height = 0),
      (this.viewport = null),
      (this.zoomCenterX = 0),
      (this.zoomCenterY = 0),
      (this.hidePowerTag = !1),
      (this.fNodeSizeMult = 1),
      (this.fLineSizeMult = 1),
      (this.fTextShowMult = 1),
      (this.fShowArrow = !1),
      (this.mouseX = null),
      (this.mouseY = null),
      (this.colors = {}),
      (this.renderTimer = null),
      (this.hidePowerTag = r),
      PIXI.utils.skipHello(),
      (this.containerEl = t),
      this.testCSS();
    var l = (this.interactiveEl = t.createEl("canvas"));
    if (
      ((t.style.padding = "0"),
      (t.style.overflow = "hidden"),
      (t.style.position = "relative"),
      (l.style.position = "absolute"),
      (l.style.left = "0"),
      (l.style.top = "0"),
      xt(l),
      l.addEventListener("mousedown", function (d) {
        return d.preventDefault();
      }),
      l.addEventListener("wheel", this.onWheel.bind(this)),
      l.addEventListener("mousemove", this.onMouseMove.bind(this)),
      l.addEventListener("mouseout", this.onMouseMove.bind(this)),
      i ||
        (i = new Worker("chrome://relationgraph/content/dist/assets/sim.js", {
          name: "Graph Worker",
        })),
      (this.worker = i),
      (i.onmessage = function (d) {
        d.data.ignore || ((o.workerResults = d.data), o.changed());
      }),
      n)
    ) {
      var c = (this.iframeEl = t.createEl("iframe"));
      xt(c),
        (c.onload = this.onIframeLoad.bind(this)),
        c.contentDocument && this.onIframeLoad();
    } else {
      var u = t.createEl("canvas");
      xt(u),
        setTimeout(function () {
          try {
            o.initGraphics(u);
          } catch {
            setTimeout(function () {
              o.initGraphics(u);
            }, 300);
          }
        }, 50);
    }
  }

  return (
    (e.prototype.destroy = function () {
      this.worker.terminate(),
        (this.workerResults = null),
        this.destroyGraphics();
    }),
    (e.prototype.onIframeLoad = function () {
      var t = this.iframeEl;
      t.contentWindow.onbeforeunload = this.onIframeUnload.bind(this);
      var n = t.contentDocument.body;
      xt(n), (n.innerHTML = "<canvas>");
      var r = n.firstChild;
      xt(r), this.destroyGraphics(), this.initGraphics(r);
    }),
    (e.prototype.onIframeUnload = function () {
      this.destroyGraphics();
    }),
    (e.prototype.onWheel = function (t) {
      if ((t.preventDefault(), this.px)) {
        var n = t.deltaY;
        t.deltaMode === 1 ? (n *= 40) : t.deltaMode === 2 && (n *= 800);
        var r = this.targetScale;
        if (
          ((r *= Math.pow(1.5, -n / 120)),
          (this.targetScale = r),
          r < this.scale)
        )
          (this.zoomCenterX = 0), (this.zoomCenterY = 0);
        else {
          var i = window.devicePixelRatio;
          (this.zoomCenterX = t.offsetX * i),
            (this.zoomCenterY = t.offsetY * i);
        }
        this.changed();
      }
    }),
    (e.prototype.onMouseMove = function (t) {
      t.type === "mouseout"
        ? (this.mouseX = this.mouseY = null)
        : ((this.mouseX = t.offsetX), (this.mouseY = t.offsetY));
    }),
    (e.prototype.initGraphics = function (t) {
      var n,
        r = this,
        i = this,
        o = i.iframeEl,
        l = i.interactiveEl,
        c = i.worker,
        u = window.WebGL2RenderingContext;
      try {
        o &&
          o.contentWindow.WebGL2RenderingContext &&
          (window.WebGL2RenderingContext =
            o.contentWindow.WebGL2RenderingContext),
          (n = this.px =
            new PIXI.Application({
              view: t,
              antialias: !0,
              backgroundAlpha: 0,
              autoStart: !1,
            }));
      } finally {
        window.WebGL2RenderingContext = u;
      }
      n.renderer.plugins.interaction.setTargetElement(l),
        (n.renderer.plugins.interaction.useSystemTicker = !1);
      var d = null,
        p = this;
      (this.onPointerDown = function (E) {
        E.data.originalEvent.target === l &&
          (w || ((this.dragging = !0), (d = E.data.getLocalPosition(n.stage))));
      }),
        (this.onPointerUp = function (E) {
          if (
            (E.data.originalEvent.instanceOf(TouchEvent) &&
              N(E.data.originalEvent),
            this.dragging)
          ) {
            this.dragging = !1;
            var I = p.getNodeFromGraphics(this);
            if (I) {
              var F = E.data.originalEvent;
              d &&
                p.onNodeClick &&
                ((F.instanceOf(MouseEvent) &&
                  (F.button === 0 || F.button === 1) &&
                  !Pr(F)) ||
                  F.instanceOf(TouchEvent)) &&
                p.onNodeClick(F, I.id, I.type),
                (I.fx = null),
                (I.fy = null),
                c.postMessage({
                  alphaTarget: 0,
                  forceNode: { id: I.id, x: null, y: null },
                });
            }
            (d = null), (p.dragNode = null), p.changed();
          }
        }),
        (this.onClick = function (E) {
          var I = E.data.originalEvent;
          if (E.data.button === 2 || (I.instanceOf(MouseEvent) && Pr(I))) {
            var F = p.getNodeFromGraphics(this);
            F &&
              p.onNodeRightClick &&
              p.onNodeRightClick(E.data.originalEvent, F.id, F.type);
          }
        }),
        (this.onPointerMove = function (E) {
          if (this.dragging) {
            var I = p.getNodeFromGraphics(this);
            if (I) {
              if (v) return (d = null), void (p.dragNode = null);
              if (d) {
                var F = E.data.getLocalPosition(n.stage),
                  D = F.x - d.x,
                  U = F.y - d.y;
                D * D + U * U > 25 && (d = null);
              }
              var $ = E.data.getLocalPosition(p.hanger);
              (I.fx = $.x),
                (I.fy = $.y),
                c.postMessage({
                  alpha: 0.3,
                  alphaTarget: 0.3,
                  run: !0,
                  forceNode: { id: I.id, x: $.x, y: $.y },
                }),
                (p.dragNode = I),
                p.changed();
            }
          }
        }),
        (this.onPointerOver = function (E) {
          var I = (p.highlightNode = p.getNodeFromGraphics(this));
          p.changed();
          var F = E.data.originalEvent;
          F.instanceOf(MouseEvent) &&
            ((p.mouseX = F.offsetX), (p.mouseY = F.offsetY)),
            p.onNodeHover && p.onNodeHover(F, I.id, I.type);
        }),
        (this.onPointerOut = function () {
          (p.highlightNode = null),
            p.changed(),
            p.onNodeUnhover && p.onNodeUnhover();
        });
      var _ = (this.hanger = new PIXI.Container()),
        P = (this.powerTag = new Hz(this));
      this.onResize(), this.resetPan();
      var O = new PIXI.Graphics();
      O.beginFill(0),
        O.drawRect(0, 0, 1e4, 1e4),
        O.endFill(),
        (O.alpha = 0),
        (O.interactive = !0);
      var a = null,
        s = null,
        g = performance.now(),
        m = 0,
        w = null,
        v = null,
        A = 0,
        R = 0,
        N = function (E) {
          for (
            var I = performance.now(),
              F = I - g,
              D = Array.prototype.slice.call(E.touches),
              U = null,
              $ = null,
              ae = 0,
              Pe = D;
            ae < Pe.length;
            ae++
          ) {
            var Q = Pe[ae];
            w && Q.identifier === w.identifier && (U = Q),
              v && Q.identifier === v.identifier && ($ = Q);
          }
          if (
            ($ && !U && ((w = v), (U = $), (v = null), ($ = null)),
            U ? D.remove(U) : D.length > 0 && ((U = D.first()), D.splice(0, 1)),
            $ ? D.remove($) : D.length > 0 && (($ = D.first()), D.splice(0, 1)),
            !d && !p.dragNode && w && U && w.identifier === U.identifier)
          ) {
            var K = window.devicePixelRatio;
            if (v && $ && v.identifier === $.identifier) {
              var q = r.interactiveEl.getBoundingClientRect(),
                me = ((w.clientX + v.clientX) / 2 - q.x) * K,
                Ee = ((w.clientY + v.clientY) / 2 - q.y) * K,
                ce = ((U.clientX + $.clientX) / 2 - q.x) * K,
                ee = ((U.clientY + $.clientY) / 2 - q.y) * K,
                Le = w.clientX - v.clientX,
                ye = w.clientY - v.clientY,
                Ce = U.clientX - $.clientX,
                oe = U.clientY - $.clientY,
                Te = Le * Le + ye * ye,
                ve = Ce * Ce + oe * oe;
              if (Te !== 0 && ve !== 0) {
                var we = Math.sqrt(ve / Te),
                  he = r.targetScale * we,
                  Me = r.panX + (ce - me),
                  f = r.panY + (ee - Ee);
                (r.zoomCenterX = ce),
                  (r.zoomCenterY = ee),
                  r.setPan(Me, f),
                  (r.targetScale = he),
                  r.changed();
              }
              (A = 0), (R = 0);
            } else {
              var h = (U.clientX - w.clientX) * K,
                y = (U.clientY - w.clientY) * K;
              (m = se(m, F, 0.8)),
                (g = I),
                (A = se(A, h, 0.8)),
                (R = se(R, y, 0.8)),
                r.setPan(r.panX + h, r.panY + y),
                r.changed();
            }
          } else
            (m = se(m, F, 0.8)),
              F < 100 && ((r.panvX = A / m), (r.panvY = R / m)),
              (A = A = 0);
          (w = U), (v = $);
        },
        j = function (E) {
          if (E.data.originalEvent.instanceOf(TouchEvent))
            N(E.data.originalEvent);
          else {
            (a = null),
              document.body.removeClass("is-grabbing"),
              (r.panning = !1);
            var I = performance.now() - g;
            (m = se(m, I, 0.8)),
              I > 100
                ? (r.panvX = r.panvY = 0)
                : ((r.panvX /= m), (r.panvY /= m));
          }
        };
      O.on("pointerdown", function (E) {
        E.data.originalEvent.instanceOf(TouchEvent)
          ? N(E.data.originalEvent)
          : ((a = E.data.getLocalPosition(n.stage)),
            (s = {
              x: _.x,
              y: _.y,
            }),
            document.body.addClass("is-grabbing"),
            (r.panning = !0));
      })
        .on("pointerup", j)
        .on("pointerupoutside", j)
        .on("pointermove", function (E) {
          if (E.data.originalEvent.instanceOf(TouchEvent))
            N(E.data.originalEvent);
          else if (a) {
            var I = E.data.getLocalPosition(n.stage),
              F = s.x + I.x - a.x,
              D = s.y + I.y - a.y,
              U = performance.now();
            (m = se(m, U - g, 0.8)),
              (g = U),
              (r.panvX = se(r.panvX, F - r.panX, 0.8)),
              (r.panvY = se(r.panvY, D - r.panY, 0.8)),
              r.setPan(F, D),
              r.changed();
          }
        }),
        n.stage.addChild(O),
        n.stage.addChild(_),
        P.initGraphics(),
        this.updateZoom(),
        (this.renderCallback = function () {
          if (((r.renderTimer = null), r.px && !(r.idleFrames > 60))) {
            var E = r,
              I = E.nodes,
              F = E.links,
              D = r.workerResults;
            if (D) {
              var U = D.id,
                $ = D.buffer,
                ae = !0;
              if ($ instanceof ArrayBuffer) r.workerResults = null;
              else {
                var Pe = new Uint32Array($, $.byteLength - 4, 1);
                Pe[0] === D.v ? (ae = !1) : (D.v = Pe[0]);
              }
              if (ae)
                for (var Q = new Float32Array($), K = 0; K < U.length; K++)
                  (X = r.nodeLookup[U[K]]) &&
                    ((X.x = Q[2 * K]),
                    (X.y = Q[2 * K + 1]),
                    X.fx && (X.x = X.fx),
                    X.fy && (X.y = X.fy));
            }
            var q = r,
              me = q.panning,
              Ee = q.panvX,
              ce = q.panvY,
              ee = q.keyboardActions,
              Le = ee.shift;
            if (!me) {
              (r.panX += (1e3 * Ee) / 60), (r.panY += (1e3 * ce) / 60);
              var ye = 0,
                Ce = 0;
              ee.up && (Ce += 1),
                ee.down && (Ce -= 1),
                ee.left && (ye += 1),
                ee.right && (ye -= 1),
                (ye === 0 && Ce === 0) || (r.idleFrames = 0);
              var oe = Le ? 3 : 1;
              (r.panvX = se(Ee, ye * oe, 0.9)),
                (r.panvY = se(ce, Ce * oe, 0.9));
            }
            var Te = 1 + (Le ? 0.1 : 0.03),
              ve = !1;
            if (
              (ee.zoomin && ((r.targetScale *= Te), (ve = !0)),
              ee.zoomout && ((r.targetScale /= Te), (ve = !0)),
              ve)
            ) {
              r.idleFrames = 0;
              var we = window.devicePixelRatio;
              (r.zoomCenterX = (r.width / 2) * we),
                (r.zoomCenterY = (r.height / 2) * we);
            }
            r.updateZoom();
            var he = r.scale,
              Me = -r.panX / he,
              f = -r.panY / he,
              h = Me + (r.width / he) * window.devicePixelRatio,
              y = f + (r.height / he) * window.devicePixelRatio;
            r.viewport = { left: Me, right: h, top: f, bottom: y };
            for (
              var x = (Me + h) / 2,
                b = (f + y) / 2,
                T = [],
                L = function (vi, wi) {
                  return vi.dist - wi.dist;
                },
                M = 0,
                S = I;
              M < S.length;
              M++
            )
              if (!(X = S[M]).rendered) {
                var C = (Xe = X.x - x) * Xe + (ft = X.y - b) * ft;
                (T.length < 50 || C < T.last().dist) &&
                  (T.push({
                    node: X,
                    dist: Xe * Xe + ft * ft,
                  }),
                  T.sort(L),
                  T.length > 50 && T.pop());
              }
            if (T.length > 0) {
              for (var H = 0, k = T; H < k.length; H++)
                k[H].node.initGraphics();
              r.idleFrames = 0;
            }
            for (var z = 0, B = F; z < B.length; z++) B[z].initGraphics();
            for (var Y = 0, Z = I; Y < Z.length; Y++) {
              var X;
              (X = Z[Y]).render();
            }
            for (var te = 0, be = F; te < be.length; te++) be[te].render();
            P.render(),
              _.sortChildren(),
              n.render(),
              r.idleFrames++,
              r.queueRender();
            var He = r,
              bt = He.mouseX,
              qe = He.mouseY,
              et = He.highlightNode;
            if (bt !== null && qe !== null && et) {
              var de = (bt * window.devicePixelRatio - r.panX) / he,
                Ae = (qe * window.devicePixelRatio - r.panY) / he,
                Xe = et.x - de,
                ft = et.y - Ae,
                Qn = et.getSize() * r.nodeScale + 2;
              Xe * Xe + ft * ft > Qn * Qn &&
                ((r.highlightNode = null),
                (r.idleFrames = 0),
                p.onNodeUnhover && p.onNodeUnhover());
            }
          }
        }),
        this.queueRender();
    }),
    (e.prototype.destroyGraphics = function () {
      var t = this,
        n = t.iframeEl,
        r = t.px,
        i = t.links,
        o = t.nodes,
        l = t.powerTag;
      this.hanger = null;
      for (var c = 0, u = i; c < u.length; c++) u[c].clearGraphics();
      for (var d = 0, p = o; d < p.length; d++) p[d].clearGraphics();
      l && ((this.powerTag = null), l.clearGraphics()),
        r &&
          (r.renderer.plugins.interaction.setTargetElement(null),
          n &&
            document.body.contains(n) &&
            n.contentDocument &&
            r.destroy(!0, {
              children: !0,
              texture: !0,
              baseTexture: !0,
            }),
          (this.px = null)),
        this.containerEl.win.cancelAnimationFrame(this.renderTimer),
        (this.renderTimer = null),
        (this.renderCallback = null),
        document.body.removeClass("is-grabbing");
    }),
    (e.prototype.zoomTo = function (t, n) {
      (this.targetScale = t),
        n
          ? ((this.zoomCenterX = n.x), (this.zoomCenterY = n.y))
          : (this.zoomCenterX = this.zoomCenterY = 0);
    }),
    (e.prototype.onResize = function () {
      var t = this,
        n = t.px,
        r = t.hanger,
        i = t.containerEl,
        o = t.interactiveEl,
        l = window.devicePixelRatio,
        c = i.clientWidth,
        u = i.clientHeight;
      if (((this.width = c), (this.height = u), n)) {
        var d = Math.round(c * l),
          p = Math.round(u * l),
          _ = n.renderer,
          P = _.width,
          O = _.height;
        (_.view.style.width = c + "px"),
          (_.view.style.height = u + "px"),
          _.resize(d, p),
          (o.width = c),
          (o.height = u),
          (n.renderer.plugins.interaction.resolution = 1 / l),
          r && this.setPan(this.panX + (d - P) / 2, this.panY + (p - O) / 2);
      }
      this.changed();
    }),
    (e.prototype.resetPan = function () {
      var t = window.devicePixelRatio;
      this.setPan((this.width / 2) * t, (this.height / 2) * t);
    }),
    (e.prototype.setData = function (t) {
      for (
        var n = this,
          r = n.nodes,
          i = n.nodeLookup,
          o = n.links,
          l = t.nodes,
          c = {},
          u = [],
          d = [],
          p = !1,
          _ = !1,
          P = 0,
          O = 0,
          a = r;
        O < a.length;
        O++
      ) {
        var s = a[O];
        l.hasOwnProperty(s.id)
          ? ((P = Math.max(P, s.x * s.x + s.y * s.y)), (c[s.id] = !1))
          : (u.push(s), (p = !0));
      }
      var g = Math.sqrt(P),
        m = [];
      for (var w in l)
        if (l.hasOwnProperty(w)) {
          var v = l[w];
          if (i.hasOwnProperty(w)) {
            var A = v.color || null;
            (s = i[w]).color !== A && ((s.color = A), (_ = !0)),
              s.type !== v.type && ((s.type = v.type), (_ = !0));
          } else
            ((s = new Nz(this, w, v.type)).color = v.color || null),
              r.push(s),
              (i[w] = s),
              (p = !0),
              m.push(s);
        }
      for (var w in l)
        if (l.hasOwnProperty(w) && i.hasOwnProperty(w)) {
          s = i[w];
          var R = l[w].links;
          for (var N in s.forward)
            s.forward.hasOwnProperty(N) &&
              (R.hasOwnProperty(N) || (d.push(s.forward[N]), (p = !0)));
          for (var N in R)
            if (
              R.hasOwnProperty(N) &&
              !s.forward.hasOwnProperty(N) &&
              i.hasOwnProperty(N)
            ) {
              var j = i[N],
                E = new Rz(this, s, j);
              o.push(E), (s.forward[j.id] = E), (j.reverse[s.id] = E), (p = !0);
            }
        }
      for (
        var I = function (b) {
            b.clearGraphics(),
              o.remove(b),
              delete b.source.forward[b.target.id],
              delete b.target.reverse[b.source.id];
          },
          F = 0,
          D = d;
        F < D.length;
        F++
      )
        I((E = D[F]));
      for (var U = 0, $ = u; U < $.length; U++) {
        (s = $[U]).clearGraphics(), r.remove(s), delete i[s.id];
        var ae = s.forward,
          Pe = s.reverse;
        for (var N in ae) ae.hasOwnProperty(N) && I(ae[N]);
        for (var N in Pe) Pe.hasOwnProperty(N) && I(Pe[N]);
      }
      var Q = m.length;
      if (Q > 0)
        for (
          var K = 60 * Q * 60,
            q = Math.sqrt(K / Math.PI + g * g) - g,
            me = Math.sqrt(K),
            Ee = 0,
            ce = m;
          Ee < ce.length;
          Ee++
        ) {
          for (
            var ee = 0, Le = 0, ye = 0, Ce = 0, oe = (s = ce[Ee]).getRelated();
            Ce < oe.length;
            Ce++
          ) {
            var Te = oe[Ce];
            if (i.hasOwnProperty(Te)) {
              var ve = i[Te];
              ve.x !== null &&
                ve.y !== null &&
                ((ee += ve.x), (Le += ve.y), ye++);
            }
          }
          if (ye > 0)
            (s.x = ee / ye + (Math.random() - 0.5) * me),
              (s.y = Le / ye + (Math.random() - 0.5) * me);
          else {
            var we = 2 * Math.random() * Math.PI,
              he = g + Math.sqrt(Math.random()) * q;
            (s.x = he * Math.cos(we)), (s.y = he * Math.sin(we));
          }
          c[s.id] = [s.x, s.y];
        }
      var Me = t.weights;
      for (var w in i)
        if (i.hasOwnProperty(w)) {
          var f = (s = i[w]).weight;
          (f = Me ? (Me.hasOwnProperty(w) ? Me[w] : 0) : s.getRelated().length),
            s.weight !== f && ((s.weight = f), (p = !0));
        }
      if (p) {
        for (var h = [], y = 0, x = o; y < x.length; y++)
          (E = x[y]), h.push([E.source.id, E.target.id]);
        this.worker.postMessage({ nodes: c, links: h, alpha: 0.3, run: !0 }),
          this.changed();
      } else _ && this.changed();
    }),
    (e.prototype.setRenderOptions = function (t) {
      var n = t.nodeSizeMultiplier,
        r = t.lineSizeMultiplier,
        i = t.showArrow,
        o = t.textFadeMultiplier;
      Number.isNumber(n) && (this.fNodeSizeMult = n),
        Number.isNumber(r) && (this.fLineSizeMult = r),
        Number.isNumber(o) && (this.fTextShowMult = o),
        isBoolean(i) && (this.fShowArrow = i),
        this.changed();
    }),
    (e.prototype.setForces = function (t) {
      this.worker.postMessage({ forces: t, alpha: 0.3, run: !0 });
    }),
    (e.prototype.getNodeFromGraphics = function (t) {
      return this.nodePxLookup.get(t);
    }),
    (e.prototype.getHighlightNode = function () {
      return this.dragNode || this.highlightNode;
    }),
    (e.prototype.updateZoom = function () {
      var t = this,
        n = t.scale,
        r = t.targetScale,
        i = t.panX,
        o = t.panY;
      if (
        (n > (r = this.targetScale = Math.min(8, Math.max(1 / 128, r)))
          ? n / r
          : r / n) -
          1 >=
        0.01
      ) {
        var l = this.zoomCenterX,
          c = this.zoomCenterY;
        if (l === 0 && c === 0) {
          var u = window.devicePixelRatio;
          (l = (this.width / 2) * u), (c = (this.height / 2) * u);
        }
        var d = { x: (l - i) / n, y: (c - o) / n };
        (n = se(n, r, 0.85)),
          (i -= d.x * n + i - l),
          (o -= d.y * n + o - c),
          this.changed();
      }
      this.setPan(i, o), this.setScale(n);
    }),
    (e.prototype.setPan = function (t, n) {
      var r = this.hanger;
      (this.panX = t), (this.panY = n), r && ((r.x = t), (r.y = n));
    }),
    (e.prototype.setScale = function (t) {
      var n = this.hanger;
      (this.scale = t), (this.nodeScale = Math.sqrt(1 / t));
      var r = Math.log(t) / Math.log(2);
      (this.textAlpha = Math.clamp(r + 2.5 - this.fTextShowMult, 0, 1)),
        n && (n.scale.x = n.scale.y = t);
    }),
    (e.prototype.changed = function () {
      (this.idleFrames = 0), this.queueRender();
    }),
    (e.prototype.queueRender = function () {
      !this.renderTimer &&
        this.renderCallback &&
        (this.renderTimer = this.containerEl.win.requestAnimationFrame(
          this.renderCallback,
        ));
    }),
    (e.prototype.testCSS = function () {
      this.colors = {
        fill: { a: 1, rgb: 5921370 },
        fillFocused: { a: 1, rgb: 9137391 },
        fillTag: { a: 1, rgb: 571726 },
        fillUnresolved: { a: 0.5, rgb: 11250603 },
        fillAttachment: { a: 1, rgb: 14724096 },
        arrow: { a: 0.5, rgb: 2236962 },
        circle: { a: 1, rgb: 9137391 },
        line: { a: 1, rgb: 13948116 },
        text: { a: 1, rgb: 2236962 },
        fillHighlight: { a: 1, rgb: 9730288 },
        lineHighlight: { a: 1, rgb: 9730288 },
      };
      for (var t = 0, n = this.nodes; t < n.length; t++) n[t].fontDirty = !0;
      var r = this.powerTag;
      r && (r.rendered = !1), this.changed();
    }),
    (e.prototype.getTransparentScreenshot = function () {
      var t = this.px;
      return t.render(), t.view;
    }),
    (e.prototype.getBackgroundScreenshot = function () {
      var t = this.getTransparentScreenshot(),
        n = document.createElement("canvas");
      (n.width = t.width), (n.height = t.height);
      var r = n.getContext("2d");
      return (
        (r.fillStyle = "#FFFFFF"),
        r.fillRect(0, 0, t.width, t.height),
        r.drawImage(t, 0, 0),
        n
      );
    }),
    (e.copyToClipboard = function (t, n, r) {
      t.toBlob(
        function (i) {
          try {
            var o = {};
            (o[n] = i),
              navigator.clipboard.write([new ClipboardItem(o)]),
              r && r();
          } catch (l) {
            console.error(l);
          }
        },
        n,
        100,
      );
    }),
    e
  );
})();
window.data = {
  nodes: {},
};

window.setTimeout(() => {
  (window.renderer = new Vz(
    document.querySelector("#graph-view"),
    !1,
    !1,
    null,
  )),
    console.log(renderer),
    renderer.setData(window.data);
}, 1e3);
const ul = {},
  hl = { class: "graph-view-container" },
  dl = Vn("div", { id: "graph-view" }, null, -1),
  pl = [dl];

function gl(e, t, n, r, i, o) {
  return ds(), ms("div", hl, pl);
}

const ml = rl(ul, [["render", gl]]);
tl(ml).mount("#app");
