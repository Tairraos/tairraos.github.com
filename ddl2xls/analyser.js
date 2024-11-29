import { setup } from "./setup.js";

function analyseContent(data) {
    let lines = data.split("\n"),
        isInTable = false,
        result = [],
        block = {};
    for (let line of lines) {
        line = line.trim();
        //还没整理完一个表，又遇到create table
        if (line.startsWith("CREATE TABLE") && isInTable) {
            console.log(`CREATE TABLE 语句嵌套了：${line}`);
            continue;
        }
        //未被create table圈起来的语句都忽略
        if (!line.startsWith("CREATE TABLE") && !isInTable) continue;

        //开始建表
        if (line.startsWith("CREATE TABLE")) {
            isInTable = true;
            block = { name: safeGet(line.match(/`(\w+)`/), 1), comment: "", fields: [] };
        }
        //结束建表
        if (line.startsWith(")")) {
            isInTable = false;
            block.comment = safeGet(line.match(/COMMENT\s*=\s*'([^']+)'/), 1);
            result.push(block);
        }
        if (line.startsWith("`")) {
            let name = safeGet(line.match(/`(\w+)`\s*([a-zA-Z]+)/), 1),
                type = safeGet(line.match(/`(\w+)`\s*([a-zA-Z]+)/), 2).toLowerCase(),
                typefull = safeGet(line.match(/`(\w+)`\s*([a-zA-Z\(\)\d]+)/), 2).toLowerCase(),
                typechs = safeGet(setup.fieldType, type),
                comment = safeGet(line.match(/COMMENT\s*'([^']+)'/), 1);
            block.fields.push([name, typechs, typefull, comment]);
        }
    }
    return result;
}
function safeGet(reg, index) {
    return reg && reg[index] ? reg[index] : "";
}
export { analyseContent };
