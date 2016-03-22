!function(a){"use strict";function b(){var a=i(n.baseURL,"#buildHistory .build-row:not(.transitive)");n.sourceVersion=+a.eq(0).find("td").eq(0).text().replace(/[^\d]/g,""),n.targetVersion=+a.eq(1).find("td").eq(0).text().replace(/[^\d]/g,"")}function c(){b(),n.$form=a('<div id="coverageForm"></div>').prependTo("body").on("keydown",function(a){13===a.keyCode?n.$button.click():27===a.keyCode&&n.$form.remove()}),n.$span=a("<span>您需要在哪两个版本间生成对比报告?</span>").appendTo(n.$form),n.$sourceVer=a('<input id="sourceVer" />').appendTo(n.$form).val(n.sourceVersion).focus(),n.$targetVer=a('<input id="targetVer" />').appendTo(n.$form).val(n.targetVersion),n.$button=a("<button>开始生成</button>").on("click",d).appendTo(n.$form),n.$meta=a('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />').appendTo("head")}function d(){if(!g())return n.$span.text("版本号必须为数字").css("color","red");if(n.$sourceVer.val()>n.$targetVer.val()){var b=n.$targetVer.val();n.$targetVer.val(n.$sourceVer.val()),n.$sourceVer.val(b)}return h(n.baseURL+n.$sourceVer.val()+"/cobertura/",n.sourceData),h(n.baseURL+n.$targetVer.val()+"/cobertura/",n.targetData),a.each(a.extend({},n.sourceData,n.targetData),function(b){return-1===a.inArray(b,n.filePool)&&n.filePool.push(b)}),e(n.filePool.sort())&&f()}function e(b){var c,d=new Date;return n.title=document.title="Build "+a("#targetVer").val()+" vs Build "+a("#sourceVer").val(),n.$mode=a('<span class="change">'+n.mode+"</span>"),n.$table=a('<table id="report"><tr><td>文件路径</td><td>条件覆盖率</td><td>条件覆盖数</td><td>行覆盖率</td><td>行覆盖数</td></tr></table>'),n.$table.prepend(a("<tr></tr>").append(a('<td colspan="5">'+n.title+", 报表生成时间："+(d.getFullYear()+"/"+(d.getMonth()+1)+"/"+(d.getDate()+1)+" "+d.getHours()+":"+d.getMinutes())+" 报表方式：</td>").append(n.$mode))),a.each(b,function(a,b){var d,e,f=n.sourceData[b],g=n.targetData[b];f?g||(g={conditionalsRate:0,linesRate:0,conditionsText:"",linesText:""}):f={conditionalsRate:0,linesRate:0,conditionsText:"",linesText:""},f.conditionalsRate===g.conditionalsRate&&f.linesRate===g.linesRate?n.$table.append('<tr class="same" style="background:#ffffff"><td><a href="'+g.link+'" target="_blank">'+b+"</a></td><td>"+f.conditionalsRate+"%</td><td>"+f.conditionsText+"</td><td>"+f.linesRate+"%</td><td>"+f.linesText+"</td></tr>"):(d=(g.conditionalsRate-f.conditionalsRate).toFixed(2),e=(g.linesRate-f.linesRate).toFixed(2),c=""===f.linesText||""===g.linesText?"ffc3c3":0>d||0>e?"ffe3e3":"e3ffe3",n.$table.append('<tr class="diff1" style="background:#'+c+'"><td rowspan="2"><a href="'+g.link+'" target="_blank">'+b+"</a></td><td>"+f.conditionalsRate+"%</td><td>"+f.conditionsText+"</td><td>"+f.linesRate+"%</td><td>"+f.linesText+"</td></tr>"),n.$table.append('<tr class="diff2" style="background:#'+c+'"><td>'+g.conditionalsRate+"% ("+(d>0?"+":"")+d+"%)</td><td>"+g.conditionsText+"</td><td>"+g.linesRate+"% ("+(e>0?"+":"")+e+"%)</td><td>"+g.linesText+"</td></tr>"))})}function f(){var b=a("<style />");b.append("#report { border: 1px solid #999; border-collapse: collapse; }"),b.append("#report td { padding: 2px 6px; border: 1px solid #bbb; font: 13px/13px verdana; }"),b.append("#report tr.diff1 td { border-top: 2px solid #000; }"),b.append("#report tr.diff2 td, #report tr.diff1 td:first-child { border-bottom: 2px solid #000; }"),b.append("#report .change, #report a { cursor: pointer; color: navy; text-decoration: blink;}"),a("body").empty().append(n.$table),a("script").add("link").remove(),a("head").append(b),n.$mode.on("click",function(){n.$table.css("border-collapse","separate"),a(".same",n.$table).toggle(),n.$table.css("border-collapse","collapse"),n.$mode.text(n.mode="显示全部"===n.mode?"只显示差异":"显示全部")})}function g(){return/^\d+$/.test(n.$sourceVer.val())&&/^\d+$/.test(n.$targetVer.val())}function h(a,b){var c=[a];do j(c.shift(),c,b);while(c.length)}function i(b,c){var d=a(),e=c||"table.sortable>tbody";return a.ajax({type:"GET",url:b,async:!1,dataType:"html",success:function(b){d=a(b)}}),a(e,d)}function j(b,c,d){a(">tr",i(b)).each(function(){var e=a(this).find(">td"),f=e.eq(0).find("a");if(f.length)if(f.text().match(/\.js$/)){var g=e.eq(2),h=e.eq(3),i=+h.attr("data"),j=+g.attr("data");d[f.text()]={link:b+f.attr("href"),conditionalsRate:100>=i?i:0,linesRate:100>=j?j:0,conditionsText:h.find("span.text").text(),linesText:g.find("span.text").text()}}else c.push(b+f.attr("href"))})}var k="utTool",l=window,m=l.pageTools=l.pageTools||{},n=m.conf=m.conf||{};n={baseURL:location.protocol+"//"+location.host+location.pathname.replace(/UT-Parallel\/.*/,"UT-Parallel/"),mode:"显示全部",filePool:[],dataPool:{},sourceData:{},targetData:{},sourceVersion:0,targetVersion:0,$form:null,$span:null,$sourceVer:null,$targetVer:null,$button:null,$meta:null,$mode:null,$table:null},m[k]=a.extend({},m.base,{run:function(){c()}}),m[k].run()}(jQuery);