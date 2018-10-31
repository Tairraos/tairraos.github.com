let $dec = document.getElementById("dec"),
    $hex = document.getElementById("hex"),
    $clear = document.getElementById("clear"),
    $history = document.getElementById("history"),
    counter = 1;

function updateHex() {
    $dec.value = $dec.value.replace(/[^\d]/g, "");
    $hex.value = (+$dec.value).toString(16).toUpperCase();
    if ($hex.value === "0") {
        $hex.value = "";
    }
}

function updateDec() {
    $hex.value = $hex.value.toUpperCase().replace(/[^\dA-F]/g, "");
    $dec.value = parseInt($hex.value, 16) || "";
}

function formatHex(h) {
    return ("000000000000" + h).replace(/^.*(.{12})$/, "$1").replace(/([\dA-F]{2})/ig, "$1 ").trim().replace(/00 /g, "").split(" ").reverse().join(" ");
}

function enter(e) {
    if(e.keyCode===13){
        clear();
    }
}

function clear() {
    if (+$dec.value) {
        $history.innerHTML += counter++ + ": " + $dec.value + " <--> " + $hex.value + " <--> " + formatHex($hex.value) + "<br />";
    }
    $dec.value = $hex.value = "";
    $dec.focus();
    $history.scrollTop = $history.scrollHeight;
}

$dec.addEventListener("change", updateHex);
$dec.addEventListener("click", updateHex);
$dec.addEventListener("keyup", updateHex);
$hex.addEventListener("change", updateDec);
$hex.addEventListener("click", updateDec);
$hex.addEventListener("keyup", updateDec);
$clear.addEventListener("click", clear);
$dec.addEventListener("keydown", enter);
$hex.addEventListener("keydown", enter);