//TimeStart, TimeEnd, Speecher, Chinese, Translation, Annotation
let subs = [];

function analyseContent(data, type) {
    let isEnglishFile, chnTxt, engTxt, chnIdx, engIdx;
    log(`读取成功，开始处理...`);
    if (type === "csv") {
        //csv文件视为voice识别文件
        let lines = data.trim().split(/[\r\n]+/);
        lines.shift(); //删除标题地
        lines.forEach((line) => {
            //csv: "Speaker Name","Start Time","End Time","Text"
            let items = line.replace(/^"|"$/g, "").split(`","`);
            if (isEnglishFile === undefined) {
                isEnglishFile = isEnglish(items[3]);
            }
            [chnTxt, engTxt] = isEnglishFile ? ["", items[3]] : [items[3], ""];
            mergeRow([fmtStamp(items[1]), fmtStamp(items[2]), items[0], chnTxt, engTxt, ""]);
        });
    } else if (type === "txt") {
        //txt文件视为screen手打文件。mix的时候，screen的内容会添上(OST)
        let lines = data.trim().split(/[\r\n]+/);
        lines.forEach((line) => {
            //txt: "Start Time", "Text"
            let items = line.match(/(\d[^\s]+)\s+(.*)/),
                stamp = fmtStamp(items[1]);
            [chnTxt, engTxt] = isEnglishFile ? ["", `(OST)${items[2]}`] : [`(OST)${items[2]}`, ""];
            mergeRow([stamp, getHolderStamp(stamp), "", chnTxt, engTxt, ""]);
        });
    } else if (type === "srt") {
        let blocks = data.replace(/^\s+|\r|\s+$/g, "").split(/\n{2,}/);
        engIdx = isEnglish(blocks[0].split(/\n/)[2]) ? 2 : 3;
        chnIdx = engIdx === 2 ? 3 : 2;
        blocks.forEach((block) => {
            let items = block.split(/\n/),
                stamp = items[1].split(/[ >-]+/);
            mergeRow([fmtStamp(stamp[0]), fmtStamp(items[1]), "", items[chnIdx] || "", items[engIdx] || "", ""]);
        });
    } else {
        let workbook = XLSX.read(data, { type: "binary" }),
            worksheet = Object.values(workbook.Sheets)[0],
            range = XLSX.utils.decode_range(worksheet["!ref"]),
            w = worksheet;

        if (range.e.c < 6) {
            log(`导入EXCEL不是Work文件！！！！！`);
            return;
        }
        for (let row = 2; row <= range.e.r + 1; row++) {
            mergeRow([w[`B${row}`].v, w[`C${row}`].v, w[`D${row}`].v, w[`E${row}`].v, w[`F${row}`].v, w[`G${row}`].v]);
        }
    }
    log(`${type}文件导入完成，共有${subs.length}条字幕`);
    subs.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
    genAction();
    genPreview();
    log(`已准备好下载文件，点击可下载`);
}

function mergeRow(row) {
    let isMerged = false;
    for (let idx1 = 0; idx1 < subs.length; idx1++) {
        if (subs[idx1][0] === row[0] && subs[idx1][1] === row[1]) {
            subs[idx1].forEach((item, idx2) => (subs[idx1][idx2] = item || row[idx2]));
            isMerged = true;
            break;
        }
    }
    if (!isMerged) {
        subs.push(row);
    }
}

//格式化时间戳
function fmtStamp(stamp) {
    let timeArr = stamp.replace(/[\s]/g, "").split(/[：:。.，,]/),
        mmm = timeArr.length >= 4 || stamp.match(/[。.，,]/) ? String(+timeArr.pop()).padEnd(3, "0") : "000",
        ss = String(+timeArr.pop() || 0).padStart(2, "0"),
        mm = String(+timeArr.pop() || 0).padStart(2, "0"),
        hh = String(+timeArr.pop() || 0).padStart(2, "0");
    return `${hh}:${mm}:${ss}.${mmm}`;
}

//下一秒的时间戳，毫秒清零以表示这是生成戳
function getHolderStamp(stamp) {
    let base = new Date(+new Date("1970-01-01T" + stamp.replace(",", ".") + "Z") + 1000);
    base.setMilliseconds(0);
    return base.toISOString().slice(11, 23);
}

function isEnglish(str) {
    return !!str.match(/^[\x1e-\x80]+$/);
}

function getSrtContent(isEng) {
    return subs.map((line, index) => `${index}\n${line[0]} --> ${line[1]}\n${isEng ? line[4] : line[3]}\n`).join("\n");
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
