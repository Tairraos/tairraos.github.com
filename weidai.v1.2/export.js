let table = [],
    $process = document.getElementById("app");

table.push("<table id='list'>");
table.push("<tr><td>微贷待还散标数据</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push("<tr><td>By 小乐</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push("<tr><td>时间戳：" + (+new Date) + "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
table.push([
    "<tr><td>项目名称</td>",
    "<td>日期</td>",
    "<td>预期总收(元)</td>",
    "<td>本金(元)</td>",
    "<td>预期利息(元)</td>",
    "<td>标的编号</td>",
    "<td>偿还期数</td>",
    "<td>标的来源</td>",
    "</tr>"
].join(""));

function getData(index) {
    fetch("https://frontpc.weidai.com.cn/api/user/investor/returnMoney/getUserReceiveList?_api=returnMoney.getUserReceiveList&_mock=false&_stamp=" + (+
        new Date), {
        "credentials": "include",
        "headers": {
            "accept": "application/json, text/json",
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrer": "https://www.weidai.com.cn/home/myAccount/receivablesDetail.html",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": "goodsType=BIDDING&holdStatus=0&startTime=&endTime=&rows=40&page=" + index,
        "method": "POST",
        "mode": "cors"
    }).then(response => response.text()).then((jsonText) => {
        let json = JSON.parse(jsonText);
        return {
            count: json.data.count,
            data: json.data.data,
            index: json.data.pageIndex,
        }
    }).then(resp => {
        $process.innerHTML = Math.floor(resp.index * 40 / resp.count * 100) + "%";
        resp.data.forEach(item => pushLine(item));
        if (resp.index < resp.count / 40) {
            getData(resp.index + 1);
        } else {
            resolveFetch();
        }
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
        "<td>" + data.recoverTime + "</td>",
        "<td>" + data.recoverPrincipal + "</td>",
        "<td>" + data.recoverTotalAmount + "</td>",
        "<td>" + data.recoverInterest + "</td>",
        "<td>" + data.goodsNo + "</td>",
        "<td>" + data.period + "</td>",
        "<td>" + data.mark + "</td>",
        "</tr>"
    ].join(""));
}

getData(1);
