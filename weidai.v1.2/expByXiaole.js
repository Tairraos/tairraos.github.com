"use strict";var table=[],$process=document.getElementById("app");table.push("<table id='list'>");table.push("<tr><td>微贷待还散标数据</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");table.push("<tr><td>By 小乐</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");table.push("<tr><td>时间戳："+ +new Date()+"</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");table.push(["<tr><td>项目名称</td>","<td>日期</td>","<td>预期总收(元)</td>","<td>本金(元)</td>","<td>预期利息(元)</td>","<td>标的编号</td>","<td>偿还期数</td>","<td>标的来源</td>","</tr>"].join(""));function getData(a){fetch("https://frontpc.weidai.com.cn/api/user/investor/returnMoney/getUserReceiveList?_api=returnMoney.getUserReceiveList&_mock=false&_stamp="+ +new Date(),{"credentials":"include","headers":{"accept":"application/json, text/json","content-type":"application/x-www-form-urlencoded"},"referrer":"https://www.weidai.com.cn/home/myAccount/receivablesDetail.html","referrerPolicy":"no-referrer-when-downgrade","body":"goodsType=BIDDING&holdStatus=0&startTime=&endTime=&rows=40&page="+a,"method":"POST","mode":"cors"}).then(function(b){return b.text()}).then(function(c){var b=JSON.parse(c);return{count:b.data.count,data:b.data.data,index:b.data.pageIndex}}).then(function(b){$process.innerHTML=Math.floor(b.index*40/b.count*100)+"%";b.data.forEach(function(c){return pushLine(c)});if(b.index<b.count/40){getData(b.index+1)}else{resolveFetch()}})}function resolveFetch(){table.push("</table>");document.write(table.join("\n"))}function pushLine(a){table.push(["<tr>","<td>"+a.goodsName+"</td>","<td>D"+a.recoverTime+"</td>","<td>"+a.recoverTotalAmount+"</td>","<td>"+a.recoverPrincipal+"</td>","<td>"+a.recoverInterest+"</td>","<td>"+(a.goodsNo==="undefined"?"优选":"标的编号缺")+"</td>","<td>第"+a.period+"</td>","<td>"+(a.mark==="undefined"?"优选":a.mark)+"</td>","</tr>"].join(""))}getData(1);