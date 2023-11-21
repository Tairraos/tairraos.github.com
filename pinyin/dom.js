let $basket = document.getElementById("basket"),
    $material = document.getElementById("material"),
    $preview = document.getElementById("preview");

// ***************************
// 拖拽区域
// ***************************
$material.addEventListener("dragenter", dragEnter, false);
$material.addEventListener("dragover", dragEnter, false);
$material.addEventListener("dragleave", dragLeave, false);
$material.addEventListener("drop", dropHandler, false);
$preview.addEventListener("click", copyit, false);

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

function genPreview(content) {
    let domArr = [];

    domArr.push(`<table id="content" class="preview"><thead>`);
    domArr.push(`<tr><td>#</td><td>Content</td><td>Action</td></tr>`);
    domArr.push(`</thead><tbody>`);
    content.forEach((item, index) => {
        domArr.push(`<tr><td>${index + 1}</td><td>${item}</td><td class="action">copy</td></tr>`);
    });
    domArr.push("</tbody></table>");
    $preview.innerHTML = domArr.join("");
}

function handleFiles(file) {
    dragLeave();
    let reader = new FileReader();
    reader.onload = function (e) {
        let lines = e.target.result.trim().split(/[\r\n]+/),
            content = [];
        lines.forEach((line) => {
            content.push(`<div class="py">${pinyinPro.pinyin(line)}</div><div class="cn">${line}</div>`);
        });
        genPreview(content);
    };
    reader.readAsText(file);
}

function copyit(e) {
    if (e.target.className==="action"){
        navigator.clipboard.writeText(e.target.closest("tr").cells[1].innerText);
    }
}
