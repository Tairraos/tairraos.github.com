/**
 * ed2000功能增强
 * javascript:(function(){var tool='ed2000',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','http://localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    var toolName = 'ed2000', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {},
        util = tools.util = tools.util || {};

    tools[toolName] = $.extend({}, tools.base, {
        init: function () {
            var no = 1, latestNo = 0, currentNo = 0,
                $inputs = $('.CommonListCell input[name^="File"]');

            $inputs.each(function () {
                $(this).attr('data-no', no++);
            }).click(function (e) {
                if (e.shiftKey) {
                    currentNo = +$(this).attr('data-no');
                    $inputs.each(function () {
                        if (inRange(+$(this).attr('data-no'), currentNo, latestNo)) {
                            $(this)[0].checked = true;
                        }
                    });
                } else if (e.metaKey) {
                    currentNo = +$(this).attr('data-no');
                    $inputs.each(function () {
                        if (inRange(+$(this).attr('data-no'), currentNo, latestNo)) {
                            $(this)[0].checked = false;
                        }
                    });
                } else {
                    latestNo = +$(this).attr('data-no');
                }

                function inRange(target, range1, range2) {
                    return (target >= range1 && target <= range2) || (target <= range1 && target >= range2);
                }
            });
        },
        getLinks: function () {
            var links = '';
            $('.CommonListCell input[name^="File"]:checked').each(function () {
                links += $(this).val() + '\n';
            });
            util.getBox().text(links).focus().select().keydown(function (e) {
                if (e.keyCode === 27) {
                    conf.$box.hide();
                }
            });
        }
    });

    $('<button>获取链接</button>').insertBefore('.CommonListCell input[value="下载选中的文件"]').click(function () {
        tools[toolName].getLinks();
    }).css({width: 80, height: 30, 'margin-right': 10});

    tools[toolName].init();
}(jQuery));
