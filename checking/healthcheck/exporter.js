import { setup } from "./setup.js";
import { compareData } from "./analyser.js";

//导出人员信息和体检报告的算法比对结果
function getComparedXlsx() {
    compareData();
    setup.comMatched.unshift(setup.comCols);
    return genXlsx([
        { sheetName: "人员信息比对体检报告", sheetContent: setup.comMatched, colWidths: setup.comWidths, fnCalcColor: calcColor },
    ]);
}

function calcColor(pos) {
    if (pos.r === 0) {
        return "333333"; //第一行表头，深黑色背景
    }
    return setup.colorSets[pos.r % 2];
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
                    font: { name: "微软雅黑", sz: "10" },
                    alignment: { horizontal: getWidth(pos.c) >= 200 ? "left" : "center", vertical: "top", wrapText: true },
                    border: {
                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                        right: { style: "thin", color: { rgb: "CCCCCC" } }
                    },
                    fill: { fgColor: { rgb: fnCalcColor ? fnCalcColor(pos) : "FFFFFF" } } //背景色方法，默认是白底
                };
                if (cellName.match(/^[A-Z]+1$/)) {
                    //首行特殊
                    sheet[cellName].s.font.bold = true; //加粗
                    sheet[cellName].s.alignment.horizontal = "center"; //加粗
                    sheet[cellName].s.font.color = { rgb: "FFFFFF" }; //白字
                    sheet[cellName].s.fill.fgColor = { rgb: "333333" }; //黑底
                }
            }
        });
        sheet["!cols"] = colWidths.map((i) => ({ wpx: i }));
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }

    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

export { getComparedXlsx };
