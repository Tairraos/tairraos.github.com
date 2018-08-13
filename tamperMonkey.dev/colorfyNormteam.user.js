// ==UserScript==
// @name         乐造：Normteam 最近电影醒目
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给normteam今年和去年的片子加上醒目颜色
// @author       Xiaole Tao
// @include      http://www.normteam.com/*
// @grant        none
// @updateURL    https://tairraos.github.io/tamperMonkey.dev/template.user.js
// @downloadURL  https://tairraos.github.io/tamperMonkey.dev/template.user.js
// ==/UserScript==

(function () {
    if (document.getElementsByClassName("boardnav").length) {
        var items = document.getElementsByTagName("th"),
            year = (new Date()).getFullYear(),
            patten = new RegExp(year + "|" + (year - 1));

        for (var i in items) {
            if (items[i].textContent.match(patten)) {
                items[i].parentElement.style.background = "#eee0ff";
            }
        }
    }
}());


