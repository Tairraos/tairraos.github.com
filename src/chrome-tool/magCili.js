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
        }
    });

    tools[toolName].run();
}(jQuery));
