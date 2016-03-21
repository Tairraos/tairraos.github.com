/**
 * 功能增强
 * javascript:(function(){var tool='文件名',css='',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','//localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
	'use strict';
	var toolName = '文件名', doc = document, win = window,
		tools = win.pageTools = win.pageTools || {},
		conf = tools.conf = tools.conf || {},
		util = tools.util = tools.util || {};

	tools[toolName] = $.extend({}, tools.base, {
		run: function () {
			//code here


}
});

tools[toolName].run();
}(jQuery));
