var fixto = function(t, e, i) {
    var s, o = (s = {
            getAll: function(t) {
                return i.defaultView.getComputedStyle(t)
            },
            get: function(t, e) {
                return this.getAll(t)[e]
            },
            toFloat: function(t) {
                return parseFloat(t, 10) || 0
            },
            getFloat: function(t, e) {
                return this.toFloat(this.get(t, e))
            },
            _getAllCurrentStyle: function(t) {
                return t.currentStyle
            }
        }, i.documentElement.currentStyle && (s.getAll = s._getAllCurrentStyle), s),
        n = function() {
            function e(t) {
                this.element = t, this.replacer = i.createElement("div"), this.replacer.style.visibility = "hidden", this.hide(), t.parentNode.insertBefore(this.replacer, t)
            }
            return e.prototype = {
                replace: function() {
                    var t = this.replacer.style,
                        e = o.getAll(this.element);
                    t.width = this._width(), t.height = this._height(), t.marginTop = e.marginTop, t.marginBottom = e.marginBottom, t.marginLeft = e.marginLeft, t.marginRight = e.marginRight, t.cssFloat = e.cssFloat, t.styleFloat = e.styleFloat, t.position = e.position, t.top = e.top, t.right = e.right, t.bottom = e.bottom, t.left = e.left, t.display = e.display
                },
                hide: function() {
                    this.replacer.style.display = "none"
                },
                _width: function() {
                    return this.element.getBoundingClientRect().width + "px"
                },
                _widthOffset: function() {
                    return this.element.offsetWidth + "px"
                },
                _height: function() {
                    return jQuery(this.element).outerHeight() + "px"
                },
                _heightOffset: function() {
                    return this.element.offsetHeight + "px"
                },
                destroy: function() {
                    t(this.replacer).remove();
                    for (var e in this) this.hasOwnProperty(e) && (this[e] = null)
                }
            }, i.documentElement.getBoundingClientRect().width || (e.prototype._width = e.prototype._widthOffset, e.prototype._height = e.prototype._heightOffset), {
                MimicNode: e,
                computedStyle: o
            }
        }();

    function a() {
        this._vendor = null
    }
    a.prototype = {
        _vendors: {
            webkit: {
                cssPrefix: "-webkit-",
                jsPrefix: "Webkit"
            },
            moz: {
                cssPrefix: "-moz-",
                jsPrefix: "Moz"
            },
            ms: {
                cssPrefix: "-ms-",
                jsPrefix: "ms"
            },
            opera: {
                cssPrefix: "-o-",
                jsPrefix: "O"
            }
        },
        _prefixJsProperty: function(t, e) {
            return t.jsPrefix + e[0].toUpperCase() + e.substr(1)
        },
        _prefixValue: function(t, e) {
            return t.cssPrefix + e
        },
        _valueSupported: function(t, e, i) {
            try {
                return i.style[t] = e, i.style[t] === e
            } catch (t) {
                return !1
            }
        },
        propertySupported: function(t) {
            return void 0 !== i.documentElement.style[t]
        },
        getJsProperty: function(t) {
            if (this.propertySupported(t)) return t;
            if (this._vendor) return this._prefixJsProperty(this._vendor, t);
            var e;
            for (var i in this._vendors)
                if (e = this._prefixJsProperty(this._vendors[i], t), this.propertySupported(e)) return this._vendor = this._vendors[i], e;
            return null
        },
        getCssValue: function(t, e) {
            var s, o = i.createElement("div"),
                n = this.getJsProperty(t);
            if (this._valueSupported(n, e, o)) return e;
            if (this._vendor && (s = this._prefixValue(this._vendor, e), this._valueSupported(n, s, o))) return s;
            for (var a in this._vendors)
                if (s = this._prefixValue(this._vendors[a], e), this._valueSupported(n, s, o)) return this._vendor = this._vendors[a], s;
            return null
        }
    };
    var r, h = new a,
        l = h.getJsProperty("transform");
    var c, d = h.getCssValue("position", "sticky"),
        u = h.getCssValue("position", "fixed");

    function p(e, i, s) {
        this.child = e, this._$child = t(e), this.parent = i, this.options = {
            className: "fixto-fixed",
            top: 0
        }, this._setOptions(s)
    }

    function f(t, e, i) {
        p.call(this, t, e, i), this._replacer = new n.MimicNode(t), this._ghostNode = this._replacer.replacer, this._saveStyles(), this._saveViewportHeight(), this._proxied_onscroll = this._bind(this._onscroll, this), this._proxied_onresize = this._bind(this._onresize, this), this.start()
    }

    function m(t, e, i) {
        p.call(this, t, e, i), this.start()
    }
    "Microsoft Internet Explorer" === navigator.appName && (c = parseFloat(navigator.appVersion.split("MSIE")[1])), p.prototype = {
        _mindtop: function() {
            var t = 0;
            if (this._$mind)
                for (var e, i, s = 0, n = this._$mind.length; s < n; s++)
                    if ((i = (e = this._$mind[s]).getBoundingClientRect()).height) t += i.height;
                    else {
                        var a = o.getAll(e);
                        t += e.offsetHeight + o.toFloat(a.marginTop) + o.toFloat(a.marginBottom)
                    }
            return t
        },
        stop: function() {
            this._stop(), this._running = !1
        },
        start: function() {
            this._running || (this._start(), this._running = !0)
        },
        destroy: function() {
            this.stop(), this._destroy(), this._$child.removeData("fixto-instance");
            for (var t in this) this.hasOwnProperty(t) && (this[t] = null)
        },
        _setOptions: function(e) {
            t.extend(this.options, e), this.options.mind && (this._$mind = t(this.options.mind)), this.options.zIndex && (this.child.style.zIndex = this.options.zIndex)
        },
        setOptions: function(t) {
            this._setOptions(t), this.refresh()
        },
        _stop: function() {},
        _start: function() {},
        _destroy: function() {},
        refresh: function() {}
    }, f.prototype = new p, t.extend(f.prototype, {
        _bind: function(t, e) {
            return function() {
                return t.call(e)
            }
        },
        _toresize: 8 === c ? i.documentElement : e,
        _onscroll: function() {
            if (this._scrollTop = i.documentElement.scrollTop || i.body.scrollTop, this._parentBottom = this.parent.offsetHeight + this._fullOffset("offsetTop", this.parent), this.fixed) {
                if (this.options.toBottom) {
                    if (this._scrollTop >= this._fullOffset("offsetTop", this._ghostNode)) return void this._unfix()
                } else if (this._scrollTop > this._parentBottom || this._scrollTop <= this._fullOffset("offsetTop", this._ghostNode) - this.options.top - this._mindtop()) return void this._unfix();
                this._adjust()
            } else {
                var t = o.getAll(this.child);
                (this._scrollTop < this._parentBottom && this._scrollTop > this._fullOffset("offsetTop", this.child) - this.options.top - this._mindtop() && this._viewportHeight > this.child.offsetHeight + o.toFloat(t.marginTop) + o.toFloat(t.marginBottom) || this.options.toBottom) && (this._fix(), this._adjust())
            }
        },
        _adjust: function() {
            var e = 0,
                i = this._mindtop(),
                s = 0,
                n = o.getAll(this.child),
                a = null;
            if (r && (a = this._getContext()) && (e = Math.abs(a.getBoundingClientRect().top)), (s = this._parentBottom - this._scrollTop - (this.child.offsetHeight + o.toFloat(n.marginBottom) + i + this.options.top)) > 0 && (s = 0), this.options.toBottom);
            else {
                var h = this.options.top;
                0 === h && (h = t("body").offset().top), this.child.style.top = Math.round(s + i + e + h - o.toFloat(n.marginTop)) + "px"
            }
        },
        _fullOffset: function(t, e, i) {
            for (var s = e[t], o = e.offsetParent; null !== o && o !== i;) s += o[t], o = o.offsetParent;
            return s
        },
        _getContext: function() {
            for (var t, e = this.child, s = null; !s;) {
                if ((t = e.parentNode) === i.documentElement) return null;
                if ("none" !== o.getAll(t)[l]) {
                    s = t;
                    break
                }
                e = t
            }
            return s
        },
        _fix: function() {
            var e = this.child,
                s = e.style,
                n = o.getAll(e),
                a = e.getBoundingClientRect().left,
                h = n.width;
            if (this.options._original, this._saveStyles(), i.documentElement.currentStyle && (h = e.offsetWidth, "border-box" !== n.boxSizing && (h -= o.toFloat(n.paddingLeft) + o.toFloat(n.paddingRight) + o.toFloat(n.borderLeftWidth) + o.toFloat(n.borderRightWidth)), h += "px"), r) {
                this._getContext();
                a = this._$child.offset().left
            }
            if (this._replacer.replace(), s.left = a - o.toFloat(n.marginLeft) + "px", s.width = h, s.position = "fixed", this.options.toBottom) s.top = "", s.bottom = this.options.top + o.toFloat(n.marginBottom) + "px";
            else {
                s.bottom = "";
                var l = this.options.top;
                0 === l && (l = t("body").offset().top), s.top = this._mindtop() + l - o.toFloat(n.marginTop) + "px"
            }
            this._$child.addClass(this.options.className), this.fixed = !0, this._$child.trigger("fixto-added")
        },
        _unfix: function() {
            var t = this.child.style;
            this._replacer.hide(), t.position = this._childOriginalPosition, t.top = this._childOriginalTop, t.bottom = this._childOriginalBottom, t.width = this._childOriginalWidth, t.left = this._childOriginalLeft, this.options.always || (this._$child.removeClass(this.options.className), this._$child.trigger("fixto-removed")), this.fixed = !1
        },
        _saveStyles: function() {
            var t = this.child.style;
            this._childOriginalPosition = t.position, this.options.toBottom ? (this._childOriginalTop = "", this._childOriginalBottom = t.bottom) : (this._childOriginalTop = t.top, this._childOriginalBottom = ""), this._childOriginalWidth = t.width, this._childOriginalLeft = t.left
        },
        _onresize: function() {
            this.refresh()
        },
        _saveViewportHeight: function() {
            this._viewportHeight = e.innerHeight || i.documentElement.clientHeight
        },
        _stop: function() {
            this._unfix(), t(e).unbind("scroll.fixto mousewheel", this._proxied_onscroll), t(this._toresize).unbind("resize.fixto", this._proxied_onresize)
        },
        _start: function() {
            this._onscroll(), t(e).bind("scroll.fixto mousewheel", this._proxied_onscroll), t(this._toresize).bind("resize.fixto", this._proxied_onresize)
        },
        _destroy: function() {
            this._replacer.destroy()
        },
        refresh: function() {
            this._saveViewportHeight(), this._unfix(), this._onscroll()
        }
    }), m.prototype = new p, t.extend(m.prototype, {
        _start: function() {
            var t = o.getAll(this.child);
            this._childOriginalPosition = t.position, this._childOriginalTop = t.top, this.child.style.position = d, this.refresh()
        },
        _stop: function() {
            this.child.style.position = this._childOriginalPosition, this.child.style.top = this._childOriginalTop
        },
        refresh: function() {
            this.child.style.top = this._mindtop() + this.options.top + "px"
        }
    });
    var g = function(t, e, s) {
        return d && !s || d && s && !1 !== s.useNativeSticky ? new m(t, e, s) : u ? (void 0 === r && (o = !1, n = i.createElement("div"), a = i.createElement("div"), n.appendChild(a), n.style[l] = "translate(0)", n.style.marginTop = "10px", n.style.visibility = "hidden", a.style.position = "fixed", a.style.top = 0, i.body.appendChild(n), a.getBoundingClientRect().top > 0 && (o = !0), i.body.removeChild(n), r = o), new f(t, e, s)) : "Neither fixed nor sticky positioning supported";
        var o, n, a
    };
    return c < 8 && (g = function() {
        return "not supported"
    }), t.fn.fixTo = function(e, i) {
        var s = t(e),
            o = 0;
        return this.each(function() {
            var n = t(this).data("fixto-instance");
            n ? n[e].call(n, i) : t(this).data("fixto-instance", g(this, s[o], i));
            o++
        })
    }, {
        FixToContainer: f,
        fixTo: g,
        computedStyle: o,
        mimicNode: n
    }
}(window.jQuery, window, document);
! function(t, e, i) {
    "use strict";
    var s = /^.*(youtu\.be\/|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtube\.com\/watch\?.*\&v=)([^#\&\?]*).*/i;
    t.fn.backstretch = function(s, o) {
        var n, a = arguments;
        return 0 === t(e).scrollTop() && e.scrollTo(0, 0), this.each(function(e) {
            var r = t(this),
                h = r.data("backstretch");
            if (h) {
                if ("string" == typeof a[0] && "function" == typeof h[a[0]]) {
                    var l = h[a[0]].apply(h, Array.prototype.slice.call(a, 1));
                    return l === h && (l = i), void(l !== i && ((n = n || [])[e] = l))
                }
                o = t.extend(h.options, o), h.hasOwnProperty("destroy") && h.destroy(!0)
            }
            if (!s || s && 0 === s.length) {
                var c = r.css("background-image");
                c && "none" !== c ? s = [{
                    url: r.css("backgroundImage").replace(/url\(|\)|"|'/g, "")
                }] : t.error("No images were supplied for Backstretch, or element must have a CSS-defined background image.")
            }
            h = new v(this, s, o || {}), r.data("backstretch", h)
        }), n ? 1 === n.length ? n[0] : n : this
    }, t.backstretch = function(e, i) {
        return t("body").backstretch(e, i).data("backstretch")
    }, t.expr[":"].backstretch = function(e) {
        return t(e).data("backstretch") !== i
    }, t.fn.backstretch.defaults = {
        duration: 5e3,
        transition: "fade",
        transitionDuration: 0,
        animateFirst: !0,
        alignX: .5,
        alignY: .5,
        paused: !1,
        start: 0,
        preload: 2,
        preloadSize: 1,
        resolutionRefreshRate: 2500,
        resolutionChangeRatioThreshold: .1
    };
    var o, n, a, r, h, l, c = {
            wrap: {
                left: 0,
                top: 0,
                overflow: "hidden",
                margin: 0,
                padding: 0,
                height: "100%",
                width: "100%",
                zIndex: -999999
            },
            itemWrapper: {
                position: "absolute",
                display: "none",
                margin: 0,
                padding: 0,
                border: "none",
                width: "100%",
                height: "100%",
                zIndex: -999999
            },
            item: {
                position: "absolute",
                margin: 0,
                padding: 0,
                border: "none",
                width: "100%",
                height: "100%",
                maxWidth: "none"
            }
        },
        d = (o = function(t) {
            for (var e = 1; e < t.length; e++) {
                for (var i = t[e], s = e; t[s - 1] && parseInt(t[s - 1].width, 10) > parseInt(i.width, 10);) t[s] = t[s - 1], --s;
                t[s] = i
            }
            return t
        }, n = function(t, i, s) {
            for (var o, n, a = e.devicePixelRatio || 1, r = S(), h = (A(), i > t ? "portrait" : t > i ? "landscape" : "square"), l = 0, c = 0; c < s.length && ("string" == typeof(n = s[c]) && (n = s[c] = {
                url: n
            }), n.pixelRatio && "auto" !== n.pixelRatio && parseFloat(n.pixelRatio) !== a || n.deviceOrientation && n.deviceOrientation !== r || n.windowOrientation && n.windowOrientation !== r || n.orientation && n.orientation !== h || (l = c, o = t, "auto" === n.pixelRatio && (t *= a), !(n.width >= o))); c++);
            return s[Math.min(c, l)]
        }, a = function(t, e) {
            if ("string" == typeof t) t = t.replace(/{{(width|height)}}/g, e);
            else if (t instanceof Array)
                for (var i = 0; i < t.length; i++) t[i].src ? t[i].src = a(t[i].src, e) : t[i] = a(t[i], e);
            return t
        }, function(e, i) {
            for (var s = e.width(), r = e.height(), h = [], l = function(t, e) {
                return "width" === e ? s : "height" === e ? r : t
            }, c = 0; c < i.length; c++)
                if (t.isArray(i[c])) {
                    i[c] = o(i[c]);
                    var d = n(s, r, i[c]);
                    h.push(d)
                } else {
                    "string" == typeof i[c] && (i[c] = {
                        url: i[c]
                    });
                    var u = t.extend({}, i[c]);
                    u.url = a(u.url, l), h.push(u)
                }
            return h
        }),
        u = function(t) {
            return s.test(t.url) || t.isVideo
        },
        p = (r = [], h = function(t) {
            for (var e = 0; e < r.length; e++)
                if (r[e].src === t.src) return r[e];
            return r.push(t), t
        }, l = function(t, e, i) {
            "function" == typeof e && e.call(t, i)
        }, function e(i, s, o, n, a) {
            if (void 0 !== i) {
                t.isArray(i) || (i = [i]), arguments.length < 5 && "function" == typeof arguments[arguments.length - 1] && (a = arguments[arguments.length - 1]), s = "function" != typeof s && s ? s : 0, o = "function" == typeof o || !o || o < 0 ? i.length : Math.min(o, i.length), n = "function" != typeof n && n ? n : 1, s >= i.length && (s = 0, o = 0), n < 0 && (n = o), n = Math.min(n, o);
                var r = i.slice(s + n, o - n);
                if (i = i.slice(s, n), o = i.length)
                    for (var c, d = 0, p = function() {
                        ++d === o && (l(i, a, !r), e(r, 0, 0, n, a))
                    }, f = 0; f < i.length; f++) u(i[f]) || ((c = new Image).src = i[f].url, (c = h(c)).complete ? p() : t(c).on("load error", p));
                else l(i, a, !0)
            }
        }),
        f = function(e) {
            for (var i = [], s = 0; s < e.length; s++) "string" == typeof e[s] ? i.push({
                url: e[s]
            }) : t.isArray(e[s]) ? i.push(f(e[s])) : i.push(m(e[s]));
            return i
        },
        m = function(t, s) {
            return (t.centeredX || t.centeredY) && (e.console && e.console.log && e.console.log("jquery.backstretch: `centeredX`/`centeredY` is deprecated, please use `alignX`/`alignY`"), t.centeredX && (t.alignX = .5), t.centeredY && (t.alignY = .5)), t.speed !== i && (e.console && e.console.log && e.console.log("jquery.backstretch: `speed` is deprecated, please use `transitionDuration`"), t.transitionDuration = t.speed, t.transition = "fade"), t.resolutionChangeRatioTreshold !== i && (e.console.log("jquery.backstretch: `treshold` is a typo!"), t.resolutionChangeRatioThreshold = t.resolutionChangeRatioTreshold), t.fadeFirst !== i && (t.animateFirst = t.fadeFirst), t.fade !== i && (t.transitionDuration = t.fade, t.transition = "fade"), g(t)
        },
        g = function(t, e) {
            return "left" === t.alignX ? t.alignX = 0 : "center" === t.alignX ? t.alignX = .5 : "right" === t.alignX ? t.alignX = 1 : (t.alignX !== i || e) && (t.alignX = parseFloat(t.alignX), isNaN(t.alignX) && (t.alignX = .5)), "top" === t.alignY ? t.alignY = 0 : "center" === t.alignY ? t.alignY = .5 : "bottom" === t.alignY ? t.alignY = 1 : (t.alignX !== i || e) && (t.alignY = parseFloat(t.alignY), isNaN(t.alignY) && (t.alignY = .5)), t
        },
        v = function(i, s, o) {
            this.options = t.extend({}, t.fn.backstretch.defaults, o || {}), this.firstShow = !0, m(this.options, !0), this.images = f(t.isArray(s) ? s : [s]), this.options.paused && (this.paused = !0), this.options.start >= this.images.length && (this.options.start = this.images.length - 1), this.options.start < 0 && (this.options.start = 0), this.isBody = i === document.body;
            var n = t(e);
            this.$container = t(i), this.$root = this.isBody ? P ? n : t(document) : this.$container, this.originalImages = this.images, this.images = d(this.options.alwaysTestWindowResolution ? n : this.$root, this.originalImages), p(this.images, this.options.start || 0, this.options.preload || 1);
            var a = this.$container.children(".backstretch").first();
            if (this.$wrap = a.length ? a : t('<div class="backstretch"></div>').css(this.options.bypassCss ? {} : c.wrap).appendTo(this.$container), !this.options.bypassCss) {
                if (!this.isBody) {
                    var r = this.$container.css("position"),
                        h = this.$container.css("zIndex");
                    this.$container.css({
                        position: "static" === r ? "relative" : r,
                        zIndex: "auto" === h ? 0 : h
                    }), this.$wrap.css({
                        zIndex: -999998
                    })
                }
                this.$wrap.css({
                    position: this.isBody && P ? "fixed" : "absolute"
                })
            }
            this.index = this.options.start, this.show(this.index), n.on("resize.backstretch", t.proxy(this.resize, this)).on("orientationchange.backstretch", t.proxy(function() {
                this.isBody && 0 === e.pageYOffset && (e.scrollTo(0, 1), this.resize())
            }, this))
        };
    v.prototype = {
        resize: function() {
            try {
                var s = this.options.alwaysTestWindowResolution ? t(e) : this.$root,
                    o = s.width(),
                    n = s.height(),
                    a = o / (this._lastResizeContainerWidth || 0),
                    r = n / (this._lastResizeContainerHeight || 0),
                    h = this.options.resolutionChangeRatioThreshold || 0;
                if ((o !== this._lastResizeContainerWidth || n !== this._lastResizeContainerHeight) && (Math.abs(a - 1) >= h || isNaN(a) || Math.abs(r - 1) >= h || isNaN(r)) && (this._lastResizeContainerWidth = o, this._lastResizeContainerHeight = n, this.images = d(s, this.originalImages), this.options.preload && p(this.images, (this.index + 1) % this.images.length, this.options.preload), 1 === this.images.length && this._currentImage.url !== this.images[0].url)) {
                    var l = this;
                    clearTimeout(l._selectAnotherResolutionTimeout), l._selectAnotherResolutionTimeout = setTimeout(function() {
                        l.show(0)
                    }, this.options.resolutionRefreshRate)
                }
                var c = {
                        left: 0,
                        top: 0,
                        right: "auto",
                        bottom: "auto"
                    },
                    u = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                    f = this.isBody ? e.innerHeight ? e.innerHeight : this.$root.height() : this.$root.innerHeight(),
                    m = u,
                    g = m / this.$itemWrapper.data("ratio"),
                    v = t.Event("backstretch.resize", {
                        relatedTarget: this.$container[0]
                    }),
                    y = this._currentImage.alignX === i ? this.options.alignX : this._currentImage.alignX,
                    w = this._currentImage.alignY === i ? this.options.alignY : this._currentImage.alignY;
                g >= f ? c.top = -(g - f) * w : (((m = (g = f) * this.$itemWrapper.data("ratio")) - u) / 2, c.left = -(m - u) * y), this.options.bypassCss || this.$wrap.css({
                    width: u,
                    height: f
                }).find(">.backstretch-item").not(".deleteable").each(function() {
                    t(this).find("img,video,iframe").css({
                        width: m,
                        height: g
                    }).css(c)
                }), this.$container.trigger(v, this)
            } catch (t) {}
            return this
        },
        show: function(e, s) {
            if (!(Math.abs(e) > this.images.length - 1)) {
                var o = this,
                    n = o.$wrap.find(">.backstretch-item").addClass("deleteable"),
                    a = o.videoWrapper,
                    r = {
                        relatedTarget: o.$container[0]
                    };
                o.$container.trigger(t.Event("backstretch.before", r), [o, e]), this.index = e;
                var h = o.images[e];
                clearTimeout(o._cycleTimeout), delete o.videoWrapper;
                var l = u(h);
                return l ? (o.videoWrapper = new y(h), o.$item = o.videoWrapper.$video.css("pointer-events", "none")) : o.$item = t("<img />"), o.$itemWrapper = t('<div class="backstretch-item">').append(o.$item), this.options.bypassCss ? o.$itemWrapper.css({
                    display: "none"
                }) : (o.$itemWrapper.css(c.itemWrapper), o.$item.css(c.item)), o.$item.bind(l ? "canplay" : "load", function(h) {
                    var c = t(this).parent(),
                        d = c.data("options");
                    s && (d = t.extend({}, d, s));
                    var u = this.naturalWidth || this.videoWidth || this.width,
                        p = this.naturalHeight || this.videoHeight || this.height;
                    c.data("ratio", u / p);
                    var f = function(t) {
                            return d[t] !== i ? d[t] : o.options[t]
                        },
                        m = f("transition"),
                        g = f("transitionEasing"),
                        v = f("transitionDuration"),
                        y = function() {
                            a && (a.stop(), a.destroy()), n.remove(), !o.paused && o.images.length > 1 && o.cycle(), o.options.bypassCss || o.isBody || o.$container.css("background-image", "none"), t(["after", "show"]).each(function() {
                                o.$container.trigger(t.Event("backstretch." + this, r), [o, e])
                            }), l && o.videoWrapper.play()
                        };
                    o.firstShow && !o.options.animateFirst || !v || !m ? (c.show(), y()) : function(e) {
                        var s = e.transition || "fade";
                        "string" == typeof s && s.indexOf("|") > -1 && (s = s.split("|")), s instanceof Array && (s = s[Math.round(Math.random() * (s.length - 1))]);
                        var o = e.new,
                            n = e.old ? e.old : t([]);
                        switch (s.toString().toLowerCase()) {
                            default:
                            case "fade":
                                o.fadeIn({
                                    duration: e.duration,
                                    complete: e.complete,
                                    easing: e.easing || i
                                });
                                break;
                            case "fadeinout":
                            case "fade_in_out":
                                var a = function() {
                                    o.fadeIn({
                                        duration: e.duration / 2,
                                        complete: e.complete,
                                        easing: e.easing || i
                                    })
                                };n.length ? n.fadeOut({
                                duration: e.duration / 2,
                                complete: a,
                                easing: e.easing || i
                            }) : a();
                                break;
                            case "pushleft":
                            case "push_left":
                            case "pushright":
                            case "push_right":
                            case "pushup":
                            case "push_up":
                            case "pushdown":
                            case "push_down":
                            case "coverleft":
                            case "cover_left":
                            case "coverright":
                            case "cover_right":
                            case "coverup":
                            case "cover_up":
                            case "coverdown":
                            case "cover_down":
                                var r = s.match(/^(cover|push)_?(.*)$/),
                                    h = "left" === r[2] ? "right" : "right" === r[2] ? "left" : "down" === r[2] ? "top" : "up" === r[2] ? "bottom" : "right",
                                    l = {
                                        display: ""
                                    },
                                    c = {};
                                if (l[h] = "-100%", c[h] = 0, o.css(l).animate(c, {
                                    duration: e.duration,
                                    complete: function() {
                                        o.css(h, ""), e.complete.apply(this, arguments)
                                    },
                                    easing: e.easing || i
                                }), "push" === r[1] && n.length) {
                                    var d = {};
                                    d[h] = "100%", n.animate(d, {
                                        duration: e.duration,
                                        complete: function() {
                                            n.css("display", "none")
                                        },
                                        easing: e.easing || i
                                    })
                                }
                        }
                    }({
                        new: c,
                        old: n,
                        transition: m,
                        duration: v,
                        easing: g,
                        complete: y
                    }), o.firstShow = !1, o.resize()
                }), o.$itemWrapper.appendTo(o.$wrap), o.$item.attr("alt", h.alt || ""), o.$itemWrapper.data("options", h), l || o.$item.attr("src", h.url), o._currentImage = h, o
            }
        },
        current: function() {
            return this.index
        },
        next: function() {
            var t = Array.prototype.slice.call(arguments, 0);
            return t.unshift(this.index < this.images.length - 1 ? this.index + 1 : 0), this.show.apply(this, t)
        },
        prev: function() {
            var t = Array.prototype.slice.call(arguments, 0);
            return t.unshift(0 === this.index ? this.images.length - 1 : this.index - 1), this.show.apply(this, t)
        },
        pause: function() {
            return this.paused = !0, this.videoWrapper && this.videoWrapper.pause(), this
        },
        resume: function() {
            return this.paused = !1, this.videoWrapper && this.videoWrapper.play(), this.cycle(), this
        },
        cycle: function() {
            if (this.images.length > 1) {
                clearTimeout(this._cycleTimeout);
                var e = this._currentImage && this._currentImage.duration || this.options.duration,
                    i = u(this._currentImage),
                    s = function() {
                        this.$item.off(".cycle"), this.paused || this.next()
                    };
                if (i) {
                    if (!this._currentImage.loop) {
                        var o = 0;
                        this.$item.on("playing.cycle", function() {
                            var e = t(this).data("player");
                            clearTimeout(o), o = setTimeout(function() {
                                e.pause(), e.$video.trigger("ended")
                            }, 1e3 * (e.getDuration() - e.getCurrentTime()))
                        }).on("ended.cycle", function() {
                            clearTimeout(o)
                        })
                    }
                    this.$item.on("error.cycle initerror.cycle", t.proxy(s, this))
                }
                i && !this._currentImage.duration ? this.$item.on("ended.cycle", t.proxy(s, this)) : this._cycleTimeout = setTimeout(t.proxy(s, this), e)
            }
            return this
        },
        destroy: function(i) {
            t(e).off("resize.backstretch orientationchange.backstretch"), this.videoWrapper && this.videoWrapper.destroy(), clearTimeout(this._cycleTimeout), i || this.$wrap.remove(), this.$container.removeData("backstretch")
        }
    };
    var y = function() {
        this.init.apply(this, arguments)
    };
    y.prototype.init = function(o) {
        var n, a = this,
            r = function() {
                a.$video = n, a.video = n[0]
            },
            h = "video";
        if (o.url instanceof Array || !s.test(o.url) || (h = "youtube"), a.type = h, "youtube" === h) {
            y.loadYoutubeAPI(), a.ytId = o.url.match(s)[2];
            var l = "https://www.youtube.com/embed/" + a.ytId + "?rel=0&autoplay=0&showinfo=0&controls=0&modestbranding=1&cc_load_policy=0&disablekb=1&iv_load_policy=3&loop=0&enablejsapi=1&origin=" + encodeURIComponent(e.location.origin);
            a.__ytStartMuted = !!o.mute || o.mute === i, n = t("<iframe />").attr({
                src_to_load: l
            }).css({
                border: 0,
                margin: 0,
                padding: 0
            }).data("player", a), o.loop && n.on("ended.loop", function() {
                a.__manuallyStopped || a.play()
            }), a.ytReady = !1, r(), e.YT ? (a._initYoutube(), n.trigger("initsuccess")) : t(e).one("youtube_api_load", function() {
                a._initYoutube(), n.trigger("initsuccess")
            })
        } else {
            n = t("<video>").prop("autoplay", !1).prop("controls", !1).prop("loop", !!o.loop).prop("muted", !!o.mute || o.mute === i).prop("preload", "auto").prop("poster", o.poster || "");
            for (var c = o.url instanceof Array ? o.url : [o.url], d = 0; d < c.length; d++) {
                var u = c[d];
                "string" == typeof u && (u = {
                    src: u
                }), t("<source>").attr("src", u.src).attr("type", u.type || null).appendTo(n)
            }
            n[0].canPlayType && c.length ? n.trigger("initsuccess") : n.trigger("initerror"), r()
        }
    }, y.prototype._initYoutube = function() {
        var i = this,
            s = e.YT;
        i.$video.attr("src", i.$video.attr("src_to_load")).removeAttr("src_to_load");
        var o = !!i.$video[0].parentNode;
        if (!o) {
            var n = t("<div>").css("display", "none !important").appendTo(document.body);
            i.$video.appendTo(n)
        }
        var a = new s.Player(i.video, {
            events: {
                onReady: function() {
                    i.__ytStartMuted && a.mute(), o || (i.$video[0].parentNode === n[0] && i.$video.detach(), n.remove()), i.ytReady = !0, i._updateYoutubeSize(), i.$video.trigger("canplay")
                },
                onStateChange: function(t) {
                    switch (t.data) {
                        case s.PlayerState.PLAYING:
                            i.$video.trigger("playing");
                            break;
                        case s.PlayerState.ENDED:
                            i.$video.trigger("ended");
                            break;
                        case s.PlayerState.PAUSED:
                            i.$video.trigger("pause");
                            break;
                        case s.PlayerState.BUFFERING:
                            i.$video.trigger("waiting");
                            break;
                        case s.PlayerState.CUED:
                            i.$video.trigger("canplay")
                    }
                },
                onPlaybackQualityChange: function() {
                    i._updateYoutubeSize(), i.$video.trigger("resize")
                },
                onError: function(t) {
                    i.hasError = !0, i.$video.trigger({
                        type: "error",
                        error: t
                    })
                }
            }
        });
        return i.ytPlayer = a, i
    }, y.prototype._updateYoutubeSize = function() {
        var t = this;
        switch (t.ytPlayer.getPlaybackQuality() || "medium") {
            case "small":
                t.video.videoWidth = 426, t.video.videoHeight = 240;
                break;
            case "medium":
                t.video.videoWidth = 640, t.video.videoHeight = 360;
                break;
            default:
            case "large":
                t.video.videoWidth = 854, t.video.videoHeight = 480;
                break;
            case "hd720":
                t.video.videoWidth = 1280, t.video.videoHeight = 720;
                break;
            case "hd1080":
                t.video.videoWidth = 1920, t.video.videoHeight = 1080;
                break;
            case "highres":
                t.video.videoWidth = 2560, t.video.videoHeight = 1440
        }
        return t
    }, y.prototype.play = function() {
        var t = this;
        return t.__manuallyStopped = !1, "youtube" === t.type ? t.ytReady && (t.$video.trigger("play"), t.ytPlayer.playVideo()) : t.video.play(), t
    }, y.prototype.pause = function() {
        var t = this;
        return t.__manuallyStopped = !1, "youtube" === t.type ? t.ytReady && t.ytPlayer.pauseVideo() : t.video.pause(), t
    }, y.prototype.stop = function() {
        var t = this;
        return t.__manuallyStopped = !0, "youtube" === t.type ? t.ytReady && (t.ytPlayer.pauseVideo(), t.ytPlayer.seekTo(0)) : (t.video.pause(), t.video.currentTime = 0), t
    }, y.prototype.destroy = function() {
        return this.ytPlayer && this.ytPlayer.destroy(), this.$video.remove(), this
    }, y.prototype.getCurrentTime = function(t) {
        return "youtube" !== this.type ? this.video.currentTime : this.ytReady ? this.ytPlayer.getCurrentTime() : 0
    }, y.prototype.setCurrentTime = function(t) {
        var e = this;
        return "youtube" === e.type ? e.ytReady && e.ytPlayer.seekTo(t, !0) : e.video.currentTime = t, e
    }, y.prototype.getDuration = function() {
        return "youtube" !== this.type ? this.video.duration : this.ytReady ? this.ytPlayer.getDuration() : 0
    }, y.loadYoutubeAPI = function() {
        if (!e.YT) {
            t("script[src*=www\\.youtube\\.com\\/iframe_api]").length || t('<script type="text/javascript" src="https://www.youtube.com/iframe_api">').appendTo("body");
            var i = setInterval(function() {
                e.YT && e.YT.loaded && (t(e).trigger("youtube_api_load"), clearTimeout(i))
            }, 50)
        }
    };
    var w, b, C, $, _, x, k, T, O, I, S = function() {
            if ("matchMedia" in e) {
                if (e.matchMedia("(orientation: portrait)").matches) return "portrait";
                if (e.matchMedia("(orientation: landscape)").matches) return "landscape"
            }
            return screen.height > screen.width ? "portrait" : "landscape"
        },
        A = function() {
            return e.innerHeight > e.innerWidth ? "portrait" : e.innerWidth > e.innerHeight ? "landscape" : "square"
        },
        P = (w = navigator.userAgent, b = navigator.platform, C = w.match(/AppleWebKit\/([0-9]+)/), $ = !!C && C[1], _ = w.match(/Fennec\/([0-9]+)/), x = !!_ && _[1], k = w.match(/Opera Mobi\/([0-9]+)/), T = !!k && k[1], O = w.match(/MSIE ([0-9]+)/), I = !!O && O[1], !((b.indexOf("iPhone") > -1 || b.indexOf("iPad") > -1 || b.indexOf("iPod") > -1) && $ && $ < 534 || e.operamini && "[object OperaMini]" === {}.toString.call(e.operamini) || k && T < 7458 || w.indexOf("Android") > -1 && $ && $ < 533 || x && x < 6 || "palmGetResource" in e && $ && $ < 534 || w.indexOf("MeeGo") > -1 && w.indexOf("NokiaBrowser/8.5.0") > -1 || I && I <= 6))
}(jQuery, window),
    function(t, e, i) {
        "use strict";
        var s = function(t, e) {
            var s = this;
            this.el = t, this.options = {}, Object.keys(o).forEach(function(t) {
                s.options[t] = o[t]
            }), Object.keys(e).forEach(function(t) {
                s.options[t] = e[t]
            }), this.isInput = "input" === this.el.tagName.toLowerCase(), this.attr = this.options.attr, this.showCursor = !this.isInput && this.options.showCursor, this.elContent = this.attr ? this.el.getAttribute(this.attr) : this.el.textContent, this.contentType = this.options.contentType, this.typeSpeed = this.options.typeSpeed, this.startDelay = this.options.startDelay, this.backSpeed = this.options.backSpeed, this.backDelay = this.options.backDelay, this.fadeOut = this.options.fadeOut, this.fadeOutClass = this.options.fadeOutClass, this.fadeOutDelay = this.options.fadeOutDelay, i && this.options.stringsElement instanceof i ? this.stringsElement = this.options.stringsElement[0] : this.stringsElement = this.options.stringsElement, this.strings = this.options.strings, this.strPos = 0, this.arrayPos = 0, this.stopNum = 0, this.loop = this.options.loop, this.loopCount = this.options.loopCount, this.curLoop = 0, this.stop = !1, this.cursorChar = this.options.cursorChar, this.shuffle = this.options.shuffle, this.sequence = [], this.build()
        };
        s.prototype = {
            constructor: s,
            init: function() {
                var t = this;
                t.timeout = setTimeout(function() {
                    for (var e = 0; e < t.strings.length; ++e) t.sequence[e] = e;
                    t.shuffle && (t.sequence = t.shuffleArray(t.sequence)), t.typewrite(t.strings[t.sequence[t.arrayPos]], t.strPos)
                }, t.startDelay)
            },
            build: function() {
                var t = this;
                (!0 === this.showCursor && (this.cursor = e.createElement("span"), this.cursor.className = "typed-cursor", this.cursor.innerHTML = this.cursorChar, this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling)), this.stringsElement) && (this.strings = [], this.stringsElement.style.display = "none", Array.prototype.slice.apply(this.stringsElement.children).forEach(function(e) {
                    t.strings.push(e.innerHTML)
                }));
                this.init()
            },
            typewrite: function(t, e) {
                if (!0 !== this.stop) {
                    this.fadeOut && this.el.classList.contains(this.fadeOutClass) && (this.el.classList.remove(this.fadeOutClass), this.cursor.classList.remove(this.fadeOutClass));
                    var i = Math.round(70 * Math.random()) + this.typeSpeed,
                        s = this;
                    s.timeout = setTimeout(function() {
                        var i = 0,
                            o = t.substr(e);
                        if ("^" === o.charAt(0)) {
                            var n = 1;
                            /^\^\d+/.test(o) && (n += (o = /\d+/.exec(o)[0]).length, i = parseInt(o)), t = t.substring(0, e) + t.substring(e + n)
                        }
                        if ("html" === s.contentType) {
                            var a = t.substr(e).charAt(0);
                            if ("<" === a) {
                                var r = "";
                                for (r = "<" === a ? ">" : ";"; t.substr(e + 1).charAt(0) !== r && (t.substr(e).charAt(0), !(++e + 1 > t.length)););
                                e++, r
                            }
                        }
                        s.timeout = setTimeout(function() {
                            if (e === t.length) {
                                if (s.options.onStringTyped(s.arrayPos), s.arrayPos === s.strings.length - 1 && (s.options.callback(), s.curLoop++, !1 === s.loop || s.curLoop === s.loopCount)) return;
                                s.timeout = setTimeout(function() {
                                    s.backspace(t, e)
                                }, s.backDelay)
                            } else {
                                0 === e && s.options.preStringTyped(s.arrayPos);
                                var i = t.substr(0, e + 1);
                                s.attr ? s.el.setAttribute(s.attr, i) : s.isInput ? s.el.value = i : "html" === s.contentType ? s.el.innerHTML = i : s.el.textContent = i, e++, s.typewrite(t, e)
                            }
                        }, i)
                    }, i)
                }
            },
            backspace: function(t, e) {
                var i = this;
                if (!0 !== this.stop)
                    if (this.fadeOut) this.initFadeOut();
                    else {
                        var s = Math.round(70 * Math.random()) + this.backSpeed;
                        i.timeout = setTimeout(function() {
                            if ("html" === i.contentType && ">" === t.substr(e).charAt(0)) {
                                for (;
                                    "<" !== t.substr(e - 1).charAt(0) && (t.substr(e).charAt(0), !(--e < 0)););
                                e--, "<"
                            }
                            var s = t.substr(0, e);
                            i.replaceText(s), e > i.stopNum ? (e--, i.backspace(t, e)) : e <= i.stopNum && (i.arrayPos++, i.arrayPos === i.strings.length ? (i.arrayPos = 0, i.shuffle && (i.sequence = i.shuffleArray(i.sequence)), i.init()) : i.typewrite(i.strings[i.sequence[i.arrayPos]], e))
                        }, s)
                    }
            },
            initFadeOut: function() {
                return self = this, this.el.className += " " + this.fadeOutClass, this.cursor.className += " " + this.fadeOutClass, setTimeout(function() {
                    self.arrayPos++, self.replaceText(""), self.typewrite(self.strings[self.sequence[self.arrayPos]], 0)
                }, self.fadeOutDelay)
            },
            replaceText: function(t) {
                this.attr ? this.el.setAttribute(this.attr, t) : this.isInput ? this.el.value = t : "html" === this.contentType ? this.el.innerHTML = t : this.el.textContent = t
            },
            shuffleArray: function(t) {
                var e, i, s = t.length;
                if (s)
                    for (; --s;) e = t[i = Math.floor(Math.random() * (s + 1))], t[i] = t[s], t[s] = e;
                return t
            },
            reset: function() {
                clearInterval(this.timeout);
                this.el.getAttribute("id");
                this.el.textContent = "", void 0 !== this.cursor && void 0 !== this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor), this.strPos = 0, this.arrayPos = 0, this.curLoop = 0, this.options.resetCallback()
            }
        }, s.new = function(t, i) {
            Array.prototype.slice.apply(e.querySelectorAll(t)).forEach(function(t) {
                var e = t._typed,
                    o = "object" == typeof i && i;
                e && e.reset(), t._typed = e = new s(t, o), "string" == typeof i && e[i]()
            })
        }, i && (i.fn.typed = function(t) {
            return this.each(function() {
                var e = i(this),
                    o = e.data("typed"),
                    n = "object" == typeof t && t;
                o && o.reset(), e.data("typed", o = new s(this, n)), "string" == typeof t && o[t]()
            })
        }), t.Typed = s;
        var o = {
            strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
            stringsElement: null,
            typeSpeed: 0,
            startDelay: 0,
            backSpeed: 0,
            shuffle: !1,
            backDelay: 500,
            fadeOut: !1,
            fadeOutClass: "typed-fade-out",
            fadeOutDelay: 500,
            loop: !1,
            loopCount: !1,
            showCursor: !0,
            cursorChar: "|",
            attr: null,
            contentType: "html",
            callback: function() {},
            preStringTyped: function() {},
            onStringTyped: function() {},
            resetCallback: function() {}
        }
    }(window, document, window.jQuery),
    function(t) {
        if ("undefined" == typeof jQuery) throw new Error("Kube's requires jQuery");
        ! function(t) {
            var e = jQuery.fn.jquery.split(".");
            if (1 == e[0] && e[1] < 8) throw new Error("Kube's requires at least jQuery v1.8")
        }(),
            function() {
                Function.prototype.inherits = function(t) {
                    var e = function() {};
                    e.prototype = t.prototype;
                    var i = new e;
                    for (var s in this.prototype) i[s] = this.prototype[s];
                    this.prototype = i, this.prototype.super = t.prototype
                };
                var e = function(e, i) {
                    i = "object" == typeof i ? i : {}, this.$element = t(e), this.opts = t.extend(!0, this.defaults, t.fn[this.namespace].options, this.$element.data(), i), this.$target = "string" == typeof this.opts.target ? t(this.opts.target) : null
                };
                e.prototype = {
                    getInstance: function() {
                        return this.$element.data("fn." + this.namespace)
                    },
                    hasTarget: function() {
                        return !(null === this.$target)
                    },
                    callback: function(e) {
                        var i = [].slice.call(arguments).splice(1);
                        return this.$element && (i = this._fireCallback(t._data(this.$element[0], "events"), e, this.namespace, i)), this.$target && (i = this._fireCallback(t._data(this.$target[0], "events"), e, this.namespace, i)), this.opts && this.opts.callbacks && t.isFunction(this.opts.callbacks[e]) ? this.opts.callbacks[e].apply(this, i) : i
                    },
                    _fireCallback: function(t, e, i, s) {
                        if (t && void 0 !== t[e])
                            for (var o = t[e].length, n = 0; n < o; n++) {
                                if (t[e][n].namespace === i) var a = t[e][n].handler.apply(this, s)
                            }
                        return void 0 === a ? s : a
                    }
                }, window.MesmerizeKube = e
            }();
        var e, i, s, o, n, a, r, h, l, c, d, u, p, f, m, g, v = window.MesmerizeKube;
        (e = v).Plugin = {
            create: function(i, s) {
                return s = void 0 === s ? i.toLowerCase() : s, t.fn[s] = function(o, n) {
                    var a = Array.prototype.slice.call(arguments, 1),
                        r = "fn." + s,
                        h = [];
                    return this.each(function() {
                        var s = t(this),
                            l = s.data(r);
                        if (n = "object" == typeof o ? o : n, l || (s.data(r, {}), s.data(r, l = new e[i](this, n))), "string" == typeof o)
                            if (t.isFunction(l[o])) {
                                var c = l[o].apply(l, a);
                                void 0 !== c && h.push(c)
                            } else t.error('No such method "' + o + '" for ' + i)
                    }), 0 === h.length || 1 === h.length ? 0 === h.length ? this : h[0] : h
                }, t.fn[s].options = {}, this
            },
            autoload: function(t) {
                for (var e = t.split(","), i = e.length, s = 0; s < i; s++) {
                    var o = e[s].toLowerCase().split(",").map(function(t) {
                        return t.trim()
                    }).join(",");
                    this.autoloadQueue.push(o)
                }
                return this
            },
            autoloadQueue: [],
            startAutoload: function() {
                if (window.MutationObserver && 0 !== this.autoloadQueue.length) {
                    var t = this;
                    new MutationObserver(function(e) {
                        e.forEach(function(e) {
                            var i = e.addedNodes;
                            0 === i.length || 1 === i.length && 3 === i.nodeType || t.startAutoloadOnce()
                        })
                    }).observe(document, {
                        subtree: !0,
                        childList: !0
                    })
                }
            },
            startAutoloadOnce: function() {
                var e = this;
                t("[data-component]").not("[data-loaded]").each(function() {
                    var i = t(this),
                        s = i.data("component"); - 1 !== e.autoloadQueue.indexOf(s) && (i.attr("data-loaded", !0), i[s]())
                })
            },
            watch: function() {
                e.Plugin.startAutoloadOnce(), e.Plugin.startAutoload()
            }
        }, t(window).on("load", function() {
            e.Plugin.watch()
        }), (i = v).Animation = function(t, e, s) {
            this.namespace = "animation", this.defaults = {}, i.apply(this, arguments), this.effect = e, this.completeCallback = void 0 !== s && s, this.prefixes = ["", "-moz-", "-o-animation-", "-webkit-"], this.queue = [], this.start()
        }, i.Animation.prototype = {
            start: function() {
                this.isSlideEffect() && this.setElementHeight(), this.addToQueue(), this.clean(), this.animate()
            },
            addToQueue: function() {
                this.queue.push(this.effect)
            },
            setElementHeight: function() {
                this.$element.height(this.$element.height())
            },
            removeElementHeight: function() {
                this.$element.css("height", "")
            },
            isSlideEffect: function() {
                return "slideDown" === this.effect || "slideUp" === this.effect
            },
            isHideableEffect: function() {
                return -1 !== t.inArray(this.effect, ["fadeOut", "slideUp", "flipOut", "zoomOut", "slideOutUp", "slideOutRight", "slideOutLeft"])
            },
            isToggleEffect: function() {
                return "show" === this.effect || "hide" === this.effect
            },
            storeHideClasses: function() {
                this.$element.hasClass("hide-sm") ? this.$element.data("hide-sm-class", !0) : this.$element.hasClass("hide-md") && this.$element.data("hide-md-class", !0)
            },
            revertHideClasses: function() {
                this.$element.data("hide-sm-class") ? this.$element.addClass("hide-sm").removeData("hide-sm-class") : this.$element.data("hide-md-class") ? this.$element.addClass("hide-md").removeData("hide-md-class") : this.$element.addClass("hide")
            },
            removeHideClass: function() {
                this.$element.data("hide-sm-class") ? this.$element.removeClass("hide-sm") : this.$element.data("hide-md-class") ? this.$element.removeClass("hide-md") : this.$element.removeClass("hide")
            },
            animate: function() {
                if (this.storeHideClasses(), this.isToggleEffect()) return this.makeSimpleEffects();
                this.$element.addClass("kubeanimated"), this.$element.addClass(this.queue[0]), this.removeHideClass();
                var e = this.queue.length > 1 ? null : this.completeCallback;
                this.complete("AnimationEnd", t.proxy(this.makeComplete, this), e)
            },
            makeSimpleEffects: function() {
                "show" === this.effect ? this.removeHideClass() : "hide" === this.effect && this.revertHideClasses(), "function" == typeof this.completeCallback && this.completeCallback(this)
            },
            makeComplete: function() {
                this.$element.hasClass(this.queue[0]) && (this.clean(), this.queue.shift(), this.queue.length && this.animate())
            },
            complete: function(e, i, s) {
                var o = e.split(" ").map(function(t) {
                    return t.toLowerCase() + " webkit" + t + " o" + t + " MS" + t
                });
                this.$element.one(o.join(" "), t.proxy(function() {
                    "function" == typeof i && i(), this.isHideableEffect() && this.revertHideClasses(), this.isSlideEffect() && this.removeElementHeight(), "function" == typeof s && s(this), this.$element.off(event)
                }, this))
            },
            clean: function() {
                this.$element.removeClass("kubeanimated").removeClass(this.queue[0])
            }
        }, i.Animation.inherits(i), (s = jQuery).fn.animation = function(t, e) {
            var i = "fn.animation";
            return this.each(function() {
                var o = s(this);
                o.data(i), o.data(i, {}), o.data(i, new v.Animation(this, t, e))
            })
        }, s.fn.animation.options = {}, (o = v).Detect = function() {}, o.Detect.prototype = {
            isMobile: function() {
                return /(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent)
            },
            isDesktop: function() {
                return !/(iPhone|iPod|iPad|BlackBerry|Android)/.test(navigator.userAgent)
            },
            isMobileScreen: function() {
                return t(window).width() <= 768
            },
            isTabletScreen: function() {
                return t(window).width() >= 768 && t(window).width() <= 1024
            },
            isDesktopScreen: function() {
                return t(window).width() > 1024
            }
        }, (n = v).FormData = function(t) {
            this.opts = t.opts
        }, n.FormData.prototype = {
            set: function(t) {
                this.data = t
            },
            get: function(t) {
                return this.formdata = t, this.opts.appendForms && this.appendForms(), this.opts.appendFields && this.appendFields(), this.data
            },
            appendFields: function() {
                var e = t(this.opts.appendFields);
                if (0 !== e.length) {
                    var i = this,
                        s = "";
                    this.formdata ? e.each(function() {
                        i.data.append(t(this).attr("name"), t(this).val())
                    }) : (e.each(function() {
                        s += "&" + t(this).attr("name") + "=" + t(this).val()
                    }), this.data = "" === this.data ? s.replace(/^&/, "") : this.data + s)
                }
            },
            appendForms: function() {
                var e = t(this.opts.appendForms);
                if (0 !== e.length)
                    if (this.formdata) {
                        var i = this,
                            s = t(this.opts.appendForms).serializeArray();
                        t.each(s, function(t, e) {
                            i.data.append(e.name, e.value)
                        })
                    } else {
                        var o = e.serialize();
                        this.data = "" === this.data ? o : this.data + "&" + o
                    }
            }
        }, (a = v).Response = function(t) {}, a.Response.prototype = {
            parse: function(t) {
                if ("" === t) return !1;
                var e = {};
                try {
                    e = JSON.parse(t)
                } catch (t) {
                    return !1
                }
                if (void 0 !== e[0])
                    for (var i in e) this.parseItem(e[i]);
                else this.parseItem(e);
                return e
            },
            parseItem: function(e) {
                return "value" === e.type ? t.each(e.data, t.proxy(function(e, i) {
                    i = !0 === (i = null === i || !1 === i ? 0 : i) ? 1 : i, t(e).val(i)
                }, this)) : "html" === e.type ? t.each(e.data, t.proxy(function(e, i) {
                    i = null === i || !1 === i ? "" : i, t(e).html(this.stripslashes(i))
                }, this)) : "addClass" === e.type ? t.each(e.data, function(e, i) {
                    t(e).addClass(i)
                }) : "removeClass" === e.type ? t.each(e.data, function(e, i) {
                    t(e).removeClass(i)
                }) : "command" === e.type ? t.each(e.data, function(e, i) {
                    t(i)[e]()
                }) : "animation" === e.type ? t.each(e.data, function(e, i) {
                    i.opts = void 0 === i.opts ? {} : i.opts, t(e).animation(i.name, i.opts)
                }) : "location" === e.type ? top.location.href = e.data : "notify" === e.type && t.notify(e.data), e
            },
            stripslashes: function(t) {
                return (t + "").replace(/\0/g, "0").replace(/\\([\\'"])/g, "$1")
            }
        }, (r = v).Utils = function() {}, r.Utils.prototype = {
            disableBodyScroll: function() {
                var e = t("html"),
                    i = window.innerWidth;
                if (!i) {
                    var s = document.documentElement.getBoundingClientRect();
                    i = s.right - Math.abs(s.left)
                }
                var o = document.body.clientWidth < i,
                    n = this.measureScrollbar();
                e.css("overflow", "hidden"), o && e.css("padding-right", n)
            },
            measureScrollbar: function() {
                var e = t("body"),
                    i = document.createElement("div");
                i.className = "scrollbar-measure", e.append(i);
                var s = i.offsetWidth - i.clientWidth;
                return e[0].removeChild(i), s
            },
            enableBodyScroll: function() {
                t("html").css({
                    overflow: "",
                    "padding-right": ""
                })
            }
        }, (h = v).Message = function(t, e) {
            this.namespace = "message", this.defaults = {
                closeSelector: ".close",
                closeEvent: "click",
                animationOpen: "fadeIn",
                animationClose: "fadeOut",
                callbacks: ["open", "opened", "close", "closed"]
            }, h.apply(this, arguments), this.start()
        }, h.Message.prototype = {
            start: function() {
                this.$close = this.$element.find(this.opts.closeSelector), this.$close.on(this.opts.closeEvent + "." + this.namespace, t.proxy(this.close, this)), this.$element.addClass("open")
            },
            stop: function() {
                this.$close.off("." + this.namespace), this.$element.removeClass("open")
            },
            open: function(e) {
                e && e.preventDefault(), this.isOpened() || (this.callback("open"), this.$element.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
            },
            isOpened: function() {
                return this.$element.hasClass("open")
            },
            onOpened: function() {
                this.callback("opened"), this.$element.addClass("open")
            },
            close: function(e) {
                e && e.preventDefault(), this.isOpened() && (this.callback("close"), this.$element.animation(this.opts.animationClose, t.proxy(this.onClosed, this)))
            },
            onClosed: function() {
                this.callback("closed"), this.$element.removeClass("open")
            }
        }, h.Message.inherits(h), h.Plugin.create("Message"), h.Plugin.autoload("Message"), (l = v).Sticky = function(t, e) {
            this.namespace = "sticky", this.defaults = {
                classname: "fixed",
                offset: 0,
                callbacks: ["fixed", "unfixed"]
            }, l.apply(this, arguments), this.start()
        }, l.Sticky.prototype = {
            start: function() {
                this.offsetTop = this.getOffsetTop(), this.load(), t(window).scroll(t.proxy(this.load, this))
            },
            getOffsetTop: function() {
                return this.$element.offset().top
            },
            load: function() {
                return this.isFix() ? this.fixed() : this.unfixed()
            },
            isFix: function() {
                return t(window).scrollTop() > this.offsetTop + this.opts.offset
            },
            fixed: function() {
                this.$element.addClass(this.opts.classname).css("top", this.opts.offset + "px"), this.callback("fixed")
            },
            unfixed: function() {
                this.$element.removeClass(this.opts.classname).css("top", ""), this.callback("unfixed")
            }
        }, l.Sticky.inherits(l), l.Plugin.create("Sticky"), l.Plugin.autoload("Sticky"), (c = v).Toggleme = function(t, e) {
            this.namespace = "toggleme", this.defaults = {
                toggleEvent: "click",
                target: null,
                text: "",
                animationOpen: "slideDown",
                animationClose: "slideUp",
                callbacks: ["open", "opened", "close", "closed"]
            }, c.apply(this, arguments), this.start()
        }, c.Toggleme.prototype = {
            start: function() {
                this.hasTarget() && this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this))
            },
            stop: function() {
                this.$element.off("." + this.namespace), this.revertText()
            },
            toggle: function(t) {
                this.isOpened() ? this.close(t) : this.open(t)
            },
            open: function(e) {
                e && e.preventDefault(), this.isOpened() || (this.storeText(), this.callback("open"), this.$target.animation("slideDown", t.proxy(this.onOpened, this)), setTimeout(t.proxy(this.replaceText, this), 100))
            },
            close: function(e) {
                e && e.preventDefault(), this.isOpened() && (this.callback("close"), this.$target.animation("slideUp", t.proxy(this.onClosed, this)))
            },
            isOpened: function() {
                return this.$target.hasClass("open")
            },
            onOpened: function() {
                this.$target.addClass("open"), this.callback("opened")
            },
            onClosed: function() {
                this.$target.removeClass("open"), this.revertText(), this.callback("closed")
            },
            storeText: function() {
                this.$element.data("replacement-text", this.$element.html())
            },
            revertText: function() {
                var t = this.$element.data("replacement-text");
                t && this.$element.html(t), this.$element.removeData("replacement-text")
            },
            replaceText: function() {
                "" !== this.opts.text && this.$element.html(this.opts.text)
            }
        }, c.Toggleme.inherits(c), c.Plugin.create("Toggleme"), c.Plugin.autoload("Toggleme"), (d = v).Offcanvas = function(t, e) {
            this.namespace = "offcanvas", this.defaults = {
                target: null,
                push: !0,
                width: "250px",
                direction: "left",
                toggleEvent: "click",
                clickOutside: !0,
                animationOpen: "slideInLeft",
                animationClose: "slideOutLeft",
                callbacks: ["open", "opened", "close", "closed"]
            }, d.apply(this, arguments), this.utils = new d.Utils, this.detect = new d.Detect, this.start()
        }, d.Offcanvas.prototype = {
            start: function() {
                this.hasTarget() && (this.buildTargetWidth(), this.buildAnimationDirection(), this.$close = this.getCloseLink(), this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this)), this.$target.addClass("offcanvas"), this.$target.trigger("kube.offcanvas.ready"))
            },
            stop: function() {
                this.closeAll(), this.$element.off("." + this.namespace), this.$close.off("." + this.namespace), t(document).off("." + this.namespace)
            },
            toggle: function(t) {
                this.isOpened() ? this.close(t) : this.open(t)
            },
            buildTargetWidth: function() {
                this.opts.width = t(window).width() < parseInt(this.opts.width) ? "100%" : this.opts.width
            },
            buildAnimationDirection: function() {
                "right" === this.opts.direction && (this.opts.animationOpen = "slideInRight", this.opts.animationClose = "slideOutRight")
            },
            getCloseLink: function() {
                return this.$target.find(".close")
            },
            open: function(e) {
                e && e.preventDefault(), this.isOpened() || (this.closeAll(), this.callback("open"), this.$target.addClass("offcanvas-" + this.opts.direction), this.$target.css("width", Math.min(parseInt(this.opts.width), window.innerWidth - 100)), this.$target.css("right", "-" + Math.min(parseInt(this.opts.width), window.innerWidth - 100)), this.pushBody(), this.$target.trigger("kube.offcanvas.open"), this.$target.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
            },
            closeAll: function() {
                var e = t(document).find(".offcanvas");
                0 !== e.length && (e.each(function() {
                    var e = t(this);
                    e.hasClass("open") && (e.css("width", "").animation("hide"), e.removeClass("open offcanvas-left offcanvas-right"))
                }), t(document).off("." + this.namespace), t("body").css("left", ""))
            },
            close: function(e) {
                if (e) {
                    var i = t(e.target);
                    if (("A" === i[0].tagName || "BUTTON" === i[0].tagName || i.parents("a").length) && 0 !== i.closest(".offcanvas").length && !i.hasClass("close")) return;
                    e.preventDefault()
                }
                this.isOpened() && (this.utils.enableBodyScroll(), this.callback("close"), this.pullBody(), this.$target.trigger("kube.offcanvas.close"), this.$target.animation(this.opts.animationClose, t.proxy(this.onClosed, this)))
            },
            isOpened: function() {
                return this.$target.hasClass("open")
            },
            onOpened: function() {
                this.opts.clickOutside && t(document).on("click." + this.namespace + " tap." + this.namespace, t.proxy(this.close, this)), this.detect.isMobileScreen() && t("html").addClass("no-scroll"), t(document).on("keyup." + this.namespace, t.proxy(this.handleKeyboard, this)), this.$close.on("click." + this.namespace, t.proxy(this.close, this)), this.utils.disableBodyScroll(), this.$target.addClass("open"), this.callback("opened")
            },
            onClosed: function() {
                this.detect.isMobileScreen() && t("html").removeClass("no-scroll"), this.$target.css("width", "").removeClass("offcanvas-" + this.opts.direction), this.$close.off("." + this.namespace), t(document).off("." + this.namespace), this.$target.removeClass("open"), this.callback("closed"), this.$target.trigger("kube.offcanvas.closed")
            },
            handleKeyboard: function(t) {
                27 === t.which && this.close()
            },
            pullBody: function() {
                this.opts.push && t("body").animate({
                    left: 0
                }, 350, function() {
                    t(this).removeClass("offcanvas-push-body")
                })
            },
            pushBody: function() {
                if (this.opts.push) {
                    var e = "left" === this.opts.direction ? {
                        left: this.opts.width
                    } : {
                        left: "-" + this.opts.width
                    };
                    t("body").addClass("offcanvas-push-body").animate(e, 200)
                }
            }
        }, d.Offcanvas.inherits(d), d.Plugin.create("Offcanvas"), d.Plugin.autoload("Offcanvas"), (u = v).Collapse = function(t, e) {
            this.namespace = "collapse", this.defaults = {
                target: null,
                toggle: !0,
                active: !1,
                toggleClass: "collapse-toggle",
                boxClass: "collapse-box",
                callbacks: ["open", "opened", "close", "closed"],
                hashes: [],
                currentHash: !1,
                currentItem: !1
            }, u.apply(this, arguments), this.start()
        }, u.Collapse.prototype = {
            start: function() {
                this.$items = this.getItems(), this.$items.each(t.proxy(this.loadItems, this)), this.$boxes = this.getBoxes(), this.setActiveItem()
            },
            getItems: function() {
                return this.$element.find("." + this.opts.toggleClass)
            },
            getBoxes: function() {
                return this.$element.find("." + this.opts.boxClass)
            },
            loadItems: function(e, i) {
                var s = this.getItem(i);
                s.$el.attr("rel", s.hash), t(s.hash).hasClass("hide") || (this.opts.currentItem = s, this.opts.active = s.hash, s.$el.addClass("active")), s.$el.on("click.collapse", t.proxy(this.toggle, this))
            },
            setActiveItem: function() {
                !1 !== this.opts.active && (this.opts.currentItem = this.getItemBy(this.opts.active), this.opts.active = this.opts.currentItem.hash), !1 !== this.opts.currentItem && (this.addActive(this.opts.currentItem), this.opts.currentItem.$box.removeClass("hide"))
            },
            addActive: function(t) {
                t.$box.removeClass("hide").addClass("open"), t.$el.addClass("active"), !1 !== t.$caret && t.$caret.removeClass("down").addClass("up"), !1 !== t.$parent && t.$parent.addClass("active"), this.opts.currentItem = t
            },
            removeActive: function(t) {
                t.$box.removeClass("open"), t.$el.removeClass("active"), !1 !== t.$caret && t.$caret.addClass("down").removeClass("up"), !1 !== t.$parent && t.$parent.removeClass("active"), this.opts.currentItem = !1
            },
            toggle: function(e) {
                e && e.preventDefault();
                var i = t(e.target).closest("." + this.opts.toggleClass).get(0) || e.target,
                    s = this.getItem(i);
                this.isOpened(s.hash) ? this.close(s.hash) : this.open(e)
            },
            openAll: function() {
                this.$items.addClass("active"), this.$boxes.addClass("open").removeClass("hide")
            },
            open: function(e, i) {
                if (void 0 !== e) {
                    "object" == typeof e && e.preventDefault();
                    var s = t(e.target).closest("." + this.opts.toggleClass).get(0) || e.target,
                        o = "object" == typeof e ? this.getItem(s) : this.getItemBy(e);
                    o.$box.hasClass("open") || (this.opts.toggle && this.closeAll(), this.callback("open", o), this.addActive(o), o.$box.animation("slideDown", t.proxy(this.onOpened, this)))
                }
            },
            onOpened: function() {
                this.callback("opened", this.opts.currentItem)
            },
            closeAll: function() {
                this.$items.removeClass("active").closest("li").removeClass("active"), this.$boxes.removeClass("open").addClass("hide")
            },
            close: function(e) {
                var i = this.getItemBy(e);
                this.callback("close", i), this.opts.currentItem = i, i.$box.animation("slideUp", t.proxy(this.onClosed, this))
            },
            onClosed: function() {
                var t = this.opts.currentItem;
                this.removeActive(t), this.callback("closed", t)
            },
            isOpened: function(e) {
                return t(e).hasClass("open")
            },
            getItem: function(e) {
                var i = {};
                i.$el = t(e), i.hash = i.$el.attr("href"), i.$box = t(i.hash);
                var s = i.$el.parent();
                i.$parent = "LI" === s[0].tagName && s;
                var o = i.$el.find(".caret");
                return i.$caret = 0 !== o.length && o, i
            },
            getItemBy: function(t) {
                var e = "number" == typeof t ? this.$items.eq(t - 1) : this.$element.find('[rel="' + t + '"]');
                return this.getItem(e)
            }
        }, u.Collapse.inherits(u), u.Plugin.create("Collapse"), u.Plugin.autoload("Collapse"), (p = v).Dropdown = function(t, e) {
            this.namespace = "dropdown", this.defaults = {
                target: null,
                toggleEvent: "click",
                height: !1,
                width: !1,
                animationOpen: "slideDown",
                animationClose: "slideUp",
                caretUp: !1,
                callbacks: ["open", "opened", "close", "closed"]
            }, p.apply(this, arguments), this.utils = new p.Utils, this.detect = new p.Detect, this.start()
        }, p.Dropdown.prototype = {
            start: function() {
                this.buildClose(), this.buildCaret(), this.detect.isMobile() && this.buildMobileAnimation(), this.$target.addClass("hide"), this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this))
            },
            stop: function() {
                this.$element.off("." + this.namespace), this.$target.removeClass("open").addClass("hide"), this.disableEvents()
            },
            buildMobileAnimation: function() {
                this.opts.animationOpen = "fadeIn", this.opts.animationClose = "fadeOut"
            },
            buildClose: function() {
                this.$close = this.$target.find(".close")
            },
            buildCaret: function() {
                this.$caret = this.getCaret(), this.buildCaretPosition()
            },
            buildCaretPosition: function() {
                var e = this.$element.offset().top + this.$element.innerHeight() + this.$target.innerHeight();
                t(document).height() > e || (this.opts.caretUp = !0, this.$caret.addClass("up"))
            },
            getCaret: function() {
                return this.$element.find(".caret")
            },
            toggleCaretOpen: function() {
                this.opts.caretUp ? this.$caret.removeClass("up").addClass("down") : this.$caret.removeClass("down").addClass("up")
            },
            toggleCaretClose: function() {
                this.opts.caretUp ? this.$caret.removeClass("down").addClass("up") : this.$caret.removeClass("up").addClass("down")
            },
            toggle: function(t) {
                this.isOpened() ? this.close(t) : this.open(t)
            },
            open: function(e) {
                e && e.preventDefault(), this.callback("open"), t(".dropdown").removeClass("open").addClass("hide"), this.opts.height && this.$target.css("min-height", this.opts.height + "px"), this.opts.width && this.$target.width(this.opts.width), this.setPosition(), this.toggleCaretOpen(), this.$target.animation(this.opts.animationOpen, t.proxy(this.onOpened, this))
            },
            close: function(e) {
                if (this.isOpened()) {
                    if (e) {
                        if (this.shouldNotBeClosed(e.target)) return;
                        e.preventDefault()
                    }
                    this.utils.enableBodyScroll(), this.callback("close"), this.toggleCaretClose(), this.$target.animation(this.opts.animationClose, t.proxy(this.onClosed, this))
                }
            },
            onClosed: function() {
                this.$target.removeClass("open"), this.disableEvents(), this.callback("closed")
            },
            onOpened: function() {
                this.$target.addClass("open"), this.enableEvents(), this.callback("opened")
            },
            isOpened: function() {
                return this.$target.hasClass("open")
            },
            enableEvents: function() {
                this.detect.isDesktop() && this.$target.on("mouseover." + this.namespace, t.proxy(this.utils.disableBodyScroll, this.utils)).on("mouseout." + this.namespace, t.proxy(this.utils.enableBodyScroll, this.utils)), t(document).on("scroll." + this.namespace, t.proxy(this.setPosition, this)), t(window).on("resize." + this.namespace, t.proxy(this.setPosition, this)), t(document).on("click." + this.namespace + " touchstart." + this.namespace, t.proxy(this.close, this)), t(document).on("keydown." + this.namespace, t.proxy(this.handleKeyboard, this)), this.$target.find('[data-action="dropdown-close"]').on("click." + this.namespace, t.proxy(this.close, this))
            },
            disableEvents: function() {
                this.$target.off("." + this.namespace), t(document).off("." + this.namespace), t(window).off("." + this.namespace)
            },
            handleKeyboard: function(t) {
                27 === t.which && this.close(t)
            },
            shouldNotBeClosed: function(e) {
                return "dropdown-close" !== t(e).attr("data-action") && e !== this.$close[0] && 0 !== t(e).closest(".dropdown").length
            },
            isNavigationFixed: function() {
                return 0 !== this.$element.closest(".fixed").length
            },
            getPlacement: function(e) {
                return t(document).height() < e ? "top" : "bottom"
            },
            getOffset: function(t) {
                return this.isNavigationFixed() ? this.$element.position() : this.$element.offset()
            },
            getPosition: function() {
                return this.isNavigationFixed() ? "fixed" : "absolute"
            },
            setPosition: function() {
                if (this.detect.isMobile()) this.$target.addClass("dropdown-mobile");
                else {
                    var e, i = this.getPosition(),
                        s = this.getOffset(i),
                        o = this.$target.innerHeight(),
                        n = this.$target.innerWidth(),
                        a = this.getPlacement(s.top + o + this.$element.innerHeight()),
                        r = t(window).width() < s.left + n ? n - this.$element.innerWidth() : 0,
                        h = s.left - r;
                    "bottom" === a ? (this.isOpened() || this.$caret.removeClass("up").addClass("down"), this.opts.caretUp = !1, e = s.top + this.$element.outerHeight() + 1) : (this.opts.animationOpen = "show", this.opts.animationClose = "hide", this.isOpened() || this.$caret.addClass("up").removeClass("down"), this.opts.caretUp = !0, e = s.top - o - 1), this.$target.css({
                        position: i,
                        top: e + "px",
                        left: h + "px"
                    })
                }
            }
        }, p.Dropdown.inherits(p), p.Plugin.create("Dropdown"), p.Plugin.autoload("Dropdown"), (f = v).Tabs = function(t, e) {
            this.namespace = "tabs", this.defaults = {
                equals: !1,
                active: !1,
                live: !1,
                hash: !0,
                callbacks: ["init", "next", "prev", "open", "opened", "close", "closed"]
            }, f.apply(this, arguments), this.start()
        }, f.Tabs.prototype = {
            start: function() {
                !1 !== this.opts.live && this.buildLiveTabs(), this.tabsCollection = [], this.hashesCollection = [], this.currentHash = [], this.currentItem = !1, this.$items = this.getItems(), this.$items.each(t.proxy(this.loadItems, this)), this.$tabs = this.getTabs(), this.currentHash = this.getLocationHash(), this.closeAll(), this.setActiveItem(), this.setItemHeight(), this.callback("init")
            },
            getTabs: function() {
                return t(this.tabsCollection).map(function() {
                    return this.toArray()
                })
            },
            getItems: function() {
                return this.$element.find("a")
            },
            loadItems: function(e, i) {
                var s = this.getItem(i);
                s.$el.attr("rel", s.hash), this.collectItem(s), s.$parent.hasClass("active") && (this.currentItem = s, this.opts.active = s.hash), s.$el.on("click.tabs", t.proxy(this.open, this))
            },
            collectItem: function(t) {
                this.tabsCollection.push(t.$tab), this.hashesCollection.push(t.hash)
            },
            buildLiveTabs: function() {
                var e = t(this.opts.live);
                0 !== e.length && (this.$liveTabsList = t("<ul />"), e.each(t.proxy(this.buildLiveItem, this)), this.$element.html("").append(this.$liveTabsList))
            },
            buildLiveItem: function(e, i) {
                var s = t(i),
                    o = t("<li />"),
                    n = t("<a />"),
                    a = e + 1;
                s.attr("id", this.getLiveItemId(s, a));
                var r = "#" + s.attr("id"),
                    h = this.getLiveItemTitle(s);
                n.attr("href", r).attr("rel", r).text(h), o.append(n), this.$liveTabsList.append(o)
            },
            getLiveItemId: function(t, e) {
                return void 0 === t.attr("id") ? this.opts.live.replace(".", "") + e : t.attr("id")
            },
            getLiveItemTitle: function(t) {
                return void 0 === t.attr("data-title") ? t.attr("id") : t.attr("data-title")
            },
            setActiveItem: function() {
                this.currentHash ? (this.currentItem = this.getItemBy(this.currentHash), this.opts.active = this.currentHash) : !1 === this.opts.active && (this.currentItem = this.getItem(this.$items.first()), this.opts.active = this.currentItem.hash), this.addActive(this.currentItem)
            },
            addActive: function(t) {
                t.$parent.addClass("active"), t.$tab.removeClass("hide").addClass("open"), this.currentItem = t
            },
            removeActive: function(t) {
                t.$parent.removeClass("active"), t.$tab.addClass("hide").removeClass("open"), this.currentItem = !1
            },
            next: function(t) {
                t && t.preventDefault();
                var e = this.getItem(this.fetchElement("next"));
                this.open(e.hash), this.callback("next", e)
            },
            prev: function(t) {
                t && t.preventDefault();
                var e = this.getItem(this.fetchElement("prev"));
                this.open(e.hash), this.callback("prev", e)
            },
            fetchElement: function(t) {
                var e;
                if (!1 !== this.currentItem) {
                    if (0 === (e = this.currentItem.$parent[t]().find("a")).length) return
                } else e = this.$items[0];
                return e
            },
            open: function(t, e) {
                if (void 0 !== t) {
                    "object" == typeof t && t.preventDefault();
                    var i = "object" == typeof t ? this.getItem(t.target) : this.getItemBy(t);
                    this.closeAll(), this.callback("open", i), this.addActive(i), this.pushStateOpen(e, i), this.callback("opened", i)
                }
            },
            pushStateOpen: function(t, e) {
                !1 !== t && !1 !== this.opts.hash && history.pushState(!1, !1, e.hash)
            },
            close: function(t) {
                var e = this.getItemBy(t);
                e.$parent.hasClass("active") && (this.callback("close", e), this.removeActive(e), this.pushStateClose(), this.callback("closed", e))
            },
            pushStateClose: function() {
                !1 !== this.opts.hash && history.pushState(!1, !1, " ")
            },
            closeAll: function() {
                this.$tabs.removeClass("open").addClass("hide"), this.$items.parent().removeClass("active")
            },
            getItem: function(e) {
                var i = {};
                return i.$el = t(e), i.hash = i.$el.attr("href"), i.$parent = i.$el.parent(), i.$tab = t(i.hash), i
            },
            getItemBy: function(t) {
                var e = "number" == typeof t ? this.$items.eq(t - 1) : this.$element.find('[rel="' + t + '"]');
                return this.getItem(e)
            },
            getLocationHash: function() {
                return !1 !== this.opts.hash && !!this.isHash() && top.location.hash
            },
            isHash: function() {
                return !("" === top.location.hash || -1 === t.inArray(top.location.hash, this.hashesCollection))
            },
            setItemHeight: function() {
                if (this.opts.equals) {
                    var t = this.getItemMaxHeight() + "px";
                    this.$tabs.css("min-height", t)
                }
            },
            getItemMaxHeight: function() {
                var e = 0;
                return this.$tabs.each(function() {
                    var i = t(this).height();
                    e = i > e ? i : e
                }), e
            }
        }, f.Tabs.inherits(f), f.Plugin.create("Tabs"), f.Plugin.autoload("Tabs"), (m = jQuery).modalcurrent = null, m.modalwindow = function(t) {
            var e = m.extend({}, t, {
                show: !0
            });
            m("<span />").modal(e)
        }, (g = v).Modal = function(t, e) {
            this.namespace = "modal", this.defaults = {
                target: null,
                show: !1,
                url: !1,
                header: !1,
                width: "600px",
                height: !1,
                maxHeight: !1,
                position: "center",
                overlay: !0,
                appendForms: !1,
                appendFields: !1,
                animationOpen: "show",
                animationClose: "hide",
                callbacks: ["open", "opened", "close", "closed"]
            }, g.apply(this, arguments), this.utils = new g.Utils, this.detect = new g.Detect, this.start()
        }, g.Modal.prototype = {
            start: function() {
                this.hasTarget() && (this.opts.show ? this.load() : this.$element.on("click." + this.namespace, t.proxy(this.load, this)))
            },
            buildModal: function() {
                this.$modal = this.$target.find(".modal"), this.$header = this.$target.find(".modal-header"), this.$close = this.$target.find(".close"), this.$body = this.$target.find(".modal-body")
            },
            buildOverlay: function() {
                !1 !== this.opts.overlay && (0 !== t("#modal-overlay").length ? this.$overlay = t("#modal-overlay") : (this.$overlay = t('<div id="modal-overlay">').addClass("hide"), t("body").prepend(this.$overlay)), this.$overlay.addClass("overlay"))
            },
            buildHeader: function() {
                this.opts.header && this.$header.html(this.opts.header)
            },
            load: function(t) {
                this.buildModal(), this.buildOverlay(), this.buildHeader(), this.opts.url ? this.buildContent() : this.open(t)
            },
            open: function(e) {
                e && e.preventDefault(), this.isOpened() || (this.detect.isMobile() && (this.opts.width = "96%"), this.opts.overlay && this.$overlay.removeClass("hide"), this.$target.removeClass("hide"), this.$modal.removeClass("hide"), this.enableEvents(), this.findActions(), this.resize(), t(window).on("resize." + this.namespace, t.proxy(this.resize, this)), this.detect.isDesktop() && this.utils.disableBodyScroll(), this.$modal.find("input[type=text],input[type=url],input[type=email]").on("keydown." + this.namespace, t.proxy(this.handleEnter, this)), this.callback("open"), this.$modal.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
            },
            close: function(e) {
                if (this.$modal && this.isOpened()) {
                    if (e) {
                        if (this.shouldNotBeClosed(e.target)) return;
                        e.preventDefault()
                    }
                    this.callback("close"), this.disableEvents(), this.$modal.animation(this.opts.animationClose, t.proxy(this.onClosed, this)), this.opts.overlay && this.$overlay.animation(this.opts.animationClose)
                }
            },
            onOpened: function() {
                this.$modal.addClass("open"), this.callback("opened"), t.modalcurrent = this
            },
            onClosed: function() {
                this.callback("closed"), this.$target.addClass("hide"), this.$modal.removeClass("open"), this.detect.isDesktop() && this.utils.enableBodyScroll(), this.$body.css("height", ""), t.modalcurrent = null
            },
            isOpened: function() {
                return this.$modal.hasClass("open")
            },
            getData: function() {
                var t = new g.FormData(this);
                return t.set(""), t.get()
            },
            buildContent: function() {
                t.ajax({
                    url: this.opts.url + "?" + (new Date).getTime(),
                    cache: !1,
                    type: "post",
                    data: this.getData(),
                    success: t.proxy(function(t) {
                        this.$body.html(t), this.open()
                    }, this)
                })
            },
            buildWidth: function() {
                var e = this.opts.width,
                    i = "2%",
                    s = "2%",
                    o = e.match(/%$/);
                parseInt(this.opts.width) > t(window).width() && !o ? e = "96%" : o || (i = "16px", s = "16px"), this.$modal.css({
                    width: e,
                    "margin-top": i,
                    "margin-bottom": s
                })
            },
            buildPosition: function() {
                if ("center" === this.opts.position) {
                    var e = t(window).height(),
                        i = this.$modal.outerHeight(),
                        s = e / 2 - i / 2 + "px";
                    this.detect.isMobile() ? s = "2%" : i > e && (s = "16px"), this.$modal.css("margin-top", s)
                }
            },
            buildHeight: function() {
                var e = t(window).height();
                if (this.opts.maxHeight) {
                    var i = parseInt(this.$body.css("padding-top")) + parseInt(this.$body.css("padding-bottom")),
                        s = parseInt(this.$modal.css("margin-top")) + parseInt(this.$modal.css("margin-bottom")),
                        o = e - this.$header.innerHeight() - i - s;
                    this.$body.height(o)
                } else !1 !== this.opts.height && this.$body.css("height", this.opts.height);
                this.$modal.outerHeight() > e && (this.opts.animationOpen = "show", this.opts.animationClose = "hide")
            },
            resize: function() {
                this.buildWidth(), this.buildPosition(), this.buildHeight()
            },
            enableEvents: function() {
                this.$close.on("click." + this.namespace, t.proxy(this.close, this)), t(document).on("keyup." + this.namespace, t.proxy(this.handleEscape, this)), this.$target.on("click." + this.namespace, t.proxy(this.close, this))
            },
            disableEvents: function() {
                this.$close.off("." + this.namespace), t(document).off("." + this.namespace), this.$target.off("." + this.namespace), t(window).off("." + this.namespace)
            },
            findActions: function() {
                this.$body.find('[data-action="modal-close"]').on("mousedown." + this.namespace, t.proxy(this.close, this))
            },
            setHeader: function(t) {
                this.$header.html(t)
            },
            setContent: function(t) {
                this.$body.html(t)
            },
            setWidth: function(t) {
                this.opts.width = t, this.resize()
            },
            getModal: function() {
                return this.$modal
            },
            getBody: function() {
                return this.$body
            },
            getHeader: function() {
                return this.$header
            },
            handleEnter: function(t) {
                13 === t.which && (t.preventDefault(), this.close(!1))
            },
            handleEscape: function(t) {
                return 27 !== t.which || this.close(!1)
            },
            shouldNotBeClosed: function(e) {
                return "modal-close" !== t(e).attr("data-action") && e !== this.$close[0] && 0 !== t(e).closest(".modal").length
            }
        }, g.Modal.inherits(g), g.Plugin.create("Modal"), g.Plugin.autoload("Modal")
    }(jQuery),
    function(t) {
        "#page-top" === window.location.hash && o("", 5);
        var e = {
                items: {},
                eachCategory: function(t) {
                    for (var e in this.items) this.items.hasOwnProperty(e) && t(this.items[e])
                },
                addItem: function(t, e) {
                    this.items[t] || (this.items[t] = []), this.items[t].push(e)
                },
                all: function() {
                    var t = [];
                    for (var e in this.items) this.items.hasOwnProperty(e) && (t = t.concat(this.items[e]));
                    return t
                }
            },
            i = !1;

        function s(e) {
            var i = isNaN(parseFloat(e.options.offset)) ? e.options.offset.call(e.target) : e.options.offset;
            return e.target.offset().top - i - t("body").offset().top
        }

        function o(t, e) {
            t === location.hash.replace("#", "") || "page-top" === t && "" === location.hash.replace("#", "") || setTimeout(function() {
                t = t ? "page-top" === t ? " " : "#" + t : " ", history && history.replaceState && history.replaceState({}, "", t)
            }, e || 100)
        }

        function n(e) {
            if (!i) {
                i = !0;
                var n = s(e);
                t("html, body").animate({
                    scrollTop: n
                }, {
                    easing: "linear",
                    complete: function() {
                        var n = s(e);
                        t("html, body").animate({
                            scrollTop: n
                        }, {
                            easing: "linear",
                            duration: 100,
                            complete: function() {
                                i = !1, o(e.id, 5)
                            }
                        })
                    }
                })
            }
        }

        function a(e) {
            var i = (e.attr("href") || "").split("#").pop(),
                s = function(t) {
                    var e = jQuery(t)[0].href || "",
                        i = "#";
                    try {
                        var s = new window.URL(e);
                        i = [s.protocol, "//", s.host, s.pathname].join("")
                    } catch (t) {
                        i = e.split("?")[0].split("#")[0]
                    }
                    return i
                }(e),
                o = null,
                n = [location.protocol, "//", location.host, location.pathname].join("");
            if (s.length && s !== n) return o;
            if (i.trim().length) try {
                o = t('[id="' + i + '"]')
            } catch (t) {
                console.log("error scrollSpy", t)
            }
            return o && o.length ? o : null
        }

        function r() {
            e.eachCategory(function(t) {
                var e = t.sort(function(t, e) {
                        return t.target.offset().top - e.target.offset().top
                    }),
                    i = e.filter(function(t) {
                        return t.target.offset().top <= window.scrollY + .25 * window.innerHeight
                    }).pop();
                e.forEach(function(t) {
                    i && t.element.is(i.element) ? (o(t.id, 5), t.options.onChange.call(t.element)) : t.options.onLeave.call(t.element)
                })
            })
        }
        t.fn.smoothScrollAnchor = function(e) {
            var i = t(this);
            e = jQuery.extend({
                offset: 0
            }, e), i.each(function() {
                var i = t(this),
                    s = e.target || a(i);
                if (s && s.length) {
                    var o = {
                        element: i,
                        options: e,
                        target: s,
                        targetSel: e.targetSel || '[id="' + s.attr("id").trim() + '"]',
                        id: (s.attr("id") || "").trim()
                    };
                    i.off("click tap").on("click tap", function(e) {
                        t(this).data("skip-smooth-scroll") || (e.preventDefault(), t(this).data("allow-propagation") || e.stopPropagation(), n(o), o.clickCallback && o.clickCallback.call(this, e))
                    })
                }
            })
        }, t.fn.scrollSpy = function(i) {
            var s = t(this),
                o = "spy-" + parseInt(Date.now() * Math.random());
            s.each(function() {
                var s = t(this);
                if (i = jQuery.extend({
                    onChange: function() {},
                    onLeave: function() {},
                    clickCallback: function() {},
                    smoothScrollAnchor: !1,
                    offset: 0
                }, i), s.is("a") && -1 !== (s.attr("href") || "").indexOf("#")) {
                    var n = a(s);
                    if (n) {
                        var r = {
                            element: s,
                            options: i,
                            target: n,
                            targetSel: '[id="' + n.attr("id").trim() + '"]',
                            id: n.attr("id").trim()
                        };
                        e.addItem(o, r), s.data("scrollSpy", r), i.smoothScrollAnchor && s.smoothScrollAnchor({
                            offset: i.offset
                        })
                    }
                }
            })
        }, t(window).scroll(r), t(window).bind("smoothscroll.update", r), t(function() {
            var i = window.location.hash.replace("#", ""),
                s = e.all().filter(function(t) {
                    return t.targetSel === '[id="' + i.trim() + '"]'
                });
            t(window).on("load", function() {
                s.length && n(s[0]), r()
            })
        })
    }(jQuery),
    function(t) {
        function e(e) {
            e.find("[data-selected-item]").each(function() {
                t(this).removeAttr("data-selected-item");
                var i = e.children("ul");
                e.is(".mobile-menu") && i.slideDown()
            })
        }

        function i(e, i) {
            t("body").off("tap.navigation-clear-selection"), t(window).off("scroll.navigation-clear-selection"), e.is(i) || t.contains(i[0], this) || s(i)
        }

        function s(e, i) {
            e.find("li.hover").each(function() {
                var e;
                i && (e = t(this), e.find("[data-selected-item]").length > 0 || e.is("[data-selected-item]")) || t(this).removeClass("hover")
            })
        }

        function o(t, e) {
            if (e.parentsUntil("ul.dorpdown-menu").filter("li").length > 0) {
                var i = e.children("ul"),
                    s = i.length && e.offset().left + e.width() + 300 > window.innerWidth,
                    o = i.length && e.closest(".open-reverse").length;
                s || o ? i.addClass("open-reverse") : i.length && i.removeClass("open-reverse")
            }
        }

        function n(e) {
            var i = e;
            t.fn.scrollSpy && i.find("a").scrollSpy({
                onChange: function() {
                    i.find(".current-menu-item,.current_page_item").removeClass("current-menu-item current_page_item"), t(this).closest("li").addClass("current-menu-item")
                },
                onLeave: function() {
                    t(this).closest("li").removeClass("current-menu-item current_page_item")
                },
                smoothScrollAnchor: !0,
                offset: function() {
                    var e = t(".navigation-bar.fixto-fixed");
                    return e.length ? e[0].getBoundingClientRect().height : 0
                }
            }), t(window).trigger("smoothscroll.update")
        }
        t.event.special.tap || (t.event.special.tap = {
            setup: function(e, i) {
                t(this).bind("touchstart", t.event.special.tap.handler).bind("touchmove", t.event.special.tap.handler).bind("touchend", t.event.special.tap.handler)
            },
            teardown: function(e) {
                t(this).unbind("touchstart", t.event.special.tap.handler).unbind("touchmove", t.event.special.tap.handler).unbind("touchend", t.event.special.tap.handler)
            },
            handler: function(e) {
                var i = t(this);
                i.data(e.type, 1), "touchend" !== e.type || i.data("touchmove") ? i.data("touchend") && i.removeData("touchstart touchmove touchend") : (e.type = "tap", t.event.handle.apply(this, arguments))
            }
        }), t("ul.dropdown-menu").each(function() {
            var a = t(this);
            if (a.hasClass("mobile-menu")) {
                var r = t('<a href="#" data-menu-toggler="">Menu</a>');
                a.before(r), r.click(function() {
                    r.hasClass("opened") ? (a.slideUp(300, function() {
                        a.css("display", "")
                    }), a.removeClass("mobile-menu"), r.removeClass("opened")) : (r.addClass("opened"), a.slideDown(), a.addClass("mobile-menu"), s(a), e(a))
                })
            }
            t("");
            a.on("tap.navigation", "li.menu-item > a, li.page_item > a", function(n) {
                var r, h, l = t(this),
                    c = l.parent();
                if (c.children("ul").length)
                    if (c.is("[data-selected-item]")) {
                        var d = l.attr("href");
                        if (0 === d.indexOf("#")) {
                            var u = d.replace("#", "").trim();
                            if (!u || !t("#" + u).length) return
                        }
                        e(a)
                    } else h = c, e(r = a), h.attr("data-selected-item", !0), s(r, h), h.addClass("hover"), o(0, h), t("body").on("tap.navigation-clear-selection", "*", function() {
                        i(jQuery(this), r)
                    }), t(window).on("scroll.navigation-clear-selection", function() {
                        i(jQuery(this), r)
                    }), n.preventDefault(), n.stopPropagation();
                else n.stopPropagation(), e(a)
            }), a.on("mouseover.navigation", "li", function() {
                a.find("li.hover").removeClass("hover"), o(0, t(this))
            }), n(a)
        }), t(function() {
            window.wp && window.wp.customize && (jQuery(".offcanvas_menu").find("li > ul").eq(0).each(function() {
                jQuery(this).show(), jQuery(this).parent().addClass("open")
            }), window.wp.customize.selectiveRefresh.bind("render-partials-response", function(e) {
                Object.getOwnPropertyNames(e.contents).filter(function(t) {
                    return -1 !== t.indexOf("nav_menu_instance[")
                }).length && setTimeout(function() {
                    t("ul.dropdown-menu").each(function() {
                        n(t(this))
                    })
                }, 1e3)
            }))
        })
    }(jQuery), window.mesmerizeMenuSticky = function() {
    var t = jQuery,
        e = "data-sticky";

    function i(t) {
        return t ? e + "-" + t : e
    }
    var s = t("[" + e + "]");
    s.each(function(e, s) {
        var o = t(s);
        if (!o.data("stickData")) {
            var n = parseInt(o.attr(i())),
                a = "1" == o.attr(i("mobile")),
                r = "1" == o.attr(i("shrinked")),
                h = "bottom" == o.attr(i("to")),
                l = "1" == o.attr(i("always"));
            l && o.addClass("fixto-fixed"), r && o.attr(i(), "initial");
            var c = {
                center: !0,
                responsiveWidth: !0,
                zIndex: 1e4 + e,
                topSpacing: n,
                stickyOnMobile: a,
                stickyOnTablet: !0,
                useShrink: r,
                toBottom: h,
                useNativeSticky: !1,
                always: l
            };
            r || (0 === n && jQuery("#wpadminbar").length && "absolute" === jQuery("#wpadminbar").css("position") && (n = 0), c.topSpacing = n, c.top = n, o.data("stickData", c), o.fixTo("body", c))
        }
    });
    var o = function() {
        var e = this.$els;
        window.innerWidth < 1024 ? e.each(function(e, i) {
            var s = t(this).data(),
                o = s.stickData;
            if (o) {
                var n = s.fixtoInstance;
                if (!n) return !0;
                window.innerWidth <= 767 ? o.stickyOnMobile || n.stop() : o.stickyOnTablet || n.stop()
            }
        }) : e.each(function(e, i) {
            var s = t(this).data();
            if (s) {
                var o = s.fixtoInstance;
                if (!o) return !0;
                o.start()
            }
        })
    }.bind({
        $els: s
    });
    t(window).bind("resize.sticky orientationchange.sticky", function() {
        setTimeout(o, 50)
    }), t(window).trigger("resize.sticky")
}, jQuery(document).ready(function(t) {
    mesmerizeMenuSticky()
}),
    function(t) {
        function e(t, e) {
            var i = jQuery(t),
                s = mesmerize_video_background.getVideoRect();
            i.css({
                width: Math.round(s.width),
                "max-width": Math.round(s.width),
                height: Math.round(s.height),
                opacity: 1,
                left: s.left
            })
        }
        window.addEventListener("resize", function() {
            var t = document.querySelector("video#wp-custom-header-video") || document.querySelector("iframe#wp-custom-header-video");
            t && (e(t), mesmerize_video_background.resizePoster())
        }), jQuery(function() {
            var t = document.querySelector("video#wp-custom-header-video") || document.querySelector("iframe#wp-custom-header-video");
            t && e(t)
        }), __cpVideoElementFirstPlayed = !1, document.addEventListener("wp-custom-header-video-loaded", function() {
            var t = document.querySelector("video#wp-custom-header-video");
            t ? e(t) : document.querySelector("#wp-custom-header") && document.querySelector("#wp-custom-header").addEventListener("play", function() {
                var t = document.querySelector("iframe#wp-custom-header-video"),
                    i = document.querySelector("video#wp-custom-header-video") || t;
                i && !__cpVideoElementFirstPlayed && (__cpVideoElementFirstPlayed = !0, e(i)),
                    function() {
                        for (var t in wp.customHeader.handlers) {
                            var e = wp.customHeader.handlers[t];
                            if (e.settings) return e
                        }
                    }().play()
            })
        })
    }(jQuery),
    function(t) {
        "ontouchstart" in window && (document.documentElement.className = document.documentElement.className + " touch-enabled"), navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/i) && (document.documentElement.className = document.documentElement.className + " no-parallax");
        var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t, e) {
            window.setTimeout(t, 1e3 / 60)
        };
        window.requestInterval = function(t, i, s) {
            if (!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame)) return window.setInterval(t, i);
            var o = (new Date).getTime(),
                n = {};
            return n.value = e(function a() {
                var r = (new Date).getTime() - o;
                r >= i && (t.call(), o = (new Date).getTime()), n.value = e(a), r >= i && s && !0 === s.call() && clearRequestInterval(n)
            }), n
        }, window.clearRequestInterval = function(t) {
            window.cancelAnimationFrame ? window.cancelAnimationFrame(t.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(t.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(t.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(t.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(t.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(t.value) : clearInterval(t)
        }, t.event.special.tap || (t.event.special.tap = {
            setup: function(e, i) {
                t(this).bind("touchstart", t.event.special.tap.handler).bind("touchmove", t.event.special.tap.handler).bind("touchend", t.event.special.tap.handler)
            },
            teardown: function(e) {
                t(this).unbind("touchstart", t.event.special.tap.handler).unbind("touchmove", t.event.special.tap.handler).unbind("touchend", t.event.special.tap.handler)
            },
            handler: function(e) {
                var i = t(this);
                i.data(e.type, 1), "touchend" !== e.type || i.data("touchmove") ? i.data("touchend") && i.removeData("touchstart touchmove touchend") : (e.type = "tap", t.event.handle.apply(this, arguments))
            }
        }), t.fn.isInView || (t.fn.isInView = function(e) {
            var i = t(window).scrollTop(),
                s = i + t(window).height(),
                o = t(this).offset().top,
                n = o + t(this).height();
            return !0 === e ? i < o && s > n : o <= s && n >= i
        }), t.throttle || (t.throttle = function(t, e, i) {
            var s, o;
            return e || (e = 250),
                function() {
                    var n = i || this,
                        a = +new Date,
                        r = arguments;
                    s && a < s + e ? (clearTimeout(o), o = setTimeout(function() {
                        s = a, t.apply(n, r)
                    }, e)) : (s = a, t.apply(n, r))
                }
        }), t.debounce || (t.debounce = function(t, e, i) {
            var s;
            return function() {
                var o = this,
                    n = arguments,
                    a = i && !s;
                clearTimeout(s), s = setTimeout(function() {
                    s = null, i || t.apply(o, n)
                }, e), a && t.apply(o, n)
            }
        })
    }(jQuery),
    function(t) {
        if (window.mesmerize_smooth_scroll && window.mesmerize_smooth_scroll.enabled) {
            var e = !0,
                i = null,
                s = null,
                o = 10,
                n = 10,
                a = 100,
                r = 0;
            t(window).load(function(t) {
                window.addEventListener && window.addEventListener("DOMMouseScroll", h, !1), window.onmousewheel = document.onmousewheel = h
            })
        }

        function h(h) {
            var l, c = 0;
            return h.wheelDelta ? c = h.wheelDelta / 120 : h.detail && (c = -h.detail / 3), 0 === window.scrollY && c > 0 || (window.innerHeight + window.scrollY >= document.body.offsetHeight && c < 0 || (l = c, l = Math.sign(l) * parseInt(Math.min(Math.abs(l, 10))), null === i && (i = t(window).scrollTop()), i -= a * l, e = l > 0, t("body").on("mousedown.wheelscroll", "a", function(e) {
                s && (clearRequestInterval(s), s = null, i = null, t("body").off("mousedown.wheelscroll"))
            }), null === s && (s = requestInterval(function() {
                var e = t(window).scrollTop();
                r = Math.round((i - e) / n), t(window).scrollTop(e + r)
            }, o, function() {
                var o = t(window).scrollTop();
                return !!(o <= 0 && e || o >= t(window).prop("scrollHeight") - t(window).height() || e && r > -1 || !e && r < 1) && (s = null, i = null, !0)
            })), h.preventDefault && h.preventDefault(), void(h.returnValue = !1)))
        }
    }(jQuery), mesmerizeDomReady(function(t) {
    if (window.mesmerize_backstretch) {
        window.mesmerize_backstretch.duration = parseInt(window.mesmerize_backstretch.duration), window.mesmerize_backstretch.transitionDuration = parseInt(window.mesmerize_backstretch.transitionDuration);
        var e = mesmerize_backstretch.images;
        if (!e) return;
        t(".header-homepage, .header").backstretch(e, mesmerize_backstretch)
    }
    if (t.fn.smoothScrollAnchor) {
        var i = t("body");
        t(".header-homepage-arrow-c .header-homepage-arrow").smoothScrollAnchor({
            target: i.find("[data-id]").length ? i.find("[data-id]").first() : i.find(".page-content, .content").eq(0),
            targetSel: i.find("[data-id]").length ? "[data-id]:first" : ".page-content, .content",
            offset: function() {
                var e = t(".navigation-bar.fixto-fixed");
                return e.length ? e[0].getBoundingClientRect().height : 0
            }
        })
    }
}), mesmerizeDomReady(function(t) {
    var e = !1,
        i = t(".post-list.row");

    function s() {
        if (!e) {
            e = !0, i.find("img").each(function() {
                this.onload = n, setTimeout(function() {
                    i.data().masonry.layout()
                }, 500)
            });
            var s = t(".post-list.row .post-list-item"),
                o = s.length - 1;
            s.each(function() {
                t(this).css({
                    width: t(this).css("max-width")
                })
            }), i.length && i.masonry({
                itemSelector: ".post-list-item",
                percentPosition: !0,
                columnWidth: "." + s.eq(o).attr("data-masonry-width")
            })
        }

        function n() {
            i.data().masonry.layout()
        }
    }
    i.is("[data-no-masonry]") || (window.innerWidth >= 768 && s(), t(window).resize(function() {
        window.innerWidth >= 768 ? s() : i.data("masonry") && i.masonry("destroy")
    }))
}),
    function(t) {
        function e(t, e) {
            t.offset().top + t.outerHeight() >= e.offset().top + e.height() ? t.css("visibility", "visible") : t.css("visibility", "")
        }

        function i(t, i) {
            i.css("margin-bottom", t.outerHeight() - 1), e(t, i)
        }
        window.mesmerizeFooterParalax = function() {
            var s = t(".footer.paralax");
            if (s.length) {
                if (s.parents(".no-parallax").length) return void s.css("visibility", "visible");
                t(".header-wrapper").css("z-index", 1);
                var o = s.prev();
                o.addClass("footer-shadow"), o.css({
                    position: "relative",
                    "z-index": 1
                }), t(window).bind("resize.footerParalax", function() {
                    i(s, o)
                }), mesmerizeDomReady(function() {
                    window.setTimeout(function() {
                        i(s, o)
                    }, 100)
                }), i(s, o), t(window).bind("scroll.footerParalax", function() {
                    e(s, o)
                })
            }
        }, window.mesmerizeStopFooterParalax = function() {
            var e = t(".footer").prev();
            t(".header-wrapper").css("z-index", 0), e.removeClass("footer-shadow"), e.css("margin-bottom", "0px"), t(window).unbind("resize.footerParalax"), t(window).unbind("scroll.footerParalax")
        }, mesmerizeFooterParalax()
    }(jQuery), mesmerizeDomReady(function(t) {
    var e = t("[data-text-effect]");
    t.fn.typed && e.length && JSON.parse(mesmerize_morph.header_text_morph) && e.each(function() {
        t(this).empty(), t(this).typed({
            strings: JSON.parse(t(this).attr("data-text-effect")),
            typeSpeed: parseInt(mesmerize_morph.header_text_morph_speed),
            loop: !0
        })
    })
}),
    function(t) {
        var e = t(".offcanvas_menu"),
            i = t("#offcanvas-wrapper");
        i.length && (t("html").addClass("has-offscreen"), i.appendTo("body"), i.on("kube.offcanvas.ready", function() {
            i.removeClass("force-hide")
        }), i.on("kube.offcanvas.open", function() {
            t("html").addClass("offcanvas-opened")
        }), i.on("kube.offcanvas.close", function() {
            t("html").removeClass("offcanvas-opened")
        })), e.each(function() {
            var e = t(this);
            e.on("mesmerize.open-all", function() {
                t(this).find(".menu-item-has-children, .page_item_has_children").each(function() {
                    t(this).addClass("open"), t(this).children("ul").slideDown(100)
                })
            }), e.find(".menu-item-has-children a, .page_item_has_children a").each(function() {
                0 === t(this).children("i.fa.arrow").length && t(this).append('<i class="fa arrow"></i>')
            }), e.on("click tap", ".menu-item-has-children > a, .page_item_has_children > a", function(e) {
                var i = t(this),
                    s = i.closest("li");
                if (e.stopPropagation(), 0 === s.children("ul").length) return t('[data-component="offcanvas"]').offcanvas("close"), !0;
                if (s.hasClass("open")) {
                    if (i.is("a")) return t('[data-component="offcanvas"]').offcanvas("close"), !0;
                    s.children("ul").slideUp(100, function() {
                        s.find("ul").each(function() {
                            t(this).parent().removeClass("open"), t(this).css("display", "none")
                        })
                    })
                } else s.children("ul").slideDown(100);
                s.toggleClass("open"), e.preventDefault()
            }), e.on("click tap", ".mesmerize-menu-cart", function(t) {
                t.stopPropagation()
            }), e.on("click tap", ".menu-item-has-children > a > .arrow, .page_item_has_children  > a > .arrow", function(e) {
                var i = t(this).closest("li");
                e.stopPropagation(), e.preventDefault(), i.toggleClass("open"), i.hasClass("open") ? i.children("ul").slideDown(100) : i.children("ul").slideUp(100)
            }), e.on("click tap", "a", function(e) {
                0 === t(this).closest("li").children("ul").length && t('[data-component="offcanvas"]').offcanvas("close")
            }), t.fn.scrollSpy && (e.find("a").each(function() {
                t(this).data("allow-propagation", !0)
            }), e.find("a > i").each(function() {
                t(this).data("allow-propagation", !1), t(this).data("skip-smooth-scroll", !0)
            }), e.find("a").scrollSpy({
                onChange: function() {
                    e.find(".current-menu-item,.current_page_item").removeClass("current-menu-item current_page_item"), t(this).closest("li").addClass("current-menu-item")
                },
                onLeave: function() {
                    t(this).closest("li").removeClass("current-menu-item current_page_item")
                },
                clickCallback: function() {
                    t('[data-component="offcanvas"]').offcanvas("close")
                },
                smoothScrollAnchor: !0,
                offset: function() {
                    return t(".navigation-bar.fixto-fixed").length ? t(".navigation-bar.fixto-fixed")[0].getBoundingClientRect().height : 0
                }
            }))
        }), t.fn.smoothScrollAnchor && (t("#page > .page-content > .content, #page >  .content").find("a[data-cp-link]").filter(function() {
            var e = t(this);
            return !e.is("[role=tab]") && !e.parent().is("[role=tab]")
        }).smoothScrollAnchor(), t("#page > .footer").find("a").filter(function() {
            var e = t(this);
            return !e.is("[role=tab]") && !e.parent().is("[role=tab]")
        }).smoothScrollAnchor())
    }(jQuery),
    function(t) {
        function e(e) {
            var i = e.find("[data-countup]"),
                s = i.text();
            s = jQuery.map(s.match(/[-]{0,1}[s\d.]*[\d]+/g), function(t) {
                return t
            }).join([]);
            var o = void 0 !== i.attr("data-max") ? i.attr("data-max") : 100,
                n = void 0 !== i.attr("data-min") ? i.attr("data-min") : 0;
            if (n > o) {
                var a = o;
                o = n, n = a
            }
            s || (s = n);
            var r = s / o * 100,
                h = e.find(".circle-bar"),
                l = h.attr("r"),
                c = Math.PI * (2 * l);
            r < 0 && (r = 0), r > 100 && (r = 100);
            var d = c * (100 - r) / 100;
            h.css({
                strokeDashoffset: d
            }), t(function() {
                wp && wp.customize || h.parent().height(h.parent().width())
            })
        }

        function i(t) {
            e(t), t.find("[data-countup]").bind("countup.update", function() {
                e(t)
            }), t.data("doCircle", function() {
                e(t)
            })
        }

        function s(t, e) {
            var i = void 0 !== t.attr("data-min") ? t.attr("data-min") : 0,
                o = t.attr("data-stop"),
                n = void 0 !== t.attr("data-max") ? t.attr("data-max") : 100,
                a = t.attr("data-prefix") || "",
                r = t.attr("data-suffix") || "",
                h = t.attr("data-duration") || 2e3,
                l = t.attr("data-decimals") || 0;
            void 0 !== o && (n = o);
            var c = "";
            try {
                var d = new CountUp(t[0], parseInt(i), parseInt(n), parseInt(l), parseInt(h) / 1e3, {
                    prefix: a,
                    suffix: r,
                    onUpdate: function(e) {
                        t.trigger("countup.update", [e])
                    }
                });
                c = d.options.formattingFn(parseInt(n))
            } catch (t) {
                console.error("invalid countup args", {
                    min: i,
                    max: n,
                    decimals: l,
                    duration: h,
                    suffix: r,
                    prefix: a
                })
            }
            t.data("countup", d), t.attr("data-max-computed", c), e && t.data("countup").reset(), (t.isInView(!0) || e) && t.data("countup").start(), t.data("restartCountUp", function() {
                s(t)
            })
        }
        t(".circle-counter").each(function() {
            i(t(this))
        });
        var o = t("[data-countup]");
        o.each(function() {
            s(t(this))
        }), t(window).on("scroll", function() {
            o.each(function() {
                var e = t(this);
                e.isInView(!0) && !e.data("one") && (e.data("countup").start(), e.data("one", !0))
            })
        }), t(function() {
            wp && wp.customize || t(window).on("resize", function() {
                t(".circle-counter .circle-svg").each(function() {
                    t(this).height(t(this).width())
                })
            })
        });
        try {
            parent.CP_Customizer && parent.CP_Customizer.addModule(function(e) {
                e.hooks.addAction("after_node_insert", function(e) {
                    e.is("[data-countup]") && (e.closest(".circle-counter").length && i(e.closest(".circle-counter")), s(e, !0)), e.find("[data-countup]").each(function() {
                        t(this).closest(".circle-counter").length && i(t(this).closest(".circle-counter")), s(t(this), !0)
                    })
                })
            })
        } catch (t) {}
    }(jQuery),
    function(t) {
        var e = function(e, i, s) {
            t("body").on("mouseover.ope-woo", function(o) {
                var n, a, r, h, l, c = t(o.target);
                (n = c, a = e, r = i, h = t.contains(r[0], n[0]) || n.is(r), l = t.contains(a[0], n[0]) || n.is(a), h || l || c.is(s)) || (t("body").off("mouseover.ope-woo"), e.fadeOut())
            })
        };

        function i(e, i) {
            if (!t("body").is(".woocommerce-cart") && !t("body").is(".woocommerce-checkout")) {
                var s = i.offset().top + i.outerHeight() - i.closest("div").offset().top;
                if (i.offset().left < e.outerWidth()) var o = i.offset().left + e.outerWidth() + 12;
                else o = i.offset().left + i.width() + 5;
                e.css({
                    position: "absolute",
                    "z-index": "100000",
                    top: s,
                    left: o
                }), e.fadeIn()
            }
        }var fixto = function(t, e, i) {
            var s, o = (s = {
                    getAll: function(t) {
                        return i.defaultView.getComputedStyle(t)
                    },
                    get: function(t, e) {
                        return this.getAll(t)[e]
                    },
                    toFloat: function(t) {
                        return parseFloat(t, 10) || 0
                    },
                    getFloat: function(t, e) {
                        return this.toFloat(this.get(t, e))
                    },
                    _getAllCurrentStyle: function(t) {
                        return t.currentStyle
                    }
                }, i.documentElement.currentStyle && (s.getAll = s._getAllCurrentStyle), s),
                n = function() {
                    function e(t) {
                        this.element = t, this.replacer = i.createElement("div"), this.replacer.style.visibility = "hidden", this.hide(), t.parentNode.insertBefore(this.replacer, t)
                    }
                    return e.prototype = {
                        replace: function() {
                            var t = this.replacer.style,
                                e = o.getAll(this.element);
                            t.width = this._width(), t.height = this._height(), t.marginTop = e.marginTop, t.marginBottom = e.marginBottom, t.marginLeft = e.marginLeft, t.marginRight = e.marginRight, t.cssFloat = e.cssFloat, t.styleFloat = e.styleFloat, t.position = e.position, t.top = e.top, t.right = e.right, t.bottom = e.bottom, t.left = e.left, t.display = e.display
                        },
                        hide: function() {
                            this.replacer.style.display = "none"
                        },
                        _width: function() {
                            return this.element.getBoundingClientRect().width + "px"
                        },
                        _widthOffset: function() {
                            return this.element.offsetWidth + "px"
                        },
                        _height: function() {
                            return jQuery(this.element).outerHeight() + "px"
                        },
                        _heightOffset: function() {
                            return this.element.offsetHeight + "px"
                        },
                        destroy: function() {
                            t(this.replacer).remove();
                            for (var e in this) this.hasOwnProperty(e) && (this[e] = null)
                        }
                    }, i.documentElement.getBoundingClientRect().width || (e.prototype._width = e.prototype._widthOffset, e.prototype._height = e.prototype._heightOffset), {
                        MimicNode: e,
                        computedStyle: o
                    }
                }();

            function a() {
                this._vendor = null
            }
            a.prototype = {
                _vendors: {
                    webkit: {
                        cssPrefix: "-webkit-",
                        jsPrefix: "Webkit"
                    },
                    moz: {
                        cssPrefix: "-moz-",
                        jsPrefix: "Moz"
                    },
                    ms: {
                        cssPrefix: "-ms-",
                        jsPrefix: "ms"
                    },
                    opera: {
                        cssPrefix: "-o-",
                        jsPrefix: "O"
                    }
                },
                _prefixJsProperty: function(t, e) {
                    return t.jsPrefix + e[0].toUpperCase() + e.substr(1)
                },
                _prefixValue: function(t, e) {
                    return t.cssPrefix + e
                },
                _valueSupported: function(t, e, i) {
                    try {
                        return i.style[t] = e, i.style[t] === e
                    } catch (t) {
                        return !1
                    }
                },
                propertySupported: function(t) {
                    return void 0 !== i.documentElement.style[t]
                },
                getJsProperty: function(t) {
                    if (this.propertySupported(t)) return t;
                    if (this._vendor) return this._prefixJsProperty(this._vendor, t);
                    var e;
                    for (var i in this._vendors)
                        if (e = this._prefixJsProperty(this._vendors[i], t), this.propertySupported(e)) return this._vendor = this._vendors[i], e;
                    return null
                },
                getCssValue: function(t, e) {
                    var s, o = i.createElement("div"),
                        n = this.getJsProperty(t);
                    if (this._valueSupported(n, e, o)) return e;
                    if (this._vendor && (s = this._prefixValue(this._vendor, e), this._valueSupported(n, s, o))) return s;
                    for (var a in this._vendors)
                        if (s = this._prefixValue(this._vendors[a], e), this._valueSupported(n, s, o)) return this._vendor = this._vendors[a], s;
                    return null
                }
            };
            var r, h = new a,
                l = h.getJsProperty("transform");
            var c, d = h.getCssValue("position", "sticky"),
                u = h.getCssValue("position", "fixed");

            function p(e, i, s) {
                this.child = e, this._$child = t(e), this.parent = i, this.options = {
                    className: "fixto-fixed",
                    top: 0
                }, this._setOptions(s)
            }

            function f(t, e, i) {
                p.call(this, t, e, i), this._replacer = new n.MimicNode(t), this._ghostNode = this._replacer.replacer, this._saveStyles(), this._saveViewportHeight(), this._proxied_onscroll = this._bind(this._onscroll, this), this._proxied_onresize = this._bind(this._onresize, this), this.start()
            }

            function m(t, e, i) {
                p.call(this, t, e, i), this.start()
            }
            "Microsoft Internet Explorer" === navigator.appName && (c = parseFloat(navigator.appVersion.split("MSIE")[1])), p.prototype = {
                _mindtop: function() {
                    var t = 0;
                    if (this._$mind)
                        for (var e, i, s = 0, n = this._$mind.length; s < n; s++)
                            if ((i = (e = this._$mind[s]).getBoundingClientRect()).height) t += i.height;
                            else {
                                var a = o.getAll(e);
                                t += e.offsetHeight + o.toFloat(a.marginTop) + o.toFloat(a.marginBottom)
                            }
                    return t
                },
                stop: function() {
                    this._stop(), this._running = !1
                },
                start: function() {
                    this._running || (this._start(), this._running = !0)
                },
                destroy: function() {
                    this.stop(), this._destroy(), this._$child.removeData("fixto-instance");
                    for (var t in this) this.hasOwnProperty(t) && (this[t] = null)
                },
                _setOptions: function(e) {
                    t.extend(this.options, e), this.options.mind && (this._$mind = t(this.options.mind)), this.options.zIndex && (this.child.style.zIndex = this.options.zIndex)
                },
                setOptions: function(t) {
                    this._setOptions(t), this.refresh()
                },
                _stop: function() {},
                _start: function() {},
                _destroy: function() {},
                refresh: function() {}
            }, f.prototype = new p, t.extend(f.prototype, {
                _bind: function(t, e) {
                    return function() {
                        return t.call(e)
                    }
                },
                _toresize: 8 === c ? i.documentElement : e,
                _onscroll: function() {
                    if (this._scrollTop = i.documentElement.scrollTop || i.body.scrollTop, this._parentBottom = this.parent.offsetHeight + this._fullOffset("offsetTop", this.parent), this.fixed) {
                        if (this.options.toBottom) {
                            if (this._scrollTop >= this._fullOffset("offsetTop", this._ghostNode)) return void this._unfix()
                        } else if (this._scrollTop > this._parentBottom || this._scrollTop <= this._fullOffset("offsetTop", this._ghostNode) - this.options.top - this._mindtop()) return void this._unfix();
                        this._adjust()
                    } else {
                        var t = o.getAll(this.child);
                        (this._scrollTop < this._parentBottom && this._scrollTop > this._fullOffset("offsetTop", this.child) - this.options.top - this._mindtop() && this._viewportHeight > this.child.offsetHeight + o.toFloat(t.marginTop) + o.toFloat(t.marginBottom) || this.options.toBottom) && (this._fix(), this._adjust())
                    }
                },
                _adjust: function() {
                    var e = 0,
                        i = this._mindtop(),
                        s = 0,
                        n = o.getAll(this.child),
                        a = null;
                    if (r && (a = this._getContext()) && (e = Math.abs(a.getBoundingClientRect().top)), (s = this._parentBottom - this._scrollTop - (this.child.offsetHeight + o.toFloat(n.marginBottom) + i + this.options.top)) > 0 && (s = 0), this.options.toBottom);
                    else {
                        var h = this.options.top;
                        0 === h && (h = t("body").offset().top), this.child.style.top = Math.round(s + i + e + h - o.toFloat(n.marginTop)) + "px"
                    }
                },
                _fullOffset: function(t, e, i) {
                    for (var s = e[t], o = e.offsetParent; null !== o && o !== i;) s += o[t], o = o.offsetParent;
                    return s
                },
                _getContext: function() {
                    for (var t, e = this.child, s = null; !s;) {
                        if ((t = e.parentNode) === i.documentElement) return null;
                        if ("none" !== o.getAll(t)[l]) {
                            s = t;
                            break
                        }
                        e = t
                    }
                    return s
                },
                _fix: function() {
                    var e = this.child,
                        s = e.style,
                        n = o.getAll(e),
                        a = e.getBoundingClientRect().left,
                        h = n.width;
                    if (this.options._original, this._saveStyles(), i.documentElement.currentStyle && (h = e.offsetWidth, "border-box" !== n.boxSizing && (h -= o.toFloat(n.paddingLeft) + o.toFloat(n.paddingRight) + o.toFloat(n.borderLeftWidth) + o.toFloat(n.borderRightWidth)), h += "px"), r) {
                        this._getContext();
                        a = this._$child.offset().left
                    }
                    if (this._replacer.replace(), s.left = a - o.toFloat(n.marginLeft) + "px", s.width = h, s.position = "fixed", this.options.toBottom) s.top = "", s.bottom = this.options.top + o.toFloat(n.marginBottom) + "px";
                    else {
                        s.bottom = "";
                        var l = this.options.top;
                        0 === l && (l = t("body").offset().top), s.top = this._mindtop() + l - o.toFloat(n.marginTop) + "px"
                    }
                    this._$child.addClass(this.options.className), this.fixed = !0, this._$child.trigger("fixto-added")
                },
                _unfix: function() {
                    var t = this.child.style;
                    this._replacer.hide(), t.position = this._childOriginalPosition, t.top = this._childOriginalTop, t.bottom = this._childOriginalBottom, t.width = this._childOriginalWidth, t.left = this._childOriginalLeft, this.options.always || (this._$child.removeClass(this.options.className), this._$child.trigger("fixto-removed")), this.fixed = !1
                },
                _saveStyles: function() {
                    var t = this.child.style;
                    this._childOriginalPosition = t.position, this.options.toBottom ? (this._childOriginalTop = "", this._childOriginalBottom = t.bottom) : (this._childOriginalTop = t.top, this._childOriginalBottom = ""), this._childOriginalWidth = t.width, this._childOriginalLeft = t.left
                },
                _onresize: function() {
                    this.refresh()
                },
                _saveViewportHeight: function() {
                    this._viewportHeight = e.innerHeight || i.documentElement.clientHeight
                },
                _stop: function() {
                    this._unfix(), t(e).unbind("scroll.fixto mousewheel", this._proxied_onscroll), t(this._toresize).unbind("resize.fixto", this._proxied_onresize)
                },
                _start: function() {
                    this._onscroll(), t(e).bind("scroll.fixto mousewheel", this._proxied_onscroll), t(this._toresize).bind("resize.fixto", this._proxied_onresize)
                },
                _destroy: function() {
                    this._replacer.destroy()
                },
                refresh: function() {
                    this._saveViewportHeight(), this._unfix(), this._onscroll()
                }
            }), m.prototype = new p, t.extend(m.prototype, {
                _start: function() {
                    var t = o.getAll(this.child);
                    this._childOriginalPosition = t.position, this._childOriginalTop = t.top, this.child.style.position = d, this.refresh()
                },
                _stop: function() {
                    this.child.style.position = this._childOriginalPosition, this.child.style.top = this._childOriginalTop
                },
                refresh: function() {
                    this.child.style.top = this._mindtop() + this.options.top + "px"
                }
            });
            var g = function(t, e, s) {
                return d && !s || d && s && !1 !== s.useNativeSticky ? new m(t, e, s) : u ? (void 0 === r && (o = !1, n = i.createElement("div"), a = i.createElement("div"), n.appendChild(a), n.style[l] = "translate(0)", n.style.marginTop = "10px", n.style.visibility = "hidden", a.style.position = "fixed", a.style.top = 0, i.body.appendChild(n), a.getBoundingClientRect().top > 0 && (o = !0), i.body.removeChild(n), r = o), new f(t, e, s)) : "Neither fixed nor sticky positioning supported";
                var o, n, a
            };
            return c < 8 && (g = function() {
                return "not supported"
            }), t.fn.fixTo = function(e, i) {
                var s = t(e),
                    o = 0;
                return this.each(function() {
                    var n = t(this).data("fixto-instance");
                    n ? n[e].call(n, i) : t(this).data("fixto-instance", g(this, s[o], i));
                    o++
                })
            }, {
                FixToContainer: f,
                fixTo: g,
                computedStyle: o,
                mimicNode: n
            }
        }(window.jQuery, window, document);
        ! function(t, e, i) {
            "use strict";
            var s = /^.*(youtu\.be\/|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtube\.com\/watch\?.*\&v=)([^#\&\?]*).*/i;
            t.fn.backstretch = function(s, o) {
                var n, a = arguments;
                return 0 === t(e).scrollTop() && e.scrollTo(0, 0), this.each(function(e) {
                    var r = t(this),
                        h = r.data("backstretch");
                    if (h) {
                        if ("string" == typeof a[0] && "function" == typeof h[a[0]]) {
                            var l = h[a[0]].apply(h, Array.prototype.slice.call(a, 1));
                            return l === h && (l = i), void(l !== i && ((n = n || [])[e] = l))
                        }
                        o = t.extend(h.options, o), h.hasOwnProperty("destroy") && h.destroy(!0)
                    }
                    if (!s || s && 0 === s.length) {
                        var c = r.css("background-image");
                        c && "none" !== c ? s = [{
                            url: r.css("backgroundImage").replace(/url\(|\)|"|'/g, "")
                        }] : t.error("No images were supplied for Backstretch, or element must have a CSS-defined background image.")
                    }
                    h = new v(this, s, o || {}), r.data("backstretch", h)
                }), n ? 1 === n.length ? n[0] : n : this
            }, t.backstretch = function(e, i) {
                return t("body").backstretch(e, i).data("backstretch")
            }, t.expr[":"].backstretch = function(e) {
                return t(e).data("backstretch") !== i
            }, t.fn.backstretch.defaults = {
                duration: 5e3,
                transition: "fade",
                transitionDuration: 0,
                animateFirst: !0,
                alignX: .5,
                alignY: .5,
                paused: !1,
                start: 0,
                preload: 2,
                preloadSize: 1,
                resolutionRefreshRate: 2500,
                resolutionChangeRatioThreshold: .1
            };
            var o, n, a, r, h, l, c = {
                    wrap: {
                        left: 0,
                        top: 0,
                        overflow: "hidden",
                        margin: 0,
                        padding: 0,
                        height: "100%",
                        width: "100%",
                        zIndex: -999999
                    },
                    itemWrapper: {
                        position: "absolute",
                        display: "none",
                        margin: 0,
                        padding: 0,
                        border: "none",
                        width: "100%",
                        height: "100%",
                        zIndex: -999999
                    },
                    item: {
                        position: "absolute",
                        margin: 0,
                        padding: 0,
                        border: "none",
                        width: "100%",
                        height: "100%",
                        maxWidth: "none"
                    }
                },
                d = (o = function(t) {
                    for (var e = 1; e < t.length; e++) {
                        for (var i = t[e], s = e; t[s - 1] && parseInt(t[s - 1].width, 10) > parseInt(i.width, 10);) t[s] = t[s - 1], --s;
                        t[s] = i
                    }
                    return t
                }, n = function(t, i, s) {
                    for (var o, n, a = e.devicePixelRatio || 1, r = S(), h = (A(), i > t ? "portrait" : t > i ? "landscape" : "square"), l = 0, c = 0; c < s.length && ("string" == typeof(n = s[c]) && (n = s[c] = {
                        url: n
                    }), n.pixelRatio && "auto" !== n.pixelRatio && parseFloat(n.pixelRatio) !== a || n.deviceOrientation && n.deviceOrientation !== r || n.windowOrientation && n.windowOrientation !== r || n.orientation && n.orientation !== h || (l = c, o = t, "auto" === n.pixelRatio && (t *= a), !(n.width >= o))); c++);
                    return s[Math.min(c, l)]
                }, a = function(t, e) {
                    if ("string" == typeof t) t = t.replace(/{{(width|height)}}/g, e);
                    else if (t instanceof Array)
                        for (var i = 0; i < t.length; i++) t[i].src ? t[i].src = a(t[i].src, e) : t[i] = a(t[i], e);
                    return t
                }, function(e, i) {
                    for (var s = e.width(), r = e.height(), h = [], l = function(t, e) {
                        return "width" === e ? s : "height" === e ? r : t
                    }, c = 0; c < i.length; c++)
                        if (t.isArray(i[c])) {
                            i[c] = o(i[c]);
                            var d = n(s, r, i[c]);
                            h.push(d)
                        } else {
                            "string" == typeof i[c] && (i[c] = {
                                url: i[c]
                            });
                            var u = t.extend({}, i[c]);
                            u.url = a(u.url, l), h.push(u)
                        }
                    return h
                }),
                u = function(t) {
                    return s.test(t.url) || t.isVideo
                },
                p = (r = [], h = function(t) {
                    for (var e = 0; e < r.length; e++)
                        if (r[e].src === t.src) return r[e];
                    return r.push(t), t
                }, l = function(t, e, i) {
                    "function" == typeof e && e.call(t, i)
                }, function e(i, s, o, n, a) {
                    if (void 0 !== i) {
                        t.isArray(i) || (i = [i]), arguments.length < 5 && "function" == typeof arguments[arguments.length - 1] && (a = arguments[arguments.length - 1]), s = "function" != typeof s && s ? s : 0, o = "function" == typeof o || !o || o < 0 ? i.length : Math.min(o, i.length), n = "function" != typeof n && n ? n : 1, s >= i.length && (s = 0, o = 0), n < 0 && (n = o), n = Math.min(n, o);
                        var r = i.slice(s + n, o - n);
                        if (i = i.slice(s, n), o = i.length)
                            for (var c, d = 0, p = function() {
                                ++d === o && (l(i, a, !r), e(r, 0, 0, n, a))
                            }, f = 0; f < i.length; f++) u(i[f]) || ((c = new Image).src = i[f].url, (c = h(c)).complete ? p() : t(c).on("load error", p));
                        else l(i, a, !0)
                    }
                }),
                f = function(e) {
                    for (var i = [], s = 0; s < e.length; s++) "string" == typeof e[s] ? i.push({
                        url: e[s]
                    }) : t.isArray(e[s]) ? i.push(f(e[s])) : i.push(m(e[s]));
                    return i
                },
                m = function(t, s) {
                    return (t.centeredX || t.centeredY) && (e.console && e.console.log && e.console.log("jquery.backstretch: `centeredX`/`centeredY` is deprecated, please use `alignX`/`alignY`"), t.centeredX && (t.alignX = .5), t.centeredY && (t.alignY = .5)), t.speed !== i && (e.console && e.console.log && e.console.log("jquery.backstretch: `speed` is deprecated, please use `transitionDuration`"), t.transitionDuration = t.speed, t.transition = "fade"), t.resolutionChangeRatioTreshold !== i && (e.console.log("jquery.backstretch: `treshold` is a typo!"), t.resolutionChangeRatioThreshold = t.resolutionChangeRatioTreshold), t.fadeFirst !== i && (t.animateFirst = t.fadeFirst), t.fade !== i && (t.transitionDuration = t.fade, t.transition = "fade"), g(t)
                },
                g = function(t, e) {
                    return "left" === t.alignX ? t.alignX = 0 : "center" === t.alignX ? t.alignX = .5 : "right" === t.alignX ? t.alignX = 1 : (t.alignX !== i || e) && (t.alignX = parseFloat(t.alignX), isNaN(t.alignX) && (t.alignX = .5)), "top" === t.alignY ? t.alignY = 0 : "center" === t.alignY ? t.alignY = .5 : "bottom" === t.alignY ? t.alignY = 1 : (t.alignX !== i || e) && (t.alignY = parseFloat(t.alignY), isNaN(t.alignY) && (t.alignY = .5)), t
                },
                v = function(i, s, o) {
                    this.options = t.extend({}, t.fn.backstretch.defaults, o || {}), this.firstShow = !0, m(this.options, !0), this.images = f(t.isArray(s) ? s : [s]), this.options.paused && (this.paused = !0), this.options.start >= this.images.length && (this.options.start = this.images.length - 1), this.options.start < 0 && (this.options.start = 0), this.isBody = i === document.body;
                    var n = t(e);
                    this.$container = t(i), this.$root = this.isBody ? P ? n : t(document) : this.$container, this.originalImages = this.images, this.images = d(this.options.alwaysTestWindowResolution ? n : this.$root, this.originalImages), p(this.images, this.options.start || 0, this.options.preload || 1);
                    var a = this.$container.children(".backstretch").first();
                    if (this.$wrap = a.length ? a : t('<div class="backstretch"></div>').css(this.options.bypassCss ? {} : c.wrap).appendTo(this.$container), !this.options.bypassCss) {
                        if (!this.isBody) {
                            var r = this.$container.css("position"),
                                h = this.$container.css("zIndex");
                            this.$container.css({
                                position: "static" === r ? "relative" : r,
                                zIndex: "auto" === h ? 0 : h
                            }), this.$wrap.css({
                                zIndex: -999998
                            })
                        }
                        this.$wrap.css({
                            position: this.isBody && P ? "fixed" : "absolute"
                        })
                    }
                    this.index = this.options.start, this.show(this.index), n.on("resize.backstretch", t.proxy(this.resize, this)).on("orientationchange.backstretch", t.proxy(function() {
                        this.isBody && 0 === e.pageYOffset && (e.scrollTo(0, 1), this.resize())
                    }, this))
                };
            v.prototype = {
                resize: function() {
                    try {
                        var s = this.options.alwaysTestWindowResolution ? t(e) : this.$root,
                            o = s.width(),
                            n = s.height(),
                            a = o / (this._lastResizeContainerWidth || 0),
                            r = n / (this._lastResizeContainerHeight || 0),
                            h = this.options.resolutionChangeRatioThreshold || 0;
                        if ((o !== this._lastResizeContainerWidth || n !== this._lastResizeContainerHeight) && (Math.abs(a - 1) >= h || isNaN(a) || Math.abs(r - 1) >= h || isNaN(r)) && (this._lastResizeContainerWidth = o, this._lastResizeContainerHeight = n, this.images = d(s, this.originalImages), this.options.preload && p(this.images, (this.index + 1) % this.images.length, this.options.preload), 1 === this.images.length && this._currentImage.url !== this.images[0].url)) {
                            var l = this;
                            clearTimeout(l._selectAnotherResolutionTimeout), l._selectAnotherResolutionTimeout = setTimeout(function() {
                                l.show(0)
                            }, this.options.resolutionRefreshRate)
                        }
                        var c = {
                                left: 0,
                                top: 0,
                                right: "auto",
                                bottom: "auto"
                            },
                            u = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                            f = this.isBody ? e.innerHeight ? e.innerHeight : this.$root.height() : this.$root.innerHeight(),
                            m = u,
                            g = m / this.$itemWrapper.data("ratio"),
                            v = t.Event("backstretch.resize", {
                                relatedTarget: this.$container[0]
                            }),
                            y = this._currentImage.alignX === i ? this.options.alignX : this._currentImage.alignX,
                            w = this._currentImage.alignY === i ? this.options.alignY : this._currentImage.alignY;
                        g >= f ? c.top = -(g - f) * w : (((m = (g = f) * this.$itemWrapper.data("ratio")) - u) / 2, c.left = -(m - u) * y), this.options.bypassCss || this.$wrap.css({
                            width: u,
                            height: f
                        }).find(">.backstretch-item").not(".deleteable").each(function() {
                            t(this).find("img,video,iframe").css({
                                width: m,
                                height: g
                            }).css(c)
                        }), this.$container.trigger(v, this)
                    } catch (t) {}
                    return this
                },
                show: function(e, s) {
                    if (!(Math.abs(e) > this.images.length - 1)) {
                        var o = this,
                            n = o.$wrap.find(">.backstretch-item").addClass("deleteable"),
                            a = o.videoWrapper,
                            r = {
                                relatedTarget: o.$container[0]
                            };
                        o.$container.trigger(t.Event("backstretch.before", r), [o, e]), this.index = e;
                        var h = o.images[e];
                        clearTimeout(o._cycleTimeout), delete o.videoWrapper;
                        var l = u(h);
                        return l ? (o.videoWrapper = new y(h), o.$item = o.videoWrapper.$video.css("pointer-events", "none")) : o.$item = t("<img />"), o.$itemWrapper = t('<div class="backstretch-item">').append(o.$item), this.options.bypassCss ? o.$itemWrapper.css({
                            display: "none"
                        }) : (o.$itemWrapper.css(c.itemWrapper), o.$item.css(c.item)), o.$item.bind(l ? "canplay" : "load", function(h) {
                            var c = t(this).parent(),
                                d = c.data("options");
                            s && (d = t.extend({}, d, s));
                            var u = this.naturalWidth || this.videoWidth || this.width,
                                p = this.naturalHeight || this.videoHeight || this.height;
                            c.data("ratio", u / p);
                            var f = function(t) {
                                    return d[t] !== i ? d[t] : o.options[t]
                                },
                                m = f("transition"),
                                g = f("transitionEasing"),
                                v = f("transitionDuration"),
                                y = function() {
                                    a && (a.stop(), a.destroy()), n.remove(), !o.paused && o.images.length > 1 && o.cycle(), o.options.bypassCss || o.isBody || o.$container.css("background-image", "none"), t(["after", "show"]).each(function() {
                                        o.$container.trigger(t.Event("backstretch." + this, r), [o, e])
                                    }), l && o.videoWrapper.play()
                                };
                            o.firstShow && !o.options.animateFirst || !v || !m ? (c.show(), y()) : function(e) {
                                var s = e.transition || "fade";
                                "string" == typeof s && s.indexOf("|") > -1 && (s = s.split("|")), s instanceof Array && (s = s[Math.round(Math.random() * (s.length - 1))]);
                                var o = e.new,
                                    n = e.old ? e.old : t([]);
                                switch (s.toString().toLowerCase()) {
                                    default:
                                    case "fade":
                                        o.fadeIn({
                                            duration: e.duration,
                                            complete: e.complete,
                                            easing: e.easing || i
                                        });
                                        break;
                                    case "fadeinout":
                                    case "fade_in_out":
                                        var a = function() {
                                            o.fadeIn({
                                                duration: e.duration / 2,
                                                complete: e.complete,
                                                easing: e.easing || i
                                            })
                                        };n.length ? n.fadeOut({
                                        duration: e.duration / 2,
                                        complete: a,
                                        easing: e.easing || i
                                    }) : a();
                                        break;
                                    case "pushleft":
                                    case "push_left":
                                    case "pushright":
                                    case "push_right":
                                    case "pushup":
                                    case "push_up":
                                    case "pushdown":
                                    case "push_down":
                                    case "coverleft":
                                    case "cover_left":
                                    case "coverright":
                                    case "cover_right":
                                    case "coverup":
                                    case "cover_up":
                                    case "coverdown":
                                    case "cover_down":
                                        var r = s.match(/^(cover|push)_?(.*)$/),
                                            h = "left" === r[2] ? "right" : "right" === r[2] ? "left" : "down" === r[2] ? "top" : "up" === r[2] ? "bottom" : "right",
                                            l = {
                                                display: ""
                                            },
                                            c = {};
                                        if (l[h] = "-100%", c[h] = 0, o.css(l).animate(c, {
                                            duration: e.duration,
                                            complete: function() {
                                                o.css(h, ""), e.complete.apply(this, arguments)
                                            },
                                            easing: e.easing || i
                                        }), "push" === r[1] && n.length) {
                                            var d = {};
                                            d[h] = "100%", n.animate(d, {
                                                duration: e.duration,
                                                complete: function() {
                                                    n.css("display", "none")
                                                },
                                                easing: e.easing || i
                                            })
                                        }
                                }
                            }({
                                new: c,
                                old: n,
                                transition: m,
                                duration: v,
                                easing: g,
                                complete: y
                            }), o.firstShow = !1, o.resize()
                        }), o.$itemWrapper.appendTo(o.$wrap), o.$item.attr("alt", h.alt || ""), o.$itemWrapper.data("options", h), l || o.$item.attr("src", h.url), o._currentImage = h, o
                    }
                },
                current: function() {
                    return this.index
                },
                next: function() {
                    var t = Array.prototype.slice.call(arguments, 0);
                    return t.unshift(this.index < this.images.length - 1 ? this.index + 1 : 0), this.show.apply(this, t)
                },
                prev: function() {
                    var t = Array.prototype.slice.call(arguments, 0);
                    return t.unshift(0 === this.index ? this.images.length - 1 : this.index - 1), this.show.apply(this, t)
                },
                pause: function() {
                    return this.paused = !0, this.videoWrapper && this.videoWrapper.pause(), this
                },
                resume: function() {
                    return this.paused = !1, this.videoWrapper && this.videoWrapper.play(), this.cycle(), this
                },
                cycle: function() {
                    if (this.images.length > 1) {
                        clearTimeout(this._cycleTimeout);
                        var e = this._currentImage && this._currentImage.duration || this.options.duration,
                            i = u(this._currentImage),
                            s = function() {
                                this.$item.off(".cycle"), this.paused || this.next()
                            };
                        if (i) {
                            if (!this._currentImage.loop) {
                                var o = 0;
                                this.$item.on("playing.cycle", function() {
                                    var e = t(this).data("player");
                                    clearTimeout(o), o = setTimeout(function() {
                                        e.pause(), e.$video.trigger("ended")
                                    }, 1e3 * (e.getDuration() - e.getCurrentTime()))
                                }).on("ended.cycle", function() {
                                    clearTimeout(o)
                                })
                            }
                            this.$item.on("error.cycle initerror.cycle", t.proxy(s, this))
                        }
                        i && !this._currentImage.duration ? this.$item.on("ended.cycle", t.proxy(s, this)) : this._cycleTimeout = setTimeout(t.proxy(s, this), e)
                    }
                    return this
                },
                destroy: function(i) {
                    t(e).off("resize.backstretch orientationchange.backstretch"), this.videoWrapper && this.videoWrapper.destroy(), clearTimeout(this._cycleTimeout), i || this.$wrap.remove(), this.$container.removeData("backstretch")
                }
            };
            var y = function() {
                this.init.apply(this, arguments)
            };
            y.prototype.init = function(o) {
                var n, a = this,
                    r = function() {
                        a.$video = n, a.video = n[0]
                    },
                    h = "video";
                if (o.url instanceof Array || !s.test(o.url) || (h = "youtube"), a.type = h, "youtube" === h) {
                    y.loadYoutubeAPI(), a.ytId = o.url.match(s)[2];
                    var l = "https://www.youtube.com/embed/" + a.ytId + "?rel=0&autoplay=0&showinfo=0&controls=0&modestbranding=1&cc_load_policy=0&disablekb=1&iv_load_policy=3&loop=0&enablejsapi=1&origin=" + encodeURIComponent(e.location.origin);
                    a.__ytStartMuted = !!o.mute || o.mute === i, n = t("<iframe />").attr({
                        src_to_load: l
                    }).css({
                        border: 0,
                        margin: 0,
                        padding: 0
                    }).data("player", a), o.loop && n.on("ended.loop", function() {
                        a.__manuallyStopped || a.play()
                    }), a.ytReady = !1, r(), e.YT ? (a._initYoutube(), n.trigger("initsuccess")) : t(e).one("youtube_api_load", function() {
                        a._initYoutube(), n.trigger("initsuccess")
                    })
                } else {
                    n = t("<video>").prop("autoplay", !1).prop("controls", !1).prop("loop", !!o.loop).prop("muted", !!o.mute || o.mute === i).prop("preload", "auto").prop("poster", o.poster || "");
                    for (var c = o.url instanceof Array ? o.url : [o.url], d = 0; d < c.length; d++) {
                        var u = c[d];
                        "string" == typeof u && (u = {
                            src: u
                        }), t("<source>").attr("src", u.src).attr("type", u.type || null).appendTo(n)
                    }
                    n[0].canPlayType && c.length ? n.trigger("initsuccess") : n.trigger("initerror"), r()
                }
            }, y.prototype._initYoutube = function() {
                var i = this,
                    s = e.YT;
                i.$video.attr("src", i.$video.attr("src_to_load")).removeAttr("src_to_load");
                var o = !!i.$video[0].parentNode;
                if (!o) {
                    var n = t("<div>").css("display", "none !important").appendTo(document.body);
                    i.$video.appendTo(n)
                }
                var a = new s.Player(i.video, {
                    events: {
                        onReady: function() {
                            i.__ytStartMuted && a.mute(), o || (i.$video[0].parentNode === n[0] && i.$video.detach(), n.remove()), i.ytReady = !0, i._updateYoutubeSize(), i.$video.trigger("canplay")
                        },
                        onStateChange: function(t) {
                            switch (t.data) {
                                case s.PlayerState.PLAYING:
                                    i.$video.trigger("playing");
                                    break;
                                case s.PlayerState.ENDED:
                                    i.$video.trigger("ended");
                                    break;
                                case s.PlayerState.PAUSED:
                                    i.$video.trigger("pause");
                                    break;
                                case s.PlayerState.BUFFERING:
                                    i.$video.trigger("waiting");
                                    break;
                                case s.PlayerState.CUED:
                                    i.$video.trigger("canplay")
                            }
                        },
                        onPlaybackQualityChange: function() {
                            i._updateYoutubeSize(), i.$video.trigger("resize")
                        },
                        onError: function(t) {
                            i.hasError = !0, i.$video.trigger({
                                type: "error",
                                error: t
                            })
                        }
                    }
                });
                return i.ytPlayer = a, i
            }, y.prototype._updateYoutubeSize = function() {
                var t = this;
                switch (t.ytPlayer.getPlaybackQuality() || "medium") {
                    case "small":
                        t.video.videoWidth = 426, t.video.videoHeight = 240;
                        break;
                    case "medium":
                        t.video.videoWidth = 640, t.video.videoHeight = 360;
                        break;
                    default:
                    case "large":
                        t.video.videoWidth = 854, t.video.videoHeight = 480;
                        break;
                    case "hd720":
                        t.video.videoWidth = 1280, t.video.videoHeight = 720;
                        break;
                    case "hd1080":
                        t.video.videoWidth = 1920, t.video.videoHeight = 1080;
                        break;
                    case "highres":
                        t.video.videoWidth = 2560, t.video.videoHeight = 1440
                }
                return t
            }, y.prototype.play = function() {
                var t = this;
                return t.__manuallyStopped = !1, "youtube" === t.type ? t.ytReady && (t.$video.trigger("play"), t.ytPlayer.playVideo()) : t.video.play(), t
            }, y.prototype.pause = function() {
                var t = this;
                return t.__manuallyStopped = !1, "youtube" === t.type ? t.ytReady && t.ytPlayer.pauseVideo() : t.video.pause(), t
            }, y.prototype.stop = function() {
                var t = this;
                return t.__manuallyStopped = !0, "youtube" === t.type ? t.ytReady && (t.ytPlayer.pauseVideo(), t.ytPlayer.seekTo(0)) : (t.video.pause(), t.video.currentTime = 0), t
            }, y.prototype.destroy = function() {
                return this.ytPlayer && this.ytPlayer.destroy(), this.$video.remove(), this
            }, y.prototype.getCurrentTime = function(t) {
                return "youtube" !== this.type ? this.video.currentTime : this.ytReady ? this.ytPlayer.getCurrentTime() : 0
            }, y.prototype.setCurrentTime = function(t) {
                var e = this;
                return "youtube" === e.type ? e.ytReady && e.ytPlayer.seekTo(t, !0) : e.video.currentTime = t, e
            }, y.prototype.getDuration = function() {
                return "youtube" !== this.type ? this.video.duration : this.ytReady ? this.ytPlayer.getDuration() : 0
            }, y.loadYoutubeAPI = function() {
                if (!e.YT) {
                    t("script[src*=www\\.youtube\\.com\\/iframe_api]").length || t('<script type="text/javascript" src="https://www.youtube.com/iframe_api">').appendTo("body");
                    var i = setInterval(function() {
                        e.YT && e.YT.loaded && (t(e).trigger("youtube_api_load"), clearTimeout(i))
                    }, 50)
                }
            };
            var w, b, C, $, _, x, k, T, O, I, S = function() {
                    if ("matchMedia" in e) {
                        if (e.matchMedia("(orientation: portrait)").matches) return "portrait";
                        if (e.matchMedia("(orientation: landscape)").matches) return "landscape"
                    }
                    return screen.height > screen.width ? "portrait" : "landscape"
                },
                A = function() {
                    return e.innerHeight > e.innerWidth ? "portrait" : e.innerWidth > e.innerHeight ? "landscape" : "square"
                },
                P = (w = navigator.userAgent, b = navigator.platform, C = w.match(/AppleWebKit\/([0-9]+)/), $ = !!C && C[1], _ = w.match(/Fennec\/([0-9]+)/), x = !!_ && _[1], k = w.match(/Opera Mobi\/([0-9]+)/), T = !!k && k[1], O = w.match(/MSIE ([0-9]+)/), I = !!O && O[1], !((b.indexOf("iPhone") > -1 || b.indexOf("iPad") > -1 || b.indexOf("iPod") > -1) && $ && $ < 534 || e.operamini && "[object OperaMini]" === {}.toString.call(e.operamini) || k && T < 7458 || w.indexOf("Android") > -1 && $ && $ < 533 || x && x < 6 || "palmGetResource" in e && $ && $ < 534 || w.indexOf("MeeGo") > -1 && w.indexOf("NokiaBrowser/8.5.0") > -1 || I && I <= 6))
        }(jQuery, window),
            function(t, e, i) {
                "use strict";
                var s = function(t, e) {
                    var s = this;
                    this.el = t, this.options = {}, Object.keys(o).forEach(function(t) {
                        s.options[t] = o[t]
                    }), Object.keys(e).forEach(function(t) {
                        s.options[t] = e[t]
                    }), this.isInput = "input" === this.el.tagName.toLowerCase(), this.attr = this.options.attr, this.showCursor = !this.isInput && this.options.showCursor, this.elContent = this.attr ? this.el.getAttribute(this.attr) : this.el.textContent, this.contentType = this.options.contentType, this.typeSpeed = this.options.typeSpeed, this.startDelay = this.options.startDelay, this.backSpeed = this.options.backSpeed, this.backDelay = this.options.backDelay, this.fadeOut = this.options.fadeOut, this.fadeOutClass = this.options.fadeOutClass, this.fadeOutDelay = this.options.fadeOutDelay, i && this.options.stringsElement instanceof i ? this.stringsElement = this.options.stringsElement[0] : this.stringsElement = this.options.stringsElement, this.strings = this.options.strings, this.strPos = 0, this.arrayPos = 0, this.stopNum = 0, this.loop = this.options.loop, this.loopCount = this.options.loopCount, this.curLoop = 0, this.stop = !1, this.cursorChar = this.options.cursorChar, this.shuffle = this.options.shuffle, this.sequence = [], this.build()
                };
                s.prototype = {
                    constructor: s,
                    init: function() {
                        var t = this;
                        t.timeout = setTimeout(function() {
                            for (var e = 0; e < t.strings.length; ++e) t.sequence[e] = e;
                            t.shuffle && (t.sequence = t.shuffleArray(t.sequence)), t.typewrite(t.strings[t.sequence[t.arrayPos]], t.strPos)
                        }, t.startDelay)
                    },
                    build: function() {
                        var t = this;
                        (!0 === this.showCursor && (this.cursor = e.createElement("span"), this.cursor.className = "typed-cursor", this.cursor.innerHTML = this.cursorChar, this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling)), this.stringsElement) && (this.strings = [], this.stringsElement.style.display = "none", Array.prototype.slice.apply(this.stringsElement.children).forEach(function(e) {
                            t.strings.push(e.innerHTML)
                        }));
                        this.init()
                    },
                    typewrite: function(t, e) {
                        if (!0 !== this.stop) {
                            this.fadeOut && this.el.classList.contains(this.fadeOutClass) && (this.el.classList.remove(this.fadeOutClass), this.cursor.classList.remove(this.fadeOutClass));
                            var i = Math.round(70 * Math.random()) + this.typeSpeed,
                                s = this;
                            s.timeout = setTimeout(function() {
                                var i = 0,
                                    o = t.substr(e);
                                if ("^" === o.charAt(0)) {
                                    var n = 1;
                                    /^\^\d+/.test(o) && (n += (o = /\d+/.exec(o)[0]).length, i = parseInt(o)), t = t.substring(0, e) + t.substring(e + n)
                                }
                                if ("html" === s.contentType) {
                                    var a = t.substr(e).charAt(0);
                                    if ("<" === a) {
                                        var r = "";
                                        for (r = "<" === a ? ">" : ";"; t.substr(e + 1).charAt(0) !== r && (t.substr(e).charAt(0), !(++e + 1 > t.length)););
                                        e++, r
                                    }
                                }
                                s.timeout = setTimeout(function() {
                                    if (e === t.length) {
                                        if (s.options.onStringTyped(s.arrayPos), s.arrayPos === s.strings.length - 1 && (s.options.callback(), s.curLoop++, !1 === s.loop || s.curLoop === s.loopCount)) return;
                                        s.timeout = setTimeout(function() {
                                            s.backspace(t, e)
                                        }, s.backDelay)
                                    } else {
                                        0 === e && s.options.preStringTyped(s.arrayPos);
                                        var i = t.substr(0, e + 1);
                                        s.attr ? s.el.setAttribute(s.attr, i) : s.isInput ? s.el.value = i : "html" === s.contentType ? s.el.innerHTML = i : s.el.textContent = i, e++, s.typewrite(t, e)
                                    }
                                }, i)
                            }, i)
                        }
                    },
                    backspace: function(t, e) {
                        var i = this;
                        if (!0 !== this.stop)
                            if (this.fadeOut) this.initFadeOut();
                            else {
                                var s = Math.round(70 * Math.random()) + this.backSpeed;
                                i.timeout = setTimeout(function() {
                                    if ("html" === i.contentType && ">" === t.substr(e).charAt(0)) {
                                        for (;
                                            "<" !== t.substr(e - 1).charAt(0) && (t.substr(e).charAt(0), !(--e < 0)););
                                        e--, "<"
                                    }
                                    var s = t.substr(0, e);
                                    i.replaceText(s), e > i.stopNum ? (e--, i.backspace(t, e)) : e <= i.stopNum && (i.arrayPos++, i.arrayPos === i.strings.length ? (i.arrayPos = 0, i.shuffle && (i.sequence = i.shuffleArray(i.sequence)), i.init()) : i.typewrite(i.strings[i.sequence[i.arrayPos]], e))
                                }, s)
                            }
                    },
                    initFadeOut: function() {
                        return self = this, this.el.className += " " + this.fadeOutClass, this.cursor.className += " " + this.fadeOutClass, setTimeout(function() {
                            self.arrayPos++, self.replaceText(""), self.typewrite(self.strings[self.sequence[self.arrayPos]], 0)
                        }, self.fadeOutDelay)
                    },
                    replaceText: function(t) {
                        this.attr ? this.el.setAttribute(this.attr, t) : this.isInput ? this.el.value = t : "html" === this.contentType ? this.el.innerHTML = t : this.el.textContent = t
                    },
                    shuffleArray: function(t) {
                        var e, i, s = t.length;
                        if (s)
                            for (; --s;) e = t[i = Math.floor(Math.random() * (s + 1))], t[i] = t[s], t[s] = e;
                        return t
                    },
                    reset: function() {
                        clearInterval(this.timeout);
                        this.el.getAttribute("id");
                        this.el.textContent = "", void 0 !== this.cursor && void 0 !== this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor), this.strPos = 0, this.arrayPos = 0, this.curLoop = 0, this.options.resetCallback()
                    }
                }, s.new = function(t, i) {
                    Array.prototype.slice.apply(e.querySelectorAll(t)).forEach(function(t) {
                        var e = t._typed,
                            o = "object" == typeof i && i;
                        e && e.reset(), t._typed = e = new s(t, o), "string" == typeof i && e[i]()
                    })
                }, i && (i.fn.typed = function(t) {
                    return this.each(function() {
                        var e = i(this),
                            o = e.data("typed"),
                            n = "object" == typeof t && t;
                        o && o.reset(), e.data("typed", o = new s(this, n)), "string" == typeof t && o[t]()
                    })
                }), t.Typed = s;
                var o = {
                    strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
                    stringsElement: null,
                    typeSpeed: 0,
                    startDelay: 0,
                    backSpeed: 0,
                    shuffle: !1,
                    backDelay: 500,
                    fadeOut: !1,
                    fadeOutClass: "typed-fade-out",
                    fadeOutDelay: 500,
                    loop: !1,
                    loopCount: !1,
                    showCursor: !0,
                    cursorChar: "|",
                    attr: null,
                    contentType: "html",
                    callback: function() {},
                    preStringTyped: function() {},
                    onStringTyped: function() {},
                    resetCallback: function() {}
                }
            }(window, document, window.jQuery),
            function(t) {
                if ("undefined" == typeof jQuery) throw new Error("Kube's requires jQuery");
                ! function(t) {
                    var e = jQuery.fn.jquery.split(".");
                    if (1 == e[0] && e[1] < 8) throw new Error("Kube's requires at least jQuery v1.8")
                }(),
                    function() {
                        Function.prototype.inherits = function(t) {
                            var e = function() {};
                            e.prototype = t.prototype;
                            var i = new e;
                            for (var s in this.prototype) i[s] = this.prototype[s];
                            this.prototype = i, this.prototype.super = t.prototype
                        };
                        var e = function(e, i) {
                            i = "object" == typeof i ? i : {}, this.$element = t(e), this.opts = t.extend(!0, this.defaults, t.fn[this.namespace].options, this.$element.data(), i), this.$target = "string" == typeof this.opts.target ? t(this.opts.target) : null
                        };
                        e.prototype = {
                            getInstance: function() {
                                return this.$element.data("fn." + this.namespace)
                            },
                            hasTarget: function() {
                                return !(null === this.$target)
                            },
                            callback: function(e) {
                                var i = [].slice.call(arguments).splice(1);
                                return this.$element && (i = this._fireCallback(t._data(this.$element[0], "events"), e, this.namespace, i)), this.$target && (i = this._fireCallback(t._data(this.$target[0], "events"), e, this.namespace, i)), this.opts && this.opts.callbacks && t.isFunction(this.opts.callbacks[e]) ? this.opts.callbacks[e].apply(this, i) : i
                            },
                            _fireCallback: function(t, e, i, s) {
                                if (t && void 0 !== t[e])
                                    for (var o = t[e].length, n = 0; n < o; n++) {
                                        if (t[e][n].namespace === i) var a = t[e][n].handler.apply(this, s)
                                    }
                                return void 0 === a ? s : a
                            }
                        }, window.MesmerizeKube = e
                    }();
                var e, i, s, o, n, a, r, h, l, c, d, u, p, f, m, g, v = window.MesmerizeKube;
                (e = v).Plugin = {
                    create: function(i, s) {
                        return s = void 0 === s ? i.toLowerCase() : s, t.fn[s] = function(o, n) {
                            var a = Array.prototype.slice.call(arguments, 1),
                                r = "fn." + s,
                                h = [];
                            return this.each(function() {
                                var s = t(this),
                                    l = s.data(r);
                                if (n = "object" == typeof o ? o : n, l || (s.data(r, {}), s.data(r, l = new e[i](this, n))), "string" == typeof o)
                                    if (t.isFunction(l[o])) {
                                        var c = l[o].apply(l, a);
                                        void 0 !== c && h.push(c)
                                    } else t.error('No such method "' + o + '" for ' + i)
                            }), 0 === h.length || 1 === h.length ? 0 === h.length ? this : h[0] : h
                        }, t.fn[s].options = {}, this
                    },
                    autoload: function(t) {
                        for (var e = t.split(","), i = e.length, s = 0; s < i; s++) {
                            var o = e[s].toLowerCase().split(",").map(function(t) {
                                return t.trim()
                            }).join(",");
                            this.autoloadQueue.push(o)
                        }
                        return this
                    },
                    autoloadQueue: [],
                    startAutoload: function() {
                        if (window.MutationObserver && 0 !== this.autoloadQueue.length) {
                            var t = this;
                            new MutationObserver(function(e) {
                                e.forEach(function(e) {
                                    var i = e.addedNodes;
                                    0 === i.length || 1 === i.length && 3 === i.nodeType || t.startAutoloadOnce()
                                })
                            }).observe(document, {
                                subtree: !0,
                                childList: !0
                            })
                        }
                    },
                    startAutoloadOnce: function() {
                        var e = this;
                        t("[data-component]").not("[data-loaded]").each(function() {
                            var i = t(this),
                                s = i.data("component"); - 1 !== e.autoloadQueue.indexOf(s) && (i.attr("data-loaded", !0), i[s]())
                        })
                    },
                    watch: function() {
                        e.Plugin.startAutoloadOnce(), e.Plugin.startAutoload()
                    }
                }, t(window).on("load", function() {
                    e.Plugin.watch()
                }), (i = v).Animation = function(t, e, s) {
                    this.namespace = "animation", this.defaults = {}, i.apply(this, arguments), this.effect = e, this.completeCallback = void 0 !== s && s, this.prefixes = ["", "-moz-", "-o-animation-", "-webkit-"], this.queue = [], this.start()
                }, i.Animation.prototype = {
                    start: function() {
                        this.isSlideEffect() && this.setElementHeight(), this.addToQueue(), this.clean(), this.animate()
                    },
                    addToQueue: function() {
                        this.queue.push(this.effect)
                    },
                    setElementHeight: function() {
                        this.$element.height(this.$element.height())
                    },
                    removeElementHeight: function() {
                        this.$element.css("height", "")
                    },
                    isSlideEffect: function() {
                        return "slideDown" === this.effect || "slideUp" === this.effect
                    },
                    isHideableEffect: function() {
                        return -1 !== t.inArray(this.effect, ["fadeOut", "slideUp", "flipOut", "zoomOut", "slideOutUp", "slideOutRight", "slideOutLeft"])
                    },
                    isToggleEffect: function() {
                        return "show" === this.effect || "hide" === this.effect
                    },
                    storeHideClasses: function() {
                        this.$element.hasClass("hide-sm") ? this.$element.data("hide-sm-class", !0) : this.$element.hasClass("hide-md") && this.$element.data("hide-md-class", !0)
                    },
                    revertHideClasses: function() {
                        this.$element.data("hide-sm-class") ? this.$element.addClass("hide-sm").removeData("hide-sm-class") : this.$element.data("hide-md-class") ? this.$element.addClass("hide-md").removeData("hide-md-class") : this.$element.addClass("hide")
                    },
                    removeHideClass: function() {
                        this.$element.data("hide-sm-class") ? this.$element.removeClass("hide-sm") : this.$element.data("hide-md-class") ? this.$element.removeClass("hide-md") : this.$element.removeClass("hide")
                    },
                    animate: function() {
                        if (this.storeHideClasses(), this.isToggleEffect()) return this.makeSimpleEffects();
                        this.$element.addClass("kubeanimated"), this.$element.addClass(this.queue[0]), this.removeHideClass();
                        var e = this.queue.length > 1 ? null : this.completeCallback;
                        this.complete("AnimationEnd", t.proxy(this.makeComplete, this), e)
                    },
                    makeSimpleEffects: function() {
                        "show" === this.effect ? this.removeHideClass() : "hide" === this.effect && this.revertHideClasses(), "function" == typeof this.completeCallback && this.completeCallback(this)
                    },
                    makeComplete: function() {
                        this.$element.hasClass(this.queue[0]) && (this.clean(), this.queue.shift(), this.queue.length && this.animate())
                    },
                    complete: function(e, i, s) {
                        var o = e.split(" ").map(function(t) {
                            return t.toLowerCase() + " webkit" + t + " o" + t + " MS" + t
                        });
                        this.$element.one(o.join(" "), t.proxy(function() {
                            "function" == typeof i && i(), this.isHideableEffect() && this.revertHideClasses(), this.isSlideEffect() && this.removeElementHeight(), "function" == typeof s && s(this), this.$element.off(event)
                        }, this))
                    },
                    clean: function() {
                        this.$element.removeClass("kubeanimated").removeClass(this.queue[0])
                    }
                }, i.Animation.inherits(i), (s = jQuery).fn.animation = function(t, e) {
                    var i = "fn.animation";
                    return this.each(function() {
                        var o = s(this);
                        o.data(i), o.data(i, {}), o.data(i, new v.Animation(this, t, e))
                    })
                }, s.fn.animation.options = {}, (o = v).Detect = function() {}, o.Detect.prototype = {
                    isMobile: function() {
                        return /(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent)
                    },
                    isDesktop: function() {
                        return !/(iPhone|iPod|iPad|BlackBerry|Android)/.test(navigator.userAgent)
                    },
                    isMobileScreen: function() {
                        return t(window).width() <= 768
                    },
                    isTabletScreen: function() {
                        return t(window).width() >= 768 && t(window).width() <= 1024
                    },
                    isDesktopScreen: function() {
                        return t(window).width() > 1024
                    }
                }, (n = v).FormData = function(t) {
                    this.opts = t.opts
                }, n.FormData.prototype = {
                    set: function(t) {
                        this.data = t
                    },
                    get: function(t) {
                        return this.formdata = t, this.opts.appendForms && this.appendForms(), this.opts.appendFields && this.appendFields(), this.data
                    },
                    appendFields: function() {
                        var e = t(this.opts.appendFields);
                        if (0 !== e.length) {
                            var i = this,
                                s = "";
                            this.formdata ? e.each(function() {
                                i.data.append(t(this).attr("name"), t(this).val())
                            }) : (e.each(function() {
                                s += "&" + t(this).attr("name") + "=" + t(this).val()
                            }), this.data = "" === this.data ? s.replace(/^&/, "") : this.data + s)
                        }
                    },
                    appendForms: function() {
                        var e = t(this.opts.appendForms);
                        if (0 !== e.length)
                            if (this.formdata) {
                                var i = this,
                                    s = t(this.opts.appendForms).serializeArray();
                                t.each(s, function(t, e) {
                                    i.data.append(e.name, e.value)
                                })
                            } else {
                                var o = e.serialize();
                                this.data = "" === this.data ? o : this.data + "&" + o
                            }
                    }
                }, (a = v).Response = function(t) {}, a.Response.prototype = {
                    parse: function(t) {
                        if ("" === t) return !1;
                        var e = {};
                        try {
                            e = JSON.parse(t)
                        } catch (t) {
                            return !1
                        }
                        if (void 0 !== e[0])
                            for (var i in e) this.parseItem(e[i]);
                        else this.parseItem(e);
                        return e
                    },
                    parseItem: function(e) {
                        return "value" === e.type ? t.each(e.data, t.proxy(function(e, i) {
                            i = !0 === (i = null === i || !1 === i ? 0 : i) ? 1 : i, t(e).val(i)
                        }, this)) : "html" === e.type ? t.each(e.data, t.proxy(function(e, i) {
                            i = null === i || !1 === i ? "" : i, t(e).html(this.stripslashes(i))
                        }, this)) : "addClass" === e.type ? t.each(e.data, function(e, i) {
                            t(e).addClass(i)
                        }) : "removeClass" === e.type ? t.each(e.data, function(e, i) {
                            t(e).removeClass(i)
                        }) : "command" === e.type ? t.each(e.data, function(e, i) {
                            t(i)[e]()
                        }) : "animation" === e.type ? t.each(e.data, function(e, i) {
                            i.opts = void 0 === i.opts ? {} : i.opts, t(e).animation(i.name, i.opts)
                        }) : "location" === e.type ? top.location.href = e.data : "notify" === e.type && t.notify(e.data), e
                    },
                    stripslashes: function(t) {
                        return (t + "").replace(/\0/g, "0").replace(/\\([\\'"])/g, "$1")
                    }
                }, (r = v).Utils = function() {}, r.Utils.prototype = {
                    disableBodyScroll: function() {
                        var e = t("html"),
                            i = window.innerWidth;
                        if (!i) {
                            var s = document.documentElement.getBoundingClientRect();
                            i = s.right - Math.abs(s.left)
                        }
                        var o = document.body.clientWidth < i,
                            n = this.measureScrollbar();
                        e.css("overflow", "hidden"), o && e.css("padding-right", n)
                    },
                    measureScrollbar: function() {
                        var e = t("body"),
                            i = document.createElement("div");
                        i.className = "scrollbar-measure", e.append(i);
                        var s = i.offsetWidth - i.clientWidth;
                        return e[0].removeChild(i), s
                    },
                    enableBodyScroll: function() {
                        t("html").css({
                            overflow: "",
                            "padding-right": ""
                        })
                    }
                }, (h = v).Message = function(t, e) {
                    this.namespace = "message", this.defaults = {
                        closeSelector: ".close",
                        closeEvent: "click",
                        animationOpen: "fadeIn",
                        animationClose: "fadeOut",
                        callbacks: ["open", "opened", "close", "closed"]
                    }, h.apply(this, arguments), this.start()
                }, h.Message.prototype = {
                    start: function() {
                        this.$close = this.$element.find(this.opts.closeSelector), this.$close.on(this.opts.closeEvent + "." + this.namespace, t.proxy(this.close, this)), this.$element.addClass("open")
                    },
                    stop: function() {
                        this.$close.off("." + this.namespace), this.$element.removeClass("open")
                    },
                    open: function(e) {
                        e && e.preventDefault(), this.isOpened() || (this.callback("open"), this.$element.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
                    },
                    isOpened: function() {
                        return this.$element.hasClass("open")
                    },
                    onOpened: function() {
                        this.callback("opened"), this.$element.addClass("open")
                    },
                    close: function(e) {
                        e && e.preventDefault(), this.isOpened() && (this.callback("close"), this.$element.animation(this.opts.animationClose, t.proxy(this.onClosed, this)))
                    },
                    onClosed: function() {
                        this.callback("closed"), this.$element.removeClass("open")
                    }
                }, h.Message.inherits(h), h.Plugin.create("Message"), h.Plugin.autoload("Message"), (l = v).Sticky = function(t, e) {
                    this.namespace = "sticky", this.defaults = {
                        classname: "fixed",
                        offset: 0,
                        callbacks: ["fixed", "unfixed"]
                    }, l.apply(this, arguments), this.start()
                }, l.Sticky.prototype = {
                    start: function() {
                        this.offsetTop = this.getOffsetTop(), this.load(), t(window).scroll(t.proxy(this.load, this))
                    },
                    getOffsetTop: function() {
                        return this.$element.offset().top
                    },
                    load: function() {
                        return this.isFix() ? this.fixed() : this.unfixed()
                    },
                    isFix: function() {
                        return t(window).scrollTop() > this.offsetTop + this.opts.offset
                    },
                    fixed: function() {
                        this.$element.addClass(this.opts.classname).css("top", this.opts.offset + "px"), this.callback("fixed")
                    },
                    unfixed: function() {
                        this.$element.removeClass(this.opts.classname).css("top", ""), this.callback("unfixed")
                    }
                }, l.Sticky.inherits(l), l.Plugin.create("Sticky"), l.Plugin.autoload("Sticky"), (c = v).Toggleme = function(t, e) {
                    this.namespace = "toggleme", this.defaults = {
                        toggleEvent: "click",
                        target: null,
                        text: "",
                        animationOpen: "slideDown",
                        animationClose: "slideUp",
                        callbacks: ["open", "opened", "close", "closed"]
                    }, c.apply(this, arguments), this.start()
                }, c.Toggleme.prototype = {
                    start: function() {
                        this.hasTarget() && this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this))
                    },
                    stop: function() {
                        this.$element.off("." + this.namespace), this.revertText()
                    },
                    toggle: function(t) {
                        this.isOpened() ? this.close(t) : this.open(t)
                    },
                    open: function(e) {
                        e && e.preventDefault(), this.isOpened() || (this.storeText(), this.callback("open"), this.$target.animation("slideDown", t.proxy(this.onOpened, this)), setTimeout(t.proxy(this.replaceText, this), 100))
                    },
                    close: function(e) {
                        e && e.preventDefault(), this.isOpened() && (this.callback("close"), this.$target.animation("slideUp", t.proxy(this.onClosed, this)))
                    },
                    isOpened: function() {
                        return this.$target.hasClass("open")
                    },
                    onOpened: function() {
                        this.$target.addClass("open"), this.callback("opened")
                    },
                    onClosed: function() {
                        this.$target.removeClass("open"), this.revertText(), this.callback("closed")
                    },
                    storeText: function() {
                        this.$element.data("replacement-text", this.$element.html())
                    },
                    revertText: function() {
                        var t = this.$element.data("replacement-text");
                        t && this.$element.html(t), this.$element.removeData("replacement-text")
                    },
                    replaceText: function() {
                        "" !== this.opts.text && this.$element.html(this.opts.text)
                    }
                }, c.Toggleme.inherits(c), c.Plugin.create("Toggleme"), c.Plugin.autoload("Toggleme"), (d = v).Offcanvas = function(t, e) {
                    this.namespace = "offcanvas", this.defaults = {
                        target: null,
                        push: !0,
                        width: "250px",
                        direction: "left",
                        toggleEvent: "click",
                        clickOutside: !0,
                        animationOpen: "slideInLeft",
                        animationClose: "slideOutLeft",
                        callbacks: ["open", "opened", "close", "closed"]
                    }, d.apply(this, arguments), this.utils = new d.Utils, this.detect = new d.Detect, this.start()
                }, d.Offcanvas.prototype = {
                    start: function() {
                        this.hasTarget() && (this.buildTargetWidth(), this.buildAnimationDirection(), this.$close = this.getCloseLink(), this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this)), this.$target.addClass("offcanvas"), this.$target.trigger("kube.offcanvas.ready"))
                    },
                    stop: function() {
                        this.closeAll(), this.$element.off("." + this.namespace), this.$close.off("." + this.namespace), t(document).off("." + this.namespace)
                    },
                    toggle: function(t) {
                        this.isOpened() ? this.close(t) : this.open(t)
                    },
                    buildTargetWidth: function() {
                        this.opts.width = t(window).width() < parseInt(this.opts.width) ? "100%" : this.opts.width
                    },
                    buildAnimationDirection: function() {
                        "right" === this.opts.direction && (this.opts.animationOpen = "slideInRight", this.opts.animationClose = "slideOutRight")
                    },
                    getCloseLink: function() {
                        return this.$target.find(".close")
                    },
                    open: function(e) {
                        e && e.preventDefault(), this.isOpened() || (this.closeAll(), this.callback("open"), this.$target.addClass("offcanvas-" + this.opts.direction), this.$target.css("width", Math.min(parseInt(this.opts.width), window.innerWidth - 100)), this.$target.css("right", "-" + Math.min(parseInt(this.opts.width), window.innerWidth - 100)), this.pushBody(), this.$target.trigger("kube.offcanvas.open"), this.$target.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
                    },
                    closeAll: function() {
                        var e = t(document).find(".offcanvas");
                        0 !== e.length && (e.each(function() {
                            var e = t(this);
                            e.hasClass("open") && (e.css("width", "").animation("hide"), e.removeClass("open offcanvas-left offcanvas-right"))
                        }), t(document).off("." + this.namespace), t("body").css("left", ""))
                    },
                    close: function(e) {
                        if (e) {
                            var i = t(e.target);
                            if (("A" === i[0].tagName || "BUTTON" === i[0].tagName || i.parents("a").length) && 0 !== i.closest(".offcanvas").length && !i.hasClass("close")) return;
                            e.preventDefault()
                        }
                        this.isOpened() && (this.utils.enableBodyScroll(), this.callback("close"), this.pullBody(), this.$target.trigger("kube.offcanvas.close"), this.$target.animation(this.opts.animationClose, t.proxy(this.onClosed, this)))
                    },
                    isOpened: function() {
                        return this.$target.hasClass("open")
                    },
                    onOpened: function() {
                        this.opts.clickOutside && t(document).on("click." + this.namespace + " tap." + this.namespace, t.proxy(this.close, this)), this.detect.isMobileScreen() && t("html").addClass("no-scroll"), t(document).on("keyup." + this.namespace, t.proxy(this.handleKeyboard, this)), this.$close.on("click." + this.namespace, t.proxy(this.close, this)), this.utils.disableBodyScroll(), this.$target.addClass("open"), this.callback("opened")
                    },
                    onClosed: function() {
                        this.detect.isMobileScreen() && t("html").removeClass("no-scroll"), this.$target.css("width", "").removeClass("offcanvas-" + this.opts.direction), this.$close.off("." + this.namespace), t(document).off("." + this.namespace), this.$target.removeClass("open"), this.callback("closed"), this.$target.trigger("kube.offcanvas.closed")
                    },
                    handleKeyboard: function(t) {
                        27 === t.which && this.close()
                    },
                    pullBody: function() {
                        this.opts.push && t("body").animate({
                            left: 0
                        }, 350, function() {
                            t(this).removeClass("offcanvas-push-body")
                        })
                    },
                    pushBody: function() {
                        if (this.opts.push) {
                            var e = "left" === this.opts.direction ? {
                                left: this.opts.width
                            } : {
                                left: "-" + this.opts.width
                            };
                            t("body").addClass("offcanvas-push-body").animate(e, 200)
                        }
                    }
                }, d.Offcanvas.inherits(d), d.Plugin.create("Offcanvas"), d.Plugin.autoload("Offcanvas"), (u = v).Collapse = function(t, e) {
                    this.namespace = "collapse", this.defaults = {
                        target: null,
                        toggle: !0,
                        active: !1,
                        toggleClass: "collapse-toggle",
                        boxClass: "collapse-box",
                        callbacks: ["open", "opened", "close", "closed"],
                        hashes: [],
                        currentHash: !1,
                        currentItem: !1
                    }, u.apply(this, arguments), this.start()
                }, u.Collapse.prototype = {
                    start: function() {
                        this.$items = this.getItems(), this.$items.each(t.proxy(this.loadItems, this)), this.$boxes = this.getBoxes(), this.setActiveItem()
                    },
                    getItems: function() {
                        return this.$element.find("." + this.opts.toggleClass)
                    },
                    getBoxes: function() {
                        return this.$element.find("." + this.opts.boxClass)
                    },
                    loadItems: function(e, i) {
                        var s = this.getItem(i);
                        s.$el.attr("rel", s.hash), t(s.hash).hasClass("hide") || (this.opts.currentItem = s, this.opts.active = s.hash, s.$el.addClass("active")), s.$el.on("click.collapse", t.proxy(this.toggle, this))
                    },
                    setActiveItem: function() {
                        !1 !== this.opts.active && (this.opts.currentItem = this.getItemBy(this.opts.active), this.opts.active = this.opts.currentItem.hash), !1 !== this.opts.currentItem && (this.addActive(this.opts.currentItem), this.opts.currentItem.$box.removeClass("hide"))
                    },
                    addActive: function(t) {
                        t.$box.removeClass("hide").addClass("open"), t.$el.addClass("active"), !1 !== t.$caret && t.$caret.removeClass("down").addClass("up"), !1 !== t.$parent && t.$parent.addClass("active"), this.opts.currentItem = t
                    },
                    removeActive: function(t) {
                        t.$box.removeClass("open"), t.$el.removeClass("active"), !1 !== t.$caret && t.$caret.addClass("down").removeClass("up"), !1 !== t.$parent && t.$parent.removeClass("active"), this.opts.currentItem = !1
                    },
                    toggle: function(e) {
                        e && e.preventDefault();
                        var i = t(e.target).closest("." + this.opts.toggleClass).get(0) || e.target,
                            s = this.getItem(i);
                        this.isOpened(s.hash) ? this.close(s.hash) : this.open(e)
                    },
                    openAll: function() {
                        this.$items.addClass("active"), this.$boxes.addClass("open").removeClass("hide")
                    },
                    open: function(e, i) {
                        if (void 0 !== e) {
                            "object" == typeof e && e.preventDefault();
                            var s = t(e.target).closest("." + this.opts.toggleClass).get(0) || e.target,
                                o = "object" == typeof e ? this.getItem(s) : this.getItemBy(e);
                            o.$box.hasClass("open") || (this.opts.toggle && this.closeAll(), this.callback("open", o), this.addActive(o), o.$box.animation("slideDown", t.proxy(this.onOpened, this)))
                        }
                    },
                    onOpened: function() {
                        this.callback("opened", this.opts.currentItem)
                    },
                    closeAll: function() {
                        this.$items.removeClass("active").closest("li").removeClass("active"), this.$boxes.removeClass("open").addClass("hide")
                    },
                    close: function(e) {
                        var i = this.getItemBy(e);
                        this.callback("close", i), this.opts.currentItem = i, i.$box.animation("slideUp", t.proxy(this.onClosed, this))
                    },
                    onClosed: function() {
                        var t = this.opts.currentItem;
                        this.removeActive(t), this.callback("closed", t)
                    },
                    isOpened: function(e) {
                        return t(e).hasClass("open")
                    },
                    getItem: function(e) {
                        var i = {};
                        i.$el = t(e), i.hash = i.$el.attr("href"), i.$box = t(i.hash);
                        var s = i.$el.parent();
                        i.$parent = "LI" === s[0].tagName && s;
                        var o = i.$el.find(".caret");
                        return i.$caret = 0 !== o.length && o, i
                    },
                    getItemBy: function(t) {
                        var e = "number" == typeof t ? this.$items.eq(t - 1) : this.$element.find('[rel="' + t + '"]');
                        return this.getItem(e)
                    }
                }, u.Collapse.inherits(u), u.Plugin.create("Collapse"), u.Plugin.autoload("Collapse"), (p = v).Dropdown = function(t, e) {
                    this.namespace = "dropdown", this.defaults = {
                        target: null,
                        toggleEvent: "click",
                        height: !1,
                        width: !1,
                        animationOpen: "slideDown",
                        animationClose: "slideUp",
                        caretUp: !1,
                        callbacks: ["open", "opened", "close", "closed"]
                    }, p.apply(this, arguments), this.utils = new p.Utils, this.detect = new p.Detect, this.start()
                }, p.Dropdown.prototype = {
                    start: function() {
                        this.buildClose(), this.buildCaret(), this.detect.isMobile() && this.buildMobileAnimation(), this.$target.addClass("hide"), this.$element.on(this.opts.toggleEvent + "." + this.namespace, t.proxy(this.toggle, this))
                    },
                    stop: function() {
                        this.$element.off("." + this.namespace), this.$target.removeClass("open").addClass("hide"), this.disableEvents()
                    },
                    buildMobileAnimation: function() {
                        this.opts.animationOpen = "fadeIn", this.opts.animationClose = "fadeOut"
                    },
                    buildClose: function() {
                        this.$close = this.$target.find(".close")
                    },
                    buildCaret: function() {
                        this.$caret = this.getCaret(), this.buildCaretPosition()
                    },
                    buildCaretPosition: function() {
                        var e = this.$element.offset().top + this.$element.innerHeight() + this.$target.innerHeight();
                        t(document).height() > e || (this.opts.caretUp = !0, this.$caret.addClass("up"))
                    },
                    getCaret: function() {
                        return this.$element.find(".caret")
                    },
                    toggleCaretOpen: function() {
                        this.opts.caretUp ? this.$caret.removeClass("up").addClass("down") : this.$caret.removeClass("down").addClass("up")
                    },
                    toggleCaretClose: function() {
                        this.opts.caretUp ? this.$caret.removeClass("down").addClass("up") : this.$caret.removeClass("up").addClass("down")
                    },
                    toggle: function(t) {
                        this.isOpened() ? this.close(t) : this.open(t)
                    },
                    open: function(e) {
                        e && e.preventDefault(), this.callback("open"), t(".dropdown").removeClass("open").addClass("hide"), this.opts.height && this.$target.css("min-height", this.opts.height + "px"), this.opts.width && this.$target.width(this.opts.width), this.setPosition(), this.toggleCaretOpen(), this.$target.animation(this.opts.animationOpen, t.proxy(this.onOpened, this))
                    },
                    close: function(e) {
                        if (this.isOpened()) {
                            if (e) {
                                if (this.shouldNotBeClosed(e.target)) return;
                                e.preventDefault()
                            }
                            this.utils.enableBodyScroll(), this.callback("close"), this.toggleCaretClose(), this.$target.animation(this.opts.animationClose, t.proxy(this.onClosed, this))
                        }
                    },
                    onClosed: function() {
                        this.$target.removeClass("open"), this.disableEvents(), this.callback("closed")
                    },
                    onOpened: function() {
                        this.$target.addClass("open"), this.enableEvents(), this.callback("opened")
                    },
                    isOpened: function() {
                        return this.$target.hasClass("open")
                    },
                    enableEvents: function() {
                        this.detect.isDesktop() && this.$target.on("mouseover." + this.namespace, t.proxy(this.utils.disableBodyScroll, this.utils)).on("mouseout." + this.namespace, t.proxy(this.utils.enableBodyScroll, this.utils)), t(document).on("scroll." + this.namespace, t.proxy(this.setPosition, this)), t(window).on("resize." + this.namespace, t.proxy(this.setPosition, this)), t(document).on("click." + this.namespace + " touchstart." + this.namespace, t.proxy(this.close, this)), t(document).on("keydown." + this.namespace, t.proxy(this.handleKeyboard, this)), this.$target.find('[data-action="dropdown-close"]').on("click." + this.namespace, t.proxy(this.close, this))
                    },
                    disableEvents: function() {
                        this.$target.off("." + this.namespace), t(document).off("." + this.namespace), t(window).off("." + this.namespace)
                    },
                    handleKeyboard: function(t) {
                        27 === t.which && this.close(t)
                    },
                    shouldNotBeClosed: function(e) {
                        return "dropdown-close" !== t(e).attr("data-action") && e !== this.$close[0] && 0 !== t(e).closest(".dropdown").length
                    },
                    isNavigationFixed: function() {
                        return 0 !== this.$element.closest(".fixed").length
                    },
                    getPlacement: function(e) {
                        return t(document).height() < e ? "top" : "bottom"
                    },
                    getOffset: function(t) {
                        return this.isNavigationFixed() ? this.$element.position() : this.$element.offset()
                    },
                    getPosition: function() {
                        return this.isNavigationFixed() ? "fixed" : "absolute"
                    },
                    setPosition: function() {
                        if (this.detect.isMobile()) this.$target.addClass("dropdown-mobile");
                        else {
                            var e, i = this.getPosition(),
                                s = this.getOffset(i),
                                o = this.$target.innerHeight(),
                                n = this.$target.innerWidth(),
                                a = this.getPlacement(s.top + o + this.$element.innerHeight()),
                                r = t(window).width() < s.left + n ? n - this.$element.innerWidth() : 0,
                                h = s.left - r;
                            "bottom" === a ? (this.isOpened() || this.$caret.removeClass("up").addClass("down"), this.opts.caretUp = !1, e = s.top + this.$element.outerHeight() + 1) : (this.opts.animationOpen = "show", this.opts.animationClose = "hide", this.isOpened() || this.$caret.addClass("up").removeClass("down"), this.opts.caretUp = !0, e = s.top - o - 1), this.$target.css({
                                position: i,
                                top: e + "px",
                                left: h + "px"
                            })
                        }
                    }
                }, p.Dropdown.inherits(p), p.Plugin.create("Dropdown"), p.Plugin.autoload("Dropdown"), (f = v).Tabs = function(t, e) {
                    this.namespace = "tabs", this.defaults = {
                        equals: !1,
                        active: !1,
                        live: !1,
                        hash: !0,
                        callbacks: ["init", "next", "prev", "open", "opened", "close", "closed"]
                    }, f.apply(this, arguments), this.start()
                }, f.Tabs.prototype = {
                    start: function() {
                        !1 !== this.opts.live && this.buildLiveTabs(), this.tabsCollection = [], this.hashesCollection = [], this.currentHash = [], this.currentItem = !1, this.$items = this.getItems(), this.$items.each(t.proxy(this.loadItems, this)), this.$tabs = this.getTabs(), this.currentHash = this.getLocationHash(), this.closeAll(), this.setActiveItem(), this.setItemHeight(), this.callback("init")
                    },
                    getTabs: function() {
                        return t(this.tabsCollection).map(function() {
                            return this.toArray()
                        })
                    },
                    getItems: function() {
                        return this.$element.find("a")
                    },
                    loadItems: function(e, i) {
                        var s = this.getItem(i);
                        s.$el.attr("rel", s.hash), this.collectItem(s), s.$parent.hasClass("active") && (this.currentItem = s, this.opts.active = s.hash), s.$el.on("click.tabs", t.proxy(this.open, this))
                    },
                    collectItem: function(t) {
                        this.tabsCollection.push(t.$tab), this.hashesCollection.push(t.hash)
                    },
                    buildLiveTabs: function() {
                        var e = t(this.opts.live);
                        0 !== e.length && (this.$liveTabsList = t("<ul />"), e.each(t.proxy(this.buildLiveItem, this)), this.$element.html("").append(this.$liveTabsList))
                    },
                    buildLiveItem: function(e, i) {
                        var s = t(i),
                            o = t("<li />"),
                            n = t("<a />"),
                            a = e + 1;
                        s.attr("id", this.getLiveItemId(s, a));
                        var r = "#" + s.attr("id"),
                            h = this.getLiveItemTitle(s);
                        n.attr("href", r).attr("rel", r).text(h), o.append(n), this.$liveTabsList.append(o)
                    },
                    getLiveItemId: function(t, e) {
                        return void 0 === t.attr("id") ? this.opts.live.replace(".", "") + e : t.attr("id")
                    },
                    getLiveItemTitle: function(t) {
                        return void 0 === t.attr("data-title") ? t.attr("id") : t.attr("data-title")
                    },
                    setActiveItem: function() {
                        this.currentHash ? (this.currentItem = this.getItemBy(this.currentHash), this.opts.active = this.currentHash) : !1 === this.opts.active && (this.currentItem = this.getItem(this.$items.first()), this.opts.active = this.currentItem.hash), this.addActive(this.currentItem)
                    },
                    addActive: function(t) {
                        t.$parent.addClass("active"), t.$tab.removeClass("hide").addClass("open"), this.currentItem = t
                    },
                    removeActive: function(t) {
                        t.$parent.removeClass("active"), t.$tab.addClass("hide").removeClass("open"), this.currentItem = !1
                    },
                    next: function(t) {
                        t && t.preventDefault();
                        var e = this.getItem(this.fetchElement("next"));
                        this.open(e.hash), this.callback("next", e)
                    },
                    prev: function(t) {
                        t && t.preventDefault();
                        var e = this.getItem(this.fetchElement("prev"));
                        this.open(e.hash), this.callback("prev", e)
                    },
                    fetchElement: function(t) {
                        var e;
                        if (!1 !== this.currentItem) {
                            if (0 === (e = this.currentItem.$parent[t]().find("a")).length) return
                        } else e = this.$items[0];
                        return e
                    },
                    open: function(t, e) {
                        if (void 0 !== t) {
                            "object" == typeof t && t.preventDefault();
                            var i = "object" == typeof t ? this.getItem(t.target) : this.getItemBy(t);
                            this.closeAll(), this.callback("open", i), this.addActive(i), this.pushStateOpen(e, i), this.callback("opened", i)
                        }
                    },
                    pushStateOpen: function(t, e) {
                        !1 !== t && !1 !== this.opts.hash && history.pushState(!1, !1, e.hash)
                    },
                    close: function(t) {
                        var e = this.getItemBy(t);
                        e.$parent.hasClass("active") && (this.callback("close", e), this.removeActive(e), this.pushStateClose(), this.callback("closed", e))
                    },
                    pushStateClose: function() {
                        !1 !== this.opts.hash && history.pushState(!1, !1, " ")
                    },
                    closeAll: function() {
                        this.$tabs.removeClass("open").addClass("hide"), this.$items.parent().removeClass("active")
                    },
                    getItem: function(e) {
                        var i = {};
                        return i.$el = t(e), i.hash = i.$el.attr("href"), i.$parent = i.$el.parent(), i.$tab = t(i.hash), i
                    },
                    getItemBy: function(t) {
                        var e = "number" == typeof t ? this.$items.eq(t - 1) : this.$element.find('[rel="' + t + '"]');
                        return this.getItem(e)
                    },
                    getLocationHash: function() {
                        return !1 !== this.opts.hash && !!this.isHash() && top.location.hash
                    },
                    isHash: function() {
                        return !("" === top.location.hash || -1 === t.inArray(top.location.hash, this.hashesCollection))
                    },
                    setItemHeight: function() {
                        if (this.opts.equals) {
                            var t = this.getItemMaxHeight() + "px";
                            this.$tabs.css("min-height", t)
                        }
                    },
                    getItemMaxHeight: function() {
                        var e = 0;
                        return this.$tabs.each(function() {
                            var i = t(this).height();
                            e = i > e ? i : e
                        }), e
                    }
                }, f.Tabs.inherits(f), f.Plugin.create("Tabs"), f.Plugin.autoload("Tabs"), (m = jQuery).modalcurrent = null, m.modalwindow = function(t) {
                    var e = m.extend({}, t, {
                        show: !0
                    });
                    m("<span />").modal(e)
                }, (g = v).Modal = function(t, e) {
                    this.namespace = "modal", this.defaults = {
                        target: null,
                        show: !1,
                        url: !1,
                        header: !1,
                        width: "600px",
                        height: !1,
                        maxHeight: !1,
                        position: "center",
                        overlay: !0,
                        appendForms: !1,
                        appendFields: !1,
                        animationOpen: "show",
                        animationClose: "hide",
                        callbacks: ["open", "opened", "close", "closed"]
                    }, g.apply(this, arguments), this.utils = new g.Utils, this.detect = new g.Detect, this.start()
                }, g.Modal.prototype = {
                    start: function() {
                        this.hasTarget() && (this.opts.show ? this.load() : this.$element.on("click." + this.namespace, t.proxy(this.load, this)))
                    },
                    buildModal: function() {
                        this.$modal = this.$target.find(".modal"), this.$header = this.$target.find(".modal-header"), this.$close = this.$target.find(".close"), this.$body = this.$target.find(".modal-body")
                    },
                    buildOverlay: function() {
                        !1 !== this.opts.overlay && (0 !== t("#modal-overlay").length ? this.$overlay = t("#modal-overlay") : (this.$overlay = t('<div id="modal-overlay">').addClass("hide"), t("body").prepend(this.$overlay)), this.$overlay.addClass("overlay"))
                    },
                    buildHeader: function() {
                        this.opts.header && this.$header.html(this.opts.header)
                    },
                    load: function(t) {
                        this.buildModal(), this.buildOverlay(), this.buildHeader(), this.opts.url ? this.buildContent() : this.open(t)
                    },
                    open: function(e) {
                        e && e.preventDefault(), this.isOpened() || (this.detect.isMobile() && (this.opts.width = "96%"), this.opts.overlay && this.$overlay.removeClass("hide"), this.$target.removeClass("hide"), this.$modal.removeClass("hide"), this.enableEvents(), this.findActions(), this.resize(), t(window).on("resize." + this.namespace, t.proxy(this.resize, this)), this.detect.isDesktop() && this.utils.disableBodyScroll(), this.$modal.find("input[type=text],input[type=url],input[type=email]").on("keydown." + this.namespace, t.proxy(this.handleEnter, this)), this.callback("open"), this.$modal.animation(this.opts.animationOpen, t.proxy(this.onOpened, this)))
                    },
                    close: function(e) {
                        if (this.$modal && this.isOpened()) {
                            if (e) {
                                if (this.shouldNotBeClosed(e.target)) return;
                                e.preventDefault()
                            }
                            this.callback("close"), this.disableEvents(), this.$modal.animation(this.opts.animationClose, t.proxy(this.onClosed, this)), this.opts.overlay && this.$overlay.animation(this.opts.animationClose)
                        }
                    },
                    onOpened: function() {
                        this.$modal.addClass("open"), this.callback("opened"), t.modalcurrent = this
                    },
                    onClosed: function() {
                        this.callback("closed"), this.$target.addClass("hide"), this.$modal.removeClass("open"), this.detect.isDesktop() && this.utils.enableBodyScroll(), this.$body.css("height", ""), t.modalcurrent = null
                    },
                    isOpened: function() {
                        return this.$modal.hasClass("open")
                    },
                    getData: function() {
                        var t = new g.FormData(this);
                        return t.set(""), t.get()
                    },
                    buildContent: function() {
                        t.ajax({
                            url: this.opts.url + "?" + (new Date).getTime(),
                            cache: !1,
                            type: "post",
                            data: this.getData(),
                            success: t.proxy(function(t) {
                                this.$body.html(t), this.open()
                            }, this)
                        })
                    },
                    buildWidth: function() {
                        var e = this.opts.width,
                            i = "2%",
                            s = "2%",
                            o = e.match(/%$/);
                        parseInt(this.opts.width) > t(window).width() && !o ? e = "96%" : o || (i = "16px", s = "16px"), this.$modal.css({
                            width: e,
                            "margin-top": i,
                            "margin-bottom": s
                        })
                    },
                    buildPosition: function() {
                        if ("center" === this.opts.position) {
                            var e = t(window).height(),
                                i = this.$modal.outerHeight(),
                                s = e / 2 - i / 2 + "px";
                            this.detect.isMobile() ? s = "2%" : i > e && (s = "16px"), this.$modal.css("margin-top", s)
                        }
                    },
                    buildHeight: function() {
                        var e = t(window).height();
                        if (this.opts.maxHeight) {
                            var i = parseInt(this.$body.css("padding-top")) + parseInt(this.$body.css("padding-bottom")),
                                s = parseInt(this.$modal.css("margin-top")) + parseInt(this.$modal.css("margin-bottom")),
                                o = e - this.$header.innerHeight() - i - s;
                            this.$body.height(o)
                        } else !1 !== this.opts.height && this.$body.css("height", this.opts.height);
                        this.$modal.outerHeight() > e && (this.opts.animationOpen = "show", this.opts.animationClose = "hide")
                    },
                    resize: function() {
                        this.buildWidth(), this.buildPosition(), this.buildHeight()
                    },
                    enableEvents: function() {
                        this.$close.on("click." + this.namespace, t.proxy(this.close, this)), t(document).on("keyup." + this.namespace, t.proxy(this.handleEscape, this)), this.$target.on("click." + this.namespace, t.proxy(this.close, this))
                    },
                    disableEvents: function() {
                        this.$close.off("." + this.namespace), t(document).off("." + this.namespace), this.$target.off("." + this.namespace), t(window).off("." + this.namespace)
                    },
                    findActions: function() {
                        this.$body.find('[data-action="modal-close"]').on("mousedown." + this.namespace, t.proxy(this.close, this))
                    },
                    setHeader: function(t) {
                        this.$header.html(t)
                    },
                    setContent: function(t) {
                        this.$body.html(t)
                    },
                    setWidth: function(t) {
                        this.opts.width = t, this.resize()
                    },
                    getModal: function() {
                        return this.$modal
                    },
                    getBody: function() {
                        return this.$body
                    },
                    getHeader: function() {
                        return this.$header
                    },
                    handleEnter: function(t) {
                        13 === t.which && (t.preventDefault(), this.close(!1))
                    },
                    handleEscape: function(t) {
                        return 27 !== t.which || this.close(!1)
                    },
                    shouldNotBeClosed: function(e) {
                        return "modal-close" !== t(e).attr("data-action") && e !== this.$close[0] && 0 !== t(e).closest(".modal").length
                    }
                }, g.Modal.inherits(g), g.Plugin.create("Modal"), g.Plugin.autoload("Modal")
            }(jQuery),
            function(t) {
                "#page-top" === window.location.hash && o("", 5);
                var e = {
                        items: {},
                        eachCategory: function(t) {
                            for (var e in this.items) this.items.hasOwnProperty(e) && t(this.items[e])
                        },
                        addItem: function(t, e) {
                            this.items[t] || (this.items[t] = []), this.items[t].push(e)
                        },
                        all: function() {
                            var t = [];
                            for (var e in this.items) this.items.hasOwnProperty(e) && (t = t.concat(this.items[e]));
                            return t
                        }
                    },
                    i = !1;

                function s(e) {
                    var i = isNaN(parseFloat(e.options.offset)) ? e.options.offset.call(e.target) : e.options.offset;
                    return e.target.offset().top - i - t("body").offset().top
                }

                function o(t, e) {
                    t === location.hash.replace("#", "") || "page-top" === t && "" === location.hash.replace("#", "") || setTimeout(function() {
                        t = t ? "page-top" === t ? " " : "#" + t : " ", history && history.replaceState && history.replaceState({}, "", t)
                    }, e || 100)
                }

                function n(e) {
                    if (!i) {
                        i = !0;
                        var n = s(e);
                        t("html, body").animate({
                            scrollTop: n
                        }, {
                            easing: "linear",
                            complete: function() {
                                var n = s(e);
                                t("html, body").animate({
                                    scrollTop: n
                                }, {
                                    easing: "linear",
                                    duration: 100,
                                    complete: function() {
                                        i = !1, o(e.id, 5)
                                    }
                                })
                            }
                        })
                    }
                }

                function a(e) {
                    var i = (e.attr("href") || "").split("#").pop(),
                        s = function(t) {
                            var e = jQuery(t)[0].href || "",
                                i = "#";
                            try {
                                var s = new window.URL(e);
                                i = [s.protocol, "//", s.host, s.pathname].join("")
                            } catch (t) {
                                i = e.split("?")[0].split("#")[0]
                            }
                            return i
                        }(e),
                        o = null,
                        n = [location.protocol, "//", location.host, location.pathname].join("");
                    if (s.length && s !== n) return o;
                    if (i.trim().length) try {
                        o = t('[id="' + i + '"]')
                    } catch (t) {
                        console.log("error scrollSpy", t)
                    }
                    return o && o.length ? o : null
                }

                function r() {
                    e.eachCategory(function(t) {
                        var e = t.sort(function(t, e) {
                                return t.target.offset().top - e.target.offset().top
                            }),
                            i = e.filter(function(t) {
                                return t.target.offset().top <= window.scrollY + .25 * window.innerHeight
                            }).pop();
                        e.forEach(function(t) {
                            i && t.element.is(i.element) ? (o(t.id, 5), t.options.onChange.call(t.element)) : t.options.onLeave.call(t.element)
                        })
                    })
                }
                t.fn.smoothScrollAnchor = function(e) {
                    var i = t(this);
                    e = jQuery.extend({
                        offset: 0
                    }, e), i.each(function() {
                        var i = t(this),
                            s = e.target || a(i);
                        if (s && s.length) {
                            var o = {
                                element: i,
                                options: e,
                                target: s,
                                targetSel: e.targetSel || '[id="' + s.attr("id").trim() + '"]',
                                id: (s.attr("id") || "").trim()
                            };
                            i.off("click tap").on("click tap", function(e) {
                                t(this).data("skip-smooth-scroll") || (e.preventDefault(), t(this).data("allow-propagation") || e.stopPropagation(), n(o), o.clickCallback && o.clickCallback.call(this, e))
                            })
                        }
                    })
                }, t.fn.scrollSpy = function(i) {
                    var s = t(this),
                        o = "spy-" + parseInt(Date.now() * Math.random());
                    s.each(function() {
                        var s = t(this);
                        if (i = jQuery.extend({
                            onChange: function() {},
                            onLeave: function() {},
                            clickCallback: function() {},
                            smoothScrollAnchor: !1,
                            offset: 0
                        }, i), s.is("a") && -1 !== (s.attr("href") || "").indexOf("#")) {
                            var n = a(s);
                            if (n) {
                                var r = {
                                    element: s,
                                    options: i,
                                    target: n,
                                    targetSel: '[id="' + n.attr("id").trim() + '"]',
                                    id: n.attr("id").trim()
                                };
                                e.addItem(o, r), s.data("scrollSpy", r), i.smoothScrollAnchor && s.smoothScrollAnchor({
                                    offset: i.offset
                                })
                            }
                        }
                    })
                }, t(window).scroll(r), t(window).bind("smoothscroll.update", r), t(function() {
                    var i = window.location.hash.replace("#", ""),
                        s = e.all().filter(function(t) {
                            return t.targetSel === '[id="' + i.trim() + '"]'
                        });
                    t(window).on("load", function() {
                        s.length && n(s[0]), r()
                    })
                })
            }(jQuery),
            function(t) {
                function e(e) {
                    e.find("[data-selected-item]").each(function() {
                        t(this).removeAttr("data-selected-item");
                        var i = e.children("ul");
                        e.is(".mobile-menu") && i.slideDown()
                    })
                }

                function i(e, i) {
                    t("body").off("tap.navigation-clear-selection"), t(window).off("scroll.navigation-clear-selection"), e.is(i) || t.contains(i[0], this) || s(i)
                }

                function s(e, i) {
                    e.find("li.hover").each(function() {
                        var e;
                        i && (e = t(this), e.find("[data-selected-item]").length > 0 || e.is("[data-selected-item]")) || t(this).removeClass("hover")
                    })
                }

                function o(t, e) {
                    if (e.parentsUntil("ul.dorpdown-menu").filter("li").length > 0) {
                        var i = e.children("ul"),
                            s = i.length && e.offset().left + e.width() + 300 > window.innerWidth,
                            o = i.length && e.closest(".open-reverse").length;
                        s || o ? i.addClass("open-reverse") : i.length && i.removeClass("open-reverse")
                    }
                }

                function n(e) {
                    var i = e;
                    t.fn.scrollSpy && i.find("a").scrollSpy({
                        onChange: function() {
                            i.find(".current-menu-item,.current_page_item").removeClass("current-menu-item current_page_item"), t(this).closest("li").addClass("current-menu-item")
                        },
                        onLeave: function() {
                            t(this).closest("li").removeClass("current-menu-item current_page_item")
                        },
                        smoothScrollAnchor: !0,
                        offset: function() {
                            var e = t(".navigation-bar.fixto-fixed");
                            return e.length ? e[0].getBoundingClientRect().height : 0
                        }
                    }), t(window).trigger("smoothscroll.update")
                }
                t.event.special.tap || (t.event.special.tap = {
                    setup: function(e, i) {
                        t(this).bind("touchstart", t.event.special.tap.handler).bind("touchmove", t.event.special.tap.handler).bind("touchend", t.event.special.tap.handler)
                    },
                    teardown: function(e) {
                        t(this).unbind("touchstart", t.event.special.tap.handler).unbind("touchmove", t.event.special.tap.handler).unbind("touchend", t.event.special.tap.handler)
                    },
                    handler: function(e) {
                        var i = t(this);
                        i.data(e.type, 1), "touchend" !== e.type || i.data("touchmove") ? i.data("touchend") && i.removeData("touchstart touchmove touchend") : (e.type = "tap", t.event.handle.apply(this, arguments))
                    }
                }), t("ul.dropdown-menu").each(function() {
                    var a = t(this);
                    if (a.hasClass("mobile-menu")) {
                        var r = t('<a href="#" data-menu-toggler="">Menu</a>');
                        a.before(r), r.click(function() {
                            r.hasClass("opened") ? (a.slideUp(300, function() {
                                a.css("display", "")
                            }), a.removeClass("mobile-menu"), r.removeClass("opened")) : (r.addClass("opened"), a.slideDown(), a.addClass("mobile-menu"), s(a), e(a))
                        })
                    }
                    t("");
                    a.on("tap.navigation", "li.menu-item > a, li.page_item > a", function(n) {
                        var r, h, l = t(this),
                            c = l.parent();
                        if (c.children("ul").length)
                            if (c.is("[data-selected-item]")) {
                                var d = l.attr("href");
                                if (0 === d.indexOf("#")) {
                                    var u = d.replace("#", "").trim();
                                    if (!u || !t("#" + u).length) return
                                }
                                e(a)
                            } else h = c, e(r = a), h.attr("data-selected-item", !0), s(r, h), h.addClass("hover"), o(0, h), t("body").on("tap.navigation-clear-selection", "*", function() {
                                i(jQuery(this), r)
                            }), t(window).on("scroll.navigation-clear-selection", function() {
                                i(jQuery(this), r)
                            }), n.preventDefault(), n.stopPropagation();
                        else n.stopPropagation(), e(a)
                    }), a.on("mouseover.navigation", "li", function() {
                        a.find("li.hover").removeClass("hover"), o(0, t(this))
                    }), n(a)
                }), t(function() {
                    window.wp && window.wp.customize && (jQuery(".offcanvas_menu").find("li > ul").eq(0).each(function() {
                        jQuery(this).show(), jQuery(this).parent().addClass("open")
                    }), window.wp.customize.selectiveRefresh.bind("render-partials-response", function(e) {
                        Object.getOwnPropertyNames(e.contents).filter(function(t) {
                            return -1 !== t.indexOf("nav_menu_instance[")
                        }).length && setTimeout(function() {
                            t("ul.dropdown-menu").each(function() {
                                n(t(this))
                            })
                        }, 1e3)
                    }))
                })
            }(jQuery), window.mesmerizeMenuSticky = function() {
            var t = jQuery,
                e = "data-sticky";

            function i(t) {
                return t ? e + "-" + t : e
            }
            var s = t("[" + e + "]");
            s.each(function(e, s) {
                var o = t(s);
                if (!o.data("stickData")) {
                    var n = parseInt(o.attr(i())),
                        a = "1" == o.attr(i("mobile")),
                        r = "1" == o.attr(i("shrinked")),
                        h = "bottom" == o.attr(i("to")),
                        l = "1" == o.attr(i("always"));
                    l && o.addClass("fixto-fixed"), r && o.attr(i(), "initial");
                    var c = {
                        center: !0,
                        responsiveWidth: !0,
                        zIndex: 1e4 + e,
                        topSpacing: n,
                        stickyOnMobile: a,
                        stickyOnTablet: !0,
                        useShrink: r,
                        toBottom: h,
                        useNativeSticky: !1,
                        always: l
                    };
                    r || (0 === n && jQuery("#wpadminbar").length && "absolute" === jQuery("#wpadminbar").css("position") && (n = 0), c.topSpacing = n, c.top = n, o.data("stickData", c), o.fixTo("body", c))
                }
            });
            var o = function() {
                var e = this.$els;
                window.innerWidth < 1024 ? e.each(function(e, i) {
                    var s = t(this).data(),
                        o = s.stickData;
                    if (o) {
                        var n = s.fixtoInstance;
                        if (!n) return !0;
                        window.innerWidth <= 767 ? o.stickyOnMobile || n.stop() : o.stickyOnTablet || n.stop()
                    }
                }) : e.each(function(e, i) {
                    var s = t(this).data();
                    if (s) {
                        var o = s.fixtoInstance;
                        if (!o) return !0;
                        o.start()
                    }
                })
            }.bind({
                $els: s
            });
            t(window).bind("resize.sticky orientationchange.sticky", function() {
                setTimeout(o, 50)
            }), t(window).trigger("resize.sticky")
        }, jQuery(document).ready(function(t) {
            mesmerizeMenuSticky()
        }),
            function(t) {
                function e(t, e) {
                    var i = jQuery(t),
                        s = mesmerize_video_background.getVideoRect();
                    i.css({
                        width: Math.round(s.width),
                        "max-width": Math.round(s.width),
                        height: Math.round(s.height),
                        opacity: 1,
                        left: s.left
                    })
                }
                window.addEventListener("resize", function() {
                    var t = document.querySelector("video#wp-custom-header-video") || document.querySelector("iframe#wp-custom-header-video");
                    t && (e(t), mesmerize_video_background.resizePoster())
                }), jQuery(function() {
                    var t = document.querySelector("video#wp-custom-header-video") || document.querySelector("iframe#wp-custom-header-video");
                    t && e(t)
                }), __cpVideoElementFirstPlayed = !1, document.addEventListener("wp-custom-header-video-loaded", function() {
                    var t = document.querySelector("video#wp-custom-header-video");
                    t ? e(t) : document.querySelector("#wp-custom-header") && document.querySelector("#wp-custom-header").addEventListener("play", function() {
                        var t = document.querySelector("iframe#wp-custom-header-video"),
                            i = document.querySelector("video#wp-custom-header-video") || t;
                        i && !__cpVideoElementFirstPlayed && (__cpVideoElementFirstPlayed = !0, e(i)),
                            function() {
                                for (var t in wp.customHeader.handlers) {
                                    var e = wp.customHeader.handlers[t];
                                    if (e.settings) return e
                                }
                            }().play()
                    })
                })
            }(jQuery),
            function(t) {
                "ontouchstart" in window && (document.documentElement.className = document.documentElement.className + " touch-enabled"), navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/i) && (document.documentElement.className = document.documentElement.className + " no-parallax");
                var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t, e) {
                    window.setTimeout(t, 1e3 / 60)
                };
                window.requestInterval = function(t, i, s) {
                    if (!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame)) return window.setInterval(t, i);
                    var o = (new Date).getTime(),
                        n = {};
                    return n.value = e(function a() {
                        var r = (new Date).getTime() - o;
                        r >= i && (t.call(), o = (new Date).getTime()), n.value = e(a), r >= i && s && !0 === s.call() && clearRequestInterval(n)
                    }), n
                }, window.clearRequestInterval = function(t) {
                    window.cancelAnimationFrame ? window.cancelAnimationFrame(t.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(t.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(t.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(t.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(t.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(t.value) : clearInterval(t)
                }, t.event.special.tap || (t.event.special.tap = {
                    setup: function(e, i) {
                        t(this).bind("touchstart", t.event.special.tap.handler).bind("touchmove", t.event.special.tap.handler).bind("touchend", t.event.special.tap.handler)
                    },
                    teardown: function(e) {
                        t(this).unbind("touchstart", t.event.special.tap.handler).unbind("touchmove", t.event.special.tap.handler).unbind("touchend", t.event.special.tap.handler)
                    },
                    handler: function(e) {
                        var i = t(this);
                        i.data(e.type, 1), "touchend" !== e.type || i.data("touchmove") ? i.data("touchend") && i.removeData("touchstart touchmove touchend") : (e.type = "tap", t.event.handle.apply(this, arguments))
                    }
                }), t.fn.isInView || (t.fn.isInView = function(e) {
                    var i = t(window).scrollTop(),
                        s = i + t(window).height(),
                        o = t(this).offset().top,
                        n = o + t(this).height();
                    return !0 === e ? i < o && s > n : o <= s && n >= i
                }), t.throttle || (t.throttle = function(t, e, i) {
                    var s, o;
                    return e || (e = 250),
                        function() {
                            var n = i || this,
                                a = +new Date,
                                r = arguments;
                            s && a < s + e ? (clearTimeout(o), o = setTimeout(function() {
                                s = a, t.apply(n, r)
                            }, e)) : (s = a, t.apply(n, r))
                        }
                }), t.debounce || (t.debounce = function(t, e, i) {
                    var s;
                    return function() {
                        var o = this,
                            n = arguments,
                            a = i && !s;
                        clearTimeout(s), s = setTimeout(function() {
                            s = null, i || t.apply(o, n)
                        }, e), a && t.apply(o, n)
                    }
                })
            }(jQuery),
            function(t) {
                if (window.mesmerize_smooth_scroll && window.mesmerize_smooth_scroll.enabled) {
                    var e = !0,
                        i = null,
                        s = null,
                        o = 10,
                        n = 10,
                        a = 100,
                        r = 0;
                    t(window).load(function(t) {
                        window.addEventListener && window.addEventListener("DOMMouseScroll", h, !1), window.onmousewheel = document.onmousewheel = h
                    })
                }

                function h(h) {
                    var l, c = 0;
                    return h.wheelDelta ? c = h.wheelDelta / 120 : h.detail && (c = -h.detail / 3), 0 === window.scrollY && c > 0 || (window.innerHeight + window.scrollY >= document.body.offsetHeight && c < 0 || (l = c, l = Math.sign(l) * parseInt(Math.min(Math.abs(l, 10))), null === i && (i = t(window).scrollTop()), i -= a * l, e = l > 0, t("body").on("mousedown.wheelscroll", "a", function(e) {
                        s && (clearRequestInterval(s), s = null, i = null, t("body").off("mousedown.wheelscroll"))
                    }), null === s && (s = requestInterval(function() {
                        var e = t(window).scrollTop();
                        r = Math.round((i - e) / n), t(window).scrollTop(e + r)
                    }, o, function() {
                        var o = t(window).scrollTop();
                        return !!(o <= 0 && e || o >= t(window).prop("scrollHeight") - t(window).height() || e && r > -1 || !e && r < 1) && (s = null, i = null, !0)
                    })), h.preventDefault && h.preventDefault(), void(h.returnValue = !1)))
                }
            }(jQuery), mesmerizeDomReady(function(t) {
            if (window.mesmerize_backstretch) {
                window.mesmerize_backstretch.duration = parseInt(window.mesmerize_backstretch.duration), window.mesmerize_backstretch.transitionDuration = parseInt(window.mesmerize_backstretch.transitionDuration);
                var e = mesmerize_backstretch.images;
                if (!e) return;
                t(".header-homepage, .header").backstretch(e, mesmerize_backstretch)
            }
            if (t.fn.smoothScrollAnchor) {
                var i = t("body");
                t(".header-homepage-arrow-c .header-homepage-arrow").smoothScrollAnchor({
                    target: i.find("[data-id]").length ? i.find("[data-id]").first() : i.find(".page-content, .content").eq(0),
                    targetSel: i.find("[data-id]").length ? "[data-id]:first" : ".page-content, .content",
                    offset: function() {
                        var e = t(".navigation-bar.fixto-fixed");
                        return e.length ? e[0].getBoundingClientRect().height : 0
                    }
                })
            }
        }), mesmerizeDomReady(function(t) {
            var e = !1,
                i = t(".post-list.row");

            function s() {
                if (!e) {
                    e = !0, i.find("img").each(function() {
                        this.onload = n, setTimeout(function() {
                            i.data().masonry.layout()
                        }, 500)
                    });
                    var s = t(".post-list.row .post-list-item"),
                        o = s.length - 1;
                    s.each(function() {
                        t(this).css({
                            width: t(this).css("max-width")
                        })
                    }), i.length && i.masonry({
                        itemSelector: ".post-list-item",
                        percentPosition: !0,
                        columnWidth: "." + s.eq(o).attr("data-masonry-width")
                    })
                }

                function n() {
                    i.data().masonry.layout()
                }
            }
            i.is("[data-no-masonry]") || (window.innerWidth >= 768 && s(), t(window).resize(function() {
                window.innerWidth >= 768 ? s() : i.data("masonry") && i.masonry("destroy")
            }))
        }),
            function(t) {
                function e(t, e) {
                    t.offset().top + t.outerHeight() >= e.offset().top + e.height() ? t.css("visibility", "visible") : t.css("visibility", "")
                }

                function i(t, i) {
                    i.css("margin-bottom", t.outerHeight() - 1), e(t, i)
                }
                window.mesmerizeFooterParalax = function() {
                    var s = t(".footer.paralax");
                    if (s.length) {
                        if (s.parents(".no-parallax").length) return void s.css("visibility", "visible");
                        t(".header-wrapper").css("z-index", 1);
                        var o = s.prev();
                        o.addClass("footer-shadow"), o.css({
                            position: "relative",
                            "z-index": 1
                        }), t(window).bind("resize.footerParalax", function() {
                            i(s, o)
                        }), mesmerizeDomReady(function() {
                            window.setTimeout(function() {
                                i(s, o)
                            }, 100)
                        }), i(s, o), t(window).bind("scroll.footerParalax", function() {
                            e(s, o)
                        })
                    }
                }, window.mesmerizeStopFooterParalax = function() {
                    var e = t(".footer").prev();
                    t(".header-wrapper").css("z-index", 0), e.removeClass("footer-shadow"), e.css("margin-bottom", "0px"), t(window).unbind("resize.footerParalax"), t(window).unbind("scroll.footerParalax")
                }, mesmerizeFooterParalax()
            }(jQuery), mesmerizeDomReady(function(t) {
            var e = t("[data-text-effect]");
            t.fn.typed && e.length && JSON.parse(mesmerize_morph.header_text_morph) && e.each(function() {
                t(this).empty(), t(this).typed({
                    strings: JSON.parse(t(this).attr("data-text-effect")),
                    typeSpeed: parseInt(mesmerize_morph.header_text_morph_speed),
                    loop: !0
                })
            })
        }),
            function(t) {
                var e = t(".offcanvas_menu"),
                    i = t("#offcanvas-wrapper");
                i.length && (t("html").addClass("has-offscreen"), i.appendTo("body"), i.on("kube.offcanvas.ready", function() {
                    i.removeClass("force-hide")
                }), i.on("kube.offcanvas.open", function() {
                    t("html").addClass("offcanvas-opened")
                }), i.on("kube.offcanvas.close", function() {
                    t("html").removeClass("offcanvas-opened")
                })), e.each(function() {
                    var e = t(this);
                    e.on("mesmerize.open-all", function() {
                        t(this).find(".menu-item-has-children, .page_item_has_children").each(function() {
                            t(this).addClass("open"), t(this).children("ul").slideDown(100)
                        })
                    }), e.find(".menu-item-has-children a, .page_item_has_children a").each(function() {
                        0 === t(this).children("i.fa.arrow").length && t(this).append('<i class="fa arrow"></i>')
                    }), e.on("click tap", ".menu-item-has-children > a, .page_item_has_children > a", function(e) {
                        var i = t(this),
                            s = i.closest("li");
                        if (e.stopPropagation(), 0 === s.children("ul").length) return t('[data-component="offcanvas"]').offcanvas("close"), !0;
                        if (s.hasClass("open")) {
                            if (i.is("a")) return t('[data-component="offcanvas"]').offcanvas("close"), !0;
                            s.children("ul").slideUp(100, function() {
                                s.find("ul").each(function() {
                                    t(this).parent().removeClass("open"), t(this).css("display", "none")
                                })
                            })
                        } else s.children("ul").slideDown(100);
                        s.toggleClass("open"), e.preventDefault()
                    }), e.on("click tap", ".mesmerize-menu-cart", function(t) {
                        t.stopPropagation()
                    }), e.on("click tap", ".menu-item-has-children > a > .arrow, .page_item_has_children  > a > .arrow", function(e) {
                        var i = t(this).closest("li");
                        e.stopPropagation(), e.preventDefault(), i.toggleClass("open"), i.hasClass("open") ? i.children("ul").slideDown(100) : i.children("ul").slideUp(100)
                    }), e.on("click tap", "a", function(e) {
                        0 === t(this).closest("li").children("ul").length && t('[data-component="offcanvas"]').offcanvas("close")
                    }), t.fn.scrollSpy && (e.find("a").each(function() {
                        t(this).data("allow-propagation", !0)
                    }), e.find("a > i").each(function() {
                        t(this).data("allow-propagation", !1), t(this).data("skip-smooth-scroll", !0)
                    }), e.find("a").scrollSpy({
                        onChange: function() {
                            e.find(".current-menu-item,.current_page_item").removeClass("current-menu-item current_page_item"), t(this).closest("li").addClass("current-menu-item")
                        },
                        onLeave: function() {
                            t(this).closest("li").removeClass("current-menu-item current_page_item")
                        },
                        clickCallback: function() {
                            t('[data-component="offcanvas"]').offcanvas("close")
                        },
                        smoothScrollAnchor: !0,
                        offset: function() {
                            return t(".navigation-bar.fixto-fixed").length ? t(".navigation-bar.fixto-fixed")[0].getBoundingClientRect().height : 0
                        }
                    }))
                }), t.fn.smoothScrollAnchor && (t("#page > .page-content > .content, #page >  .content").find("a[data-cp-link]").filter(function() {
                    var e = t(this);
                    return !e.is("[role=tab]") && !e.parent().is("[role=tab]")
                }).smoothScrollAnchor(), t("#page > .footer").find("a").filter(function() {
                    var e = t(this);
                    return !e.is("[role=tab]") && !e.parent().is("[role=tab]")
                }).smoothScrollAnchor())
            }(jQuery),
            function(t) {
                function e(e) {
                    var i = e.find("[data-countup]"),
                        s = i.text();
                    s = jQuery.map(s.match(/[-]{0,1}[s\d.]*[\d]+/g), function(t) {
                        return t
                    }).join([]);
                    var o = void 0 !== i.attr("data-max") ? i.attr("data-max") : 100,
                        n = void 0 !== i.attr("data-min") ? i.attr("data-min") : 0;
                    if (n > o) {
                        var a = o;
                        o = n, n = a
                    }
                    s || (s = n);
                    var r = s / o * 100,
                        h = e.find(".circle-bar"),
                        l = h.attr("r"),
                        c = Math.PI * (2 * l);
                    r < 0 && (r = 0), r > 100 && (r = 100);
                    var d = c * (100 - r) / 100;
                    h.css({
                        strokeDashoffset: d
                    }), t(function() {
                        wp && wp.customize || h.parent().height(h.parent().width())
                    })
                }

                function i(t) {
                    e(t), t.find("[data-countup]").bind("countup.update", function() {
                        e(t)
                    }), t.data("doCircle", function() {
                        e(t)
                    })
                }

                function s(t, e) {
                    var i = void 0 !== t.attr("data-min") ? t.attr("data-min") : 0,
                        o = t.attr("data-stop"),
                        n = void 0 !== t.attr("data-max") ? t.attr("data-max") : 100,
                        a = t.attr("data-prefix") || "",
                        r = t.attr("data-suffix") || "",
                        h = t.attr("data-duration") || 2e3,
                        l = t.attr("data-decimals") || 0;
                    void 0 !== o && (n = o);
                    var c = "";
                    try {
                        var d = new CountUp(t[0], parseInt(i), parseInt(n), parseInt(l), parseInt(h) / 1e3, {
                            prefix: a,
                            suffix: r,
                            onUpdate: function(e) {
                                t.trigger("countup.update", [e])
                            }
                        });
                        c = d.options.formattingFn(parseInt(n))
                    } catch (t) {
                        console.error("invalid countup args", {
                            min: i,
                            max: n,
                            decimals: l,
                            duration: h,
                            suffix: r,
                            prefix: a
                        })
                    }
                    t.data("countup", d), t.attr("data-max-computed", c), e && t.data("countup").reset(), (t.isInView(!0) || e) && t.data("countup").start(), t.data("restartCountUp", function() {
                        s(t)
                    })
                }
                t(".circle-counter").each(function() {
                    i(t(this))
                });
                var o = t("[data-countup]");
                o.each(function() {
                    s(t(this))
                }), t(window).on("scroll", function() {
                    o.each(function() {
                        var e = t(this);
                        e.isInView(!0) && !e.data("one") && (e.data("countup").start(), e.data("one", !0))
                    })
                }), t(function() {
                    wp && wp.customize || t(window).on("resize", function() {
                        t(".circle-counter .circle-svg").each(function() {
                            t(this).height(t(this).width())
                        })
                    })
                });
                try {
                    parent.CP_Customizer && parent.CP_Customizer.addModule(function(e) {
                        e.hooks.addAction("after_node_insert", function(e) {
                            e.is("[data-countup]") && (e.closest(".circle-counter").length && i(e.closest(".circle-counter")), s(e, !0)), e.find("[data-countup]").each(function() {
                                t(this).closest(".circle-counter").length && i(t(this).closest(".circle-counter")), s(t(this), !0)
                            })
                        })
                    })
                } catch (t) {}
            }(jQuery),
            function(t) {
                var e = function(e, i, s) {
                    t("body").on("mouseover.ope-woo", function(o) {
                        var n, a, r, h, l, c = t(o.target);
                        (n = c, a = e, r = i, h = t.contains(r[0], n[0]) || n.is(r), l = t.contains(a[0], n[0]) || n.is(a), h || l || c.is(s)) || (t("body").off("mouseover.ope-woo"), e.fadeOut())
                    })
                };

                function i(e, i) {
                    if (!t("body").is(".woocommerce-cart") && !t("body").is(".woocommerce-checkout")) {
                        var s = i.offset().top + i.outerHeight() - i.closest("div").offset().top;
                        if (i.offset().left < e.outerWidth()) var o = i.offset().left + e.outerWidth() + 12;
                        else o = i.offset().left + i.width() + 5;
                        e.css({
                            position: "absolute",
                            "z-index": "100000",
                            top: s,
                            left: o
                        }), e.fadeIn()
                    }
                }
                jQuery(document).ready(function() {
                    var s, o = jQuery("#main_menu"),
                        n = o.find("li.mesmerize-menu-cart"),
                        a = jQuery(".mesmerize-woo-header-cart");
                    ! function(t, s, o) {
                        t.parent().append(o);
                        var n = t.find("li").not(s);
                        s.children("a").off().on("mouseover", function(a) {
                            0 !== o.children().length && (n.trigger("mouseleave"), e(o, s, t), i(o, s))
                        })
                    }(o, n, a), (s = a).prepend('<a href="#" class="close-mini-cart small"><i class="fa fa-close"></i></a>'), t(".close-mini-cart").click(function() {
                        t("body").off("mouseover.ope-woo"), s.fadeOut()
                    }), n.children("a").on("touchstart", function(e) {
                        "use strict";
                        a.is(":visible") ? window.location = t(this).attr("href") : (e.preventDefault(), i(a, n))
                    })
                }), t(".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image:eq(0) .wp-post-image").on("load", function() {
                    var e = t(this);
                    e && setTimeout(function() {
                        var t = e.closest(".woocommerce-product-gallery__image").height(),
                            i = e.closest(".flex-viewport");
                        t && i && i.height(t)
                    }, 500)
                }).each(function() {
                    this.complete && t(this).load()
                })
            }(jQuery);
        jQuery(document).ready(function() {
            var s, o = jQuery("#main_menu"),
                n = o.find("li.mesmerize-menu-cart"),
                a = jQuery(".mesmerize-woo-header-cart");
            ! function(t, s, o) {
                t.parent().append(o);
                var n = t.find("li").not(s);
                s.children("a").off().on("mouseover", function(a) {
                    0 !== o.children().length && (n.trigger("mouseleave"), e(o, s, t), i(o, s))
                })
            }(o, n, a), (s = a).prepend('<a href="#" class="close-mini-cart small"><i class="fa fa-close"></i></a>'), t(".close-mini-cart").click(function() {
                t("body").off("mouseover.ope-woo"), s.fadeOut()
            }), n.children("a").on("touchstart", function(e) {
                "use strict";
                a.is(":visible") ? window.location = t(this).attr("href") : (e.preventDefault(), i(a, n))
            })
        }), t(".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image:eq(0) .wp-post-image").on("load", function() {
            var e = t(this);
            e && setTimeout(function() {
                var t = e.closest(".woocommerce-product-gallery__image").height(),
                    i = e.closest(".flex-viewport");
                t && i && i.height(t)
            }, 500)
        }).each(function() {
            this.complete && t(this).load()
        })
    }(jQuery);