// ==UserScript==
// @name         乐造：Cili001助手
// @icon         http://localhost/lemade.ico
// @namespace    http://tampermonkey.net/
// @version      0.1
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
            "我们的一天",
            "福尔摩斯",
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
            "新福尔摩斯",
            "吸血鬼日记",
            "暴君",
            "黑帆",
            "黑吃黑",
            "格林",
            "小律师大作为",
            "废柴联盟"
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

        doSelect: function (patten) {
            var regMovieName = new RegExp(patten, "ig");
            $("dd").css({display: "none"}).each(function () {
                var link = $("a[href]", $(this)).eq(0).text();
                if (patten !== "" && link.length && link.match(regMovieName)) {
                    $(this).css({display: ""});
                }
            });
            selectedPatten = patten;
        },

        doCopyLink: function (patten) {
            var texts = "";
            if (patten) {
                var regMovieName = new RegExp(patten, "ig");
                $("dd").each(function () {
                    var link = $("a[href]", $(this)).eq(0).text();
                    if (link.length && link.match(regMovieName)) {
                        texts += window.decodeURI($(this).attr("ed2k")) + "\n";
                    }
                });
            } else {
                $("dd").each(function () {
                    var link = $("a[href]", $(this)).eq(0).text();
                    if ($(this).hasClass("colored")) {
                        texts += window.decodeURI($(this).attr("ed2k")) + "\n";
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

        doColorfy: function (list) {
            $("dd").each(function () {
                var screenItem = $(this).find(".b").text();
                for (var index in list) {
                    if (screenItem.indexOf(list[index]) >= 0) {
                        if ((/web-hr/i).test(screenItem)) {
                            $(this).css({background: "#cfc"}).addClass("colored");
                        } else {
                            $(this).css({background: "#fcc"}).addClass("colored");
                        }
                    }
                }
            });
        },

        run: function () {
            var $selector = $("<div class=\"addon\"></div>").append(
                "<button>-HR</button>",
                "<button>-HDTV</button>",
                "<button>rip</button>",
                "<button>MKV</button>",
                "<button>MP4</button>",
                "<button>RMVB</button>",
                "<input type=\"text\" />",
                "<button>COPY LINK</button>",
                "<button>Restore</button>");

            $("head").append([
                "<style>",
                ".addon {",
                "    text-align: center;",
                "}",
                "",
                ".addon button {",
                "    width: 80px;",
                "    height: 40px;",
                "    margin: 0 10px;",
                "}",
                "",
                ".addon input {",
                "    width: 100px;",
                "    height: 36px;",
                "    font-size: 20px;",
                "    margin: 0 10px;",
                "    vertical-align: middle;",
                "}",
                "</style>"
            ].join("\n"));

            $(".header-box").after($selector);
            $("button", $selector).on("click", function (e) {
                var cmd = $(e.target).text();
                if (cmd === "COPY LINK") {
                    tools.doCopyLink(selectedPatten);
                } else if (cmd === "Restore") {
                    tools.doSelect(".");
                } else {
                    tools.doSelect(cmd);
                }
            });
            $("input", $selector).on("input", function (e) {
                var cmd = $(e.target).val();
                tools.doSelect(cmd);
            });

            $("#ad_banner_2").remove();
            tools.doColorfy(watchList);
        }
    };

    tools.run();
}(jQuery, jQuery.noConflict()));
