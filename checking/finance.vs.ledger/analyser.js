import { setup } from "./setup.js";
import { log, genPreview } from "./dom.js";

let led = (name) => setup.ledCols.indexOf(name),
    fin = (name) => setup.finCols.indexOf(name),
    com = (name) => setup.comCols.indexOf(name);

//比对台账和财务账
function compareData() {
    let finMap = dataToMap(setup.finData, setup.finCols.indexOf("对方户名")), //用公司名分组
        ledMap = dataToMap(setup.ledData, setup.ledCols.indexOf("委托方")), //用公司名分组
        companyies = Array.from(finMap.keys()); //财务账涉及公司就是要对比的

    setup.comMatched = [];
    setup.comMissed = [];
    setup.comUnmatched = [];
    log(`财务帐所涉公司为${companyies.length}家`);
    log(`1 对比财务账和单行台账匹配情况`);
    companyies.forEach((company) => {
        if (ledMap.has(company)) {
            let ledLines = ledMap.get(company),
                finLines = finMap.get(company);
            for (let i = 0; i < ledLines.length; i++) {
                for (let j = 0; j < finLines.length; j++) {
                    //台账应收款和财务账到款金额匹配
                    if (ledLines[i][led("应收款")] === finLines[j][fin("到款金额")]) {
                        setup.comMatched.push(...mergeData(ledLines[i], finLines[j], "单行匹配"));
                        ledLines.splice(i, 1);
                        finLines.splice(j, 1);
                        i--;
                        break;
                    }
                }
            }
            ledLines.length === 0 && ledMap.delete(company);
            finLines.length === 0 && finMap.delete(company);
        }
    });
    log(`2 对比财务账和多行台账匹配情况`);
    companyies = Array.from(finMap.keys()); //更新公司列表，财务账已完全匹配的公司在上一步被删除了
    companyies.forEach((company) => {
        if (ledMap.has(company)) {
            let ledLines = ledMap.get(company),
                finLines = finMap.get(company),
                ledSum = ledLines.reduce((total, ledLine) => total + ledLine[led("应收款")], 0), //台账应收款求和
                finSum = finLines.reduce((total, finLine) => total + finLine[fin("到款金额")], 0); //财务账到款金额求和
            if (ledSum === finSum) {
                setup.comMatched.push(...mergeData(ledLines, finLines, "折分匹配"));
            } else {
                setup.comUnmatched.push(...mergeData(ledLines, finLines, "未匹配"));
            }
        } else {
            let ledEmpty = setup.ledCols.map((item) => ""); //用全空行代替缺台账的情形
            setup.comMissed.push(...mergeData(ledEmpty, finMap.get(company), "缺台账"));
        }
    });

    setup.comMerged = [...setup.comMatched, ...setup.comUnmatched, ...setup.comMissed];
    log(`比对结束，结果有${setup.comMerged.length}条数据`);
    log(`台账中委托方不存在于财务帐中的记录已被忽略`);

    genPreview("result", setup.comCols, setup.comPreview, setup.comMerged);
    return setup.comMerged;
}

function compareLed() {
    let idIndex = com("项目编号");

    return setup.ledData.map((ledLine) => {
        let ledComLine = [...ledLine], //复制一行
            id = ledComLine[led("项目编号")],
            matched = setup.comMerged.filter((comLine) => comLine[idIndex] === id);
        if (matched.length > 0) {
            ledComLine[led("到款日期")] = matched[0][com("到款日期")];
            ledComLine[led("到款金额")] = matched[0][com("到款金额")];
            ledComLine.push(matched[0][com("匹配状态")]);
            return ledComLine;
        }
        return [...ledComLine, "无财务账"];
    });
}

//["月份", "形式", "到款日期", "对方户名", "到款金额", "类型", "区域", "项目编号", "业务员", "是否开票", "备注", "所在系统", "财务到款", "匹配状态"]
function mergeData(ledLines, finLines, matchStatus) {
    console.log(ledLines, finLines, matchStatus);
    ledLines = Array.isArray(ledLines[0]) ? ledLines : [ledLines]; //如果只是单行数据，用数组包一层
    finLines = Array.isArray(finLines[0]) ? finLines : [finLines];
    //把两个数组拼到一起
    let len = Math.max(ledLines.length, finLines.length),
        finBase = finLines[0], //财务数据只取第一行
        result = [];
    for (let i = 0; i < len; i++) {
        let finValue = i < finLines.length ? finLines[i][fin("到款金额")] : "", //取出财务账到款金额
            ledLine = i < ledLines.length ? ledLines[i] : setup.ledCols.map((item) => ""); //用全空行代替缺台账的情形
        result.push([
            getMonth(finBase[fin("到款日期")]), //月份 = 提取月(setup.finData.到款日期)
            finBase[fin("形式")], //形式 = setup.finData.形式
            matchStatus !== "未匹配" ? finBase[fin("到款日期")] : "", //到款日期= setup.finData.到款日期
            finBase[fin("对方户名")], //对方户名 = setup.finData.对方户名
            (matchStatus === "未匹配" ? "应收" : "") + ledLine[led("应收款")], //到款金额 = setup.ledData.应收款
            ledLine[led("项目类型")], //类型 = setup.ledData.项目类型
            ledLine[led("归属地")], //区域 = setup.ledData.归属地
            ledLine[led("项目编号")], //项目编号 = setup.ledData.项目编号
            ledLine[led("业务员")], //业务员 = setup.ledData.业务员
            "", //是否开票 = ""
            finBase[fin("备注")], //备注 = setup.finData.备注
            getYear(finBase[fin("到款日期")]) >= 2023 ? "八骏" : "", //所在系统 = 提取年(setup.finData.到款日期) >= 2023 ? "八骏" : ""
            finValue, //财务账到款金额
            matchStatus || "" //匹配状态
        ]);
    }
    return result;
}

function getMonth(date) {
    return String(date).match(/^(\d+)\/(\d+)\/(\d+)*$/) ? date.replace(/^(\d+)\/(\d+)\/(\d+)*$/, "$2") : "未知";
}

function getYear(date) {
    return String(date).match(/^(\d+)\/(\d+)\/(\d+)*$/) ? date.replace(/^(\d+)\/(\d+)\/(\d+)*$/, "$1") : 0;
}

//将 setup.finData 和 setup.ledData 据转换为 Map，用第几列数据做key
function dataToMap(data, colNum) {
    let resultMap = new Map();
    for (let i = 0; i < data.length; i++) {
        let key = data[i][colNum];
        if (resultMap.has(key)) {
            resultMap.get(key).push(data[i]);
        } else {
            resultMap.set(key, [data[i]]);
        }
    }
    return resultMap;
}

export { compareData, compareLed, com };
