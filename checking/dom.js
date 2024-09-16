let $ = (id) => document.getElementById(id),
    today = new Date().toISOString().slice(0, 10),
    $basket = $("basket"),
    $log = $("log"),
    $material = $("material");

let actionDom = {
    finance: { preview: $("preview-finance"), show: $("show-finance"), download: $("download-finance"), name: "财务帐" },
    ledger: { preview: $("preview-ledger"), show: $("show-ledger"), download: $("download-ledger"), name: "台账" },
    result: { preview: $("preview-result"), show: $("show-result"), download: $("download-result"), name: "对比结果" }
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
        $basket.innerHTML = "文件拖放动作有问题，重试一次。";
        dragLeave();
        return;
    }
    handleFiles(file[0]);
}

function genPreview(type, stru, data) {
    let domArr = [];
    domArr.push(`<table id="content" class="preview"><thead>`);
    domArr.push(`<tr class="xls-title"><th>#</th>${stru.map((item) => `<th>${item}</th>`).join("")}</tr>`);
    domArr.push(`</thead><tbody>`);
    data.forEach((line, index) => {
        domArr.push(`<tr class="xls-data"><td>${index + 1}</td>${line.map((item) => `<td>${item}</td>`).join("")}</tr>`);
    });
    domArr.push("</tbody></table>");
    actionDom[type].preview.innerHTML = domArr.join("");
    actionDom[type].show.addEventListener("click", () => switchDisplay(type));
    switchDisplay(type);
}

function switchDisplay(type) {
    $("showing").innerText = actionDom[type].name;
    Object.keys(actionDom).forEach((type) => {
        actionDom[type].preview.classList.add("hidden");
    });
    actionDom[type].preview.classList.remove("hidden");
    actionDom[type].show.removeAttribute("disabled");
}

function genAction(financeData, ledgerData) {
    if (financeData.length) {
        replaceDownload("finance", getDownloadLink("财务账", `账务账备份.多谱到账.${today}.xlsx`, getFinanceXlsx()));
    }
    if (ledgerData.length) {
        replaceDownload("ledger", getDownloadLink("台账", `台账备份.${today}.xlsx`, getLedgerXlsx()));
    }
    if (financeData.length && ledgerData.length) {
        replaceDownload("result", getDownloadLink("对比结果", `比对账.${today}.xlsx`, getComparedXlsx()));
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
        checkedType = file.name.match(/多谱到账/) ? "finance" : file.name.match(/台账/) ? "ledger" : "invalid";
    }

    if (checkedType === "invalid") {
        log(`请检查文件：[${file.name}]`);
        log(`文件包含”台账"或"多谱到账"为正确的财务账或台账。`);
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
