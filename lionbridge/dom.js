let exportName = getDate(),
    $basket = document.getElementById("basket"),
    $action = document.getElementById("action"),
    $preview = document.getElementById("preview"),
    $log = document.getElementById("log"),
    $content = document.getElementById("content"),
    $material = document.getElementById("material");

$material.addEventListener("dragenter", dragEnter, false);
$material.addEventListener("dragover", dragEnter, false);
$material.addEventListener("dragleave", dragLeave, false);
$material.addEventListener("drop", dropHandler, false);
document.querySelector("#t1 button").addEventListener("click", copydom);
document.querySelector("#t2 button").addEventListener("click", copydom);
document.querySelector("#t3 button").addEventListener("click", copydom);
document.querySelector("#t4 button").addEventListener("click", copydom);
document.querySelector("#t5 button").addEventListener("click", copydom);
document.querySelector("#t6 button").addEventListener("click", copydom);
document.querySelector("#t7 button").addEventListener("click", copydom);
document.querySelector("#t8 button").addEventListener("click", copydom);

Object.keys(localStorage.valueOf()).forEach((id) => {
    if (!id.match(/^\w+$/)) return;
    let $input = document.querySelector(`#clipboard #${id} input`);
    if ($input) $input.value = localStorage.getItem(id);
});

function copydom(e) {
    let $text = e.target.parentElement.querySelector("input");
    navigator.clipboard.writeText($text.value);
    localStorage.setItem($text.parentElement.id, $text.value);
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
    let extPattern = /\.(txt|srt|xls|xlsx|csv)$/,
        test = file.name.match(extPattern);
    dragLeave();
    if (!test) {
        log(`无法处理：[${file.name}]`);
        return;
    }

    log(`读取${file.name}...`);
    exportName = file.name.replace(extPattern, "");
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = e.target.result;
        analyseContent(data, test[1]); //读出文件，开始分析
    };
    test[1].match(/txt|srt|csv/) ? reader.readAsText(file) : reader.readAsBinaryString(file);
}

function genPreview() {
    let domArr = [],
        index = 1;

    domArr.push(`<table id="content"><thead>`);
    domArr.push(
        `<tr class="xls-title"><td>#</td><td>Time Start</td><td>Time End</td><td>Speecher</td><td>Chinese</td><td>Translation</td><td>Annotation</td></tr>`
    );
    domArr.push(`</thead><tbody>`);
    subs.forEach((item) => {
        domArr.push(`<tr class="xls-data"><td>${index++}</td><td>${item.join("</td><td>")}</td></tr>`);
    });
    domArr.push("</tbody></table>");
    $preview.innerHTML = domArr.join("");
    document.querySelector("#content").addEventListener("click", (e) => {
        e.target.parentElement.style.backgroundColor = "#cce";
    });
}

function genAction() {
    if (subs.length) {
        $action.innerHTML = "下载：";
        $action.appendChild(getDownloadLink("中文SRT", `${exportName}.work.CHN.srt`, getSrtContent(false)));
        $action.appendChild(getDownloadLink("英语SRT", `${exportName}.work.ENG.srt`, getSrtContent(true)));
        $action.appendChild(getDownloadLink("工作XLSX", `${exportName}.work.xlsx`, getWorkXlsx()));
        $action.appendChild(getDownloadLink("交付XLSX", `${exportName}.RELEASE.xlsx`, getReleaseXlsx()));
        $action.appendChild(getDownloadLink("交付TXT", `${exportName}.RELEASE.txt`, getReleasTxt()));
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
