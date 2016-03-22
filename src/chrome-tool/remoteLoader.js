/**
 * js加载器，会预先加载jQuery，然后加载相应的插件
 */


(function () {
    'use strict';
    var $, doc = document, win = window,
        tools = win.pageTools = {},
        conf = tools.conf = {
        	remoteBase: '//tairraos.github.io/chrome-tool'
        };


    tools.base = {
        run: function () { }
    };

    tools.util = {
        getBox: function () {
            if (!conf.$box) {
                conf.$box = $('<div id="toolShowBox"></div>').appendTo('body').css({
                    width: '80%', height: '90%', 'z-index': 999999,
                    position: 'fixed', top: '5%', left: '10%'
                });
                conf.$txt = $('<textarea id="toolTextBox"></textarea>').appendTo(conf.$box).css({
                    width: '100%', height: '100%', font: '12px/28px verdana;',
                    border: '1px solid #000', 'border-radius': '5px',
                    opacity: 0.9, resize: 'none'
                });
            } else {
                conf.$txt.empty();
                conf.$box.show();
            }
            return conf.$txt;
        },
        getPathContent: function (path, selector) {
            var dom = $();
            selector = selector || 'body';
            $.ajax({
                type: "GET", url: path, async: false, dataType: "html", success: function (result) {
                    dom = $(result);
                }
            });
            $('script', dom).add('link', dom).remove();
            return $(selector, dom);
        }
    };

    launchLoad();

    function launchLoad() {
        var waitingHandler, doLoadFlag = false;

        function checkJQuery() {
            if (win.jQuery) { //如果内存里有jQuery了
                win.clearInterval(waitingHandler); //停掉轮询
                prepareToLoad(); //准备加载Tool
            } else if (!doLoadFlag) { //如果还没有加载过，加载jQuery
                doLoadFlag = true;
                loadJQuery();
            }
        }

        function prepareToLoad() {
            if (doLoadFlag) { //如果是本文件Load的jQuery，把$还给Page
                jQuery.noConflict();
            }
            $ = jQuery;

            var strSrc = $('script[src*="remoteLoader.js"]').attr('src'),
                toolName = strSrc.match(/js=([^&]+)/),
                cssName = strSrc.match(/css=([^&]+)/);


            loadTool(toolName ? toolName[1] : null, cssName ? cssName[1] : null);
        }

        waitingHandler = win.setInterval(function () { //定时器，每100毫秒轮询jQuery是否存在
            checkJQuery();
        }, 100);
    }

    function loadJQuery() {
        var s = doc.createElement('script');
        s.setAttribute('src', location.protocol + conf.remoteBase + '/jquery.js');
        doc.head.appendChild(s);
    }

    function loadTool(toolName, cssName) {
        var toolScript, cssLink,
            script = $('script[src*="tools/' + toolName + '"]'),
            css = $('link[href*="tools/' + cssName + '"]');

        if (toolName && script.length) { //如果tool已经加载过了，run它
            tools[toolName].run();
        } else if (toolName && !script.length) { //否则，加载它
            toolScript = doc.createElement('script');
            toolScript.setAttribute('src', conf.remoteBase + '/' + toolName);
            doc.head.appendChild(toolScript);
        }

        if (cssName && !css.length) { //如果css没有加载过，加载它
            cssLink = doc.createElement('link');
            cssLink.setAttribute('type', 'text/css');
            cssLink.setAttribute('rel', 'stylesheet');
            cssLink.setAttribute('href', conf.remoteBase + '/' + cssName);
            doc.head.appendChild(cssLink);
        }
    }

}());


