/**
 * pro = project
 * led = ledger
 * com = compare
 * Cols = Columns
 */

let proData = [], //业务报告
    ledData = []; //台账报告

let comMatched = [], //对比结果: 已匹配
    proMissed = [], //对比结果: 业务报告未匹配
    ledMissed = []; //对比结果: 台账报告未匹配

let proCols = ["项目编号", "项目名称", "报告编制人", "地区", "费用", "检测时间", "报告完成时间", "归档完成时间"], //从业务报告提取字段
    proWidths = [125, 400, 60, 60, 60, 80, 80, 80], //导出账务帐的列宽
    proPreview = proCols;

let ledCols = ["报告编号", "项目名称", "金额", "评审费", "交接人", "业务员", "交接日期", "类型", "报告份数", "发票", "去向", "给企业日期", "备注"], //从从台账报告提取字段
    ledWidths = [125, 400, 60, 60, 60, 80, 80, 60, 60, 120, 60, 80, 200], //导出台账报告的列宽
    ledPreview = ["报告编号", "项目名称", "金额", "评审费", "交接人", "业务员", "备注"]; //屏幕上回显的列

/**
 * 项目编号 = proData.项目编号
 * 项目名称= proData.项目名称
 * 金额 = ledData.金额
 * 评审费 = ledData.评审费
 */
let comCols = ["项目编号", "项目名称", "金额", "评审费"], //对比结果表头
    comWidths = [125, 400, 80, 80],
    comPreview = ["项目编号", "项目名称", "金额", "评审费"];

let colorSets = {
    0: { default: "D9D9D9" }, //偶数行
    1: { default: "FFFFFF" } //奇数行
};
