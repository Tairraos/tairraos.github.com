let exportName = getDate(),
    $basket = document.getElementById("basket"),
    $action = document.getElementById("action"),
    $preview = document.getElementById("preview"),
    $log = document.getElementById("log"),
    $content = document.getElementById("content"),
    $material = document.getElementById("material");

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

function genPreview(domid, stru, data) {
    let domArr = [];
    domArr.push(`<table id="content" class="preview"><thead>`);
    domArr.push(`<tr class="xls-title"><th>#</th>${stru.map((item) => `<th>${item}</th>`).join("")}</tr>`);
    domArr.push(`</thead><tbody>`);
    data.forEach((line, index) => {
        domArr.push(`<tr class="xls-data"><td>${index + 1}</td>${line.map((item) => `<td>${item}</td>`).join("")}</tr>`);
    });
    domArr.push("</tbody></table>");
    document.getElementById(domid).innerHTML = domArr.join("");
}

// ***************************
// Action:下载输出
// ***************************

function genAction(financeData, ledgerData) {
    $action.innerHTML = "";
    if (financeData.length) {
        $action.appendChild(getDownloadLink("财务账纯数据", `账务账备份.多谱到账.${exportName}.xlsx`, getFinanceXlsx(false)));
    }
    if (ledgerData.length) {
        $action.appendChild(getDownloadLink("台账纯数据", `台账备份.${exportName}.xlsx`, getLedgerXlsx()));
    }
    if (financeData.length && ledgerData.length) {
        $action.appendChild(getDownloadLink("台账和财务账对比结果", `${exportName}.checking.xlsx`, getSrtContent(false)));
    }
}

function handleFiles(file) {
    let checkedType;
    dragLeave();
    if (file.name.match(/\.(xls|xlsx)$/)) {
        checkedType = file.name.match(/多谱到账/) ? "finance" : file.name.match(/台账/) ? "ledger" : "invalid";
    }

    if (checkedType === "invalid") {
        log(`文件名有误：[${file.name}]`);
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


