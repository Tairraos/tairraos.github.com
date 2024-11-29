import { genXlsx, formatData } from "./exporter.js";
import { analyseContent } from "./analyser.js";

let $ = (selector) => document.querySelector(selector),
    $action = $("#action"),
    $preview = $("#preview"),
    $sqltext = $("#material textarea");

$("#do-preview").addEventListener("click", () => {
    let analyzed = analyseContent($sqltext.value);
    genPreview(analyzed); //生成预览表格
    $action.append(getDownloadLink("下载excel type chs", "数据目录.xlsx", genXlsx("数据目录", formatData(analyzed, 1), [215, 66, 275])));
    $action.append(getDownloadLink("下载excel type full", "数据目录.xlsx", genXlsx("数据目录", formatData(analyzed, 0), [215, 85, 275])));
});

/**
 * 生成预览表格
 * @param {Array} ref - 数据的引用数组
 * @param {Array} stru - 表格的结构数组
 * @param {Array} data - 要显示的数据数组data
 */

function genPreview(data) {
    let domArr = [];
    for (let table of data) {
        domArr.push(`<table class="preview"><thead>`);
        domArr.push(`<tr class="preview-title"><th class="left">${table.name}</th><th>&nbsp;</th><th>&nbsp;</th><th class="left">${table.comment}</th></tr>`);
        domArr.push(`</thead><tbody>`);
        table.fields.forEach((line) =>
            domArr.push(`<tr><td class="left">${line[0]}</td><td class="left">${line[2]}</td><td>${line[1]}</td><td class="left">${line[3]}</td></tr>`)
        );
        domArr.push("</tbody></table>");
    }
    $preview.innerHTML = domArr.join("");
}

function getDownloadLink(text, filename, content) {
    let ele = document.createElement("a");
    ele.setAttribute("class", "link-download");
    ele.innerHTML = text;
    ele.download = filename;
    ele.href = URL.createObjectURL(new Blob([content]));
    return ele;
}

export { genPreview };
