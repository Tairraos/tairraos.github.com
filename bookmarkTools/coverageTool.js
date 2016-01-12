/**
 * UT对比工具
 * javascript:(function(){var tool='coverageTool',css='coverageTool',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','http://localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'coverageTool', win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {};

    conf = {
        page1: location.protocol + '//' + location.host + '/jenkins/job/coveragetest_1/',
        page2: location.protocol + '//' + location.host + '/jenkins/job/coveragetest_2/',
        inCompare: false
    };

    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            goCompare();
        }
    });

    tools[toolName].run();

    function goCompare() {
        $('script').remove();
        $('body').empty().append([
            '<div id="coverForm">',
            '<span><label>URL1：<input type="text" name="url1" id="url1" value=""/></label></span>',
            '<span><label>URL2：<input type="text" name="url2" id="url2" value=""/></label></span>',
            '<span><button type="button" id="doLoad">加载内容</button></span>',
            '</div>',
            '<div id="compare-box">',
            '<div id="file1"></div>',
            '<div id="file2"></div>',
            '<div id="footer"></div>',
            '</div>'
        ].join(''));

        $('#doLoad').on('click', doLoad);
        $('#file1').on('dblclick', toggleCompare);
        $('#file2').on('dblclick', toggleCompare);

        function doLoad() {
            var conf = {
                file1Url: $('#url1').val(),
                file2Url: $('#url2').val()
            };
            $('#file1').append(getPathContent(conf.file1Url, 'table.source')).on('scroll', onScroll);
            $('#file2').append(getPathContent(conf.file2Url, 'table.source')).on('scroll', onScroll);
            toggleCompare();
        }

        function onScroll(e) {
            $('#file1').scrollLeft($(this).scrollLeft());
            $('#file2').scrollLeft($(this).scrollLeft());
        }

        function getPathContent(path, selector) {
            var dom = $(), retSel = selector || 'div';
            $.ajax({
                type: "GET",
                url: path,
                async: false,
                dataType: "html",
                success: function (result) {
                    dom = $('<section />').append(result.replace(/[\n\r]/g, '').replace(/^.*<body[^>]*>(.*)<\/body>.*$/, '$1'));
                }
            });
            return $(retSel, dom);
        }

        function toggleCompare() {
            var a = $('#file1 tr'),
                b = $('#file2 tr');
            if (conf.inCompare) {
                a.removeClass('minor primary');
                b.removeClass('minor primary');
            } else {
                for (var i = 1; i < b.length; i++) {
                    var cls = (a.eq(i).attr('class') === b.eq(i).attr('class')) ? 'minor' : 'primary';
                    a.eq(i).addClass(cls);
                    b.eq(i).addClass(cls);
                }
            }
            conf.inCompare = !conf.inCompare;
        }

    }

}(jQuery));
