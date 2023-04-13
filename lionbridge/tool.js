//TimeStart, TimeEnd, Speecher, Chinese, Translation, Annotation
let subs = [];

function analyseContent(data, type) {
    log(`读取成功，开始处理...`);
    if (type === "xls" || type === "xlsx") {
        let workbook = XLSX.read(data, { type: "binary" }),
            worksheet = Object.values(workbook.Sheets)[0],
            range = XLSX.utils.decode_range(worksheet["!ref"]),
            w = worksheet;

        if (range.e.c < 6) {
            return log(`导入EXCEL不是Work文件！！！！！`);
        }
        let g = (r) => (w[r] ? w[r].v : "");
        for (let row = 2; row <= range.e.r + 1; row++) {
            mergeRow([g(`B${row}`), g(`C${row}`), g(`D${row}`), g(`E${row}`), g(`F${row}`), g(`G${row}`)]);
        }
    }
    log(`${type}文件导入完成，共有${subs.length}条字幕`);
    subs.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
    genAction();
    genPreview();
    log(`已准备好下载文件，点击可下载`);
}

function getReleasTxt() {
    let fmtReleaseStamp = (stamp) => stamp.replace(/^(\d+):(\d+):(\d+)\.\d+$/, `$1 hours $2 minutes $3 seconds`).replace("00 hours ", "");
    return subs.map((line) => `Timestamp ${fmtReleaseStamp(line[0])} ${line[4]}`).join("\n");
}

function getDate() {
    let today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getReleaseXlsx() {
    let fmtReleaseStamp = (stamp) => stamp.replace(/^(\d+):(\d+):(\d+)\.\d+$/, `$1 hours $2 min $3 s`).replace("00 hours ", "");
    let content = subs.map((item, index) => [index + 1, fmtReleaseStamp(item[0]), item[4], item[5]]);
    content.unshift(["#", "Timestamp", "Translation", "Annotation"]);
    return genXlsx(content, { AB: "008000", C: "0000FF", D: "ff0000" }, [30, 90, 600, 300]);
}

function genXlsx(content, mapColor, listWidth) {
    let workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.aoa_to_sheet(content);
    Object.keys(worksheet).forEach((key) => {
        if (!key.startsWith("!")) {
            worksheet[key].s = {
                font: { name: "Calibri", sz: "11", bold: key.match(/^[A-Z]1$/) ? true : false, color: { rgb: getColor(key, mapColor) } },
                alignment: { horizontal: "left", vertical: "top", wrapText: true }
            };
        }
    });
    worksheet["!cols"] = listWidth.map((i) => ({ wpx: i }));
    XLSX.utils.book_append_sheet(workbook, worksheet, "YouTube");
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

function getColor(key, mapColor) {
    let color = "#000000";
    !key.match(/^[A-Z]1$/) && Object.keys(mapColor).forEach((item) => (color = item.includes(key[0]) ? mapColor[item] : color));
    return color;
}
