

function analyseContent(data, checkedType) {
    let workbook = XLSX.read(data, { type: "binary" });
    if (checkedType === "finance") {
        log(`财务文件读取成功，开始提取非空行数据...`);
        //财务账仅加载第一个sheet
        loadData(workbook, [Object.keys(workbook.Sheets)[0]], financeColumns, financeData);
        genPreview("finance", financeColumns, financeData);
    } else if (checkedType === "ledger") {
        log(`台账文件读取成功，开始提取 结清情况 为 未结清的数据...`);
        //文员台账加载所有"台账"结尾的sheet
        let sheets = Object.keys(workbook.Sheets).filter((sheetName) => sheetName.match(/台账/));
        if (sheets.length) {
            loadData(workbook, sheets, ledgerColumns, ledgerData, ledgerValid);
            genPreview("ledger", ledgerColumns, ledgerData);
        } else {
            log(`台账文件不包含有效sheet`);
        }
    }
    genAction(financeData, ledgerData);
}

//转数字算法
function toNum(value) {
    return typeof value === "string" ? +value.replace(/,/g, "") : +value;
}

//转 YYYY/M/D 日期算法
function toDate(value) {
    if (typeof value === "number") {
        let targetDate = new Date(new Date(1899, 11, 31).getTime() + value * 24 * 60 * 60 * 1000);
        return `${targetDate.getFullYear()}/${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
    } else {
        //不是数字日期的话，就是财务给的日期格式,前8位是年月日
        return value.replace(/^(\d\d\d\d)-?(\d\d)-?(\d\d).*$/, (match, year, month, day) => `${+year}/${+month}/${+day}`);
    }
}

//提取数据：workbook=excel对象, sheets=sheet列表, columns=关注的列, target=数据容器, ignore=忽略条件，valid=数据有效条件
function loadData(workbook, sheets, columns, target, valid) {
    let counter = 0; //计数器
    sheets.forEach((sheetName) => {
        let sheet = workbook.Sheets[sheetName],
            range = XLSX.utils.decode_range(sheet["!ref"]), //rang.s=excel sheet左上角坐标，range.e=excel sheet右下角坐标
            gn = (c, r) => XLSX.utils.encode_col(c) + (r + 1), //坐标转换成单元格名字, 传入(1,1)，返回"A1"
            gv = (name) => (sheet[name] ? sheet[name].v : ""), //提取单元格数据, 传入A1，返回值，如果值是null，返回空字符串
            g = (c, r) => gv(gn(c, r)); //读取单元格工具，传入坐标

        //解析首行标题
        let titles = {}; //读入首行标题，title 里存放每个标题对应的列坐标
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            titles[g(colIndex, range.s.r)] = colIndex; //range.s.r 是首行的行坐标
        }
        //解析内容，符合条件的数据会被存入 target
        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
            //满足数据有效条件 并且 第一列不为空 （第一列是公司名字）
            if ((!valid || g(titles[valid.column], rowIndex) === valid.value) && g(titles[columns[0]], rowIndex) !== "") {
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
    log(`解析成功，提取到${counter}条有效数据`);
}