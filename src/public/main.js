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
  function e(t, e) {
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
  function r(r) {
    for (var n = 1; n < arguments.length; n++) {
      var o = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? e(Object(o), !0).forEach(function (e) {
            var n, i, a, c;
            (n = r),
              (i = e),
              (a = o[e]),
              (c = (function (e, r) {
                if ('object' != t(e) || !e) return e;
                var n = e[Symbol.toPrimitive];
                if (void 0 !== n) {
                  var o = n.call(e, 'string');
                  if ('object' != t(o)) return o;
                  throw new TypeError('@@toPrimitive must return a primitive value.');
                }
                return String(e);
              })(i)),
              (i = 'symbol' == t(c) ? c : String(c)) in n
                ? Object.defineProperty(n, i, { value: a, enumerable: !0, configurable: !0, writable: !0 })
                : (n[i] = a);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o))
          : e(Object(o)).forEach(function (t) {
              Object.defineProperty(r, t, Object.getOwnPropertyDescriptor(o, t));
            });
    }
    return r;
  }
  var n = 'ncea-search-data',
    o = JSON.stringify({ fields: {}, count: {} }),
    i = function () {
      var t = sessionStorage.getItem(n) || o;
      return JSON.parse(t);
    },
    a = function (t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        o = i(),
        a = o.fields;
      if (e) a.hasOwnProperty(t.id) && delete a[t.id], sessionStorage.setItem(n, JSON.stringify(o));
      else {
        var c = a[t.id] || {};
        t.querySelectorAll('input').forEach(function (e) {
          e.addEventListener('change', function (i) {
            var u = i.target,
              s = u.name,
              f = u.value,
              l = u.checked;
            (c[s] = 'checkbox' === e.type ? l : f),
              (a[t.id] = r(r({}, a[t.id]), c)),
              sessionStorage.setItem(n, JSON.stringify(o));
          });
        });
      }
    },
    c = function (t) {
      var e,
        r = null !== (e = i().fields[t.id]) && void 0 !== e ? e : {};
      t.querySelectorAll('input').forEach(function (t) {
        r.hasOwnProperty(t.name) &&
          (['text', 'number'].includes(t.type) && (t.value = r[t.name]),
          'checkbox' === t.type && (t.checked = r[t.name]));
      });
    };
  function u(t) {
    return (
      (u =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      u(t)
    );
  }
  function s() {
    s = function () {
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
      f = i.toStringTag || '@@toStringTag';
    function l(t, e, r) {
      return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e];
    }
    try {
      l({}, '');
    } catch (t) {
      l = function (t, e, r) {
        return (t[e] = r);
      };
    }
    function h(t, e, r, n) {
      var i = e && e.prototype instanceof b ? e : b,
        a = Object.create(i.prototype),
        c = new I(n || []);
      return o(a, '_invoke', { value: k(t, r, c) }), a;
    }
    function y(t, e, r) {
      try {
        return { type: 'normal', arg: t.call(e, r) };
      } catch (t) {
        return { type: 'throw', arg: t };
      }
    }
    e.wrap = h;
    var p = 'suspendedStart',
      v = 'suspendedYield',
      d = 'executing',
      g = 'completed',
      m = {};
    function b() {}
    function w() {}
    function O() {}
    var S = {};
    l(S, a, function () {
      return this;
    });
    var E = Object.getPrototypeOf,
      L = E && E(E(A([])));
    L && L !== r && n.call(L, a) && (S = L);
    var x = (O.prototype = b.prototype = Object.create(S));
    function j(t) {
      ['next', 'throw', 'return'].forEach(function (e) {
        l(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function P(t, e) {
      function r(o, i, a, c) {
        var s = y(t[o], t, i);
        if ('throw' !== s.type) {
          var f = s.arg,
            l = f.value;
          return l && 'object' == u(l) && n.call(l, '__await')
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
        c(s.arg);
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
      var o = p;
      return function (i, a) {
        if (o === d) throw new Error('Generator is already running');
        if (o === g) {
          if ('throw' === i) throw a;
          return { value: t, done: !0 };
        }
        for (n.method = i, n.arg = a; ; ) {
          var c = n.delegate;
          if (c) {
            var u = _(c, n);
            if (u) {
              if (u === m) continue;
              return u;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;
          else if ('throw' === n.method) {
            if (o === p) throw ((o = g), n.arg);
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          o = d;
          var s = y(e, r, n);
          if ('normal' === s.type) {
            if (((o = n.done ? g : v), s.arg === m)) continue;
            return { value: s.arg, done: n.done };
          }
          'throw' === s.type && ((o = g), (n.method = 'throw'), (n.arg = s.arg));
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
          m
        );
      var i = y(o, e.iterator, r.arg);
      if ('throw' === i.type) return (r.method = 'throw'), (r.arg = i.arg), (r.delegate = null), m;
      var a = i.arg;
      return a
        ? a.done
          ? ((r[e.resultName] = a.value),
            (r.next = e.nextLoc),
            'return' !== r.method && ((r.method = 'next'), (r.arg = t)),
            (r.delegate = null),
            m)
          : a
        : ((r.method = 'throw'), (r.arg = new TypeError('iterator result is not an object')), (r.delegate = null), m);
    }
    function N(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]), 2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])), this.tryEntries.push(e);
    }
    function T(t) {
      var e = t.completion || {};
      (e.type = 'normal'), delete e.arg, (t.completion = e);
    }
    function I(t) {
      (this.tryEntries = [{ tryLoc: 'root' }]), t.forEach(N, this), this.reset(!0);
    }
    function A(e) {
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
      throw new TypeError(u(e) + ' is not iterable');
    }
    return (
      (w.prototype = O),
      o(x, 'constructor', { value: O, configurable: !0 }),
      o(O, 'constructor', { value: w, configurable: !0 }),
      (w.displayName = l(O, f, 'GeneratorFunction')),
      (e.isGeneratorFunction = function (t) {
        var e = 'function' == typeof t && t.constructor;
        return !!e && (e === w || 'GeneratorFunction' === (e.displayName || e.name));
      }),
      (e.mark = function (t) {
        return (
          Object.setPrototypeOf ? Object.setPrototypeOf(t, O) : ((t.__proto__ = O), l(t, f, 'GeneratorFunction')),
          (t.prototype = Object.create(x)),
          t
        );
      }),
      (e.awrap = function (t) {
        return { __await: t };
      }),
      j(P.prototype),
      l(P.prototype, c, function () {
        return this;
      }),
      (e.AsyncIterator = P),
      (e.async = function (t, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new P(h(t, r, n, o), i);
        return e.isGeneratorFunction(r)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      j(x),
      l(x, f, 'Generator'),
      l(x, a, function () {
        return this;
      }),
      l(x, 'toString', function () {
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
      (e.values = A),
      (I.prototype = {
        constructor: I,
        reset: function (e) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = t),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = t),
            this.tryEntries.forEach(T),
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
                s = n.call(a, 'finallyLoc');
              if (u && s) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return o(a.finallyLoc);
              } else if (u) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
              } else {
                if (!s) throw new Error('try statement without catch or finally');
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
            (a.type = t), (a.arg = e), i ? ((this.method = 'next'), (this.next = i.finallyLoc), m) : this.complete(a)
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
            m
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), T(r), m;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
              var n = r.completion;
              if ('throw' === n.type) {
                var o = n.arg;
                T(r);
              }
              return o;
            }
          }
          throw new Error('illegal catch attempt');
        },
        delegateYield: function (e, r, n) {
          return (
            (this.delegate = { iterator: A(e), resultName: r, nextLoc: n }), 'next' === this.method && (this.arg = t), m
          );
        },
      }),
      e
    );
  }
  function f(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
        u = c.value;
    } catch (t) {
      return void r(t);
    }
    c.done ? e(u) : Promise.resolve(u).then(n, o);
  }
  var l,
    h,
    y =
      ((l = s().mark(function t(e) {
        var r, o, i, a;
        return s().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  return (
                    (t.prev = 0),
                    (r = sessionStorage.getItem(n)),
                    (o = JSON.parse(r)),
                    (t.next = 5),
                    fetch(e, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(o.fields),
                    })
                  );
                case 5:
                  if (!(i = t.sent).ok) {
                    t.next = 13;
                    break;
                  }
                  return (t.next = 9), i.text();
                case 9:
                  (a = t.sent), (document.getElementById('results-block').innerHTML = a), (t.next = 14);
                  break;
                case 13:
                  console.error('Failed to fetch the results view: '.concat(i.status));
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
      })),
      (h = function () {
        var t = this,
          e = arguments;
        return new Promise(function (r, n) {
          var o = l.apply(t, e);
          function i(t) {
            f(o, r, n, i, a, 'next', t);
          }
          function a(t) {
            f(o, r, n, i, a, 'throw', t);
          }
          i(void 0);
        });
      }),
      function (t) {
        return h.apply(this, arguments);
      });
  (function () {
    if ('undefined' != typeof Storage) {
      var t = document.querySelectorAll('[data-do-browser-storage]');
      t.length > 0 &&
        t.forEach(function (t) {
          t instanceof HTMLFormElement && (a(t), c(t));
        }),
        (r = document.querySelectorAll('[data-do-storage-reset]')).length > 0 &&
          r.forEach(function (t) {
            t.addEventListener('click', function () {
              sessionStorage.setItem(n, o);
            });
          });
      var e = document.querySelectorAll('[data-do-storage-skip]');
      e.length > 0 &&
        e.forEach(function (t) {
          t.addEventListener('click', function (t) {
            var e = t.target.closest('form');
            e && (a(e, !0), c(e));
          });
        });
    }
    var r;
  })(),
    document.addEventListener('DOMContentLoaded', function () {
      var t = document.querySelector('[data-fetch-results]');
      if (t) {
        var e = t.getAttribute('data-action');
        y(e);
      }
    });
})();
