import { setup } from "./setup.js";
import { log, genPreview } from "./dom.js";

let led = (name) => setup.ledCols.indexOf(name),
    pro = (name) => setup.proCols.indexOf(name);

//比对台账报告和业务报告
function compareData() {
    let ledObj = arrayToObj(setup.ledData, 0),
        proObj = arrayToObj(setup.proData, 0);

    log(`遍历业务报告，根据台账报告分类匹配和未匹配项`);
    for (let pid of Object.keys(proObj)) {
        if (ledObj[pid]) {
            //台账报告中存在
            setup.comMatched.push(mergeData(ledObj[pid], proObj[pid]));
        } else {
            setup.proMissed.push(proObj[pid]);
        }
    }
    log(`遍历台账报告，查找未匹配的台账报告数据`);
    for (let pid of Object.keys(ledObj)) {
        if (!proObj[pid]) {
            //业务报告中不存在
            setup.ledMissed.push(ledObj[pid]);
        }
    }
    log(`比对结束`);
    log(`${setup.comMatched.length} 条数据匹配成功`);
    log(`${setup.ledMissed.length} 条台账报告数据未匹配`);
    log(`${setup.proMissed.length} 条业务报告数据未匹配`);

    genPreview("result", setup.comCols, setup.comPreview, setup.comMatched);
}

// ["项目编号", "项目名称", "金额", "评审费"]
function mergeData(ledLine, proLine) {
    return [
        proLine[pro("项目编号")], // 项目编号 = proData.项目编号
        proLine[pro("项目名称")], // 项目名称= proData.项目名称
        ledLine[led("金额")], // 金额 = ledData.金额
        ledLine[led("评审费")] // 评审费 = ledData.评审费
    ];
}

//将 finData 和 ledData 据转换为 Map，用第几列数据做key
function arrayToObj(data, colKey) {
    let resultObj = {};
    for (let i = 0; i < data.length; i++) {
        resultObj[data[i][colKey]] = data[i];
    }
    return resultObj;
}

export { compareData };
