// ==UserScript==
// @name         乐造：获取 Webex Session Ticket
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  小乐的工作用工具，获取 Webex Session Ticket
// @author       Xiaole Tao
// @include      *://*.qa.webex.com.cn/*
// @include      *://*.qa.webex.com/*
// @include      *://go.webex.com/*
// @include      *://alpha.webex.com/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @updateURL    https://tairraos.github.io/tamperMonkey.dev/getSessionTicket.user.js
// @downloadURL  https://tairraos.github.io/tamperMonkey.dev/getSessionTicket.user.js
// ==/UserScript==

(function ($) {
    window.leSmartTool = {
        run: function () {
            var win, doc;
            var tryFrame = $("frame[name=mainFrame]", top.document);
            if (tryFrame.length) {
                var mainFrame = $("frame[name=main]", tryFrame[0].contentDocument);
                if (mainFrame.length) {
                    win = mainFrame[0].contentWindow;
                    doc = mainFrame[0].contentDocument;
                } else {
                    win = {};
                    doc = {};
                }
            } else {
                win = window;
                doc = document;
            }


            if (win.thinClientConfig && win.thinClientConfig.pbSettings) {
                var textarea = $("<textarea id=\"smartTicket\" style='width:800px;height:100px;'>" + win.thinClientConfig.pbSettings.sessionTicket + "</textarea>");
                if (!$("#smartTicket", doc).length) {
                    $(".screen_i2", doc).prepend(textarea);
                    textarea.hover(function () {
                        $(this)[0].select();
                    });
                }
            }
            //
            // if (win.thinClientConfig && win.thinClientConfig.pbSettings) {
            //     var ticket = win.thinClientConfig.pbSettings.sessionTicket,
            //         key = $("#ipt-pmr-meetingAccessCode").val(),
            //         data = {
            //             ticket: ticket,
            //             key: key
            //         };
            //     if (opener) {
            //         opener.window.postMessage(data, "*");
            //         console.log(data);
            //     } else {
            //         var textarea = $("<textarea id=\"smartTicket\" style='width:800px;height:100px;'>" + win.thinClientConfig.pbSettings.sessionTicket + "</textarea>");
            //         if (!$("#smartTicket", doc).length) {
            //             $(".screen_i2", doc).prepend(textarea);
            //             textarea.hover(function () {
            //                 $(this)[0].select();
            //             });
            //         }
            //     }
            // }
        }
    };
}(jQuery));
