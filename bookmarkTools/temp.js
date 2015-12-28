/**
 * 功能增强
 * javascript:(function(){var tool='temp',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','http://localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
	'use strict';
	var toolName = 'temp', doc = document, win = window,
		tools = win.pageTools = win.pageTools || {},
		conf = tools.conf = tools.conf || {},
		util = tools.util = tools.util || {};

	tools[toolName] = $.extend({}, tools.base, {
		run: function () {
			//code here
			$('script').remove();
			$('embed').parent().remove();
			$('#auto-header').remove();
			$('#auto-header-clubpop').remove();
			$('body').prepend($('.article'));
			$('.content').remove();

		}
	});

	tools[toolName].run();
}(jQuery));
