function analyseContent(data, checkedType) {
    let workbook = XLSX.read(data, { type: "binary" });
    if (checkedType === "pro") {
        log(`业务报告读取成功，开始提取非空行数据...`);
        //业务报告仅加载第一个sheet
        proData = loadData(workbook, [Object.keys(workbook.Sheets)[0]], proCols);
        genPreview("pro", proCols, proPreview, proData);
    } else if (checkedType === "led") {
        log(`台账报告读取成功，开始提取非空行数据...`);
        //文员台账报告加载所有"台账报告"结尾的sheet
        let sheets = Object.keys(workbook.Sheets).filter((sheetName) => sheetName.match(/台账报告/));
        ledData = loadData(workbook, [Object.keys(workbook.Sheets)[0]], ledCols);
        genPreview("led", ledCols, ledPreview, ledData);
    }
    genAction();
}

//提取数据：workbook=excel对象, sheets=sheet列表, cols=关注的列, {col=列名, checker=过滤器}
function loadData(workbook, sheets, cols, { col, checker } = {}) {
    let target = [];
    let counter = 0; //计数器
    sheets.forEach((sheetName) => {
        let sheet = workbook.Sheets[sheetName],
            range = XLSX.utils.decode_range(sheet["!ref"]), //rang.s=excel sheet左上角坐标，range.e=excel sheet右下角坐标
            gn = (c, r) => XLSX.utils.encode_col(c) + (r + 1), //坐标转换成单元格名字, 传入(1,1)，返回"A1"
            gv = (name) => (sheet[name] ? sheet[name].v : ""), //提取单元格数据, 传入A1，返回值，如果值是null，返回空字符串
            g = (c, r) => (c !== "undefined" ? gv(gn(c, r)) : ""); //读取单元格工具，传入坐标, 列不存在则返回空

        //解析首行标题
        let titles = {}; //读入首行标题，title 里存放每个标题对应的列坐标
        let startLine = 0;
        //在前4行找title
        for (let rowIndex = range.s.r; rowIndex <= 3; rowIndex++) {
            if ([proCols[0], ledCols[0]].includes(g(range.s.c, rowIndex))) {
                for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
                    titles[g(colIndex, rowIndex)] = colIndex; //rowIndex 是首当前行的行坐标
                }
                startLine = rowIndex + 1;
            }
        }
        if (startLine === 0) {
            log(`解析失败，未长到标题行`);
        }
        //解析内容，符合条件的数据会被存入 target
        for (let rowIndex = range.s.r + startLine; rowIndex <= range.e.r; rowIndex++) {
            //满足数据有效条件 并且 第一列不为空 （第一列是公司名字）
            if (!checker || checker(g(titles[col], rowIndex))) {
                let line = cols.map((colName) => g(titles[colName], rowIndex));
                if (!line.join("0").match(/^0+$/)) {
                    target.push(line); //不是全空白的行，才被添入target
                }
                counter++;
            }
        }
    });
    log(`解析成功，提取到${counter}条有效数据`);
    return target;
}
