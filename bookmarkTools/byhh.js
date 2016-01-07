/**
 * 功能增强
 * javascript:(function(){var tool='byhh',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','http://localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'byhh', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {};

    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            //code here
            var movieName = $('#username').val().replace(/ /g,'.'),
                strInput = window.prompt("请输入特征串"),
                regInput = new RegExp(strInput,'ig'),
                regMovieName = new RegExp(movieName,'ig');
            $('td.magTitle').each(function () {
                var link = $('a[href]', $(this)).attr('href');
                if (link.length && link.match(regMovieName) && link.match(regInput)) {
                    $('input', $(this)).get(0).checked = true;
                }
            });

        }
    });

    tools[toolName].run();
}(jQuery));
