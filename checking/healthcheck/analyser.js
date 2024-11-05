import { setup } from "./setup.js";
import { log, genPreview } from "./dom.js";

let info = (name) => setup.infoCols.indexOf(name),
    health = (name) => setup.healthCols.indexOf(name);

//比对人员信息和体检报告
function compareData() {
    let infoObj = arrayToObj(setup.infoData, health("姓名")),
        healthObj = arrayToObj(setup.healthData, info("姓名"));

    log(`遍历体检报告，填入对应身份证号`);
    for (let pid of Object.keys(healthObj)) {
        if (infoObj[pid]) {
            //人员信息中存在
            setup.comMatched.push(mergeData(infoObj[pid], healthObj[pid]));

        }
    }
    
    log(`比对结束`);
    log(`${setup.comMatched.length} 条数据匹配成功`);


    genPreview("result", setup.comCols, setup.comPreview, setup.comMatched);
}

// ["项目编号", "项目名称", "金额", "评审费"]
function mergeData(infoLine, healthLine) {
    return [
        healthLine[health("姓名")], //* 姓名 = healthData.姓名
        healthLine[health("性别")], //* 性别 = healthData.性别
        healthLine[health("年龄")], //* 年龄 = healthData.年龄
        healthLine[health("工种")], //* 工种 = healthData.工种
        healthLine[health("工龄")], //* 工龄 = healthData.工龄
        healthLine[health("危害因素")], //* 危害因素 = healthData.危害因素
        healthLine[health("职业异常指标")], //* 职业异常指标 = healthData.职业异常指标
        healthLine[health("医学建议")], //* 医学建议 = healthData.医学建议
        healthLine[health("意见")], //* 意见 = healthData.意见
        healthLine[health("结论")], //* 结论 = healthData.结论
        infoLine[info("身份证号")], //* 身份证号 = infoData.身份证号
        "", //* 联系方式 = ""
    ];
}

//将 finData 和 infoData 据转换为 Map，用第几列数据做key
function arrayToObj(data, colKey) {
    let resultObj = {};
    for (let i = 0; i < data.length; i++) {
        resultObj[data[i][colKey]] = data[i];
    }
    return resultObj;
}

export { compareData };
