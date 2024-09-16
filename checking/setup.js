let financeData = [], //财务账数据(文件名含"多谱到账"四字)
    ledgerData = [], //台账数据（文件名含"台账"二字, sheets以"台账"二字结尾）
    compared = [], //对比结果
    compareResult = {}; //对比结果

let financeColumns = ["对方户名", "到款金额", "交易时间", "形式"], //从财务账提取字段
    financeMissed = ["", "", ""]; //台帐没有对应财务账

let ledgerColumns = ["委托方", "业务员", "项目类型", "项目编号", "归属地", "合同额", "合作费", "其他费用", "评审费", "应收款", "到款日期", "到款金额"], //从台账提取字段
    ledgerValid = { column: "结清情况", value: "未结清" }, //仅保留 “结清情况 为 未结清” 的数据
    ledgerMissed = ["", "", "", "", "", "", "", "", "", "", "缺台账"]; //财务帐没有对应台账

let currencyList = ["合同额", "合作费", "其他费用", "评审费", "应收款", "到款金额"], //提取后，转成数值型的字段
    dateList = ["到款日期", "交易时间"]; //提取后，会转成 YYYY/M/D 形式的字段

let comparedColumns = ["对方户名", ...ledgerColumns.slice(1), ...financeColumns.slice(1)]; //对比结果表头

let colorSets = {
    0: { base: "D9D9D9", match: "CCD9CB", conflict: "D9B9B9" }, //偶数行
    1: { base: "FFFFFF", match: "F0FFEF", conflict: "FFDADA" } //奇数行
};
