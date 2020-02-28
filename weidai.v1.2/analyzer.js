(function() {
    var $basket = document.getElementById("basket"),
        $title = document.getElementById("title"),
        $report = document.getElementById("report");

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
        if (file.name.match(/\.xls$/)) {
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
            end = +raw["!ref"].match(/H(\d+)/)[1],
            totalPay = 0,
            monthNum = {},
            monthPay = {},
            yearPay = {},
            lastPayDay;

        for (var pointer = start; pointer <= end; pointer++) {
            var d = raw["B" + pointer].v.slice(0, -3),
                y = d.slice(0, -3),
                v = raw["D" + pointer].v;
            monthPay[d] = fix((monthPay[d] || 0) + v);
            yearPay[y] = fix((yearPay[y] || 0) + v);
            monthNum[d] = fix((monthNum[d] || 0) + 1);
            totalPay = fix(totalPay + v);
        }
        lastPayDay = raw["B" + end].v;

        //for debug
        window.debug = {
            start,
            end,
            raw,
            totalPay,
            monthPay,
            yearPay
        };
        drawChart({
            totalPay,
            monthPay,
            yearPay,
            lastPayDay
        });
    }

    function drawChart(data) {
        var chart = echarts.init(document.getElementById("chart"), "light"),
            x, pieData = [];
        for (x in data.yearPay) {
            pieData.push({
                value: data.yearPay[x],
                name: x + "年 " + fix(data.yearPay[x] / data.totalPay * 100) + "%"
            });
        }
        var option = {
            title: {},
            tooltip: {},
            legend: {},
            xAxis: {
                data: Object.keys(data.monthPay).map(function(d) {
                    return d.match(/-01/) ? d.slice(0, -3) + "年" : d.slice(-2) + "月"
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
                    data: Object.values(data.monthPay)
                },
                {
                    name: "月回款",
                    type: "bar",
                    label: {
                        show: true,
                        position: "insideBottom",
                        distance: 5,
                        align: "left",
                        verticalAlign: "middle",
                        rotate: 90,
                        fontSize: 12
                    },
                    data: Object.values(data.monthPay)
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

        var report = ["回款分析："],
            amount = 0;
        report.push("最后一笔回款时间" + data.lastPayDay.replace(/-(\d\d)-(\d\d)/, "年$1月$2日"));
        for (x in data.yearPay) {
            report.push(x + "年还款：" + data.yearPay[x] + "元，占比" + fix(data.yearPay[x] / data.totalPay * 100) + "%");
        }
        for (x in data.monthPay) {
            amount = fix(amount + data.monthPay[x]);
            report.push(format(x) + "还款：" + data.monthPay[x] + "元，占比" + fix(data.monthPay[x] / data.totalPay * 100) + "%" +
                "总还款：" + amount + "元，占比" + fix(amount / data.totalPay * 100) + "%");
        }
        $report.innerHTML = report.join("<br>\n");
    }
}());
