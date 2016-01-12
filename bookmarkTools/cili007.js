/**
 * 功能增强
 * javascript:(function(){var tool='cili007',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'cili007', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {},
        util = tools.util = tools.util || {};

    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            //code here
            var movieName = $('.keywords').val(),
                regMovieName = new RegExp(movieName, 'ig'),
                texts = '';
            $('dd').each(function () {
                var link = $('a[href]', $(this)).eq(0).text();
                if (link.length && link.match(regMovieName)) {
                    texts += window.decodeURI($(this).attr('ed2k')) + '\n';
                }
            });
            util.getBox().text(texts).focus().select().keydown(function (e) {
                if (e.keyCode === 27) {
                    conf.$box.hide();
                }
            });

        }
    });

    tools[toolName].run();
}(jQuery));
