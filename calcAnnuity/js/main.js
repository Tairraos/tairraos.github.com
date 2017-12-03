function getX(original, rate, years) {
    return rate * Math.pow(1 + rate, years) / (Math.pow((1 + rate), years) - 1) * original;
}

function round(x) {
    return ((x * 100) | 0) / 100;
}

function currency(x) {
    return ("" + ((x * 100) | 0)).replace(/(\d\d)$/, ".$1");
}

function doList() {
    var original = +$("#original").val(),
        rate = +$("#rate").val(),
        startYear = +$("#startYear").val(),
        endYear = +$("#endYear").val() + 1,
        years = endYear - startYear,
        x = round(getX(original, rate, years)),
        tmpOriginal;

    var html = $("<table cellspacing=\"1\" cellpadding=\"0\"></table>");
    html.append("<tr><td>年龄</td><td>年初余额</td><td>利率</td><td>年末余额</td><td>支取金额</td></tr>");
    while (years-- > 0) {
        tmpOriginal = round(original * (1 + rate) - x);

        html.append(["<tr>",
            "<td>" + (startYear++) + "岁</td>",
            "<td>￥" + currency(original) + "</td>",
            "<td>" + rate * 100 + "%</td>",
            "<td>￥" + currency(tmpOriginal) + "</td>",
            "<td>￥" + x + "</td>",
            "</tr>"].join(""));
        original = tmpOriginal;
    }
    html.append(["<tr>",
        "<td>" + (startYear++) + "岁</td>",
        "<td>￥" + original + "</td>",
        "<td>&nbsp;</td>",
        "<td>&nbsp;</td>",
        "<td>&nbsp;</td>",
        "</tr>"].join(""));

    $(".list").html(html);
}

