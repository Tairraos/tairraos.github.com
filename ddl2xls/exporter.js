import { setup } from "./setup.js";

//格式化出一个数组，用它生成对应的xlsx
function formatData(analyzed, isChs) {
    let content = [];
    analyzed.forEach((line) => content.push([line.name, " ", line.comment])); //先生成集中的表名项
    content.push(["", "", ""]); //空一行
    //为每个表生成数据项
    for (let table of analyzed) {
        content.push([table.name, " ", table.comment]); //表名第二列使用“数据表”三个字，这样会应用黑底白字theme
        table.fields.forEach((line) => content.push([line[0], isChs ? line[1] : line[2], line[3]]));
        content.push(["", "", ""]); //空一行
    }
    return content;
}

function genXlsx(sheetName, sheetContent, colWidths) {
    let workbook = XLSX.utils.book_new(),
        sheet = XLSX.utils.aoa_to_sheet(sheetContent),
        range = XLSX.utils.decode_range(sheet["!ref"]), //rang.s=excel sheet左上角坐标，range.e=excel sheet右下角坐标
        gn = (c, r) => XLSX.utils.encode_col(c) + (r + 1), //坐标转换成单元格名字, 传入(1,1)，返回"A1"
        gv = (name) => (sheet[name] ? sheet[name].v : ""), //提取单元格数据, 传入A1，返回值，如果值是null，返回空字符串
        g = (c, r) => (c !== "undefined" ? gv(gn(c, r)) : ""), //读取单元格工具，传入坐标, 列不存在则返回空
        isDeepLine = false,
        isEmptyLine = false,
        theme = {};

    for (let r = range.s.r; r <= range.e.r; r++) {
        isDeepLine = !isDeepLine; //行背景深浅
        isEmptyLine = g(0, r) === "" && g(1, r) === "" && g(2, r) === "";
        //第二列为“数据表”三个字，此行会使用黑底白字theme
        if (g(0, r) !== "" && g(1, r) === " " && g(2, r) !== "") {
            theme = setup.themes.dark;
            isDeepLine = true;
        } else {
            theme = isDeepLine ? setup.themes.deep : setup.themes.light;
        }
        for (let c = 0; c <= 2; c++) {
            let cellName = gn(c, r);
            if (!isEmptyLine) {
                sheet[cellName].s = {
                    font: { name: "微软雅黑", sz: "12", color: { rgb: theme.fg } },
                    fill: { fgColor: { rgb: theme.bg } },
                    alignment: { horizontal: c === 1 && !g(1, r).match(/^[a-z]/) ? "center" : "left", vertical: "center", wrapText: true },
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
    sheet["!cols"] = colWidths.map((i) => ({ wpx: i })); //单元格宽度
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

export { genXlsx, formatData };
