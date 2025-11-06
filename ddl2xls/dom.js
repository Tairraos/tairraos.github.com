/**
 * 文件：dom.js
 * 作用：负责页面交互、解析触发与预览渲染、Excel下载链接生成
 * 说明：优化变量命名与注释，保证代码可读性与维护性
 */
import { genXlsx, formatData } from "./exporter.js";
import { analyzeContent } from "./analyser.js";

// DOM 选择器与关键节点引用
const select = (selector) => document.querySelector(selector);
const actionBar = select("#action");
const previewContainer = select("#preview");
const sqlTextarea = select("#material textarea");

/**
 * 重置预览区：
 * - 删除旧的下载按钮（class 为 link-download）并释放 Blob URL
 * - 清空预览表格内容
 */
function resetPreview() {
    // 删除旧的下载按钮，并尝试释放对象URL
    actionBar.querySelectorAll(".link-download").forEach((link) => {
        try {
            if (link.href) URL.revokeObjectURL(link.href);
        } catch (e) {
            // 忽略可能的异常，保证清理流程不中断
        }
        link.remove();
    });
    // 清空预览区域表格
    previewContainer.innerHTML = "";
}

/**
 * 生成下载链接元素
 * @param {string} text - 按钮文案
 * @param {string} filename - 下载文件名
 * @param {ArrayBuffer} content - Excel 二进制内容
 * @returns {HTMLAnchorElement} - 可点击下载的链接元素
 */
function createDownloadLink(text, filename, content) {
    const link = document.createElement("a");
    link.setAttribute("class", "link-download");
    link.innerHTML = text;
    link.download = filename;
    link.href = URL.createObjectURL(new Blob([content]));
    return link;
}

// 预览按钮点击事件：先清理，再解析并生成内容
select("#do-preview").addEventListener("click", () => {
    // 1) 清理旧内容和按钮
    resetPreview();

    // 2) 解析 SQL 文本，得到结构化数据
    const analyzedTables = analyzeContent(sqlTextarea.value);

    // 3) 渲染预览表格（使用字符串拼接一次性写入，减少重排）
    const htmlParts = [];
    for (const table of analyzedTables) {
        htmlParts.push(`<table class="preview"><thead>`);
        htmlParts.push(
            `<tr class="preview-title"><th class="left" style="width:200px">${table.name}</th><th style="width:100px">&nbsp;</th><th style="width:80px">&nbsp;</th><th class="left" style="width:300px">${table.comment}</th></tr>`
        );
        htmlParts.push(`</thead><tbody>`);
        table.fields.forEach((field) =>
            htmlParts.push(`<tr><td class="left">${field[0]}</td><td class="left">${field[2]}</td><td>${field[1]}</td><td class="left">${field[3]}</td></tr>`)
        );
        htmlParts.push("</tbody></table>");
    }
    previewContainer.innerHTML = htmlParts.join("");

    // 4) 生成下载按钮（中文类型 / 原始类型）
    actionBar.append(
        createDownloadLink(
            "下载excel中文类型",
            "数据目录中文类型.xlsx",
            genXlsx(
                "数据目录",
                formatData(analyzedTables, 1),
                [215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275, 25, 215, 66, 275]
            )
        )
    );
    actionBar.append(
        createDownloadLink(
            "下载excel原始类型",
            "数据目录完整类型.xlsx",
            genXlsx(
                "数据目录",
                formatData(analyzedTables, 0),
                [215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275, 25, 215, 85, 275]
            )
        )
    );
});
