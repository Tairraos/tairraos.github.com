let exportName = getDate(),
    $basket = document.getElementById("basket"),
    $action = document.getElementById("action"),
    $preview = document.getElementById("preview"),
    $log = document.getElementById("log"),
    $content = document.getElementById("content"),
    $material = document.getElementById("material"),
    $clipboard = document.getElementById("clipboard"),
    $toolClipboard = document.getElementById("tool_clipboard"),
    $toolMergesrt = document.getElementById("tool_mergesrt"),
    $toolFixmark = document.getElementById("tool_fixmark"),
    $toolBackcolor = document.getElementById("tool_backcolor");

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

// ***************************
// 剪贴板工具
// ***************************
document.querySelector("#t1 button").addEventListener("click", copydom);
document.querySelector("#t2 button").addEventListener("click", copydom);
document.querySelector("#t3 button").addEventListener("click", copydom);
document.querySelector("#t4 button").addEventListener("click", copydom);
document.querySelector("#t5 button").addEventListener("click", copydom);
document.querySelector("#t6 button").addEventListener("click", copydom);
document.querySelector("#t7 button").addEventListener("click", copydom);
document.querySelector("#t8 button").addEventListener("click", copydom);

// 从localstorage里读回剪贴板历史
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

// ***************************
// 三个Tool按钮
// ***************************
$toolClipboard.addEventListener("click", toggleToolClipboard);
$toolMergesrt.addEventListener("click", toggleToolMergesrt);
$toolFixmark.addEventListener("click", goFixmark);
$toolBackcolor.addEventListener("click", toggleToolBackcolor);

function resetTools() {
    $toolMergesrt.className = "tooloff";
    $toolFixmark.className = "tooloff";
    $toolBackcolor.className = "tooloff";
    $preview.removeEventListener("click", processMergeAction);
    $preview.removeEventListener("click", toggleTRBackcolor);
}

function goFixmark() {
    subs.forEach((item, index) => {
        subs[index][3] = !item[3] ? "" : (item[3] + "。").replace(/[。，,.]{2,}/g, "。");
        subs[index][4] = !item[4] ? "" : (item[4] + ".").replace(/[.,]{2,}/g, ".");
    });
    refreshAction();
}

function tiggerToggle(btn, status) {
    btn.className = (status ? status === "off" : btn.className === "toolon") ? "tooloff" : "toolon";
    return btn.className === "toolon";
}

function toggleToolClipboard(e) {
    $clipboard.style.display = tiggerToggle($toolClipboard) ? "block" : "none";
}

function toggleToolMergesrt(e) {
    if (tiggerToggle($toolMergesrt)) {
        genMergeview();
        tiggerToggle($toolBackcolor, "off");
        $preview.addEventListener("click", processMergeAction);
    } else {
        genPreview();
        $preview.removeEventListener("click", processMergeAction);
    }
}
function toggleToolBackcolor(e) {
    genPreview();
    if (tiggerToggle($toolBackcolor)) {
        tiggerToggle($toolMergesrt, "off");
        $preview.addEventListener("click", toggleTRBackcolor);
    } else {
        $preview.removeEventListener("click", toggleTRBackcolor);
    }
}

function processMergeAction(e) {
    let index = +e.target.parentElement.getAttribute("data-index");
    if (e.target.className.match(/^start/)) {
        mergeStart = index;
        if (index >= mergeEnd) {
            mergeEnd = index;
        }
    } else if (e.target.className === "select") {
        if (index >= mergeStart) {
            mergeEnd = index;
        }
    } else if (e.target.className === "ready" && mergeStart < mergeEnd) {
        let length = mergeEnd - mergeStart + 1,
            tmpsub = subs.splice(mergeStart - 1, length),
            targetArrTxt = tmpsub.map((item) => item[3]);
        tmpsub[0][1] = tmpsub[length - 1][1];
        tmpsub[0][3] = targetArrTxt.join("，") + "。";
        subs.splice(mergeStart - 1, 0, tmpsub[0]);
        if (mergeStart < subs.length) {
            mergeStart += 1;
        }
        mergeEnd = mergeStart;
        genAction();
    }
    genMergeview();
}

function genMergeview() {
    let domArr = [],
        targetArrTxt = [],
        startTime = subs[mergeStart - 1][0];
    domArr.push(`<table id="content" class="merge"><thead>`);
    domArr.push(`<tr class="xls-title"><td>#</td><td>Time Start</td><td>Time End</td><td>Duration</td><td>Chinese</td></tr>`);
    domArr.push(`</thead><tbody>`);

    subs.forEach((item, index) => {
        let pointer = index + 1,
            duration = getStampDiff(pointer > mergeStart ? startTime : item[0], item[1]);
        if (pointer >= mergeStart && pointer <= mergeEnd) {
            targetArrTxt.push(item[3]);
        }
        domArr.push(
            [
                `<tr class="xls-data${duration > 30 ? " longline" : ""}" data-index="${pointer}">`,
                `<td>${pointer}</td>`,
                `<td class="${pointer === mergeStart ? "pointer" : pointer <= mergeStart || pointer > mergeEnd ? "start" : "startfade"}">${
                    pointer <= mergeStart || pointer > mergeEnd ? item[0] : "→"
                }</td>`,
                `<td class="${pointer < mergeStart || pointer > mergeEnd ? "" : "endfade"}">${
                    pointer < mergeStart || pointer >= mergeEnd ? item[1] : "→"
                }</td>`,
                `<td class="${pointer === mergeEnd ? "ready" : "select"}">${pointer < mergeStart || pointer >= mergeEnd ? duration : ""}</td>`,
                `<td class="${pointer < mergeStart || pointer >= mergeEnd ? "" : "txtfade"}">${
                    pointer === mergeEnd ? targetArrTxt.join("，") + "。" : item[3]
                }</td></tr>`
            ].join("")
        );
    });
    domArr.push("</tbody></table>");
    $preview.innerHTML = domArr.join("");
}
function toggleTRBackcolor(e) {
    e.target.parentElement.style.background = e.target.parentElement.style.background === "" ? "#cce" : "";
}

function genPreview() {
    let domArr = [];

    domArr.push(`<table id="content" class="preview"><thead>`);
    domArr.push(
        `<tr class="xls-title"><td>#</td><td>Time Start</td><td>Time End</td><td>Speecher</td><td>Chinese</td><td>Translation</td><td>Annotation</td></tr>`
    );
    domArr.push(`</thead><tbody>`);
    subs.forEach((item, index) => {
        domArr.push(`<tr class="xls-data"><td>${index + 1}</td><td>${item.join("</td><td>")}</td></tr>`);
    });
    domArr.push("</tbody></table>");
    $preview.innerHTML = domArr.join("");
}

// ***************************
// 下载Action工具
// ***************************

function genAction() {
    if (subs.length) {
        $action.innerHTML = "下载：";
        $action.appendChild(getDownloadLink("中文SRT", `${exportName}.work.CHN.srt`, getSrtContent(false)));
        $action.appendChild(getDownloadLink("英语SRT", `${exportName}.work.ENG.srt`, getSrtContent(true)));
        $action.appendChild(getDownloadLink("工作XLSX", `${exportName}.work.xlsx`, getWorkXlsx()));
        $action.appendChild(getDownloadLink("交付XLSX", `${exportName}.RELEASE.xlsx`, getReleaseXlsx()));
        $action.appendChild(getDownloadLink("交付TXT", `${exportName}.RELEASE.txt`, getReleaseTxt()));
    }
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
    exportName = file.name.replace(/^([^\.]+).*$/, "$1");
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = e.target.result;
        analyseContent(data, test[1]); //读出文件，开始分析
    };
    test[1].match(/txt|srt|csv/) ? reader.readAsText(file) : reader.readAsBinaryString(file);
}

function getDownloadLink(text, filename, content) {
    let ele = document.createElement("a");
    ele.setAttribute("class", "link-download");
    ele.innerHTML = text;
    ele.download = filename;
    ele.href = URL.createObjectURL(new Blob([content]));
    return ele;
}
