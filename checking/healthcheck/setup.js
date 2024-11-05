/**
 * health = 体检报告
 * info = 人员信息
 * com = compare
 * Cols = Columns
 */

let setup = {
    healthData: [], //体检报告
    infoData: [], //人员信息

    comMatched: [], //对比结果: 已匹配

    healthCols: ["姓名", "性别", "年龄", "工种", "工龄", "危害因素", "职业异常指标", "医学建议", "意见", "结论"], //从体检报告提取字段
    healthPreview: ["姓名", "性别", "年龄", "工种", "工龄", "危害因素"],

    infoCols: ["姓名", "身份证号"], //从从人员信息提取字段
    infoPreview: ["姓名", "身份证号"], //屏幕上回显的列

    /**
     * 姓名 = healthData.姓名
     * 性别 = healthData.性别
     * 年龄 = healthData.年龄
     * 工种 = healthData.工种
     * 工龄 = healthData.工龄
     * 危害因素 = healthData.危害因素
     * 职业异常指标 = healthData.职业异常指标
     * 医学建议 = healthData.医学建议
     * 意见 = healthData.意见
     * 结论 = healthData.结论
     * 身份证号 = infoData.身份证号
     * 联系方式 = ""
     */
    comCols: ["姓名", "性别", "年龄", "工种", "工龄", "危害因素", "职业异常指标", "医学建议", "意见", "结论", "身份证号", "联系方式"], //对比结果表头
    comWidths: [80, 60, 60, 80, 80, 120, 400, 400, 200, 100, 120, 60],
    comPreview: ["姓名", "性别", "年龄", "工种", "工龄", "危害因素", "身份证号"],

    colorSets: {
        0: "D9D9D9", //偶数行
        1: "FFFFFF" //奇数行
    }
};

window.setup = setup;
export { setup };
