// ==UserScript==
// @name         乐造：Webstorm URL 转本地服务器
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小乐开发专用，Webstorm URL 转本地服务器
// @author       Xiaole Tao
// @include      *://localhost:55555/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    var tools = window.leSmartTool = {
        run: function () {
            var href = location.href;
            if (href.match(/https?:\/\/localhost:55555/)) {
                href = href.replace(/(https?):\/\/localhost:55555/, "$1://local.webex.com/Workspace");
                href = href.replace(/_ijt=[\d\w]+/, "");
                href = href.replace(/\?&/, "?");
                href = href.replace(/\?$/, "");
                location.href = href;
            }
        }
    };

    tools.run();

})(jQuery, jQuery.noConflict());
