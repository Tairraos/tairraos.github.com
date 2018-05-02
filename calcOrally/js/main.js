var conf = {
    questions: 100, //题目数
    operators: ["+", "-", "x", "÷", "+-×"] //生成题目类型
}, quesSet = [], quesNode = $(".exam");

/**
 * gen a random number between 1 to n or n to m
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function getRandomNum(n, m) {
    return Math.random() * (m - n + 1) + n | 0;
}

/**
 * select a operators from given operators list
 * @returns {*}
 */
function getRandomOperator() {
    return conf.operators[(Math.random() * 10000 | 0) % conf.operators.length];
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
    var operator = getRandomOperator(), op2,
        A, B, C;

    if (operator === "+") {
        A = getRandomNum(1, 90);
        B = getRandomNum(1, 99 - A);
    } else if (operator === "-") {
        A = getRandomNum(2, 99);
        B = getRandomNum(1, 99);
        if (A < B) {
            C = A;
            A = B;
            B = C;
        }
        if (A === B) {
            B = B - 1;
        }
    } else if (operator === "×") {
        A = getRandomNum(2, 7);
        B = getRandomNum(2, 9);
    } else if (operator === "÷") {
        B = getRandomNum(1, 25);
        C = getRandomNum(1, 99 / B | 0);
        A = B * C;
    } else if (operator === "+-×") {
        A = getRandomNum(2, 7);
        B = getRandomNum(2, 9);
        C = getRandomNum(2, 99);
        var D = A * B;
        if (C + D > 99) {
            if (C > D) {
                return [
                    "<div class='question'>",
                    "<span class='N'>" + C + "</span>",
                    "<span class='O'>-</span>",
                    "<span class='N'>" + A + "</span>",
                    "<span class='O'>×</span>",
                    "<span class='N'>" + B + "</span>",
                    "<span class='O'>=</span>",
                    "</div>"
                ].join("");
            } else {
                return [
                    "<div class='question'>",
                    "<span class='N'>" + A + "</span>",
                    "<span class='O'>×</span>",
                    "<span class='N'>" + B + "</span>",
                    "<span class='O'>-</span>",
                    "<span class='N'>" + C + "</span>",
                    "<span class='O'>=</span>",
                    "</div>"
                ].join("");
            }
        } else {
            if (D>C){}
            if (getRandomNum(2, 99) > 40) {
                return [
                    "<div class='question'>",
                    "<span class='N'>" + A + "</span>",
                    "<span class='O'>×</span>",
                    "<span class='N'>" + B + "</span>",
                    "<span class='O'>+</span>",
                    "<span class='N'>" + C + "</span>",
                    "<span class='O'>=</span>",
                    "</div>"
                ].join("");
            } else if (getRandomNum(2, 99) > 50) {
                return [
                    "<div class='question'>",
                    "<span class='N'>" + C + "</span>",
                    "<span class='O'>+</span>",
                    "<span class='N'>" + A + "</span>",
                    "<span class='O'>×</span>",
                    "<span class='N'>" + B + "</span>",
                    "<span class='O'>=</span>",
                    "</div>"
                ].join("");
            } else {
            }
        }
    }

    return [
        "<div class='question'>",
        "<span class='B f'>" + A + "</span>",
        "<span class='O o'>" + operator + "</span>",
        "<span class='B s'>" + B + "</span>",
        "<span class='O x'>=</span>",
        "</div>"
    ].join("");

}

function insertPage() {
    quesSet = [];
    for (var i = 1; i <= conf.questions; i++) {
        quesSet.push(getQuestion(i));
    }

    quesNode.append(
        "<ul class=\"questions\">" + quesSet.join("") + "</ul>" +
        "<div class=\"bottom\">本页训练运算符: " + conf.operators.join(" ") + "</div>" +
        "<div class=\"PageNext\"></div>"
    );
}

$(function () {
    $(".form button").on("click", function () {
        conf.operators = $(this).text().split(" ");
        $(".form").remove();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
        insertPage();
    });
});
