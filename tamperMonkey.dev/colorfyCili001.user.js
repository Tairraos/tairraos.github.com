// ==UserScript==
// @name         乐造：Cili001助手
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Cili001助手，将小乐关注的剧集醒目显示
// @author       Xiaole Tao
// @include      *://oabt*.com/*
// @match        http://tampermonkey.net/faq.php?version=4.5.5570&ext=gcal#Q600
// @grant        none
// @require http://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==

(function ($) {
    var watchList = [
            "反击",
            "天蝎",
            "打工姐妹花",
            "末日孤舰",
            "维京传奇",
            "女子监狱",
            "纸牌屋",
            "真实的人类",
            "童话镇",
            "生活大爆炸",
            "我们的生活",
            "演绎法",
            "凶鬼恶灵",
            "无耻家庭",
            "行尸走肉",
            "诉讼双雄",
            "金装律师",
            "神盾局特工",
            "西部世界",
            "黑镜",
            "天堂执法者",
            "夏威夷特勤组",
            "逍遥法外",
            "摩登家庭",
            "透明家庭",
            "权力的游戏",
            "国土安全",
            "傲骨之战",
            "绝命律师",
            "新福尔摩斯"
        ], selectedPatten;

    var tools = {
        getBox: function () {
            if (tools.$box) {
                tools.$txt.empty();
                tools.$box.show();
            } else {
                tools.$box = $("<div id=\"toolShowBox\"></div>").appendTo("body").css({
                    width: "80%", height: "90%", "z-index": 999999,
                    position: "fixed", top: "5%", left: "10%"
                });
                tools.$txt = $("<textarea id=\"toolTextBox\"></textarea>").appendTo(tools.$box).css({
                    width: "100%", height: "100%", font: "12px/28px verdana;",
                    border: "1px solid #000", "border-radius": "5px",
                    opacity: 0.9, resize: "none"
                });
            }
            return tools.$txt;
        },

        getPathContent: function (path, selector) {
            var dom = $();
            selector = selector || "body";
            $.ajax({
                type: "GET", url: path, async: false, dataType: "html", success: function (result) {
                    dom = $(result);
                }
            });
            $("script", dom).add("link", dom).remove();
            return $(selector, dom);
        },

        doSelect: function (patten, btn) {
            var regPatten = new RegExp(patten, "ig");
            $(".link-list>li").css({background: "unset"}).each(function () {
                var name = $(".name", $(this)).text();
                if (patten !== "" && name.match(regPatten)) {
                    $(this).css({background: "#eee0ff"});
                    $(btn).css({background: "#eee0ff"});
                }
            });
            selectedPatten = patten;
        },

        doCopy: function (patten) {
            var texts = "";
            if (patten) {
                var regMovieName = new RegExp(patten, "ig");
                $(".link-list>li").each(function () {
                    var name = $(".name", $(this)).text();
                    if (patten !== "" && name.match(regMovieName)) {
                        texts += window.decodeURI($(this).attr("data-ed2k")) + "\n";
                    }
                });
            }
            tools.getBox().val(texts).focus().select().keydown(function (e) {
                if (e.keyCode === 27) {
                    tools.$txt.val("");
                    tools.$box.hide();
                }
            });
        },

        genMovieButtonList: function () {
            return $(
                "<div class='button-list'>" +
                "<ul class='fav'>" +
                watchList.map(function (item) {
                    return "<li><a href='index?k=" + item + "'>" + item + "</a></li>";
                }).join(" ") +
                "</ul></div>");
        },
        run: function () {
            var isHomePage = !!$(".psearch-top").length;
            if (isHomePage) {
                $('.psearch-bottom').prepend(tools.genMovieButtonList());
            } else {
                $('.ui-header').append(tools.genMovieButtonList());
                $(".result-alert").remove();
                var $selector = $("<div class=\"addon\"></div>").append(
                    "<button>HR</button>",
                    "<button>HDTV</button>",
                    "<button>rip</button>",
                    "<button>MKV</button>",
                    "<button>MP4</button>",
                    "<button>RMVB</button>",
                    "<input type=\"text\" />",
                    "<button>COPY</button>",
                );
                $(".nav-pills").empty().append($selector);

                $("button", $selector).on("click", function (e) {
                    var cmd = $(e.target).text();
                    if (cmd === "COPY") {
                        tools.doCopy(selectedPatten);
                    } else {
                        tools.doSelect(cmd, $(e.target));
                    }
                });
                $("input", $selector).on("input", function (e) {
                    var cmd = $(e.target).val();
                    tools.doSelect(cmd);
                });
            }

            $("head").append([
                "<style>",
                ".page-search.page-fluid .psearch-top { height: 250px; }",
                ".psearch-bottom .fav { width: 810px; margin: 10px auto 0 auto; }",
                ".fav { text-align: center; }",
                ".fav li, .addon button, .addon input { display: inline-block; width: 90px; border: 1px solid #ccc; text-align: center; border-radius: 5px; padding: 2px; margin: 2px; }",
                ".ui-header .fav { text-align: left; }",
                ".ui-header .fav li, .addon button { width: auto; font-size: 12px; padding: 1px 8px; }",
                ".addon input { font-size: 12px; width: 60px; text-align: left; }",
                ".page-search .ui-header .button-list { padding: 8px; }",
                ".page-search .ui-header { height: 130px; }",
                ".page-search .ui-content { margin-top: 130px; }",
                ".page-search .ui-content .link-list-wrapper .result-desc { margin-top: 0;}",
                ".page-search .ui-content .link-list-wrapper .link-list-title { margin: 0; }",
                "#toolTextBox { font-size: 12px; white-space: nowrap; overflow: scroll; }",
                "</style>"
            ].join("\n"));
        }
    };

    tools.run();
}(jQuery, jQuery.noConflict()));
