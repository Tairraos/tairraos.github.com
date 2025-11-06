/**
 * 文件：setup.js
 * 作用：项目通用配置，包括 Excel 主题与字段类型中文映射
 * 说明：保持原结构，补充注释说明
 */
const setup = {
    themes: {
        dark: { bg: "333333", fg: "FFFFFF", border: "CCCCCC" }, // 黑底白字，用于表名行
        deep: { bg: "F0F0F0", fg: "000000", border: "333333" }, // 深色背景行
        light: { bg: "FFFFFF", fg: "000000", border: "333333" } // 浅色背景行
    },
    // 字段基础类型（英文）到中文类型的映射，用于在导出“中文类型”Excel时显示
    fieldType: {
        bit: "比特布尔",
        int: "数值",
        smallint: "数值",
        bigint: "数值",
        tinyint: "数值",
        varchar: "字符",
        char: "字符",
        text: "字符",
        date: "日期",
        datetime: "时间日期",
        time: "时间",
        timestamp: "时间戳",
        json: "JSON",
        decimal: "小数数值"
    }
};

export { setup };
