/**
 * 格式化微信网页
 * javascript:(function(){var tool='formatWechat',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'formatWechat', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {},
        util = tools.util = tools.util || {};

    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            //把所有lazy load的图片都load到
            $('img').each(function () {
                $(this).attr('src', $(this).attr('data-src')).removeAttr('data-src');
            });

            //移除无用的script和div
            $('script').remove();
            $('link').remove();
            $('body>div').not('#js_article').remove();

            //背景变白色
            $('body').css('background', '#fff');

            //移掉标题样式
            $('#activity-name').removeClass('rich_media_title');

            //移掉没有用的空白区域和二维码
            $('#js_top_ad_area').remove();
            $('#js_pc_qr_code').remove();
            $('#media').remove();
            $('.rich_media_area_extra').remove();
            $('.rich_media_meta_list').remove();
            $('.rich_media_tool').remove();

            //文章区域边框不要了
            $('.rich_media_inner').css({'border': 'none', 'padding': 0});

            //如果使用了fieldset的，复制出来用p包裹
            $('.rich_media_content fieldset').each(function () {
                $('.rich_media_content').append($(this).wrapInner('<p></p>').html());
            }).remove();

        }
    });

    tools[toolName].run();
}(jQuery));
