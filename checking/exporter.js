let lastCompany, parity;
//导出财务数据
function getFinXlsx() {
    let content = [...finData];
    content.unshift(finCols);
    //["形式", "到款日期", "对方户名", "到款金额", "备注"]
    return genXlsx([{ sheetName: "财务帐待匹配", sheetContent: content, colWidths: finWidths }]);
}

//导出台账数据
function getLedXlsx() {
    let dataContent = [...ledData];
    dataContent.unshift(ledCols);
    let doneContent = [...ledDone];
    doneContent.unshift(ledCols);
    //["客户等级", "项目来源", "月份", "区域", "业绩业务员", "项目类型", "项目编号"],
    //["委托方", "合同额", "合作费", "其他费用", "评审费", "应收款", "净额"],
    //["已收款", "欠款额", "结清情况", "负责人", "业务员", "提交日期", "开票逾期天数"],
    //["合同归档类型", "签订日期", "采样/评审日期", "开票日期", "到款日期", "到款金额", "归属地"]
    return genXlsx([
        { sheetName: "台账未结清", sheetContent: dataContent, colWidths: ledWidths },
        { sheetName: "台账已结清", sheetContent: doneContent, colWidths: ledWidths }
    ]);
}

//导出台账和财务账的算法比对结果
function getComparedXlsx() {
    let comContent = compareData();
    //["月份", "形式", "到款日期", "对方户名", "到款金额", "类型", "区域", "项目编号", "业务员", "是否开票", "备注", "所在系统", "财务到款", "匹配状态"]
    comContent.unshift(comCols);
    let ledComContent = compareLed();
    ledComContent.unshift(ledComCols);
    return genXlsx([
        { sheetName: "台账比对财务账", sheetContent: comContent, colWidths: comWidths, fnCalcColor: calcComparedColor },
        { sheetName: "台账未结清", sheetContent: ledComContent, colWidths: ledComWidths, fnCalcColor: calcLedgerColor }
    ]);
}

//计算每个单元格的颜色
function calcComparedColor(sheet, pos) {
    let company = sheet[XLSX.utils.encode_col(com("对方户名")) + (pos.r + 1)].v,
        status = sheet[XLSX.utils.encode_col(com("匹配状态")) + (pos.r + 1)].v;
    return calcColor(pos, company, status);
}

//计算每个单元格的颜色
function calcLedgerColor(sheet, pos) {
    let company = sheet[XLSX.utils.encode_col(ledComCols.indexOf("委托方")) + (pos.r + 1)].v,
        status = sheet[XLSX.utils.encode_col(ledComCols.indexOf("匹配状态")) + (pos.r + 1)].v;
    return calcColor(pos, company, status);
}

function calcColor(pos, company, status) {
    if (pos.r === 0) {
        return "333333"; //第一行表头，深黑色背景
    }
    if (lastCompany !== company) {
        parity = +!parity;
        lastCompany = company;
    }
    return colorSets[parity || 0][status];
}

//生成 xlsx 数据
function genXlsx(sheetConfigs) {
    let workbook = XLSX.utils.book_new();
    for (let { sheetName, sheetContent, colWidths, fnCalcColor } of sheetConfigs) {
        let sheet = XLSX.utils.aoa_to_sheet(sheetContent),
            getWidth = (col) => (colWidths[col] ? colWidths[col] : 50); //默认宽度50
        Object.keys(sheet).forEach((cellName) => {
            if (!cellName.startsWith("!")) {
                let pos = XLSX.utils.decode_cell(cellName);
                sheet[cellName].s = {
                    font: { name: "Calibri", sz: "12" },
                    alignment: { horizontal: getWidth(pos.c) > 200 ? "left" : "center", vertical: "top", wrapText: true },
                    border: {
                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                        right: { style: "thin", color: { rgb: "CCCCCC" } }
                    },
                    fill: { fgColor: { rgb: fnCalcColor ? fnCalcColor(sheet, pos) : "FFFFFF" } } //背景色方法，默认是白底
                };
                if (cellName.match(/^[A-Z]+1$/)) {
                    //首行特殊
                    sheet[cellName].s.font.bold = true; //加粗
                    sheet[cellName].s.alignment.horizontal = "center"; //加粗
                    sheet[cellName].s.font.color = { rgb: "FFFFFF" }; //白字
                    sheet[cellName].s.fill.fgColor = { rgb: "333333" }; //黑底
                }
                if (["撤销", "缺台账"].includes(sheet[cellName].v)) {
                    sheet[cellName].s.font.color = { rgb: "FF0000" }; //红字
                }
            }
        });
        sheet["!cols"] = colWidths.map((i) => ({ wpx: i }));
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }

    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}
