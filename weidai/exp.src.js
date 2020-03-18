var table = [],
    per = 40,
    curIndex = 1,
    hold = 0;

var $container = document.getElementsByClassName("wdpc-header")[0];
$container.innerHTML = "<div id='ds' class='hacktext' style='text-align:center; line-height:100px;'></div>";
var $process = document.getElementById("ds");

table.push("<table id='list'>");
table.push("<tr><td colspan='8'>微贷待还散标数据 By 小乐</td></tr>");
table.push("<tr><td colspan='8'>时间戳：" + String(new Date()) + "</td>/tr>");
table.push([
    "<tr><td>项目名称</td>",
    "<td>日期</td>",
    "<td>预期总收(元)</td>",
    "<td>本金(元)</td>",
    "<td>预期利息(元)</td>",
    "<td>偿还期数</td>",
    "<td>偿还状态</td>",
    "<td>页数</td>",
    "</tr>"
].join(""));

function getData(index, holdStatus) {
    fetch("https://frontpc.weidai.com.cn/api/user/investor/returnMoney/getUserReceiveList?_api=returnMoney.getUserReceiveList&_mock=false&_stamp=" + +
        new Date(), {
            "credentials": "include",
            "headers": {
                "accept": "application/json, text/json",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7,zh-TW;q=0.6",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://www.weidai.com.cn/home/myAccount/receivablesDetail.html",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": "goodsType=BIDDING&holdStatus=" + (+!!holdStatus) + "&startTime=&endTime=&rows=" + per + "&page=" + index,
            "method": "POST",
            "mode": "cors"
        }).then(function(response) {
        return response.text();
    }).then(function(jsonText) {
        var json = JSON.parse(jsonText);
        return {
            available: json.data.available,
            count: json.data.count,
            data: json.data.data,
            index: json.data.pageIndex
        };
    }).then(function(resp) {
        if (resp.available === true) {
            $process.innerHTML = "先下载待收，再下载已经收。" + (hold ? "已收" : "待收") + "数据，共" + resp.count + "条数据，每页" + per + "条数据，第" + curIndex + "页 进度：" +
                Math.floor(resp.index * per / resp.count * 100) + "%";
            resp.data.forEach(function(item) {
                return pushLine(item);
            });
            if (resp.index < resp.count / per) {
                curIndex = resp.index + 1;
                getData(resp.index + 1, hold);
            } else {
                if (hold === 1) {
                    resolveFetch();
                } else {
                    curIndex = 1;
                    hold = 1;
                    getData(curIndex, hold);
                }
            }
        } else {
            getData(curIndex);
        }
    }).catch(function() {
        window.setTimeout(function() {
            getData(curIndex);
        }, 500);
    });
}

function resolveFetch() {
    table.push("</table>");
    document.write(table.join("\n"));
}

function pushLine(data) {
    table.push([
        "<tr>",
        "<td>" + data.goodsName + "</td>",
        "<td>D" + data.recoverTime + "</td>",
        "<td>" + data.recoverTotalAmount + "</td>",
        "<td>" + data.recoverPrincipal + "</td>",
        "<td>" + data.recoverInterest + "</td>",
        "<td>第" + data.period + "期</td>",
        "<td>" + data.status + "</td>",
        "<td>第" + curIndex + "页</td>",
        "</tr>"
    ].join(""));
}

getData(curIndex, hold);
