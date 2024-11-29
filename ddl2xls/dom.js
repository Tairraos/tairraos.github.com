import { genXlsx, formatData } from "./exporter.js";
import { analyseContent } from "./analyser.js";

let $ = (selector) => document.querySelector(selector),
    $action = $("#action"),
    $preview = $("#preview"),
    $sqltext = $("#material textarea");

$("#do-preview").addEventListener("click", () => {
    let analyzed = analyseContent($sqltext.value); //分析sql语句
    let domArr = [];
    for (let table of analyzed) {
        domArr.push(`<table class="preview"><thead>`);
        domArr.push(
            `<tr class="preview-title"><th class="left" style="width:200px">${table.name}</th><th style="width:100px">&nbsp;</th><th style="width:80px">&nbsp;</th><th class="left" style="width:300px">${table.comment}</th></tr>`
        );
        domArr.push(`</thead><tbody>`);
        table.fields.forEach((line) =>
            domArr.push(`<tr><td class="left">${line[0]}</td><td class="left">${line[2]}</td><td>${line[1]}</td><td class="left">${line[3]}</td></tr>`)
        );
        domArr.push("</tbody></table>");
    }
    $preview.innerHTML = domArr.join("");
    $action.append(
        getDownloadLink(
            "下载excel中文类型",
            "数据目录中文类型.xlsx",
            genXlsx("数据目录", formatData(analyzed, 1), [215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275])
        )
    );
    $action.append(
        getDownloadLink(
            "下载excel原始类型",
            "数据目录完整类型.xlsx",
            genXlsx("数据目录", formatData(analyzed, 0), [215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275])
        )
    );
});

function getDownloadLink(text, filename, content) {
    let ele = document.createElement("a");
    ele.setAttribute("class", "link-download");
    ele.innerHTML = text;
    ele.download = filename;
    ele.href = URL.createObjectURL(new Blob([content]));
    return ele;
}
