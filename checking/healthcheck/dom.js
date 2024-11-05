import { setup } from "./setup.js";
import { getComparedXlsx } from "./exporter.js";
import { analyseContent } from "./loader.js";

let $ = (selector) => document.querySelector(selector),
    today = new Date().toISOString().slice(0, 10),
    $basket = $("#basket"),
    $log = $("#log"),
    $material = $("#material");

let actionDom = {
    health: { preview: $("#preview-health"), show: $("#show-health"), name: "体检报告" },
    info: { preview: $("#preview-info"), show: $("#show-info"), name: "人员信息" },
    result: { preview: $("#preview-result"), show: $("#show-result"), download: $("#download-result"), name: "对比结果" }
};

// ***************************
// 拖拽区域
// ***************************
$material.addEventListener("dragenter", dragEnter, false);
$material.addEventListener("dragover", dragEnter, false);
$material.addEventListener("dragleave", dragLeave, false);
$material.addEventListener("drop", dropHandler, false);

function log(msg) {
    $log.innerText += (msg || "") + "\n";
    $log.scrollTo(0, $log.scrollHeight);
}

function dragLeave() {
    $basket.classList.remove("dragover");
}

function dragEnter(e) {
    $basket.classList.add("dragover");
    e.stopPropagation();
    e.preventDefault();
}

function dropHandler(e) {
    let file = e.dataTransfer.files;

    e.stopPropagation();
    e.preventDefault();

    if (!file.length) {
        $basket.innerHTML = "文件拖放动作有问题，重试一次";
        dragLeave();
        return;
    }
    handleFiles(file[0]);
}

//type 注入哪个dom, ref 数据源格字段含义, stru 目标字段, data 数据
function genPreview(type, ref, stru, data) {
    let domArr = [];
    //hardcode
    let leftList = ["委托方", "对方户名", "备注"];
    domArr.push(`<table id="content" class="preview"><thead>`);
    domArr.push(`<tr class="preview-title"><th>#</th>${stru.map((item) => `<th>${item}</th>`).join("")}</tr>`);
    domArr.push(`</thead><tbody>`);
    data.forEach((line, index) => {
        domArr.push(
            `<tr><td>${index + 1}</td>${stru
                .map((item) => `<td${leftList.includes(item) ? " class='left'" : ""}>${line[ref.indexOf(item)]}</td>`)
                .join("")}</tr>`
        );
    });
    domArr.push("</tbody></table>");
    actionDom[type].preview.innerHTML = domArr.join("");
    actionDom[type].show.addEventListener("click", () => switchDisplay(type));
    switchDisplay(type);
}

function switchDisplay(type) {
    $("#showing").innerText = actionDom[type].name;
    Object.keys(actionDom).forEach((type) => {
        actionDom[type].preview && actionDom[type].preview.classList.add("hidden");
    });
    actionDom[type].preview.classList.remove("hidden");
    actionDom[type].show.removeAttribute("disabled");
}

function genAction() {
    if (setup.healthData.length && setup.infoData.length) {
        replaceDownload("result", getDownloadLink("对比结果", `比对报告.${today}.xlsx`, getComparedXlsx()));
    }
}

function replaceDownload(type, child) {
    let ele = actionDom[type].download;
    ele.innerHTML = "";
    ele.appendChild(child);
}

function handleFiles(file) {
    let checkedType;
    dragLeave();
    if (file.name.match(/\.(xls|xlsx)$/)) {
        checkedType = file.name.match(/信息/) ? "info" : file.name.match(/体检/) ? "health" : "invalid";
    }

    if (checkedType === "invalid") {
        log(`文件名需要包含”体检"作为体检报告`);
        log(`文件名需要包含"信息"作为人员信息`);
        return;
    }

    log(`读取${file.name}`);
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = reader.result;
        analyseContent(data, checkedType); //读出文件，开始分析
    };
    reader.readAsArrayBuffer(file);
}

function getDownloadLink(text, filename, content) {
    let ele = document.createElement("a");
    ele.setAttribute("class", "link-download");
    ele.innerHTML = text;
    ele.download = filename;
    ele.href = URL.createObjectURL(new Blob([content]));
    return ele;
}

export { log, genPreview, genAction };
