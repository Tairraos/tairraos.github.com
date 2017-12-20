var conf = {}, quesSet = [], quesNode = $(".exam");

/**
 * gen a random number between 1 to n or n to m
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function getRandomNum(n, m) {
    return (Math.random() * (m - n) + n) | 0;
}

/**
 * return an array, small num is front
 * @param {number} n
 * @param {number} m
 * @returns {array}
 */
function sortNum(n, m) {
    m = m || 1;
    return n < m ? [n, m] : [m, n];
}

function getQuestion() {
    var A = getRandomNum(1, 10),
        B = getRandomNum(1, 10);

    return [
        "<div class='question'>",
        "<span class='A'>" + A + "</span>",
        "<span class='O'> x </span>",
        "<span class='B'>" + B + "</span>",
        "<span class='O'>=</span>",
        "</div>"
    ].join("");
}

function insertPage() {
    quesSet = [];
    for (var i = 1; i <= 100; i++) {
        quesSet.push(getQuestion(i));
    }

    quesNode.append("<ul class=\"questions\">" + quesSet.join("") + "</ul><div class=\"PageNext\"></div>");
}

insertPage();
insertPage();
insertPage();
