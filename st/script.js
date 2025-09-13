/**
 * 营养学刷题工具主要功能实现
 * 包含题目打乱、选项打乱、答题判断、进度统计等功能
 */

// 全局变量
let questions = []; // 打乱后的题目数组
let currentQuestionIndex = 0; // 当前题目索引
let selectedAnswers = []; // 用户选择的答案
let isAnswered = false; // 是否已答题
let stats = { correct: 0, wrong: 0 }; // 统计数据
let optionMapping = {}; // 原始字母到页面字母的映射
let reverseMapping = {}; // 页面字母到原始字母的映射
let quesWrong = []; // 错题数组
let isReviewMode = false; // 是否为复习错题模式

// 状态保存相关变量
let normalQuizState = {
    questions: [],
    currentIndex: 0,
    stats: { correct: 0, wrong: 0 }
}; // 正常刷题状态保存
let reviewQuizState = {
    currentIndex: 0,
    stats: { correct: 0, wrong: 0 }
}; // 错题复习状态保存

/**
 * 恢复原始HTML结构
 */
function restoreOriginalHTML() {
    const card = document.getElementById('question-card');
    card.innerHTML = `
        <div class="question-type" id="question-type">单选题</div>
        <div class="question" id="question-text"></div>
        <div class="options" id="options-container"></div>
        <button class="submit-btn hidden" id="submit-btn" onclick="submitAnswer()">提交答案</button>
        <div class="result" id="result-container">
            <div class="result-title" id="result-title"></div>
            <div class="correct-answer" id="correct-answer"></div>
            <div class="explanation" id="explanation"></div>
        </div>
        <button class="next-btn hidden" id="next-btn" onclick="nextQuestion()">下一题</button>
    `;
}

/**
 * 初始化刷题工具
 * @param {boolean} reviewMode - 是否为复习错题模式
 * @param {boolean} restoreState - 是否恢复之前的状态
 */
function initQuiz(reviewMode = false, restoreState = false) {
    isReviewMode = reviewMode;
    
    // 检查并恢复原始HTML结构
    const questionType = document.getElementById('question-type');
    if (!questionType) {
        restoreOriginalHTML();
    }
    
    // 根据模式选择题库和状态
    if (isReviewMode) {
        if (quesWrong.length === 0) {
            alert('暂无错题，请先做题后再复习！');
            return;
        }
        
        if (restoreState && reviewQuizState.currentIndex < quesWrong.length) {
            // 恢复错题复习状态
            questions = [...quesWrong];
            currentQuestionIndex = reviewQuizState.currentIndex;
            stats = { ...reviewQuizState.stats };
        } else {
            // 新开始错题复习
            questions = [...quesWrong];
            shuffleArray(questions);
            currentQuestionIndex = 0;
            stats = { correct: 0, wrong: 0 };
            reviewQuizState = { currentIndex: 0, stats: { correct: 0, wrong: 0 } };
        }
        
        document.getElementById('quiz-mode').innerHTML = '<span style="color: #f44336;">当前模式：错题复习</span>';
        
        // 显示错题复习进度条，隐藏正常进度条
        document.getElementById('normal-progress').classList.add('hidden');
        document.getElementById('review-progress').classList.remove('hidden');
        
        // 更新错题复习进度条
        document.getElementById('review-total').textContent = questions.length;
        
    } else {
        if (restoreState && normalQuizState.questions.length > 0 && normalQuizState.currentIndex < normalQuizState.questions.length) {
            // 恢复正常刷题状态
            questions = [...normalQuizState.questions];
            currentQuestionIndex = normalQuizState.currentIndex;
            stats = { ...normalQuizState.stats };
        } else {
            // 新开始正常刷题
            questions = [...quesBank];
            shuffleArray(questions);
            currentQuestionIndex = 0;
            stats = { correct: 0, wrong: 0 };
            normalQuizState = { questions: [...questions], currentIndex: 0, stats: { correct: 0, wrong: 0 } };
        }
        
        document.getElementById('quiz-mode').innerHTML = '<span>当前模式：正常题库</span>';
        
        // 显示正常进度条，隐藏错题复习进度条
        document.getElementById('normal-progress').classList.remove('hidden');
        document.getElementById('review-progress').classList.add('hidden');
        
        // 更新正常进度条
        document.getElementById('normal-total').textContent = questions.length;
    }
    
    updateStats();
    
    // 更新按钮状态
    updateButtonStates();
    
    // 显示当前题目
    showQuestion();
}

/**
 * 数组打乱算法（Fisher-Yates洗牌算法）
 * @param {Array} array - 需要打乱的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 显示当前题目
 */
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // 所有题目完成
        showCompletionMessage();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    selectedAnswers = [];
    isAnswered = false;
    
    // 更新进度条
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    if (isReviewMode) {
        // 更新错题复习进度条
        document.getElementById('review-current').textContent = currentQuestionIndex + 1;
        document.getElementById('review-progress-fill').style.width = progress + '%';
    } else {
        // 更新正常刷题进度条
        document.getElementById('normal-current').textContent = currentQuestionIndex + 1;
        document.getElementById('normal-progress-fill').style.width = progress + '%';
    }
    
    // 判断题目类型
    let questionType = '';
    if (question.option.length === 0) {
        questionType = '判断题';
    } else if (question.answer.length > 1) {
        questionType = '多选题';
    } else {
        questionType = '单选题';
    }
    
    // 设置题目类型样式
    const typeElement = document.getElementById('question-type');
    typeElement.textContent = questionType;
    typeElement.className = 'question-type';
    if (questionType === '单选题') {
        typeElement.classList.add('type-single');
    } else if (questionType === '多选题') {
        typeElement.classList.add('type-multiple');
    } else {
        typeElement.classList.add('type-judge');
    }
    
    // 显示题目
    document.getElementById('question-text').textContent = question.ques;
    
    // 显示选项
    showOptions(question);
    
    // 隐藏结果和下一题按钮
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('next-btn').classList.add('hidden');
    
    // 根据题目类型显示或隐藏提交按钮
    if (questionType === '多选题') {
        document.getElementById('submit-btn').classList.remove('hidden');
        document.getElementById('submit-btn').disabled = false;
    } else {
        document.getElementById('submit-btn').classList.add('hidden');
    }
}

/**
 * 显示选项
 * @param {Object} question - 题目对象
 */
function showOptions(question) {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // 重置映射关系
    optionMapping = {};
    reverseMapping = {};
    
    if (question.option.length === 0) {
        // 判断题
        const judgeOptions = document.createElement('div');
        judgeOptions.className = 'judge-options';
        
        ['对', '错'].forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option judge-option';
            optionElement.textContent = option;
            optionElement.onclick = () => selectOption(optionElement, option);
            judgeOptions.appendChild(optionElement);
        });
        
        container.appendChild(judgeOptions);
    } else {
        // 单选题或多选题
        // 打乱选项顺序
        const shuffledOptions = [...question.option];
        shuffleArray(shuffledOptions);
        
        shuffledOptions.forEach((option, index) => {
            // 提取原始选项的字母前缀
            const originalLetter = option.charAt(0);
            const pageIndex = String.fromCharCode(65 + index); // A, B, C, D...
            
            // 建立映射关系
            optionMapping[originalLetter] = pageIndex;
            reverseMapping[pageIndex] = originalLetter;
            
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = pageIndex + option.substring(1);
            optionElement.onclick = () => selectOption(optionElement, pageIndex);
            container.appendChild(optionElement);
        });
    }
}

/**
 * 选择选项
 * @param {HTMLElement} element - 选项元素
 * @param {string} value - 选项值
 */
function selectOption(element, value) {
    if (isAnswered) return;
    
    const question = questions[currentQuestionIndex];
    const isMultiple = question.option.length > 0 && question.answer.length > 1;
    
    if (isMultiple) {
        // 多选题
        if (element.classList.contains('selected')) {
            // 取消选择
            element.classList.remove('selected');
            selectedAnswers = selectedAnswers.filter(ans => ans !== value);
        } else {
            // 选择
            element.classList.add('selected');
            selectedAnswers.push(value);
        }
    } else {
        // 单选题或判断题，清除之前选择并直接提交
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');
        selectedAnswers = [value];
        submitAnswer();
    }
}

/**
 * 提交答案
 */
function submitAnswer() {
    if (isAnswered || selectedAnswers.length === 0) return;
    
    isAnswered = true;
    const question = questions[currentQuestionIndex];
    
    // 判断答案是否正确
    let isCorrect = false;
    if (question.option.length === 0) {
        // 判断题
        isCorrect = selectedAnswers[0] === question.answer;
    } else {
        // 单选题或多选题 - 将页面字母转换为原始字母进行判断
        let originalUserAnswer = '';
        if (question.answer.length > 1) {
            // 多选题：转换每个字母
            originalUserAnswer = selectedAnswers.map(letter => reverseMapping[letter] || letter).sort().join('');
        } else {
            // 单选题：转换单个字母
            originalUserAnswer = reverseMapping[selectedAnswers[0]] || selectedAnswers[0];
        }
        isCorrect = originalUserAnswer === question.answer;
    }
    
    // 更新统计
    if (isCorrect) {
        stats.correct++;
    } else {
        stats.wrong++;
        // 如果答错且不在错题库中，则添加到错题数组
        addToWrongQuestions(question);
    }
    updateStats();
    
    // 显示结果
    showResult(isCorrect, question);
    
    // 隐藏提交按钮，显示下一题按钮
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

/**
 * 显示答题结果
 * @param {boolean} isCorrect - 是否正确
 * @param {Object} question - 题目对象
 */
function showResult(isCorrect, question) {
    const resultContainer = document.getElementById('result-container');
    const resultTitle = document.getElementById('result-title');
    const correctAnswer = document.getElementById('correct-answer');
    const explanation = document.getElementById('explanation');
    
    // 设置结果样式和内容
    resultContainer.className = 'result ' + (isCorrect ? 'correct' : 'wrong');
    resultTitle.textContent = isCorrect ? '✓ 回答正确！' : '✗ 回答错误！';
    
    // 显示正确答案（转换为页面字母）
    let displayAnswer = '';
    if (question.option.length === 0) {
        displayAnswer = question.answer;
        correctAnswer.textContent = `正确答案：${displayAnswer}`;
    } else {
        // 将原始答案字母转换为页面字母显示
        if (question.answer.length > 1) {
            displayAnswer = question.answer.split('').map(letter => optionMapping[letter] || letter).sort().join('');
        } else {
            displayAnswer = optionMapping[question.answer] || question.answer;
        }
        correctAnswer.textContent = `正确答案：${displayAnswer}`;
    }
    
    // 显示解析，处理${answer}替换
    let explanationText = question.explain;
    if (explanationText.includes('${answer}')) {
        explanationText = explanationText.replace(/\$\{answer\}/g, displayAnswer);
    }
    explanation.textContent = explanationText;
    
    // 标记选项颜色
    markOptions(question);
    
    resultContainer.style.display = 'block';
}

/**
 * 标记选项颜色
 * @param {Object} question - 题目对象
 */
function markOptions(question) {
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        if (question.option.length === 0) {
            // 判断题不需要标记选项
            return;
        }
        
        const pageLetter = String.fromCharCode(65 + index);
        const originalLetter = reverseMapping[pageLetter];
        
        // 标记正确答案
        if (question.answer.includes(originalLetter)) {
            option.classList.add('correct');
        }
        
        // 标记错误选择
        if (selectedAnswers.includes(pageLetter) && !question.answer.includes(originalLetter)) {
            option.classList.add('wrong');
        }
    });
}

/**
 * 下一题
 */
function nextQuestion() {
    currentQuestionIndex++;
    
    // 保存当前状态
    if (isReviewMode) {
        reviewQuizState.currentIndex = currentQuestionIndex;
        reviewQuizState.stats = { ...stats };
    } else {
        normalQuizState.currentIndex = currentQuestionIndex;
        normalQuizState.stats = { ...stats };
    }
    
    showQuestion();
}

/**
 * 更新统计信息
 */
function updateStats() {
    document.getElementById('correct-count').textContent = stats.correct;
    document.getElementById('wrong-count').textContent = stats.wrong;
    
    const total = stats.correct + stats.wrong;
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

/**
 * 重新打乱题序
 */
function shuffleQuestions() {
    shuffleArray(questions);
    currentQuestionIndex = 0;
    showQuestion();
}

/**
 * 恢复原始HTML结构
 */
function restoreOriginalHTML() {
    const card = document.getElementById('question-card');
    
    // 检查是否需要恢复原始结构
    if (!document.getElementById('question-type') || !document.getElementById('question-text')) {
        card.innerHTML = `
            <div class="question-type" id="question-type">单选题</div>
            <div class="question" id="question-text"></div>
            <div class="options" id="options-container"></div>
            <button class="submit-btn hidden" id="submit-btn" onclick="submitAnswer()">提交答案</button>
            <div class="result" id="result-container">
                <div class="result-title" id="result-title"></div>
                <div class="correct-answer" id="correct-answer"></div>
                <div class="explanation" id="explanation"></div>
            </div>
            <button class="next-btn hidden" id="next-btn" onclick="nextQuestion()">下一题</button>
        `;
    }
}

/**
 * 重新开始
 */
function resetQuiz() {
    // 清空错题数组，切换回正常题库
    quesWrong = [];
    isReviewMode = false;
    
    currentQuestionIndex = 0;
    stats = { correct: 0, wrong: 0 };
    updateStats();
    
    // 清空状态保存
    normalQuizState = { questions: [], currentIndex: 0, stats: { correct: 0, wrong: 0 } };
    reviewQuizState = { currentIndex: 0, stats: { correct: 0, wrong: 0 } };
    
    // 重新初始化正常题库
    questions = [...quesBank];
    shuffleArray(questions);
    
    // 更新界面显示
    document.getElementById('quiz-mode').innerHTML = '<span>当前模式：正常题库</span>';
    
    // 显示正常刷题进度条，隐藏错题复习进度条
    document.getElementById('normal-progress').classList.remove('hidden');
    document.getElementById('review-progress').classList.add('hidden');
    
    // 恢复原始HTML结构（如果被破坏）
    restoreOriginalHTML();
    
    updateButtonStates();
    
    showQuestion();
}

/**
 * 显示完成信息
 */
function showCompletionMessage() {
    const card = document.getElementById('question-card');
    const total = stats.correct + stats.wrong;
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    
    const modeText = isReviewMode ? '错题复习' : '正常刷题';
    
    card.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #4CAF50; margin-bottom: 20px;">🎉 恭喜完成${modeText}！</h2>
            <div style="font-size: 1.2rem; margin-bottom: 30px;">
                <p>总题数：${total}</p>
                <p>正确：${stats.correct}</p>
                <p>错误：${stats.wrong}</p>
                <p>正确率：${accuracy}%</p>
            </div>
            <div style="margin-bottom: 20px;">
                ${isReviewMode ? 
                    '<button class="next-btn" onclick="returnToNormalQuiz()" style="margin-right: 10px;">返回刷题</button>' : 
                    ''}
                <button class="next-btn" onclick="resetQuiz()">重新开始</button>
            </div>
        </div>
    `;
}

/**
 * 添加题目到错题数组
 * @param {Object} question - 题目对象
 */
function addToWrongQuestions(question) {
    // 检查是否已存在，避免重复添加
    const exists = quesWrong.some(q => q.id === question.id);
    if (!exists) {
        quesWrong.push(question);
        // 添加错题后立即更新按钮状态
        updateButtonStates();
    }
}

/**
 * 复习错题
 */
function reviewWrongQuestions() {
    if (quesWrong.length === 0) {
        alert('暂无错题，请先做题后再复习！');
        return;
    }
    
    // 如果当前是正常刷题模式，保存当前状态
    if (!isReviewMode) {
        normalQuizState.questions = [...questions];
        normalQuizState.currentIndex = currentQuestionIndex;
        normalQuizState.stats = { ...stats };
    }
    
    initQuiz(true);
}

/**
 * 返回正常刷题
 */
function returnToNormalQuiz() {
    if (!isReviewMode) {
        return; // 已经在正常模式，无需切换
    }
    
    // 保存错题复习状态
    reviewQuizState.currentIndex = currentQuestionIndex;
    reviewQuizState.stats = { ...stats };
    
    // 切换回正常刷题模式，恢复之前的状态
    initQuiz(false, true);
}

/**
 * 导出错题
 */
function exportWrongQuestions() {
    if (quesWrong.length === 0) {
        alert('暂无错题，请先做题后再导出！');
        return;
    }
    
    let exportText = `错题汇总（共${quesWrong.length}题）\n\n`;
    
    quesWrong.forEach((question, index) => {
        exportText += `${index + 1}. ${question.ques}\n`;
        
        if (question.option.length === 0) {
            // 判断题
            exportText += `类型：判断题\n`;
            exportText += `正确答案：${question.answer}\n`;
        } else {
            // 单选题或多选题
            const questionType = question.answer.length > 1 ? '多选题' : '单选题';
            exportText += `类型：${questionType}\n`;
            
            question.option.forEach(option => {
                exportText += `${option}\n`;
            });
            
            exportText += `正确答案：${question.answer}\n`;
        }
        
        exportText += `解析：${question.explain}\n`;
        exportText += `\n${'='.repeat(50)}\n\n`;
    });
    
    // 显示导出区域
    document.getElementById('export-textarea').value = exportText;
    document.getElementById('export-area').classList.remove('hidden');
}

/**
 * 更新按钮状态
 */
function updateButtonStates() {
    const reviewBtn = document.getElementById('review-btn');
    const exportBtn = document.getElementById('export-btn');
    const returnBtn = document.getElementById('return-btn');
    
    // 根据错题数量更新按钮状态
    if (quesWrong.length === 0) {
        reviewBtn.disabled = true;
        exportBtn.disabled = true;
        reviewBtn.title = '暂无错题';
        exportBtn.title = '暂无错题';
    } else {
        reviewBtn.disabled = false;
        exportBtn.disabled = false;
        reviewBtn.title = `复习 ${quesWrong.length} 道错题`;
        exportBtn.title = `导出 ${quesWrong.length} 道错题`;
    }
    
    // 根据当前模式更新返回按钮状态
    if (isReviewMode) {
        // 错题复习模式：显示并高亮返回按钮
        returnBtn.classList.remove('hidden');
        returnBtn.classList.add('active');
        returnBtn.title = '返回继续正常刷题';
    } else {
        // 正常刷题模式：隐藏返回按钮
        returnBtn.classList.add('hidden');
        returnBtn.classList.remove('active');
    }
}

/**
 * 全选文本
 */
function selectAllText() {
    const textarea = document.getElementById('export-textarea');
    textarea.select();
    textarea.setSelectionRange(0, 99999); // 兼容移动设备
    
    // 尝试复制到剪贴板
    try {
        document.execCommand('copy');
        alert('错题内容已复制到剪贴板！');
    } catch (err) {
        alert('请手动选择并复制文本内容。');
    }
}

/**
 * 关闭导出区域
 */
function closeExportArea() {
    document.getElementById('export-area').classList.add('hidden');
}

// 页面加载完成后初始化
window.onload = function() {
    if (typeof quesBank !== 'undefined' && quesBank.length > 0) {
        initQuiz();
    } else {
        document.getElementById('question-card').innerHTML = 
            '<div style="text-align: center; padding: 40px; color: #f44336;">错误：无法加载题库数据，请检查 nutrition-questions.js 文件是否存在。</div>';
    }
};

/**
 * 键盘快捷键支持
 */
document.addEventListener('keydown', function(event) {
    // ESC键关闭导出区域
    if (event.key === 'Escape') {
        const exportArea = document.getElementById('export-area');
        if (!exportArea.classList.contains('hidden')) {
            closeExportArea();
        }
    }
    
    // Ctrl+A 全选导出文本
    if (event.ctrlKey && event.key === 'a') {
        const exportArea = document.getElementById('export-area');
        if (!exportArea.classList.contains('hidden')) {
            event.preventDefault();
            selectAllText();
        }
    }
});