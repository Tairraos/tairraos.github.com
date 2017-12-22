// ==UserScript==
// @name         乐造：获取 Webex Session Ticket
// @icon         https://tairraos.github.io/tamperMonkey/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  小乐的工作用工具，获取 Webex Session Ticket
// @author       Xiaole Tao
// @include      *://*.qa.webex.com.cn/*
// @include      *://*.qa.webex.com/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @updateURL    https://tairraos.github.io/tamperMonkey/getSessionTicket.user.js
// @downloadURL  https://tairraos.github.io/tamperMonkey/getSessionTicket.user.js
// ==/UserScript==

(function(a){(function(){if(window.thinClientConfig&&window.thinClientConfig.pbSettings){var b=a("<textarea style='width:800px;height:100px;'>"+window.thinClientConfig.pbSettings.sessionTicket+"</textarea>");a(".screen_i2").prepend(b);b.hover(function(){a(this)[0].select()})}})()})(jQuery,jQuery.noConflict());
