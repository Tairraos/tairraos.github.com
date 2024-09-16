//比对台账和财务账
function compareData() {
    let companyData = {},
        financeMap = dataToMap(financeData), //用第1列做key，用公司名分组
        ledgerMap = dataToMap(ledgerData), //用1,2列做key，用公司+业务员分组
        companyies = Array.from(financeMap.keys());

    log(`财务帐所涉公司为${companyies.length}家`);
    log(`按公司名进行分组，准备比对`);

    companyies.forEach((company) => {
        let projectGroup = [];
        if (ledgerMap.has(company)) {
            let ledgerLines = ledgerMap.get(company);
            projectGroup.push(...financeMap.get(company).map((line) => [company, ...ledgerLines[0], ...line]));
            for (let i = 1; i < ledgerLines.length; i++) {
                projectGroup.push([company, ...ledgerLines[i], ...financeMissed]);
            }
        } else {
            projectGroup.push(...financeMap.get(company).map((line) => [company, ...ledgerMissed, ...line]));
        }
        companyData[company] = projectGroup;
        compared.push(...projectGroup);
    });
    log(`开始比对应收款和到款金额`);
    companyies.forEach((company, index) => {
        let financeSum = companyData[company].reduce((sum, current) => sum + +current[12], 0); //到款金额
        let ledgerSum = companyData[company].reduce((sum, current) => sum + +current[9], 0); //应收款
        compareResult[company] = { index, match: financeSum === ledgerSum ? true : false, financeSum, ledgerSum };
    });

    log(`比对结束，结果有${compared.length}条数据`);

    genPreview("result", comparedColumns, compared);
    return compared;
}

//将 financeData 和 ledgerData 据转换为 Map，用第几列数据做key
function dataToMap(data, colNum = 0) {
    let resultMap = new Map();
    for (let i = 0; i < data.length; i++) {
        let key = data[i][colNum];
        if (resultMap.has(key)) {
            resultMap.get(key).push(data[i].slice(1));
        } else {
            resultMap.set(key, [data[i].slice(1)]);
        }
    }
    return resultMap;
}
