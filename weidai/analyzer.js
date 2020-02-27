(function() {
    let $basket = document.getElementById("basket"),
        $title = document.getElementById("title");

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
            let reader = new FileReader();
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

    function analyseContent(data) {
        let start = 5,
            end = +data["!ref"].match(/H(\d+)/)[1],
            total = 0,
            monthData = {},
            yearData = {};

        for (var pointer = start; pointer <= end; pointer++) {
            var d = data["B" + pointer].v.slice(0, -3),
                y = d.slice(0, -3),
                v = data["C" + pointer].v;
            monthData[d] = fix((monthData[d] || 0) + v);
            yearData[y] = fix((yearData[y] || 0) + v);
            total = fix(total + v);
        }

        //for debug
        window.debug = {
            start,
            end,
            data,
            total,
            monthData,
            yearData
        };
        drawChart({
            monthData,
            yearData
        });
    }

    function drawChart(data) {
        var chart = echarts.init(document.getElementById("chart"), "light");
        var pieData = [];
        for (x in data.yearData) {
            pieData.push({
                value: data.yearData[x],
                name: x
            });
        }
        var option = {
            title: {},
            tooltip: {},
            legend: {},
            xAxis: {
                data: Object.keys(data.monthData)
            },
            yAxis: {},
            series: [{
                    name: "月回款",
                    type: "line",
                    lineStyle: {
                        color: "#600"
                    },
                    smooth: true,
                    data: Object.values(data.monthData)
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
                    data: Object.values(data.monthData)
                },
                {
                    name: "年回款",
                    type: "pie",
                    radius: "40%",
                    center: ["75%", "35%"],
                    data: pieData
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);
    }
}());
