(function () {
    var a = document;
    ISV = ISV || {};
    ISV.atpanel = {
        utils: {
            rand: function (b) {
                return Math.floor(Math.random() * b) + 1
            },
            sub: function (b, d, c) {
                return ((b.replace) ? b.replace(/\{(\w+)\}/g, function (f, g) {
                    var e = !c ? d[g] : c(g);
                    return e !== undefined ? e : f
                }) : "")
            },
            o2s: function (d, e, c) {
                var b = [],
                    c = c || {};
                for (var f in e) {
                        (e[f] !== undefined && c[f] === undefined) && b.push(f + "=" + e[f])
                    }
                d = d.indexOf("?") > 0 ? d + "&" + b.join("&") : d + "?" + b.join("&");
                return d
            },
            extend: function (e) {
                var b = [].slice.call(arguments, 1),
                    d = 0,
                    c = b.length,
                    f;
                for (; d < c; d++) {
                        f = b[d];
                        for (var g in f) {
                            f[g] !== undefined && (e[g] = f[g])
                        }
                    }
                return e
            }
        },
        config: {
            url: "http://toptrace.taobao.com/toplog/?appkey={appkey}&sign={sign}&cache={cache}",
            query: "&pre={pre}&scr={width}x{height}",
            params: {
                pre: encodeURIComponent(a.referrer),
                width: screen.width,
                height: screen.height
            }
        },
        joinParams: function (c) {
            var j = this,
                e = j.config,
                b = e.url,
                i = e.query,
                g = e.params,
                f = ISV.config || {},
                d = {
                    cache: j.utils.rand(9999999)
                },
                h;
            d = j.utils.extend(d, g, f);
            if (c) {
                    h = j.utils.sub(b + i, d)
                } else {
                    h = j.utils.sub(b, d);
                    h = j.utils.o2s(h, d, {
                        appkey: true,
                        sign: true,
                        atpanel: true
                    })
                }
            return h
        },
        init: function () {
            var c = this,
                b = new Image();
            b.src = c.joinParams(true);
            a.body.appendChild(b)
        }
    };
    ISV.atpanel.init()
})();