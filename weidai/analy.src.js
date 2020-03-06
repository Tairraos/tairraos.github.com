(function() {
    var $basket = document.getElementById("basket"),
        $title = document.getElementById("title"),
        $readme = document.getElementById("readme"),
        $report = document.getElementById("report"),
        conf = {
            totalPay: 0,
            dayData: {},
            monthNum: {},
            monthPay: {},
            yearPay: {}
        };
    window.conf = conf;
    if (!window.FileReader) {
        $basket.innerHTML = "你的浏览器太老了，换一个浏览器试试。";
        return;
    }

    $basket.addEventListener("dragenter", dragEnter, false);
    $basket.addEventListener("dragover", dragEnter, false);
    $basket.addEventListener("dragleave", dragLeave, false);
    $basket.addEventListener("drop", dropHandler, false);
    document.title += " by 小乐";
    $title.innerHTML = document.title;
    $readme.innerHTML = "把“导出获得的xls或xlsx文件”拖放到此处。"

    function dragLeave() {
        $basket.classList.remove("dragover");
    }

    function dragEnter(e) {
        $basket.classList.add("dragover");
        e.stopPropagation();
        e.preventDefault();
    }

    function dropHandler(e) {
        file = e.dataTransfer.files;

        e.stopPropagation();
        e.preventDefault();

        if (!file.length) {
            $basket.innerHTML = "文件拖放动作有问题，重试一次。";
            dragLeave();
            return;
        }
        handleFiles(file[0]);
    }

    function handleFiles(file) {
        if (file.name.match(/\.xls.?$/)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: "binary"
                });
                if (!workbook.Sheets["待收明细报表_全部"]) {
                    $basket.innerHTML = "你拖放的xls不是微贷散标导出文件，重试一次。";
                    return;
                }
                analyseContent(workbook.Sheets["待收明细报表_全部"]);
                $basket.style.display = "none";
            };
            reader.readAsBinaryString(file);
        } else {
            $basket.innerHTML = "你拖放的不是xls文件，重试一次。";
        }
        dragLeave();
    }

    function fix(num) {
        return Math.round(+num * 100) / 100;
    };

    function format(d) {
        return d.replace("-", "年") + "月";
    };

    function analyseContent(raw) {
        var start = 5,
            end = +raw["!ref"].match(/(\d+)/g)[1],
            dd = conf.dayData,
            mp = conf.monthPay,
            mn = conf.monthNum,
            yp = conf.yearPay;

        for (var pointer = start; pointer <= end; pointer++) {
            var type = raw["A" + pointer].v.match(/抵|械/),
                d = raw["B" + pointer].v.slice(-10),
                m = d.slice(0, -3),
                y = m.slice(0, -3),
                v = raw["D" + pointer].v,
                ds = dd[d] || {
                    pay: 0,
                    credit: 0,
                    num: 0,
                    bnum: 0,
                    bpay: 0
                };
            dd[d] = ds;
            ds.pay = fix(ds.pay + v);
            ds.credit = ds.credit + (+!type);
            ds.num = ds.num + 1;
            ds.bnum = ds.bnum + +(v > 100);
            ds.bpay = ds.bpay > v ? ds.bpay : v;

            mp[m] = fix((mp[m] || 0) + v);
            mn[m] = fix((mn[m] || 0) + 1);
            yp[y] = fix((yp[y] || 0) + v);
            conf.totalPay = fix(conf.totalPay + v);
        }
        conf.lastPayDay = raw["B" + end].v.slice(-10);

        drawChart();
        genCalendar();
    }

    function drawChart() {
        var chart = echarts.init(document.getElementById("chart"), "light"),
            x, c, pieData = [],
            processData = [],
            amount = 0;
        for (x in conf.yearPay) {
            pieData.push({
                value: conf.yearPay[x],
                name: x + "年 " + fix(conf.yearPay[x] / conf.totalPay * 100) + "%"
            });
        }
        c = 0;
        for (x in conf.monthPay) {
            amount = fix(amount + conf.monthPay[x]);
            processData.push({
                value: Math.floor(amount / conf.totalPay * 100) + "%",
                name: "进度: " + fix(amount / conf.totalPay * 100) + "%",
                xAxis: c++,
                yAxis: conf.monthPay[x]
            });
        }
        var option = {
            title: {},
            tooltip: {},
            legend: {},
            xAxis: {
                splitNumber: Object.keys(conf.monthPay).length,
                axisLabel: {
                    interval: 0
                },
                data: Object.keys(conf.monthPay).map(function(d) {
                    return {
                        value: d.match(/-01/) ? d.slice(0, -3) + "年" : d.slice(-2) + "月",
                        textStyle: {
                            fontSize: 10
                        }
                    }
                })
            },
            yAxis: {},
            series: [{
                    name: "月回款",
                    type: "line",
                    lineStyle: {
                        color: "#600"
                    },
                    smooth: true,
                    data: Object.values(conf.monthPay)
                },
                {
                    name: "月回款",
                    type: "bar",
                    markPoint: {
                        symbol: "pin",
                        data: processData,
                        symbolSize: [1, 30],
                        label: {
                            color: "#333",
                            fontSize: 10
                        },
                        itemStyle: {
                            color: "#fff",
                        }
                    },
                    label: {
                        show: true,
                        position: "insideBottom",
                        rotate: 45,
                        offset: [2, -8],
                        fontSize: 8
                    },
                    data: Object.values(conf.monthPay)
                },
                {
                    name: "年回款",
                    type: "pie",
                    radius: "40%",
                    center: ["70%", "35%"],
                    data: pieData
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);

        var report = ["回款分析："];

        report.push("");

        report.push("待还总本金金额：" + conf.totalPay + "元");
        report.push("共有待执行合同：" + Math.max.apply(Math, Object.values(conf.monthNum)) + "个");
        report.push("最后一笔回款时间：" + conf.lastPayDay.replace(/-(\d\d)-(\d\d)/, "年$1月$2日"));
        report.push("");
        for (x in conf.yearPay) {
            report.push(x + "年还款：" + conf.yearPay[x] + "元，占比" + fix(conf.yearPay[x] / conf.totalPay * 100) + "%");
        }
        report.push("");
        amount = 0;
        for (x in conf.monthPay) {
            amount = fix(amount + conf.monthPay[x]);
            report.push(format(x) + "还款：" + conf.monthPay[x] + "元(" + fix(conf.monthPay[x] / conf.totalPay * 100) + "%)；" +
                "累计还款：" + amount + "元(" + fix(amount / conf.totalPay * 100) + "%)；" +
                "执行合同数:" + conf.monthNum[x] + "个");
        }
        report.push("");
        $report.innerHTML = report.join("<br>\n");
    }

    function nextDay(date) {
        var d = new Date(+(new Date(date)) + 1000 * 60 * 60 * 24);
        return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
    }

    function thisDay(date) {
        return date.replace(/-/g, "");
    }

    function genCalendar() {
        var a = document.createElement("a"),
            content = [];

        content.push("BEGIN:VCALENDAR");
        content.push("METHOD:PUBLISH");
        content.push("VERSION:2.0");
        content.push("X-WR-CALNAME:微贷");
        content.push("X-APPLE-CALENDAR-COLOR:#660000");
        content.push("X-WR-TIMEZONE:Asia/Shanghai");
        content.push("CALSCALE:GREGORIAN");
        for (x in conf.dayData) {
            content.push("BEGIN:VEVENT");
            var ds = conf.dayData[x];
            content.push("SUMMARY:还款" + ds.pay + "元");
            content.push("DESCRIPTION:" + [
                "今日还款" + ds.pay + "元",
                "执行合同" + ds.num + "个",
                "信用标" + ds.credit + "个",
                "抵押标" + (ds.num - ds.credit) + "个",
                "大于100元的标" + ds.bnum + "个",
                "最大还款标" + ds.bpay + "元"
            ].join("\\n"));
            content.push("DTSTART;VALUE=DATE:" + thisDay(x));
            content.push("DTEND;VALUE=DATE:" + nextDay(x));
            content.push("SEQUENCE:1");
            content.push("END:VEVENT");
        }
        content.push("END:VCALENDAR");
        a.innerHTML = "导出还款日历";
        a.download = "微贷.ics";
        a.href = URL.createObjectURL(new Blob([content.join("\n")]));
        $report.appendChild(a);
    }
}());
