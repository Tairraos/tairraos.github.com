function generateAvatarLetter(name) {
    var mathcer = /^([\w\d])[^ ,]*$|^([\w\d])[^,]* ([\w\d])[^ ]*$|^([\w\d])[^ ,]*,\s*([\w\d]).*$/;
    name = typeof name === "string" ? name.trim().replace(/ *[([{][^)\]}]*[)\]}]|_/g, "") : "";
    return mathcer.test(name) ? name.replace(mathcer, "$1$2$3$5$4").toUpperCase() : null;
}

let input = document.querySelector("#optname"),
    abbr = document.querySelector("#optabbr");

input.addEventListener("keyup", (e) => {
     let abbrText = generateAvatarLetter(input.value);
     abbr.innerText = abbrText || "avatar";
});
