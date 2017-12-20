var conf = {
        questions: 100, //题目数
        maxSum: 100, //加法最大和
        minSum: 2, //加法最小和（被减数）
        operators: ["+", "-"] //生成题目类型
    }, quesSet = [], quesNode = $(".exam");

/**
 * gen a random number between 1 to n or n to m
 * @param {number} n
 * @param {number} m
 * @returns {number}
 */
function getRandomNum(n, m) {
    var range = sortNum(n, m);
    return  Math.random() * 10000 % (range[0] - range[1]) + range[1] | 0;
}

/**
 * select a operators from given operators list
 * @param {array} operators
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
    var operator = getRandomOperator(),
        A, B, C;
    if (operator === "+") {
        C = Math.random() * (conf.maxSum - conf.minSum) + conf.minSum | 0;
        if (C > conf.maxSum) {
            A = Math.random() * 40 + 59 | 0;
        } else {
            A = Math.random() * (C - 1) + 1 | 0;
        }
        B = C - A;
    } else if (operator === "-") {
        A = getRandomNum();
        B = getRandomNum();

        if (A < B) {
            C = A;
            A = B;
            B = C;
        }
    }
    return [
        "<div class='question'>",
        "<span class='A'>" + A + "</span>",
        "<span class='O'>" + operator + "</span>",
        "<span class='B'>" + B + "</span>",
        "<span class='O'>=</span>",
        "</div>"
    ].join("");
}

function insertPage() {
    quesSet = [];
    for (var i = 1; i <= conf.questions; i++) {
        quesSet.push(getQuestion(i));
    }

    quesNode.append("<ul class=\"questions\">" + quesSet.join("") + "</ul><div class=\"PageNext\"></div>");
}

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
