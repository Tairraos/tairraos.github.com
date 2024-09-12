//财务账数据(文件名含"多谱到账"四字)、台账数据（文件名含"台账"二字, sheets以"台账"二字结尾）
let financeData = [],
    ledgerData = [];
//财务账加载字段
let financeColumns = ["对方户名", "到款金额", "交易时间", "形式"];
let financeIgnore = { column: "对方户名", value: "" }; //数据忽略条件：对方户名 为 空
//台账加载字段
let ledgerColumns = ["委托方", "项目类型", "项目编号", "业务员", "归属地", "合同额", "合作费", "其他费用", "评审费", "应收款", "到款日期", "到款金额"];
let ledgerIgnore = { column: "委托方", value: "" }; //数据忽略条件：委托方 为 空
let ledgerValid = { column: "结清情况", value: "未结清" }; //数据有效条件，结清情况 为 未结清

//数据清洗条件
let currencyList = ["合同额", "合作费", "其他费用", "评审费", "应收款", "到款金额"]; //会转成数值型
let dateList = ["到款日期", "交易时间"]; //会转成 YYYY/M/D 的格式

function analyseContent(data, checkedType) {
    log(`读取成功，开始处理...`);
    let workbook = XLSX.read(data, { type: "binary" });
    // range = XLSX.utils.decode_range(worksheet["!ref"]),
    // w = worksheet;
    if (checkedType === "finance") {
        log(`财务数据已加载，开始解析...`);
        //财务账仅加载第一个sheet
        loadData(workbook, [Object.keys(workbook.Sheets)[0]], financeColumns, financeData, financeIgnore);
        genPreview("financePreview", financeColumns, financeData);
    } else if (checkedType === "ledger") {
        log(`台账数据已加载，开始解析...`);
        //文员台账加载所有"台账"结尾的sheet
        let sheets = Object.keys(workbook.Sheets).filter((sheetName) => sheetName.match(/台账/));
        if (sheets.length) {
            loadData(workbook, sheets, ledgerColumns, ledgerData, ledgerIgnore, ledgerValid);
            genPreview("ledgerPreview", ledgerColumns, ledgerData);
        } else {
            log(`台账文件不包含有效sheet`);
        }
    }
    genAction(financeData, ledgerData);
}

//转日期，空格后的
function toDate(value) {
    if (typeof value === "number") {
        let targetDate = new Date(new Date(1899, 11, 31).getTime() + value * 24 * 60 * 60 * 1000);
        return `${targetDate.getFullYear()}/${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
    } else {
        //不是数字日期的话，就是财务给的日期格式,前8位是年月日
        return value.replace(/^(\d\d\d\d)-?(\d\d)-?(\d\d).*$/, (match, year, month, day) => `${+year}/${+month}/${+day}`);
    }
}

//转数字
function toNum(value) {
    return typeof value === "string" ? +value.replace(/,/g, "") : +value;
}

//workbook=从哪个excel里读, sheets=哪些sheet, columns=读哪些列, target=存到哪里, ignore=忽略条件，valid=数据有效条件
function loadData(workbook, sheets, columns, target, ignore, valid) {
    let counter = 0;
    sheets.forEach((sheetName) => {
        let sheet = workbook.Sheets[sheetName];
        let range = XLSX.utils.decode_range(sheet["!ref"]); //rang.s=excel sheet左上角坐标，range.e=excel sheet右下角坐标
        let gn = (c, r) => XLSX.utils.encode_col(c) + (r + 1); //get name, 传入(1,1)，返回"A1"
        let gv = (name) => (sheet[name] ? sheet[name].v : ""); //get value, 传入cell name，A1，返回值，如果值是null，返回空字符串
        let g = (c, r) => gv(gn(c, r));
        //读入首行标题
        let titles = {}; //title里存着每个标题对应的colid
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            titles[g(colIndex, range.s.r)] = colIndex; //range.s.r是首行的rowid
        }
        //读取所有数据
        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
            if ((!valid || g(titles[valid.column], rowIndex) === valid.value) && g(titles[ignore.column], rowIndex) !== ignore.value) {
                //(没有数据有效条件，或满足数据有效条件) 并且 不满足忽略条件
                target.push(
                    columns.map((colName) => {
                        let value = g(titles[colName], rowIndex);
                        return currencyList.includes(colName) ? toNum(value) : dateList.includes(colName) ? toDate(value) : value;
                    })
                );
                counter++;
            }
        }
    });
    log(`解析完成，加载到${counter}条数据`);
}

function getDate() {
    let today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getFinanceXlsx() {
    let content = financeData.map((item, index) => [index + 1, ...item]);
    content.unshift([...financeColumns]);
    //["到款金额", "交易时间", "对方户名", "形式"];
    return genXlsx("财务帐待匹配", content, [400, 80, 80, 60]);
}

function getLedgerXlsx() {
    let content = ledgerData.map((item, index) => [index + 1, ...item]);
    content.unshift([...ledgerColumns]);
    //["项目类型", "项目编号", "委托方", "业务员", "归属地", "合同额", "合作费", "其他费用", "评审费", "应收款", "到款日期", "到款金额"];
    return genXlsx("台账未结清", content, [400, 80, 80, 100, 100, 80, 80, 80, 80, 80, 80, 80]);
}

function getComparedXlsx() {
    let content = mergeData();
    content.unshift(["对方户名", ...ledgerColumns.slice(1), ...financeColumns.slice(1)]);
    return genXlsx("台账和财务账对比结果", content, [400, 80, 80, 100, 100, 80, 80, 80, 80, 80, 80, 80, 80, 80, 60]);
}

function mergeData() {
    let financeMap = new Map();
    let ledgerMap = new Map();

    // 处理 financeData 数组，将公司名作为键，值为包含其余数据的数组
    for (let i = 0; i < financeData.length; i++) {
        let company = financeData[i][0];
        let restData = financeData[i].slice(1);
        if (!financeMap.has(company)) {
            financeMap.set(company, [restData]);
        } else {
            financeMap.get(company).push(restData);
        }
    }

    // 处理 ledgerMap 数组，financeMap里没的数据在这里会丢弃
    for (let i = 0; i < ledgerData.length; i++) {
        let company = ledgerData[i][0];
        let restData = ledgerData[i].slice(1);
        if (financeMap.has(company)) {
            // 如果公司名在 financeMap 中，才搜集数据
            if (!ledgerMap.has(company)) {
                ledgerMap.set(company, [restData]);
            } else {
                ledgerMap.get(company).push(restData);
            }
        }
    }

    let merged = [];
    let companies = Array.from(financeMap.keys()); //财务账里所有的公司名
    companies.forEach((company) => {
        if (!ledgerMap.has(company)) {
            //1 取出台账的 company 数据，第一条，merge所有的财务账数据
            //2 如果
            //2 台账的其余数据，对应财务帐 【待检查】
        }        
    })

    // 遍历 financeMap 中的公司
    for (let [company, financeBuff] of financeMap) {
        if (ledgerMap.has(company)) {
            let ledgerBuff = ledgerMap.get(company);
            // 对于 financeMap 和 ledgerMap 中都存在的公司，组合所有可能的行
            for (let i = 0; i < financeBuff.length; i++) {
                for (let j = 0; j < ledgerBuff.length; j++) {
                    merged.push([company].concat(financeBuff[i].concat(ledgerBuff[j])));
                }
            }
        } else {
            // 如果公司只存在于 financeData 中，直接添加 financeData 中的行
            for (let i = 0; i < financeData.length; i++) {
                merged.push([company].concat(financeData[i]));
            }
        }
    }

    // 处理只存在于 ledgerData 中的公司
    for (let [company, ledgerBuff] of ledgerMap) {
        if (!financeMap.has(company)) {
            for (let i = 0; i < ledgerBuff.length; i++) {
                merged.push([company].concat(ledgerBuff[i]));
            }
        }
    }

    return merged;
}

function genXlsx(name, content, listWidth) {
    let workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.aoa_to_sheet(content);
    Object.keys(worksheet).forEach((key) => {
        if (!key.startsWith("!")) {
            worksheet[key].s = {
                font: { name: "Calibri", sz: "12", bold: key.match(/^[A-Z]+1$/) ? true : false },
                alignment: { horizontal: "center", vertical: "top", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "cccccc" } },
                    bottom: { style: "thin", color: { rgb: "cccccc" } },
                    left: { style: "thin", color: { rgb: "cccccc" } },
                    right: { style: "thin", color: { rgb: "cccccc" } }
                },
                fill: { fgColor: { rgb: "FFFFFF" } }
            };
        }
    });
    worksheet["!cols"] = listWidth.map((i) => ({ wpx: i }));
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}
