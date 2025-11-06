import { genXlsx, formatData } from "./exporter.js";
import { analyzeContent } from "./analyser.js";

let $ = (selector) => document.querySelector(selector),
    $action = $("#action"),
    $preview = $("#preview"),
    $sqltext = $("#material textarea");

/**
 * 重置预览区：
 * - 删除旧的下载按钮（class 为 link-download）并释放 Blob URL
 * - 清空预览表格内容
 * - 初始化可能需要的局部状态
 */
function resetPreview() {
    // 删除旧的下载按钮，并尝试释放对象URL
    $action.querySelectorAll(".link-download").forEach((link) => {
        try {
            if (link.href) URL.revokeObjectURL(link.href);
        } catch (e) {
            // 忽略可能的异常，保证清理流程不中断
        }
        link.remove();
    });
    // 清空预览区域表格
    $preview.innerHTML = "";
}

// 预览按钮点击事件：先清理，再解析并生成内容
$("#do-preview").addEventListener("click", () => {
    // 1) 清理旧内容和按钮
    resetPreview();

    // 2) 解析 SQL 文本，得到结构化数据
    let analyzed = analyzeContent($sqltext.value); // 分析 sql 语句

    // 3) 渲染预览表格
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

    // 4) 生成下载按钮（中文类型 / 原始类型）
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
