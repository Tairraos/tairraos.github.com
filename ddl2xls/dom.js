import { setup } from "./setup.js";
import { genXlsx } from "./exporter.js";
import { analyseContent } from "./analyser.js";

let $ = (selector) => document.querySelector(selector),
    $action = $("#action"),
    $preview = $("#preview"),
    $sqltext = $("#material textarea");

$("#do-preview").addEventListener("click", () => {
    let analyzed = analyseContent($sqltext.value),
        content = [];
    genPreview(analyzed);

    //生成集中的表名项
    for (let table of analyzed) {
        content.push([table.name, "数据表", table.comment]);
    }
    //空一行
    content.push(["", "", ""]);
    //为每个表生成数据项
    for (let table of analyzed) {
        content.push([table.name, "数据表", table.comment]);
        table.fields.forEach((line) => content.push(line));
        content.push(["", "", ""]);
    }

    $action.append(getDownloadLink("下载excel", "数据目录.xlsx", genXlsx("数据目录", content, [215, 66, 275])));
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
        domArr.push(`<tr class="preview-title"><th class="left">${table.name}</th><th>&nbsp;</th><th class="left">${table.comment}</th></tr>`);
        domArr.push(`</thead><tbody>`);
        table.fields.forEach((line) => domArr.push(`<tr><td class="left">${line[0]}</td><td>${line[1]}</td><td class="left">${line[2]}</td></tr>`));
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
