let $basket = document.getElementById("basket"),
    $action = document.getElementById("action"),
    $preview = document.getElementById("preview"),
    $log = document.getElementById("log"),
    $content = document.getElementById("content"),
    $material = document.getElementById("material");

$material.addEventListener("dragenter", dragEnter, false);
$material.addEventListener("dragover", dragEnter, false);
$material.addEventListener("dragleave", dragLeave, false);
$material.addEventListener("drop", dropHandler, false);

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
        $basket.innerHTML = "文件拖放动作有问题，重试一次。";
        dragLeave();
        return;
    }
    handleFiles(file[0]);
}

function log(msg) {
    $log.innerText += (msg || "") + "\n";
    $log.scrollTo(0, $log.scrollHeight);
}

function handleFiles(file) {
    let test = file.name.match(/\.(xls|xlsx)$/);
    dragLeave();
    if (!test) {
        log(`无法处理：[${file.name}]`);
        return;
    }

    log(`读取${file.name}...`);
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = e.target.result;
        analyseContent(data, test[1]); //读出文件，开始分析
    };
    reader.readAsBinaryString(file);
}

function genPreview() {
    let domArr = [],
        index = 1;

    domArr.push(`<table id="content"><thead>`);
    domArr.push(`<tr class="xls-title"><td>#</td><td>Time Start</td><td>Time End</td><td>Speecher</td><td>Chinese</td><td>Translation</td><td>Annotation</td></tr>`);
    domArr.push(`</thead><tbody>`);
    subs.forEach((item) => {
        domArr.push(`<tr class="xls-data"><td>${index++}</td><td>${item.join("</td><td>")}</td></tr>`);
    });
    domArr.push("</tbody></table>");
    $preview.innerHTML = domArr.join("");
}

function genAction() {
    if (subs.length) {
        $action.innerHTML = "下载交付文件到 Download 目录：";
        $action.appendChild(getDownloadLink("交付XLSX", `[RELEASE].${getDate()}.xlsx`, getReleaseXlsx()));
        $action.appendChild(getDownloadLink("交付TXT", `[RELEASE].${getDate()}.txt`, getReleasTxt()));
    }
}

function getDownloadLink(text, filename, content) {
    let ele = document.createElement("a");
    ele.setAttribute("class", "link-download");
    ele.innerHTML = text;
    ele.download = filename;
    ele.href = URL.createObjectURL(new Blob([content]));
    return ele;
}
