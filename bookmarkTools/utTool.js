/**
 * UT统计工具
 * javascript:(function(){var tool='utTool',css='utTool',p=window.pageTools;if(p&&p[tool]){p[tool].run();return;}var d=document,s=d.createElement('script');s.setAttribute('src','http://localhost/tools/loader.js?tool='+tool+'&css='+css);d.body.appendChild(s);}());
 */
(function ($) {
	'use strict';
	var toolName = 'utTool', win = window,
		tools = win.pageTools = win.pageTools || {},
		conf = tools.conf = tools.conf || {};

	conf = {
		baseURL: location.protocol + '//' + location.host + location.pathname.replace(/UT-Parallel\/.*/, 'UT-Parallel/'),
		mode: '显示全部',
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
		$table: null
	};

	tools[toolName] = $.extend({}, tools.base, {
		run: function () {
			showForm();
		}
	});

	tools[toolName].run();

	/**
	 * 取到最后两个build版本
	 */
	function getVersion() {
		var versionHistory = getPathContent(conf.baseURL, '#buildHistory .build-row:not(.transitive)');
		conf.sourceVersion = +versionHistory.eq(0).find('td').eq(0).text().replace(/[^\d]/g, '');
		conf.targetVersion = +versionHistory.eq(1).find('td').eq(0).text().replace(/[^\d]/g, '');
	}

	/**
	 * 显示表单
	 */
	function showForm() {
		getVersion();
		conf.$form = $('<div id="coverageForm"></div>').prependTo('body').on('keydown', function (e) {
			if (e.keyCode === 13) {
				conf.$button.click();
			} else if (e.keyCode === 27) {
				conf.$form.remove();
			}
		});
		conf.$span = $('<span>您需要在哪两个版本间生成对比报告?</span>').appendTo(conf.$form);
		conf.$sourceVer = $('<input id="sourceVer" />').appendTo(conf.$form).val(conf.sourceVersion).focus();
		conf.$targetVer = $('<input id="targetVer" />').appendTo(conf.$form).val(conf.targetVersion);
		conf.$button = $('<button>开始生成</button>').on('click', startAnalytic).appendTo(conf.$form);
		conf.$meta = $('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />').appendTo('head'); //确定中文能正确显示
	}

	/**
	 * 分析开始
	 * @returns {*}
	 */
	function startAnalytic() {
		if (!checkNumber()) {
			return conf.$span.text('版本号必须为数字').css('color', 'red');
		}
		if (conf.$sourceVer.val() > conf.$targetVer.val()) {
			var v = conf.$targetVer.val();
			conf.$targetVer.val(conf.$sourceVer.val());
			conf.$sourceVer.val(v);
		}
		analyticURL(conf.baseURL + conf.$sourceVer.val() + '/cobertura/', conf.sourceData);
		analyticURL(conf.baseURL + conf.$targetVer.val() + '/cobertura/', conf.targetData);
		$.each($.extend({}, conf.sourceData, conf.targetData), function (name) {
			return ($.inArray(name, conf.filePool) === -1) && conf.filePool.push(name);
		});
		return genReport(conf.filePool.sort()) && showReport();
	}

	/**
	 * 生成报表
	 * @param filePool
	 * @returns {*}
	 */
	function genReport(filePool) {
		var tempColor, today = new Date();
		conf.title = document.title = 'Build ' + $('#sourceVer').val() + ' vs Build ' + $('#targetVer').val();
		conf.$mode = $('<span class="change">' + conf.mode + '</span>');
		conf.$table = $('<table id="report"><tr><td>文件路径</td><td>条件覆盖率</td><td>条件覆盖数</td><td>行覆盖率</td><td>行覆盖数</td></tr></table>');
		conf.$table.prepend($('<tr></tr>').append($('<td colspan="5">' + conf.title + ', 报表生成时间：' + (today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + (today.getDay() + 1) + ' ' + today.getHours() + ':' + today.getMinutes()) + ' 报表方式：</td>').append(conf.$mode)));

		return $.each(filePool, function (i, name) {
			var s = conf.sourceData[name], t = conf.targetData[name], deltaC, deltaL;
			if (!s) {
				s = t;
			} else if (!t) {
				t = s;
			} //如果文件只有其中一个版本有
			if (s.conditionalsRate === t.conditionalsRate && s.linesRate === t.linesRate) {
				conf.$table.append('<tr class="same" style="background:#ffffff"><td><a href="' + t.link + '" target="_blank">' + name + '</a></td><td>' + s.conditionalsRate + '%</td><td>' + s.conditionsText + '</td><td>' + s.linesRate + '%</td><td>' + s.linesText + '</td></tr>');
			} else {
				deltaC = (t.conditionalsRate - s.conditionalsRate).toFixed(2); //条件覆盖增减
				deltaL = (t.linesRate - s.linesRate).toFixed(2); //行覆盖增减
				tempColor = (deltaC < 0 || deltaL < 0) ? 'ffe3e3' : 'e3ffe3'; //决定行颜色
				conf.$table.append('<tr class="diff1" style="background:#' + tempColor + '"><td rowspan="2"><a href="' + t.link + '" target="_blank">' + name + '</a></td><td>' + s.conditionalsRate + '%</td><td>' + s.conditionsText + '</td><td>' + s.linesRate + '%</td><td>' + s.linesText + '</td></tr>');
				conf.$table.append('<tr class="diff2" style="background:#' + tempColor + '"><td>' + t.conditionalsRate + '% (' + ((deltaC > 0) ? '+' : '') + deltaC + '%)</td><td>' + t.conditionsText + '</td><td>' + t.linesRate + '% (' + ((deltaL > 0) ? '+' : '') + deltaL + '%)</td><td>' + t.linesText + '</td></tr>');
			}
		});
	}

	/**
	 * 显示结果
	 */
	function showReport() {
		var css = $('<style />');
		css.append('#report { border: 1px solid #999; border-collapse: collapse; }');
		css.append('#report td { padding: 2px 6px; border: 1px solid #bbb; font: 13px/13px verdana; }');
		css.append('#report tr.diff1 td { border-top: 2px solid #000; }');
		css.append('#report tr.diff2 td, #report tr.diff1 td:first-child { border-bottom: 2px solid #000; }');
		css.append('#report .change, #report a { cursor: pointer; color: navy; text-decoration: blink;}');
		$('body').empty().append(conf.$table);
		$('script').add('link').remove();
		$('head').append(css);
		conf.$mode.on('click', function () {
			conf.$table.css('border-collapse', 'separate');
			$('.same', conf.$table).toggle();
			conf.$table.css('border-collapse', 'collapse');
			conf.$mode.text(conf.mode = (conf.mode === '显示全部') ? '只显示差异' : '显示全部');
		});
	}

	/**
	 * 检查是不是两个数字
	 * @returns {boolean}
	 */
	function checkNumber() {
		return /^\d+$/.test(conf.$sourceVer.val()) && /^\d+$/.test(conf.$targetVer.val());
	}

	/**
	 * 遍历URL
	 * @param URL
	 * @param dataPool
	 */
	function analyticURL(URL, dataPool) {
		var pathPool = [URL];
		do {
			analyticContent(pathPool.shift(), pathPool, dataPool);
		} while (pathPool.length);
	}

	/**
	 * 抓回url内容
	 * @param path
	 * @param selector
	 * @returns {*|HTMLElement}
	 */
	function getPathContent(path, selector) {
		var dom = $(), retSel = selector || 'table.sortable>tbody';
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
	}

	/**
	 * 分析内容
	 * @param path
	 * @param pathPool
	 * @param dataPool
	 */
	function analyticContent(path, pathPool, dataPool) {
		$('>tr', getPathContent(path)).each(function () {
			var line = $(this).find('>td'), link = line.eq(0).find('a');
			if (link.length) {
				if (link.text().match(/\.js$/)) { //如果内容是一个文件
					var conditionals = line.eq(2),
						lines = line.eq(3),
						rateC = +conditionals.attr('data'),
						rateL = +lines.attr('data');
					dataPool[link.text()] = {
						link: path + link.attr('href'),
						conditionalsRate: (rateC <= 100) ? rateC : 0,
						linesRate: (rateL <= 100) ? rateL : 0,
						conditionsText: conditionals.find('span.text').text(),
						linesText: lines.find('span.text').text()
					};
				} else { //如果内容是一个路径
					pathPool.push(path + link.attr('href'));
				}
			}
		});
	}
}(jQuery))