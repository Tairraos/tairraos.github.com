// ==UserScript==
// @name         乐造：Webex UT比较工具
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小乐开发专用，Webex UT比较工具
// @author       Xiaole Tao
// @include      http://*/job/Thinclient-JS-UT-EC-MASTER/
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==

(function ($) {
    "use strict";

    var tools = window.leSmartTool = {
        baseURL: location.protocol + "//" + location.host + location.pathname.replace(/UT-Parallel\/.*/, "UT-Parallel/"),
        mode: "显示全部",
        filePool: [],
        dataPool: {},
        sourceData: {},
        targetData: {},
        sourceVersion: 0,
        targetVersion: 0,
        $form: null, //查询表单
        $span: null,
        $sourceVer: null,
        $targetVer: null,
        $button: null,
        $meta: null,
        $mode: null,
        $table: null,

        run: function () {
            tools.getVersion();
            tools.$form = $("<div id=\"coverageForm\"></div>").on("keydown", function (e) {
                if (e.keyCode === 13) {
                    tools.$button.click();
                } else if (e.keyCode === 27) {
                    tools.$form.remove();
                }
            });
            tools.$span = $("<span>生成对比报告: </span>").appendTo(tools.$form);
            tools.$form.append("<span> </span>");
            tools.$sourceVer = $("<input id=\"sourceVer\" style=\"width: 50px;text-align: center;\" />").appendTo(tools.$form).val(tools.sourceVersion);
            tools.$form.append("<span> 对比 </span>");
            tools.$targetVer = $("<input id=\"targetVer\" style=\"width: 50px;text-align: center;\" />").appendTo(tools.$form).val(tools.targetVersion);
            tools.$form.append("<span> </span>");
            tools.$button = $("<button>开始生成</button>").on("click", tools.startAnalytic).appendTo(tools.$form);
            tools.$meta = $("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />").appendTo("head"); //确定中文能正确显示
            $("#description").empty().append(tools.$form);
        },


        /**
         * 取到最后两个build版本
         */
        getVersion: function () {
            var versionHistory = tools.getPathContent(tools.baseURL, "#buildHistory .build-row:not(.transitive)");
            tools.sourceVersion = +versionHistory.eq(0).find("td a").eq(1).text().replace(/[^\d]/g, "");
            tools.targetVersion = +versionHistory.eq(1).find("td a").eq(1).text().replace(/[^\d]/g, "");
        },

        /**
         * 分析开始
         * @returns {*}
         */
        startAnalytic: function () {
            if (!tools.checkNumber()) {
                return tools.$span.text("版本号必须为数字").css("color", "red");
            }
            if (tools.$sourceVer.val() > tools.$targetVer.val()) {
                var v = tools.$targetVer.val();
                tools.$targetVer.val(tools.$sourceVer.val());
                tools.$sourceVer.val(v);
            }
            tools.analyticURL(tools.baseURL + tools.$sourceVer.val() + "/cobertura/", tools.sourceData);
            tools.analyticURL(tools.baseURL + tools.$targetVer.val() + "/cobertura/", tools.targetData);
            $.each($.extend({}, tools.sourceData, tools.targetData), function (name) {
                return ($.inArray(name, tools.filePool) === -1) && tools.filePool.push(name);
            });
            return tools.genReport(tools.filePool.sort()) && tools.showReport();
        },

        /**
         * 生成报表
         * @param filePool
         * @returns {*}
         */
        genReport: function (filePool) {
            var tempColor, today = new Date();
            tools.title = document.title = "Build " + $("#targetVer").val() + " vs Build " + $("#sourceVer").val();
            tools.$mode = $("<span class=\"change\">" + tools.mode + "</span>");
            tools.$table = $("<table id=\"report\"><tr><td>文件路径</td><td>条件覆盖率</td><td>条件覆盖数</td><td>行覆盖率</td><td>行覆盖数</td></tr></table>");
            tools.$table.prepend($("<tr></tr>").append($("<td colspan=\"5\">" + tools.title + ", 报表生成时间：" + (today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + 1) + " " + today.getHours() + ":" + today.getMinutes()) + " 报表方式：</td>").append(tools.$mode)));

            return $.each(filePool, function (i, name) {
                var s = tools.sourceData[name], t = tools.targetData[name], deltaC, deltaL;

                //如果文件只有其中一个版本有
                if (!s) {
                    s = {conditionalsRate: 0, linesRate: 0, conditionsText: "", linesText: ""};
                } else if (!t) {
                    t = {conditionalsRate: 0, linesRate: 0, conditionsText: "", linesText: ""};
                }

                if (s.conditionalsRate === t.conditionalsRate && s.linesRate === t.linesRate) {
                    tools.$table.append("<tr class=\"same\" style=\"background:#ffffff\"><td><a href=\"" + t.link + "\" target=\"_blank\">" + name + "</a></td><td>" + s.conditionalsRate + "%</td><td>" + s.conditionsText + "</td><td>" + s.linesRate + "%</td><td>" + s.linesText + "</td></tr>");
                } else {
                    deltaC = (t.conditionalsRate - s.conditionalsRate).toFixed(2); //条件覆盖增减
                    deltaL = (t.linesRate - s.linesRate).toFixed(2); //行覆盖增减
                    tempColor = (s.linesText === "" || t.linesText === "") ? "ffc3c3" : ((deltaC < 0 || deltaL < 0) ? "ffe3e3" : "e3ffe3"); //决定行颜色
                    tools.$table.append("<tr class=\"diff1\" style=\"background:#" + tempColor + "\"><td rowspan=\"2\"><a href=\"" + s.link + "\" target=\"_blank\">" + name + "</a></td><td>" + s.conditionalsRate + "%</td><td>" + s.conditionsText + "</td><td>" + s.linesRate + "%</td><td>" + s.linesText + "</td></tr>");
                    tools.$table.append("<tr class=\"diff2\" style=\"background:#" + tempColor + "\"><td>" + t.conditionalsRate + "% (" + ((deltaC > 0) ? "+" : "") + deltaC + "%)</td><td>" + t.conditionsText + "</td><td>" + t.linesRate + "% (" + ((deltaL > 0) ? "+" : "") + deltaL + "%)</td><td>" + t.linesText + "</td></tr>");
                }
            });
        },

        /**
         * 显示结果
         */
        showReport: function () {
            var css = $("<style />");
            css.append("#report { border: 1px solid #999; border-collapse: collapse; }");
            css.append("#report td { padding: 2px 6px; border: 1px solid #bbb; font: 13px/13px verdana; }");
            css.append("#report tr.diff1 td { border-top: 2px solid #000; }");
            css.append("#report tr.diff2 td, #report tr.diff1 td:first-child { border-bottom: 2px solid #000; }");
            css.append("#report .change, #report a { cursor: pointer; color: navy; text-decoration: blink;}");
            $("body").empty().append(tools.$table);
            $("script").add("link").remove();
            $("head").append(css);
            tools.$mode.on("click", function () {
                tools.$table.css("border-collapse", "separate");
                $(".same", tools.$table).toggle();
                tools.$table.css("border-collapse", "collapse");
                tools.$mode.text(tools.mode = (tools.mode === "显示全部") ? "只显示差异" : "显示全部");
            });
        },

        /**
         * 检查是不是两个数字
         * @returns {boolean}
         */
        checkNumber: function () {
            return /^\d+$/.test(tools.$sourceVer.val()) && /^\d+$/.test(tools.$targetVer.val());
        },

        /**
         * 遍历URL
         * @param URL
         * @param dataPool
         */
        analyticURL: function (URL, dataPool) {
            var pathPool = [URL];
            do {
                tools.analyticContent(pathPool.shift(), pathPool, dataPool);
            } while (pathPool.length);
        },

        /**
         * 抓回url内容
         * @param path
         * @param selector
         * @returns {*|HTMLElement}
         */
        getPathContent: function (path, selector) {
            var dom = $(), retSel = selector || "table.sortable>tbody";
            $.ajax({
                type: "GET",
                url: path,
                async: false,
                dataType: "html",
                success: function (result) {
                    dom = $(result);
                }
            });
            return $(retSel, dom);
        },

        /**
         * 分析内容
         * @param path
         * @param pathPool
         * @param dataPool
         */
        analyticContent: function (path, pathPool, dataPool) {
            $(">tr", tools.getPathContent(path)).each(function () {
                var line = $(this).find(">td"), link = line.eq(0).find("a");
                if (link.length) {
                    if (link.text().match(/\.js$/)) { //如果内容是一个文件
                        var lines = line.eq(2),
                            conditionals = line.eq(3),
                            rateC = +conditionals.attr("data"),
                            rateL = +lines.attr("data");
                        dataPool[link.text()] = {
                            link: path + link.attr("href"),
                            conditionalsRate: (rateC <= 100) ? rateC : 0,
                            linesRate: (rateL <= 100) ? rateL : 0,
                            conditionsText: conditionals.find("span.text").text(),
                            linesText: lines.find("span.text").text()
                        };
                    } else { //如果内容是一个路径
                        pathPool.push(path + link.attr("href"));
                    }
                }
            });
        }
    };

    //马上运行
    tools.run();

})(jQuery, jQuery.noConflict());
