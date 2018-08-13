function getX(original, rate, years) {
    return rate * Math.pow(1 + rate, years) / (Math.pow(1 + rate, years) - 1) * original;
}

function round(x) {
    return ((x + 0.000001) * 100 | 0) / 100;
}

function currency(x) {
    return (x + 0.000001 + "00").replace(/(\.\d\d).*$/, "$1");
}

function rated(x) {
    return (x * 100 + 0.000001 + "00").replace(/(\.\d\d).*$/, "$1");
}

function doList() {
    var type = $("input[name='type']:checked").val(),
        startAge = +$("#startAge").val(),
        increase = +$("#increase").val(),
        duration1 = +$("#duration").val(),
        rate = +$("#rate").val(),
        original = +$("#original").val() / (1 + rate),
        startYear = +$("#startYear").val() - 1,
        endYear = +$("#endYear").val(),
        years = endYear - startYear,
        duration2 = startYear - startAge - duration1,
        x, annal;

    var html = $("<table cellspacing=\"1\" cellpadding=\"0\"></table>");
    html.append("<tr><td>年龄</td><td>存入/支取</td><td>当期金额</td><td>利率</td><td>期末金额</td></tr>");

    if (type === "1") {
        original = increase;
        while (duration1-- > 0) {
            annal = round(original * (1 + rate));
            html.append(["<tr>",
                "<td>" + startAge++ + "岁</td>",
                "<td class='plus'>+￥" + increase + "</td>",
                "<td>￥" + currency(original) + "</td>",
                "<td>" + rated(rate) + "%</td>",
                "<td>￥" + currency(annal) + "</td>",
                "</tr>"].join(""));
            original = annal + increase;
        }

        while (duration2-- > 0) {
            annal = round(original * (1 + rate));
            html.append(["<tr>",
                "<td>" + startAge++ + "岁</td>",
                "<td>￥0</td>",
                "<td>￥" + currency(original) + "</td>",
                "<td>" + rated(rate) + "%</td>",
                "<td>￥" + currency(annal) + "</td>",
                "</tr>"].join(""));
            original = annal;
        }
    }

    x = round(getX(original, rate, years));
    annal = round(original * (1 + rate));

    if (type === "2") {
        html.append(["<tr>",
            "<td>" + startYear++ + "岁</td>",
            "<td>&nbsp;</td>",
            "<td>&nbsp;</td>",
            "<td>&nbsp;</td>",
            "<td>￥" + currency(annal) + "</td>",
            "</tr>"].join(""));
    } else {
        html.append(["<tr>",
            "<td>" + startYear++ + "岁</td>",
            "<td>￥0</td>",
            "<td>￥" + currency(original) + "</td>",
            "<td>" + rated(rate) + "%</td>",
            "<td>￥" + currency(annal) + "</td>",
            "</tr>"].join(""));
    }
    original = annal - x;
    while (--years > 0) {
        annal = round(original * (1 + rate));
        html.append(["<tr>",
            "<td>" + startYear++ + "岁</td>",
            "<td class='minus'>-￥" + x + "</td>",
            "<td>￥" + currency(original) + "</td>",
            "<td>" + rated(rate) + "%</td>",
            "<td>￥" + currency(annal) + "</td>",
            "</tr>"].join(""));
        original = annal - x;
    }
    html.append(["<tr>",
        "<td>" + startYear++ + "岁</td>",
        "<td class='minus'>-￥" + x + "</td>",
        "<td>￥" + currency(original) + "</td>",
        "<td>&nbsp;</td>",
        "<td>&nbsp;</td>",
        "</tr>"].join(""));

    $(".list").html(html);
}

