import { setup } from "./setup.js";

/**
 * 文件：analyser.js
 * 功能：解析 MySQL DDL 文本，按表/字段生成结构化数据
 * 核心：支持字段定义既可带反引号 `name`，也可不带反引号 name
 * 适用：配合 exporter.js 将解析结果导出为 XLS
 */

/**
 * 解析整段 DDL 文本，返回按表分组的结构
 * @param {string} data - DDL 原始文本内容
 * @returns {{name: string, comment: string, fields: [string, string, string, string][]}[]} - 每个表一个 block，fields 为 [name, type_chs, type_full, comment]
 */
function analyzeContent(data) {
    // 将输入按行拆分，逐行解析
    let lines = data.split(/\r?\n/),
        isInTable = false,
        result = [],
        block = {};

    for (let rawLine of lines) {
        // 逐行处理，消除两侧空白
        let line = rawLine.trim();
        if (!line) continue; // 空行跳过

        // 统一大小写判断，增强健壮性
        const upper = line.toUpperCase();

        // 还没整理完一个表，又遇到 CREATE TABLE，进行提示并跳过
        if (upper.startsWith("CREATE TABLE") && isInTable) {
            console.log(`CREATE TABLE 语句嵌套了：${line}`);
            continue;
        }

        // 未处于建表上下文且当前行不是 CREATE TABLE，忽略
        if (!upper.startsWith("CREATE TABLE") && !isInTable) continue;

        // 开始建表：匹配表名（优先匹配反引号包裹的，其次匹配普通标识符），初始化 block
        if (upper.startsWith("CREATE TABLE")) {
            isInTable = true;
            const tableName =
                // 反引号表名
                safeGet(line.match(/`([^`]+)`/), 1) ||
                // 非反引号表名（允许 schema 前缀）
                safeGet(line.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?[A-Za-z0-9_]+`?\.)?`?([A-Za-z0-9_]+)`?/i), 1);
            block = { name: tableName, comment: "", fields: [] };
            continue;
        }

        // 结束建表：遇到右括号开头的行，提取表注释（如果存在），push 到结果
        if (line.startsWith(")")) {
            isInTable = false;
            // 表级注释可能写在闭括号行后面，如：) ENGINE=... COMMENT='表注释'
            block.comment = safeGet(line.match(/COMMENT\s*=\s*'([^']+)'/i), 1);
            result.push(block);
            block = {};
            continue;
        }

        // 处于表定义体中，尝试解析字段行
        const fieldTuple = parseFieldLine(line);
        if (fieldTuple) {
            block.fields.push(fieldTuple); // [name, type_chs, type_full, comment]
        }
        // 其他（如主键/索引/约束）行忽略
    }
    return result;
}

/**
 * 解析字段定义行，兼容以下两种格式：
 * - `role_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '角色ID（主键）',
 * - role_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID（主键）',
 * 若不是字段行（如 PRIMARY KEY/UNIQUE KEY/INDEX/CONSTRAINT 等），返回 null
 * @param {string} line - 单行 DDL 文本
 * @returns {[string, string, string, string] | null} - [name, type_chs, type_full, comment]
 */
function parseFieldLine(line) {
    // 跳过非字段定义行（主键、索引、约束、外键等）
    const nonColumnStarters = /^(PRIMARY\s+KEY|UNIQUE\s+KEY|KEY\s|INDEX\s|CONSTRAINT\s|FOREIGN\s+KEY|CHECK\s|PARTITION\s)/i;
    if (nonColumnStarters.test(line)) return null;

    // 移除行尾逗号，便于处理
    let work = line.replace(/,\s*$/, "");

    // 名称匹配：优先反引号，其次普通标识符
    let name = safeGet(work.match(/^`([^`]+)`\s+/), 1);
    let consumedLength = 0;
    if (name) {
        // 计算已消费长度：`name` + 之后的至少一个空格
        const m = work.match(/^`([^`]+)`\s+/);
        consumedLength = m ? m[0].length : 0;
    } else {
        // 普通标识符（字母或下划线开头，后续为字母数字下划线）
        name = safeGet(work.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+/), 1);
        const m = work.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+/);
        consumedLength = m ? m[0].length : 0;
    }
    if (!name) return null; // 未匹配到字段名，判定为非字段行

    // 剩余部分用于提取类型/修饰符
    const rest = work.slice(consumedLength).trim();

    // 在 rest 中找到第一个约束/修饰关键字的位置，用于截断 type_full
    const boundaryIdx = rest.search(/\b(?:NOT\s+NULL|NULL|DEFAULT|COMMENT|AUTO_INCREMENT|PRIMARY|UNIQUE|KEY|REFERENCES|CHECK|ON\s+UPDATE|COLLATE|CHARACTER\s+SET)\b/i);
    const type_full_raw = boundaryIdx >= 0 ? rest.slice(0, boundaryIdx).trim() : rest.trim();

    // 规范化大小写（保持与旧实现一致）
    const type_full = type_full_raw.toLowerCase();

    // 基础类型（第一个单词）用于中文类型映射
    const typeBaseMatch = type_full.match(/^[a-zA-Z]+/);
    const type_base = typeBaseMatch ? typeBaseMatch[0].toLowerCase() : "";
    const type_chs = setup.fieldType[type_base] || "";

    // 字段注释（优先匹配单引号）
    const comment = safeGet(line.match(/COMMENT\s*'([^']*)'/i), 1);

    return [name, type_chs, type_full, comment];
}

/**
 * 安全取值的工具方法
 * @param {RegExpMatchArray|null} reg - 正则匹配结果
 * @param {number} index - 目标分组索引
 * @returns {string} - 若存在返回对应分组，否则返回空字符串
 */
function safeGet(reg, index) {
    return reg && reg[index] ? reg[index] : "";
}

export { analyzeContent };
