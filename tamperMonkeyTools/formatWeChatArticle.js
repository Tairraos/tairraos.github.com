// ==UserScript==
// @name         乐造：微信文章净化
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  净化微信文章页面，load所有的图片，以便保存到笔记
// @author       Xiaole Tao
// @include      *://mp.weixin.qq.com/s/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==

(function () {
    //把所有lazy load的图片都load到
    $("img").each(function () {
        $(this).attr("src", $(this).attr("data-src")).removeAttr("data-src");
        $(this).removeAttr("data-s").removeAttr("data-type").removeAttr("data-copyright");
        $(this).removeAttr("style").removeAttr("data-ratio").removeAttr("data-w").removeAttr("data-backw");
        $(this).removeAttr("data-backh").removeAttr("_width").removeAttr("data-fail");
    });

    //移除无用的script和div
    $("script").remove();
    $("link").remove();
    $("body>div").not("#js_article").remove();

    //背景变白色
    $("body").css("background", "#fff");

    //移掉标题样式
    //$("#activity-name").removeClass("rich_media_title");

    //移掉没有用的空白区域和二维码
    $("#js_top_ad_area").remove();
    $("#js_pc_qr_code").remove();
    $("#media").remove();
    $("#js_sponsor_ad_area").remove();
    $(".rich_media_area_extra").remove();
    $(".rich_media_meta_list").remove();
    $(".rich_media_tool").remove();
    $(".reward_qrcode_area").remove();
    $(".reward_area").remove();
    $(".original_tool_area").remove();
    $(".sougou").remove();

}(jQuery, jQuery.noConflict()));

