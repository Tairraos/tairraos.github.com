/**
 * 文件：exporter.js
 * 作用：将解析得到的数据结构转换为 Excel 并应用主题样式
 * 说明：保持功能不变，优化变量命名、注释与排版
 */
import { setup } from "./setup.js";

/**
 * 将表结构数据格式化为 AOA（Array of Arrays）供 Excel 生成
 * @param {{name: string, comment: string, fields: [string, string, string, string][]}[]} analyzedTables - 解析后的表结构
 * @param {0|1} isChs - 1 表示中文类型，0 表示原始类型
 * @returns {Array[]} - 二维数组，供 xlsx 生成工作表
 */
function formatData(analyzedTables, isChs) {
    const sheetRows = [];
    // 先生成集中表名项
    analyzedTables.forEach((table) => sheetRows.push([table.name, " ", table.comment]));
    sheetRows.push(["", "", ""]); // 空一行

    // 每个表生成数据项
    for (const table of analyzedTables) {
        // 表名第二列使用“数据表”三个字，这样会应用黑底白字 theme
        sheetRows.push([table.name, " ", table.comment]);
        table.fields.forEach((field) => sheetRows.push([field[0], isChs ? field[1] : field[2], field[3]]));
        sheetRows.push(["", "", ""]); // 空一行
    }
    return sheetRows;
}

/**
 * 生成 Excel 文件字节数组
 * @param {string} sheetName - 工作表名称
 * @param {Array[]} sheetContent - 工作表内容（AOA）
 * @param {number[]} colWidths - 每列宽度像素值
 * @returns {ArrayBuffer} - Excel 文件内容（字节数组）
 */
function genXlsx(sheetName, sheetContent, colWidths) {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(sheetContent);
    const range = XLSX.utils.decode_range(sheet["!ref"]); // range.s=excel 左上角坐标，range.e=excel 右下角坐标

    // 工具函数：坐标转换成单元格名字, 传入(1,1)，返回"A1"
    const cellNameAt = (c, r) => XLSX.utils.encode_col(c) + (r + 1);
    // 工具函数：安全读取单元格值
    const cellValue = (name) => (sheet[name] ? sheet[name].v : "");
    // 工具函数：按坐标读取单元格值（列不存在则返回空）
    const readAt = (c, r) => (typeof c !== "undefined" ? cellValue(cellNameAt(c, r)) : "");

    let isDeepRow = false; // 行背景深浅标记（交替）
    let isBlankRow = false; // 空行标记
    let theme = {};

    for (let r = range.s.r; r <= range.e.r; r++) {
        isDeepRow = !isDeepRow; // 行背景深浅交替
        isBlankRow = readAt(0, r) === "" && readAt(1, r) === "" && readAt(2, r) === "";

        // 第二列为“数据表”此行使用黑底白字 theme
        if (readAt(0, r) !== "" && readAt(1, r) === " " && readAt(2, r) !== "") {
            theme = setup.themes.dark;
            isDeepRow = true;
        } else {
            theme = isDeepRow ? setup.themes.deep : setup.themes.light;
        }

        for (let c = 0; c <= 2; c++) {
            const name = cellNameAt(c, r);
            if (!isBlankRow) {
                sheet[name].s = {
                    font: { name: "微软雅黑", sz: "12", color: { rgb: theme.fg } },
                    fill: { fgColor: { rgb: theme.bg } },
                    alignment: { horizontal: c === 1 && !readAt(1, r).match(/^[a-z]/) ? "center" : "left", vertical: "center", wrapText: true },
                    border: {
                        top: { style: "thin", color: { rgb: theme.border } },
                        bottom: { style: "thin", color: { rgb: theme.border } },
                        left: { style: "thin", color: { rgb: theme.border } },
                        right: { style: "thin", color: { rgb: theme.border } }
                    }
                };
            }
        }
    }
    sheet["!cols"] = colWidths.map((w) => ({ wpx: w })); // 单元格宽度
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

export { genXlsx, formatData };
