let $dec = document.getElementById("dec"),
    $hex = document.getElementById("hex"),
    $clearNumber = document.getElementById("clearNumber"),
    $clearHistory = document.getElementById("clearHistory"),
    $history = document.getElementById("history"),
    counter = 1;

function updateHex() {
    $dec.value = +$dec.value.replace(/[^\d]/g, "");
    $hex.value = (+$dec.value).toString(16).toUpperCase();
    if ($hex.value === "") {
        $hex.value = "0";
    }
}

function updateDec() {
    $hex.value = $hex.value.toUpperCase().replace(/[^\dA-F]/g, "");
    $dec.value = parseInt($hex.value, 16) || "0";
}

function formatHex(h) {
    return ("000000000000" + h).replace(/^.*(.{12})$/, "$1").replace(/([\dA-F]{2})/ig, "$1 ").trim().replace(/00 /g, "").split(" ").reverse().join(" ");
}

function enter(e) {
    if (e.keyCode === 13) {
        clearNumber();
    }
}

function clearNumber() {
    if (+$dec.value) {
        $history.innerHTML += counter++ + ": " + $dec.value + " <--> " + $hex.value + " <--> " + formatHex($hex.value) + "<br />";
    }
    $dec.value = $hex.value = "0";
    $dec.focus();
    $history.scrollTop = $history.scrollHeight;
}

function clearHistory() {
    $history.innerHTML = "";
    counter = 1;
    $dec.focus();
}

$dec.addEventListener("change", updateHex);
$dec.addEventListener("click", updateHex);
$dec.addEventListener("keyup", updateHex);
$hex.addEventListener("change", updateDec);
$hex.addEventListener("click", updateDec);
$hex.addEventListener("keyup", updateDec);
$dec.addEventListener("keydown", enter);
$hex.addEventListener("keydown", enter);
$clearNumber.addEventListener("click", clearNumber);
$clearHistory.addEventListener("click", clearHistory);