//导出财务数据
function getFinanceXlsx() {
    let content = financeData.map((item, index) => [index + 1, ...item]);
    content.unshift(["#", ...financeColumns]);
    //["#", "对方户名", "到款金额", "交易时间", "形式"];
    return genXlsx("财务帐待匹配", content, [50, 400, 80, 80, 60]);
}

//导出台账数据
function getLedgerXlsx() {
    let content = ledgerData.map((item, index) => [index + 1, ...item]);
    content.unshift(["#", ...ledgerColumns]);
    //["#", "委托方", "业务员", "项目类型", "项目编号", "归属地", "合同额", "合作费", "其他费用", "评审费", "应收款", "到款日期", "到款金额"];
    return genXlsx("台账未结清", content, [50, 400, 100, 80, 80, 100, 80, 80, 80, 80, 80, 80, 80]);
}

//导出台账和财务账的算法比对结果
function getComparedXlsx() {
    let content = compareData();
    content.unshift([...comparedColumns]);
    //["对方户名", "项目类型", "项目编号", "业务员", "归属地", "合同额", "合作费", "其他费用", "评审费", "应收款", "到款日期", "到款金额", "到款金额", "交易时间", "形式"];
    return genXlsx("台账和财务账对比结果", content, [320, 100, 80, 80, 100, 80, 80, 80, 80, 80, 80, 80, 80, 80, 60], calcComparedColor);
}

//计算每个单元格的颜色
function calcComparedColor(sheet, cellName) {
    let p = XLSX.utils.decode_cell(cellName);
    if (p.r === 0) {
        return "333333"; //第一行表头，深黑色背景
    }
    let company = sheet["A" + (p.r + 1)].v,
        lineColor = colorSets[compareResult[company].index % 2];
    return lineColor[![9, 12].includes(p.c) ? "base" : compareResult[company].match ? "match" : "conflict"];
}

//生成 xlsx 数据
function genXlsx(name, content, listWidth, fnCalcColor = () => "FFFFFF") {
    let workbook = XLSX.utils.book_new(),
        sheet = XLSX.utils.aoa_to_sheet(content);
    Object.keys(sheet).forEach((cellName) => {
        if (!cellName.startsWith("!")) {
            let p = XLSX.utils.decode_cell(cellName);
            sheet[cellName].s = {
                font: { name: "Calibri", sz: "12" },
                alignment: { horizontal: "center", vertical: "top", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "CCCCCC" } },
                    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                    left: { style: "thin", color: { rgb: "CCCCCC" } },
                    right: { style: "thin", color: { rgb: "CCCCCC" } }
                },
                fill: { fgColor: { rgb: fnCalcColor(sheet, cellName) } } //背景色方法，默认是白底
            };
            if (cellName.match(/^[A-Z]+1$/)) {
                //首行特殊
                sheet[cellName].s.font.bold = true; //加粗
                sheet[cellName].s.font.color = { rgb: "FFFFFF" }; //白字
                sheet[cellName].s.fill.fgColor = { rgb: "333333" }; //黑底
            }
            if (sheet[cellName].v === "缺台账") {
                sheet[cellName].s.font.color = { rgb: "FF0000" }; //红字
            }
        }
    });
    sheet["!cols"] = listWidth.map((i) => ({ wpx: i }));
    workbook.views = workbook.views || [{}];
    workbook.views[0].xSplit = 0;
    workbook.views[0].ySplit = 1;
    workbook.views[0].state = "frozen";
    XLSX.utils.book_append_sheet(workbook, sheet, name);
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}
