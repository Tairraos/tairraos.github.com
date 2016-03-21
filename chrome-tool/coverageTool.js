/**
 * UT对比工具
 * javascript:(function(){var tool='coverageTool',css='coverageTool',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'coverageTool', win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {};

    conf = {
        baseUrl1: '//' + location.host + '/jenkins/job/coveragetest_1/',
        baseUrl2: '//' + location.host + '/jenkins/job/coveragetest_2/',
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
            '<span><label>URL:</label><input type="text" name="url" id="url" value=""/></span>',
            '<span><label>Build1:</label><input type="text" name="build1" id="build1" value=""/>',
            '<label>Build2:</label><input type="text" name="build2" id="build2" value=""/>',
            '<button type="button" id="doLoad">加载内容</button></span>',
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
            var $url = $('#url'), page1, page2;
            $url.val($url.val().replace(/^.*\/cobertura/, '\/cobertura'));
            page1 = conf.baseUrl1 + $('#build1').val() + $url.val();
            page2 = conf.baseUrl2 + $('#build2').val() + $url.val();

            console.log(page1, page2);

            $('#file1').append(getPathContent(page1, 'table.source')).on('scroll', onScroll);
            $('#file2').append(getPathContent(page2, 'table.source')).on('scroll', onScroll);
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
