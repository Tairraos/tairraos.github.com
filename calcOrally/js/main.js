var conf = {
    questions: 100, //题目数
    maxSum: 30, //加法最大和
    minSum: 5, //加法最小和（被减数）
    operators: ["+", "-"] //生成题目类型
},quesSet = [], quesNode = document.getElementById("questions");

function getQuestion() {
    var operator = conf.operators[((Math.random() * 100) | 0) % 2],
        A, B, C;
    if (operator === "+") {
        C = (Math.random() * (conf.maxSum - conf.minSum) + conf.minSum) | 0;
        if (C > 20) {
            A = (Math.random() * 10 + 10) | 0;
        } else {
            A = ((Math.random() * (C - 1)) + 1) | 0;
        }
        B = C - A;
    } else if (operator === "-") {
        A = (Math.random() * 19 + 1) | 0;
        B = (Math.random() * 19 + 1) | 0;
        if (A < B) {
            C = A;
            A = B;
            B = C;
        }
    }
    return [
        "<li>",
        "<span class='A'>" + A + "</span>",
        "<span class='O'>" + operator + "</span>",
        "<span class='B'>" + B + "</span>",
        "<span class='O'>=</span>",
        "</li>"
    ].join("");
}

for (var i = 1; i <= conf.questions; i++) {
    quesSet.push(getQuestion());
}
quesNode.innerHTML = quesSet.join("");
