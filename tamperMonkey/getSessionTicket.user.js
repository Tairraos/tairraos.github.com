// ==UserScript==
// @name         乐造：获取 Webex Session Ticket
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  小乐的工作用工具，获取 Webex Session Ticket
// @author       Xiaole Tao
// @include      *://*.qa.webex.com.cn/*
// @include      *://*.qa.webex.com/*
// @include      *://go.webex.com/*
// @include      *://alpha.webex.com/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @updateURL    https://tairraos.github.io/tamperMonkey.dev/getSessionTicket.user.js
// @downloadURL  https://tairraos.github.io/tamperMonkey.dev/getSessionTicket.user.js
// ==/UserScript==

(function () {
    window.leSmartTool = {
        run: function () {
            // var win, doc;
            // var tryFrame = $("frame[name=mainFrame]", top.document);
            // if (tryFrame.length) {
            //     var mainFrame = $("frame[name=main]", tryFrame[0].contentDocument);
            //     if (mainFrame.length) {
            //         win = mainFrame[0].contentWindow;
            //         doc = mainFrame[0].contentDocument;
            //     } else {
            //         win = {};
            //         doc = {};
            //     }
            // } else {
            //     win = window;
            //     doc = document;
            // }
            if (thinClientConfig && thinClientConfig.pbSettings) {
                prompt("session ticket", thinClientConfig.pbSettings.sessionTicket);
            }
        }
    };
}());
