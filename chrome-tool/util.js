(function () {
    'use strict';
    var $, doc = document, win = window,
        tools = win.pageTools = {},
        conf = tools.conf = {};

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

}());


