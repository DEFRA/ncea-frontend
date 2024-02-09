(() => {
  'use strict';
  function t(e) {
    return (
      (t =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      t(e)
    );
  }
  function e() {
    e = function () {
      return n;
    };
    var r,
      n = {},
      o = Object.prototype,
      i = o.hasOwnProperty,
      a =
        Object.defineProperty ||
        function (t, e, r) {
          t[e] = r.value;
        },
      c = 'function' == typeof Symbol ? Symbol : {},
      u = c.iterator || '@@iterator',
      f = c.asyncIterator || '@@asyncIterator',
      l = c.toStringTag || '@@toStringTag';
    function s(t, e, r) {
      return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e];
    }
    try {
      s({}, '');
    } catch (r) {
      s = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function h(t, e, r, n) {
      var o = e && e.prototype instanceof b ? e : b,
        i = Object.create(o.prototype),
        c = new G(n || []);
      return a(i, '_invoke', { value: k(t, r, c) }), i;
    }
    function y(t, e, r) {
      try {
        return { type: 'normal', arg: t.call(e, r) };
      } catch (t) {
        return { type: 'throw', arg: t };
      }
    }
    n.wrap = h;
    var p = 'suspendedStart',
      v = 'suspendedYield',
      d = 'executing',
      m = 'completed',
      g = {};
    function b() {}
    function w() {}
    function L() {}
    var E = {};
    s(E, u, function () {
      return this;
    });
    var x = Object.getPrototypeOf,
      S = x && x(x(F([])));
    S && S !== o && i.call(S, u) && (E = S);
    var O = (L.prototype = b.prototype = Object.create(E));
    function j(t) {
      ['next', 'throw', 'return'].forEach(function (e) {
        s(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function P(e, r) {
      function n(o, a, c, u) {
        var f = y(e[o], e, a);
        if ('throw' !== f.type) {
          var l = f.arg,
            s = l.value;
          return s && 'object' == t(s) && i.call(s, '__await')
            ? r.resolve(s.__await).then(
                function (t) {
                  n('next', t, c, u);
                },
                function (t) {
                  n('throw', t, c, u);
                },
              )
            : r.resolve(s).then(
                function (t) {
                  (l.value = t), c(l);
                },
                function (t) {
                  return n('throw', t, c, u);
                },
              );
        }
        u(f.arg);
      }
      var o;
      a(this, '_invoke', {
        value: function (t, e) {
          function i() {
            return new r(function (r, o) {
              n(t, e, r, o);
            });
          }
          return (o = o ? o.then(i, i) : i());
        },
      });
    }
    function k(t, e, n) {
      var o = p;
      return function (i, a) {
        if (o === d) throw new Error('Generator is already running');
        if (o === m) {
          if ('throw' === i) throw a;
          return { value: r, done: !0 };
        }
        for (n.method = i, n.arg = a; ; ) {
          var c = n.delegate;
          if (c) {
            var u = _(c, n);
            if (u) {
              if (u === g) continue;
              return u;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;
          else if ('throw' === n.method) {
            if (o === p) throw ((o = m), n.arg);
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          o = d;
          var f = y(t, e, n);
          if ('normal' === f.type) {
            if (((o = n.done ? m : v), f.arg === g)) continue;
            return { value: f.arg, done: n.done };
          }
          'throw' === f.type && ((o = m), (n.method = 'throw'), (n.arg = f.arg));
        }
      };
    }
    function _(t, e) {
      var n = e.method,
        o = t.iterator[n];
      if (o === r)
        return (
          (e.delegate = null),
          ('throw' === n && t.iterator.return && ((e.method = 'return'), (e.arg = r), _(t, e), 'throw' === e.method)) ||
            ('return' !== n &&
              ((e.method = 'throw'), (e.arg = new TypeError("The iterator does not provide a '" + n + "' method")))),
          g
        );
      var i = y(o, t.iterator, e.arg);
      if ('throw' === i.type) return (e.method = 'throw'), (e.arg = i.arg), (e.delegate = null), g;
      var a = i.arg;
      return a
        ? a.done
          ? ((e[t.resultName] = a.value),
            (e.next = t.nextLoc),
            'return' !== e.method && ((e.method = 'next'), (e.arg = r)),
            (e.delegate = null),
            g)
          : a
        : ((e.method = 'throw'), (e.arg = new TypeError('iterator result is not an object')), (e.delegate = null), g);
    }
    function T(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]), 2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])), this.tryEntries.push(e);
    }
    function N(t) {
      var e = t.completion || {};
      (e.type = 'normal'), delete e.arg, (t.completion = e);
    }
    function G(t) {
      (this.tryEntries = [{ tryLoc: 'root' }]), t.forEach(T, this), this.reset(!0);
    }
    function F(e) {
      if (e || '' === e) {
        var n = e[u];
        if (n) return n.call(e);
        if ('function' == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            a = function t() {
              for (; ++o < e.length; ) if (i.call(e, o)) return (t.value = e[o]), (t.done = !1), t;
              return (t.value = r), (t.done = !0), t;
            };
          return (a.next = a);
        }
      }
      throw new TypeError(t(e) + ' is not iterable');
    }
    return (
      (w.prototype = L),
      a(O, 'constructor', { value: L, configurable: !0 }),
      a(L, 'constructor', { value: w, configurable: !0 }),
      (w.displayName = s(L, l, 'GeneratorFunction')),
      (n.isGeneratorFunction = function (t) {
        var e = 'function' == typeof t && t.constructor;
        return !!e && (e === w || 'GeneratorFunction' === (e.displayName || e.name));
      }),
      (n.mark = function (t) {
        return (
          Object.setPrototypeOf ? Object.setPrototypeOf(t, L) : ((t.__proto__ = L), s(t, l, 'GeneratorFunction')),
          (t.prototype = Object.create(O)),
          t
        );
      }),
      (n.awrap = function (t) {
        return { __await: t };
      }),
      j(P.prototype),
      s(P.prototype, f, function () {
        return this;
      }),
      (n.AsyncIterator = P),
      (n.async = function (t, e, r, o, i) {
        void 0 === i && (i = Promise);
        var a = new P(h(t, e, r, o), i);
        return n.isGeneratorFunction(e)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      j(O),
      s(O, l, 'Generator'),
      s(O, u, function () {
        return this;
      }),
      s(O, 'toString', function () {
        return '[object Generator]';
      }),
      (n.keys = function (t) {
        var e = Object(t),
          r = [];
        for (var n in e) r.push(n);
        return (
          r.reverse(),
          function t() {
            for (; r.length; ) {
              var n = r.pop();
              if (n in e) return (t.value = n), (t.done = !1), t;
            }
            return (t.done = !0), t;
          }
        );
      }),
      (n.values = F),
      (G.prototype = {
        constructor: G,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = r),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = r),
            this.tryEntries.forEach(N),
            !t)
          )
            for (var e in this) 't' === e.charAt(0) && i.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = r);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ('throw' === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function n(n, o) {
            return (c.type = 'throw'), (c.arg = t), (e.next = n), o && ((e.method = 'next'), (e.arg = r)), !!o;
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var a = this.tryEntries[o],
              c = a.completion;
            if ('root' === a.tryLoc) return n('end');
            if (a.tryLoc <= this.prev) {
              var u = i.call(a, 'catchLoc'),
                f = i.call(a, 'finallyLoc');
              if (u && f) {
                if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return n(a.finallyLoc);
              } else if (u) {
                if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
              } else {
                if (!f) throw new Error('try statement without catch or finally');
                if (this.prev < a.finallyLoc) return n(a.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var n = this.tryEntries[r];
            if (n.tryLoc <= this.prev && i.call(n, 'finallyLoc') && this.prev < n.finallyLoc) {
              var o = n;
              break;
            }
          }
          o && ('break' === t || 'continue' === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
          var a = o ? o.completion : {};
          return (
            (a.type = t), (a.arg = e), o ? ((this.method = 'next'), (this.next = o.finallyLoc), g) : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ('throw' === t.type) throw t.arg;
          return (
            'break' === t.type || 'continue' === t.type
              ? (this.next = t.arg)
              : 'return' === t.type
                ? ((this.rval = this.arg = t.arg), (this.method = 'return'), (this.next = 'end'))
                : 'normal' === t.type && e && (this.next = e),
            g
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), N(r), g;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ('throw' === n.type) {
                var o = n.arg;
                N(r);
              }
              return o;
            }
          }
          throw new Error('illegal catch attempt');
        },
        delegateYield: function (t, e, n) {
          return (
            (this.delegate = { iterator: F(t), resultName: e, nextLoc: n }), 'next' === this.method && (this.arg = r), g
          );
        },
      }),
      n
    );
  }
  function r(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  var n,
    o,
    i = function (t) {
      var e = t.querySelector('button[data-to-disable]');
      if (e) {
        e.disabled = !0;
        var r = Array.from(t.querySelectorAll('input[type="text"], input[type="number"]')).some(function (t) {
          return '' !== (null == t ? void 0 : t.value.trim());
        });
        e.disabled = !r;
      }
    },
    a =
      ((n = e().mark(function t() {
        var r;
        return e().wrap(function (t) {
          for (;;)
            switch ((t.prev = t.next)) {
              case 0:
                (r = document.querySelectorAll('[data-toggle-submit-button]')).length > 0 &&
                  r.forEach(function (t) {
                    t instanceof HTMLFormElement &&
                      t.querySelectorAll('input').forEach(function (e) {
                        e.addEventListener('input', function () {
                          i(t);
                        });
                      });
                  });
              case 2:
              case 'end':
                return t.stop();
            }
        }, t);
      })),
      (o = function () {
        var t = this,
          e = arguments;
        return new Promise(function (o, i) {
          var a = n.apply(t, e);
          function c(t) {
            r(a, o, i, c, u, 'next', t);
          }
          function u(t) {
            r(a, o, i, c, u, 'throw', t);
          }
          c(void 0);
        });
      }),
      function () {
        return o.apply(this, arguments);
      });
  function c(t) {
    return (
      (c =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      c(t)
    );
  }
  function u(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(t);
      e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function f(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? u(Object(r), !0).forEach(function (e) {
            var n, o, i, a;
            (n = t),
              (o = e),
              (i = r[e]),
              (a = (function (t, e) {
                if ('object' != c(t) || !t) return t;
                var r = t[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var n = r.call(t, 'string');
                  if ('object' != c(n)) return n;
                  throw new TypeError('@@toPrimitive must return a primitive value.');
                }
                return String(t);
              })(o)),
              (o = 'symbol' == c(a) ? a : String(a)) in n
                ? Object.defineProperty(n, o, { value: i, enumerable: !0, configurable: !0, writable: !0 })
                : (n[o] = i);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
          : u(Object(r)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
            });
    }
    return t;
  }
  var l = 'ncea-search-data',
    s = JSON.stringify({ fields: {}, count: {} }),
    h = function () {
      var t = sessionStorage.getItem(l) || s;
      return JSON.parse(t);
    },
    y = function (t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        r = h(),
        n = r.fields;
      if (e) n.hasOwnProperty(t.id) && delete n[t.id], sessionStorage.setItem(l, JSON.stringify(r));
      else {
        var o = n[t.id] || {};
        t.querySelectorAll('input').forEach(function (e) {
          e.addEventListener('change', function (i) {
            var a = i.target,
              c = a.name,
              u = a.value,
              s = a.checked;
            (o[c] = 'checkbox' === e.type ? s : u),
              (n[t.id] = f(f({}, n[t.id]), o)),
              sessionStorage.setItem(l, JSON.stringify(r));
          });
        });
      }
    },
    p = function (t) {
      var e,
        r = null !== (e = h().fields[t.id]) && void 0 !== e ? e : {};
      t.querySelectorAll('input').forEach(function (t) {
        r.hasOwnProperty(t.name) &&
          (['text', 'number'].includes(t.type) && (t.value = r[t.name]),
          'checkbox' === t.type && (t.checked = r[t.name]));
      }),
        clearTimeout(t.detectFieldsStateTimeout),
        (t.detectFieldsStateTimeout = setTimeout(function () {
          i(t);
        }, 500));
    };
  function v(t) {
    return (
      (v =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      v(t)
    );
  }
  function d() {
    d = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (t, e, r) {
          t[e] = r.value;
        },
      i = 'function' == typeof Symbol ? Symbol : {},
      a = i.iterator || '@@iterator',
      c = i.asyncIterator || '@@asyncIterator',
      u = i.toStringTag || '@@toStringTag';
    function f(t, e, r) {
      return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e];
    }
    try {
      f({}, '');
    } catch (t) {
      f = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function l(t, e, r, n) {
      var i = e && e.prototype instanceof b ? e : b,
        a = Object.create(i.prototype),
        c = new G(n || []);
      return o(a, '_invoke', { value: k(t, r, c) }), a;
    }
    function s(t, e, r) {
      try {
        return { type: 'normal', arg: t.call(e, r) };
      } catch (t) {
        return { type: 'throw', arg: t };
      }
    }
    e.wrap = l;
    var h = 'suspendedStart',
      y = 'suspendedYield',
      p = 'executing',
      m = 'completed',
      g = {};
    function b() {}
    function w() {}
    function L() {}
    var E = {};
    f(E, a, function () {
      return this;
    });
    var x = Object.getPrototypeOf,
      S = x && x(x(F([])));
    S && S !== r && n.call(S, a) && (E = S);
    var O = (L.prototype = b.prototype = Object.create(E));
    function j(t) {
      ['next', 'throw', 'return'].forEach(function (e) {
        f(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function P(t, e) {
      function r(o, i, a, c) {
        var u = s(t[o], t, i);
        if ('throw' !== u.type) {
          var f = u.arg,
            l = f.value;
          return l && 'object' == v(l) && n.call(l, '__await')
            ? e.resolve(l.__await).then(
                function (t) {
                  r('next', t, a, c);
                },
                function (t) {
                  r('throw', t, a, c);
                },
              )
            : e.resolve(l).then(
                function (t) {
                  (f.value = t), a(f);
                },
                function (t) {
                  return r('throw', t, a, c);
                },
              );
        }
        c(u.arg);
      }
      var i;
      o(this, '_invoke', {
        value: function (t, n) {
          function o() {
            return new e(function (e, o) {
              r(t, n, e, o);
            });
          }
          return (i = i ? i.then(o, o) : o());
        },
      });
    }
    function k(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === p) throw new Error('Generator is already running');
        if (o === m) {
          if ('throw' === i) throw a;
          return { value: t, done: !0 };
        }
        for (n.method = i, n.arg = a; ; ) {
          var c = n.delegate;
          if (c) {
            var u = _(c, n);
            if (u) {
              if (u === g) continue;
              return u;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;
          else if ('throw' === n.method) {
            if (o === h) throw ((o = m), n.arg);
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          o = p;
          var f = s(e, r, n);
          if ('normal' === f.type) {
            if (((o = n.done ? m : y), f.arg === g)) continue;
            return { value: f.arg, done: n.done };
          }
          'throw' === f.type && ((o = m), (n.method = 'throw'), (n.arg = f.arg));
        }
      };
    }
    function _(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t)
        return (
          (r.delegate = null),
          ('throw' === n && e.iterator.return && ((r.method = 'return'), (r.arg = t), _(e, r), 'throw' === r.method)) ||
            ('return' !== n &&
              ((r.method = 'throw'), (r.arg = new TypeError("The iterator does not provide a '" + n + "' method")))),
          g
        );
      var i = s(o, e.iterator, r.arg);
      if ('throw' === i.type) return (r.method = 'throw'), (r.arg = i.arg), (r.delegate = null), g;
      var a = i.arg;
      return a
        ? a.done
          ? ((r[e.resultName] = a.value),
            (r.next = e.nextLoc),
            'return' !== r.method && ((r.method = 'next'), (r.arg = t)),
            (r.delegate = null),
            g)
          : a
        : ((r.method = 'throw'), (r.arg = new TypeError('iterator result is not an object')), (r.delegate = null), g);
    }
    function T(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]), 2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])), this.tryEntries.push(e);
    }
    function N(t) {
      var e = t.completion || {};
      (e.type = 'normal'), delete e.arg, (t.completion = e);
    }
    function G(t) {
      (this.tryEntries = [{ tryLoc: 'root' }]), t.forEach(T, this), this.reset(!0);
    }
    function F(e) {
      if (e || '' === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ('function' == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function r() {
              for (; ++o < e.length; ) if (n.call(e, o)) return (r.value = e[o]), (r.done = !1), r;
              return (r.value = t), (r.done = !0), r;
            };
          return (i.next = i);
        }
      }
      throw new TypeError(v(e) + ' is not iterable');
    }
    return (
      (w.prototype = L),
      o(O, 'constructor', { value: L, configurable: !0 }),
      o(L, 'constructor', { value: w, configurable: !0 }),
      (w.displayName = f(L, u, 'GeneratorFunction')),
      (e.isGeneratorFunction = function (t) {
        var e = 'function' == typeof t && t.constructor;
        return !!e && (e === w || 'GeneratorFunction' === (e.displayName || e.name));
      }),
      (e.mark = function (t) {
        return (
          Object.setPrototypeOf ? Object.setPrototypeOf(t, L) : ((t.__proto__ = L), f(t, u, 'GeneratorFunction')),
          (t.prototype = Object.create(O)),
          t
        );
      }),
      (e.awrap = function (t) {
        return { __await: t };
      }),
      j(P.prototype),
      f(P.prototype, c, function () {
        return this;
      }),
      (e.AsyncIterator = P),
      (e.async = function (t, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new P(l(t, r, n, o), i);
        return e.isGeneratorFunction(r)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      j(O),
      f(O, u, 'Generator'),
      f(O, a, function () {
        return this;
      }),
      f(O, 'toString', function () {
        return '[object Generator]';
      }),
      (e.keys = function (t) {
        var e = Object(t),
          r = [];
        for (var n in e) r.push(n);
        return (
          r.reverse(),
          function t() {
            for (; r.length; ) {
              var n = r.pop();
              if (n in e) return (t.value = n), (t.done = !1), t;
            }
            return (t.done = !0), t;
          }
        );
      }),
      (e.values = F),
      (G.prototype = {
        constructor: G,
        reset: function (e) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = t),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = t),
            this.tryEntries.forEach(N),
            !e)
          )
            for (var r in this) 't' === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ('throw' === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (e) {
          if (this.done) throw e;
          var r = this;
          function o(n, o) {
            return (c.type = 'throw'), (c.arg = e), (r.next = n), o && ((r.method = 'next'), (r.arg = t)), !!o;
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var a = this.tryEntries[i],
              c = a.completion;
            if ('root' === a.tryLoc) return o('end');
            if (a.tryLoc <= this.prev) {
              var u = n.call(a, 'catchLoc'),
                f = n.call(a, 'finallyLoc');
              if (u && f) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return o(a.finallyLoc);
              } else if (u) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
              } else {
                if (!f) throw new Error('try statement without catch or finally');
                if (this.prev < a.finallyLoc) return o(a.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var o = this.tryEntries[r];
            if (o.tryLoc <= this.prev && n.call(o, 'finallyLoc') && this.prev < o.finallyLoc) {
              var i = o;
              break;
            }
          }
          i && ('break' === t || 'continue' === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
          var a = i ? i.completion : {};
          return (
            (a.type = t), (a.arg = e), i ? ((this.method = 'next'), (this.next = i.finallyLoc), g) : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ('throw' === t.type) throw t.arg;
          return (
            'break' === t.type || 'continue' === t.type
              ? (this.next = t.arg)
              : 'return' === t.type
                ? ((this.rval = this.arg = t.arg), (this.method = 'return'), (this.next = 'end'))
                : 'normal' === t.type && e && (this.next = e),
            g
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), N(r), g;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ('throw' === n.type) {
                var o = n.arg;
                N(r);
              }
              return o;
            }
          }
          throw new Error('illegal catch attempt');
        },
        delegateYield: function (e, r, n) {
          return (
            (this.delegate = { iterator: F(e), resultName: r, nextLoc: n }), 'next' === this.method && (this.arg = t), g
          );
        },
      }),
      e
    );
  }
  function m(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  var g = (function () {
    var t = (function (t) {
      return function () {
        var e = this,
          r = arguments;
        return new Promise(function (n, o) {
          var i = t.apply(e, r);
          function a(t) {
            m(i, n, o, a, c, 'next', t);
          }
          function c(t) {
            m(i, n, o, a, c, 'throw', t);
          }
          a(void 0);
        });
      };
    })(
      d().mark(function t(e) {
        var r, n, o, i;
        return d().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  return (
                    (t.prev = 0),
                    (r = sessionStorage.getItem(l)),
                    (n = JSON.parse(r)),
                    (t.next = 5),
                    fetch(e, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(n.fields),
                    })
                  );
                case 5:
                  if (!(o = t.sent).ok) {
                    t.next = 13;
                    break;
                  }
                  return (t.next = 9), o.text();
                case 9:
                  (i = t.sent), (document.getElementById('results-block').innerHTML = i), (t.next = 14);
                  break;
                case 13:
                  console.error('Failed to fetch the results view: '.concat(o.status));
                case 14:
                  t.next = 19;
                  break;
                case 16:
                  (t.prev = 16), (t.t0 = t.catch(0)), console.error('Error fetching HTML view: '.concat(t.t0.message));
                case 19:
                case 'end':
                  return t.stop();
              }
          },
          t,
          null,
          [[0, 16]],
        );
      }),
    );
    return function (e) {
      return t.apply(this, arguments);
    };
  })();
  (function () {
    if ('undefined' != typeof Storage) {
      var t = document.querySelectorAll('[data-do-browser-storage]');
      t.length > 0 &&
        t.forEach(function (t) {
          t instanceof HTMLFormElement && (y(t), p(t));
        }),
        (r = document.querySelectorAll('[data-do-storage-reset]')).length > 0 &&
          r.forEach(function (t) {
            t.addEventListener('click', function () {
              sessionStorage.setItem(l, s);
            });
          }),
        (e = document.querySelectorAll('[data-do-storage-skip]')).length > 0 &&
          e.forEach(function (t) {
            t.addEventListener('click', function (t) {
              var e = t.target.closest('form');
              e && (y(e, !0), p(e));
            });
          });
    }
    var e, r;
  })(),
    document.addEventListener('DOMContentLoaded', function () {
      var t = document.querySelector('[data-fetch-results]');
      if (t) {
        var e = t.getAttribute('data-action');
        g(e);
      }
    }),
    a();
})();
