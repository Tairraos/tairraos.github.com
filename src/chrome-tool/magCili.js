/**
 * 功能增强
 * javascript:(function(){var tool='magCili',css='magCili',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
    'use strict';
    var toolName = 'cili007', doc = document, win = window,
        tools = win.pageTools = win.pageTools || {},
        conf = tools.conf = tools.conf || {},
        util = tools.util = tools.util || {};


    var watchList=[
        "暴君.Tyrant",
        "福尔摩斯.演绎法.Elementary",
        "格林.Grimm",
        "行尸走肉.The.Walking.Dead",
        "妙女神探.Rizzoli.and.Isles",
        "摩登家庭.Modern.Family",
        "神盾局特工.Marvels.Agents.of.S.H.I.E.L.D",
        "天堂执法者.Hawaii.Five-0",
        "天蝎.Scorpion",
        "逍遥法外.How.to.Get.Away.with.Murder",
        "英雄重生.Heroes.Reborn",
        "永无止境.Limitless",
        "逍遥法外.How.to.Get.Away.with.Murder",
        "黑帆.Black.Sails",
        "卡特特工.Marvel's.Agent.Carter",
        "凶鬼恶灵.Supernatural",
        "明日传奇.DCs.Legends.of.Tomorrow",
        "灵书妙探.Castle",
        "绝命律师.Better.Call.Saul",
        "明日传奇.DCs.Legends.of.Tomorrow",
        "诉讼双雄.Suits",
        "傲骨贤妻.The.Good.Wife",
        "超感猎杀.Sense8",
        "打工姐妹花.2.Broke.Girls",
        "反击.Strike.Back",
        "废柴联盟.Community",
        "副总统.Veep",
        "国土安全.Homeland",
        "黑吃黑.Banshee",
        "谎言满屋.House.of.Lies",
        "极品老妈.Mom.S03",
        "绝命律师.Better.Call.Saul",
        "美国恐怖故事.American.Horror.Story",
        "末日孤舰.The.Last.Ship",
        "女子监狱.Orange.Is.The.New.Black",
        "权力的游戏.Game.of.Thrones",
        "生活大爆炸.The.Big.Bang.Theory",
        "唐顿庄园.Downton.Abbey",
        "童话镇.Once.Upon.a.Time",
        "透明家庭.Transparent",
        "维京传奇.Vikings",
        "无耻家庭.Shameless.US",
        "吸血鬼日记.The.Vampire.Diaries",
        "小律师大作为.Franklin.and.Bash",
        "新福尔摩斯.Sherlock",
        "疑犯追踪.Person.of.Interest",
        "真实的人类.Humans",
        "真探.True.Detective",
        "纸牌屋.House.Of.Cards",
        "传世.Extant",
        "凶鬼恶灵.Supernatural",
        "新福尔摩斯.Sherlock",
        "末日孤舰.The.Last.Ship",
        "极品老妈.Mom",
        "燃情克利夫兰.Hot.In.Cleveland",
        "真实的人类.Humans",
        "穹顶之下.Under.the.Dome",
        "行尸走肉.The.Walking.Dead",
        "超感猎杀.Sense8",
        "铁杉树丛.Hemlock.Grove",
        "黑吃黑.Banshee",
        "硅谷.Silicon.Valley",
        "抗争之城.Defiance",
        "智能缉凶.Intelligence.US"
    ];
    var selectedPatten, tool;
    tools[toolName] = $.extend({}, tools.base, {
        run: function () {
            //code here
            var $selector = $('<div class="addon"></div>').append(
                '<button>Web-HR</button>',
                '<button>HR-HDTV</button>',
                '<button>HDTVrip</button>',
                '<button>MKV</button>',
                '<button>MP4</button>',
                '<button>RMVB</button>',
                '<input type="text" />',
                '<button>COPY LINK</button>',
                '<button>Restore</button>');
            $('.header-box').after($selector);
            $('button', $selector).on('click', function (e) {
                var cmd = $(e.target).text();
                if (cmd === 'COPY LINK') {
                    tools[toolName].doCopyLink(selectedPatten);
                } else if (cmd === 'Restore') {
                    tools[toolName].doSelect('.');
                } else {
                    tools[toolName].doSelect(cmd);
                }
            });
            $('input', $selector).on('input', function (e) {
                var cmd = $(e.target).val();
                tools[toolName].doSelect(cmd);
            });

            $('#ad_banner_2').remove();
            tools[toolName].doColorfy(watchList);
        },
        doSelect: function (patten) {
            var regMovieName = new RegExp(patten, 'ig');
            $('dd').css({display:'none'}).each(function () {
                var link = $('a[href]', $(this)).eq(0).text();
                if (patten !== '' && link.length && link.match(regMovieName)) {
                    $(this).css({display:''});
                }
            });
            selectedPatten = patten;
        },
        doCopyLink: function (patten) {
            if (!patten) {
                return;
            }
            var regMovieName = new RegExp(patten, 'ig'),
                texts = '';
            $('dd').each(function () {
                var link = $('a[href]', $(this)).eq(0).text();
                if (link.length && link.match(regMovieName)) {
                    texts += window.decodeURI($(this).attr('ed2k')) + '\n';
                }
            });
            util.getBox().val(texts).focus().select().keydown(function (e) {
                if (e.keyCode === 27) {
                    conf.$txt.val('');
                    conf.$box.hide();
                }
            });
        },
        doColorfy:function(watchList){
            var screenList = $('dd');
            screenList.each(function(){
                var screenItem  = $(this).find('.b').text();
                for (var index in watchList){
                    if (screenItem.indexOf(watchList[index])>=0){
                        $(this).css({background:'#fcc'});
                    }
                }
            });
        }
    });

    tools[toolName].run();
}(jQuery));
