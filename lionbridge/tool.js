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
            log(`导入EXCEL不是Work文件！！！！！`);
            return;
        }
        for (let row = 2; row <= range.e.r + 1; row++) {
            subs.push([w[`B${row}`].v, w[`C${row}`].v, w[`D${row}`].v, w[`E${row}`].v, w[`F${row}`].v, w[`G${row}`].v]);
        }
    }
    log(`${type}文件导入完成，共有${subs.length}条字幕`);
    subs.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
    genAction();
    genPreview();
    log(`已准备好下载文件，点击可下载`);
}

function getReleasTxt() {
    let fmtStamp = (stamp) => stamp.replace(/^(\d+):(\d+):(\d+)\.\d+$/, `Timestamp $1 hours $2 minutes $3 seconds`).replace("00 hours ", "");
    return subs.map((line) => `${fmtStamp(line[0])} ${line[4]}`).join("\n");
}

function getDate() {
    let today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getWorkXlsx() {
    let content = subs.map((item, index) => [index + 1, ...item]);
    content.unshift(["#", "Time Start", "Time End", "Speecher", "Chinese", "Translation", "Annotation"]);
    return genXlsx(content, /^[ABCD]|^[A-Z]1$/, [30, 80, 80, 60, 400, 400, 300]);
}

function getReleaseXlsx() {
    let content = subs.map((item, index) => [index + 1, item[0], item[4], item[5]]);
    content.unshift(["#", "Timestamp", "Translation", "Annotation"]);
    return genXlsx(content, /^[AB]|^[A-Z]1$/, [30, 80, 400, 300]);
}

function genXlsx(content, reCenter, listWidth) {
    let workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.aoa_to_sheet(content);
    Object.keys(worksheet).forEach((key) => {
        if (!key.startsWith("!")) {
            worksheet[key].s = {
                font: { name: "Calibri", sz: "11", bold: key.match(/^[A-Z]1$/) ? true : false },
                alignment: { horizontal: key.match(reCenter) ? "center" : "left", vertical: "center", wrapText: true }
            };
        }
    });
    worksheet["!cols"] = listWidth.map((i) => ({ wpx: i }));
    XLSX.utils.book_append_sheet(workbook, worksheet, "YouTube");
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}
