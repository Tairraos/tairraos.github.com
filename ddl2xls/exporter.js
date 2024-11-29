import { setup } from "./setup.js";

function genXlsx(sheetName, sheetContent, colWidths) {
    let workbook = XLSX.utils.book_new(),
        sheet = XLSX.utils.aoa_to_sheet(sheetContent),
        range = XLSX.utils.decode_range(sheet["!ref"]), //rang.s=excel sheet左上角坐标，range.e=excel sheet右下角坐标
        gn = (c, r) => XLSX.utils.encode_col(c) + (r + 1), //坐标转换成单元格名字, 传入(1,1)，返回"A1"
        gv = (name) => (sheet[name] ? sheet[name].v : ""), //提取单元格数据, 传入A1，返回值，如果值是null，返回空字符串
        g = (c, r) => (c !== "undefined" ? gv(gn(c, r)) : ""), //读取单元格工具，传入坐标, 列不存在则返回空
        isDeepLine = false,
        isEmptyLine = false,
        theme = ["FFFFFF", "000000"];

    for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
        isDeepLine = !isDeepLine;
        isEmptyLine = g(0, rowIndex) === "" && g(1, rowIndex) === "" && g(2, rowIndex) === "";
        if (g(1, rowIndex) === "数据表") {
            sheet[gn(1, rowIndex)].v = ""; //清空数据表三个字
            theme = ["333333", "FFFFFF", "CCCCCC"];
            isDeepLine = true;
        } else {
            theme = [setup.colorSets[+isDeepLine], "000000", "333333"];
        }
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            let cellName = gn(colIndex, rowIndex);
            if (!isEmptyLine) {
                sheet[cellName].s = {
                    font: { name: "微软雅黑", sz: "12", color: { rgb: theme[1] } },
                    fill: { fgColor: { rgb: theme[0] } },
                    alignment: { horizontal: "left", vertical: "center", wrapText: true },
                    border: {
                        top: { style: "thin", color: { rgb: theme[2] } },
                        bottom: { style: "thin", color: { rgb: theme[2] } },
                        left: { style: "thin", color: { rgb: theme[2] } },
                        right: { style: "thin", color: { rgb: theme[2] } }
                    }
                };
            } else {
                console.log(rowIndex);
            }
        }
    }
    sheet["!cols"] = colWidths.map((i) => ({ wpx: i }));
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);

    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

export { genXlsx };
