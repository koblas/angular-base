/*! EnhanceJS: a progressive enhancement bootstrejser. Copyright 2012 @scottjehl, Filament Group, Inc. Licensed MIT/GPLv2 */ ! function (w, undefined) {
    "use strict";
    var doc = w.document,
        docElem = doc.documentElement,
        head = doc.head || doc.getElementsByTagName("head")[0];
    w.ejs = {}, ejs.hasClass = function (e, a) {
        return e.className.indexOf(a) > -1
    }, ejs.onDefine = function (prop, callback) {
        function checkRun() {
            if (eval(prop))
                for (; callbackStack[0] && "function" == typeof callbackStack[0];) callbackStack.shift().call(w);
            else setTimeout(checkRun, 15)
        }
        var callbackStack = [];
        callback && callbackStack.push(callback), checkRun()
    }, ejs.bodyReady = function (e) {
        ejs.onDefine("document.body", e)
    }, ejs.loadCSS = function (e, a) {
        var n = doc.createElement("link"),
            c = head.getElementsByTagName("link"),
            t = c[c.length - 1];
        n.type = "text/css", n.href = e, n.rel = "stylesheet", a && (n.media = a), t && t.nextSibling ? head.insertBefore(n, t.nextSibling) : head.appendChild(n)
    }, ejs.loadJS = function (e) {
        var a = doc.createElement("script"),
            n = head.firstChild;
        a.src = e, n ? head.insertBefore(a, n) : head.appendChild(a)
    }, ejs.basepath = {
        js: "",
        css: ""
    }, ejs.files = {
        js: {},
        css: {}
    }, ejs.jsToLoad = [], ejs.cssToLoad = [], ejs.addFile = function (e) {
        var a = e.indexOf(".js") > -1;
        ejs[a ? "jsToLoad" : "cssToLoad"].push(ejs.basepath[a ? "js" : "css"] + e)
    }, ejs.load = function (e) {
        return (e.indexOf(".js") > -1 ? ejs.loadJS : ejs.loadCSS)(e)
    }, ejs.concatSyntax = function (e) {
        var a = e.split(",").length > 1 ? "/quickconcat.php?files=" : "";
        return a + e
    }, ejs.enhance = function () {
        ejs.jsToLoad.length && ejs.load(ejs.concatSyntax(ejs.jsToLoad.join(","))), ejs.cssToLoad.length && ejs.load(ejs.concatSyntax(ejs.cssToLoad.join(",")))
    }
}(this),
function (e) {
    var a = e.ejs,
        n = e.document.documentElement;
    if ("querySelectorAll" in e.document && "localStorage" in window) {
        n.className += " enhanced", "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 || (n.className = n.className.replace(/touch ?/, ""));
        var c = e.document.querySelector("script[data-load]");
        if (c) {
            var t = c.getAttribute("data-load"),
                s = c.getAttribute("data-load-async");
            s && window.Worker && (t = s), a.addFile(t), a.bodyReady(function () {
                a.enhance()
            })
        }
    }
}(this);