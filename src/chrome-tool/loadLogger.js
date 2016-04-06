/**
 * 功能增强
 * javascript:(function(){var tool='文件名',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'loadLogger', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {},
        util = tools.util = tools.util || {};

    conf.loggerURL = '//127.0.0.1/latest/_demo/loggerHelp.js';
    conf.templateURL = '//127.0.0.1/latest/pbloggerconfig.js';

    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            var pbLoader = top.pbLoader;
            if (pbLoader) {
                var dip = pbLoader.conf.win_pbui.pb.getObject('pb.dip'),
                    doc = pbLoader.conf.doc_pbui;
                dip.enableLog = true;

                var jsScript1 = doc.createElement('script');
                jsScript1.setAttribute('src', conf.loggerURL);
                doc.head.appendChild(jsScript1);
                setTimeout(function(){
                    var jsScript2 = doc.createElement('script');
                    jsScript2.setAttribute('src', conf.templateURL);
                    doc.head.appendChild(jsScript2);
                },2000);
            }

        }
    });

    tools[toolName].run();
}(jQuery));
