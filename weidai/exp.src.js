var table = [],
    $process = document.getElementById("app"),
    per = 10,
    curIndex = 867;

table.push("<table id='list'>");
table.push("<tr><td>微贷待还散标数据</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push("<tr><td>By 小乐</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push("<tr><td>时间戳：" + +new Date() + "</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push([
    "<tr><td>项目名称</td>",
    "<td>日期</td>",
    "<td>预期总收(元)</td>",
    "<td>本金(元)</td>",
    "<td>预期利息(元)</td>",
    "<td>偿还期数</td>",
    "<td>页码</td>",
    "</tr>"
].join(""));

function getData(index) {
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
                "body": "goodsType=BIDDING&holdStatus=0&startTime=&endTime=&rows=" + per + "&page=" + index,
                "method": "POST",
                "mode": "cors"
            })
        .then(function(response) {
            var json = JSON.parse(response.text());
            var resp = {
                available: json.data.available,
                count: json.data.count,
                data: json.data.data,
                index: json.data.pageIndex
            };

            curIndex = resp.index;
            console.log(resp.available);
            $process.innerHTML = Math.floor(resp.index * per / resp.count * 100) + "%";
            if (resp.available === true) {
                resp.data.forEach(function(item) {
                    return pushLine(item);
                });

                if (curIndex < resp.count / per) {
                    getData(curIndex + 1);
                } else {
                    resolveFetch();
                }
            } else {
                getData(curIndex);
            }
        })
        .catch(function() {
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
        "<td>第" + data.period + "</td>",
        "<td>第" + curIndex + "</td>",
        "</tr>"
    ].join(""));
}

