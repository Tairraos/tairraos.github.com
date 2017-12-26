// ==UserScript==
// @name         乐造：获取 Webex Session Ticket
// @icon         https://tairraos.github.io/tamperMonkey/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  小乐的工作用工具，获取 Webex Session Ticket
// @author       Xiaole Tao
// @include      *://*.qa.webex.com.cn/*
// @include      *://*.qa.webex.com/*
// @include      *://go.webex.com/*
// @include      *://alpha.webex.com/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @updateURL    https://tairraos.github.io/tamperMonkey/getSessionTicket.user.js
// @downloadURL  https://tairraos.github.io/tamperMonkey/getSessionTicket.user.js
// ==/UserScript==

(function(c){var a,b;a=c("frame[name=mainFrame]",top.document);a.length?(b=c("frame[name=main]",a[0].contentDocument),b.length?(a=b[0].contentWindow,b=b[0].contentDocument):(a={},b={})):(a=window,b=document);a.thinClientConfig&&a.thinClientConfig.pbSettings&&(a=c("<textarea style='width:800px;height:100px;'>"+a.thinClientConfig.pbSettings.sessionTicket+"</textarea>"),c(".screen_i2",b).prepend(a),a.hover(function(){c(this)[0].select()}))})(jQuery,jQuery.noConflict());
