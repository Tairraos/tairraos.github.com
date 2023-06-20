// ==UserScript==
// @name         Amazon 搜索页抓取机
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Collect amazon search page data
// @author       Xiaole Iota
// @match        https://www.amazon.com/s*
// @require      https://tairraos.github.io/xlsx.bundle.js
// @icon         https://tairraos.github.io/lemade.ico
// @downloadURL  https://tairraos.github.io/amazon.down.user.js
// @updateURL    https://tairraos.github.io/amazon.down.user.js
// @grant        GM_addStyle
// ==/UserScript==

// ***********************************************
// tamper monkey 插件，从 amazon 搜索结果页抓取产品信息
// ***********************************************
(function () {
    let panel = document.createElement("div"),
        data = {},
        fieldList = {
            id: "string",
            page_url: "string",
            image1: "string",
            // "image2":"string",
            // "image3":"string",
            // "image4":"string",
            // "image5":"string",
            category_first: "string",
            category_last: "string",
            // "sales_total":"int",
            sales_month: "int",
            // "sales_week":"int",
            sales_day: "int",
            // "page_rank":"int",
            bsr_first: "string",
            bsr_last: "string",
            stars_avg: "float",
            // "star_1":"int",
            // "star_2":"int",
            // "star_3":"int",
            // "star_4":"int",
            // "star_5":"int",
            review_count: "int",
            // "price":"float",
            // "price_buybox":"float",
            price_offer: "float",
            asin: "float",
            // "style":"string",
            // "color":"string",
            // "material":"string",
            // "dimensions":"string",
            // "weight":"string",
            // "commercial_grade":"string",
            // "assembly":"string",
            product_name: "string",
            // "description":"string",
            brand: "string",
            // "model":"string",
            product_id: "string",
            page_release: "string",
            data_stamp: "string"
        };
    let fixnum = (num) => (num ? String(num).replace(/[^\d\.\+\-]/g, "") : ""),
        domInner = (dom) => (dom ? dom.innerText : ""),
        getDate = () => new Date().toISOString().replace(/T/, " ").replace(/\..*/, "");

    function getButton(text, fnClick) {
        let btn = document.createElement("button");
        btn.innerText = text;
        btn.className = "hacked-btn";
        btn.addEventListener("click", fnClick);
        return btn;
    }

    function getLog() {
        let span = document.createElement("span");
        span.innerText = "已抓取 0 条数据";
        span.className = "hacked-log";
        return span;
    }

    function setupCollectEnv() {
        panel.append(getButton(`抓取数据`, collect));
        panel.append(getLog());
    }

    function verify() {
        var noJungle = Object.values(data).filter((item) => !item.brand).length;
        alert(noJungle ? `没有 Jungle 数据的记录： ${noJungle} 条` : `所有记录都有jungle数据。`);
    }
    function jungleSearch(data, pattern, dir) {
        let copy = [...data],
            result = ""; // 防错，未搜到返回空
        while (result === "" && copy.length) {
            let val = dir ? copy.pop() : copy.shift();
            if (val.match(pattern)) {
                result = val.replace(pattern, "$1");
            }
        }
        return result;
    }
    function collect() {
        let domProdList = document.querySelectorAll("div[data-asin][data-uuid]"),
            searched_category = document.querySelector("#searchDropdownBox").selectedOptions[0].innerText,
            searched_keywords = document.querySelector("#twotabsearchtextbox").value,
            current_page = document.querySelector(".s-pagination-selected").innerText;

        domProdList.forEach((domProd, index) => {
            let asin = domProd.getAttribute("data-asin"),
                product_id = domProd.getAttribute("data-uuid").replace(/[^a-fA-F0-9\-]/g, ""); // 防错，有新data-uuid里并不是真的uuid
            if (asin && product_id && domProd.querySelector("a") && !domProd.querySelector("a").href.match(/\/sspa\/click/)) {
                data[asin] = {
                    //From Amazon
                    page_url: domProd.querySelector("a").href,
                    image1: domProd.querySelector("img").src,
                    stars_avg: domInner(document.querySelector(".a-icon-alt")).replace(/ .*/, ""), // 防错，空格后的文字都删除
                    review_count: fixnum(domInner(domProd.querySelector("a.s-underline-text span.s-underline-text"))), // 防错，数字含有逗号
                    price_offer: fixnum(domInner(domProd.querySelector(".a-price .a-offscreen"))), // 防错，数字含有逗号
                    asin: asin,
                    product_name: domProd.querySelector("h2").textContent.trim(),
                    product_id: domProd.getAttribute("data-uuid"),
                    data_stamp: getDate()
                };

                let jungle = document.querySelector(`#embedCard-${asin}-regular-${product_id}`),
                    jungleData = jungle
                        ? domInner(jungle)
                              .replace(/:(\d)\n/g, ":$1")
                              .replace(/#(\d+) in ([^\n]+)/g, "BSR:$1\nCATEGORY:$2")
                              .split("\n")
                        : []; // 防错，有些数据jungle注入失败

                Object.assign(data[asin], {
                    //From Jungle
                    category_first: jungleSearch(jungleData, /CATEGORY:(.*)/),
                    category_last: jungleSearch(jungleData, /CATEGORY:(.*)/, true), // 逆向搜索
                    sales_month: fixnum(jungleSearch(jungleData, /Mo\. Sales:(.*)/)), // 防错，数字含有逗号
                    sales_day: fixnum(jungleSearch(jungleData, /D\. Sales:(.*)/)), // 防错，数字含有逗号
                    bsr_first: jungleSearch(jungleData, /BSR:(.*)/),
                    bsr_last: jungleSearch(jungleData, /BSR:(.*)/, true), // 逆向搜索
                    brand: jungleSearch(jungleData, /Brand:(.*)/),
                    page_release: jungleSearch(jungleData, /Date First Available:(.*)/)
                });
            }
        });
        document.querySelector(".hacked-log").innerText = `已抓取 ${Object.keys(data).length} 条数据`;
        document.querySelector(".hacked-log").prepend(getButton(`数据检查`, verify));
        document.querySelector(".hacked-log").prepend(getDownloadLink("下载JSON", `amazon-data[${getDate()}].json`, JSON.stringify(data)));
        document.querySelector(".hacked-log").prepend(getDownloadLink("下载XLSX", `amazon-data[${getDate()}].xlsx`, getWorkXlsx(data)));
    }

    function getDownloadLink(text, filename, content) {
        let ele = document.createElement("a");
        ele.className = "hacked-link";
        ele.innerHTML = text;
        ele.download = filename;
        ele.href = URL.createObjectURL(new Blob([content]));
        return ele;
    }

    function getWorkXlsx() {
        let content = [Object.keys(fieldList)];
        Object.values(data).forEach((line) => {
            content.push(Object.keys(fieldList).map((item) => (line[item] ? line[item] : "")));
        });
        // ["id","page_url","image1","image2","image3","image4","image5","category_first","category_last","sales_total","sales_month","sales_week","sales_day","page_rank","bsr_first","bsr_last","stars_avg","star_1","star_2","star_3","star_4","star_5","review_count","price","price_buybox","price_offer","asin","style","color","material","dimensions","weight","commercial_grade","assembly","product_name","description","brand","model","product_id","page_release","data_stamp"]
        // [ 30,  150,       80,      30,      30,      30,      30,      100,             100,            60,           60,           60,          60,         60,         60,         60,        60,         40,      40,      40,      40,      40,      60,            60,     60,            60,           80,    40,     40,     40,        40,          40,      40,                40,        150,            150,          80,     40,    120,         80,            110]
        return genXlsx(
            content,
            [
                30, 150, 80, 30, 30, 30, 30, 100, 100, 60, 60, 60, 60, 60, 60, 60, 60, 40, 40, 40, 40, 40, 60, 60, 60, 60, 80, 40, 40, 40, 40, 40, 40, 40, 150,
                150, 80, 40, 120, 80, 110
            ]
        );
    }

    function genXlsx(content, listWidth = []) {
        let workbook = XLSX.utils.book_new(),
            worksheet = XLSX.utils.aoa_to_sheet(content);
        Object.keys(worksheet).forEach((key) => {
            if (!key.startsWith("!")) {
                worksheet[key].s = {
                    font: { name: "Calibri", sz: "11" },
                    alignment: { horizontal: "left", vertical: "middle", wrapText: false }
                };
            }
        });
        worksheet["!cols"] = listWidth.map((i) => ({ wpx: i }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "Amazon raw");
        return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    }

    GM_addStyle(`
    #hacked-panel {
        position: fixed;
        width: 540px;
        height: 50px;
        top: 0;
        left: calc(50% - 150px);
        background: #010415e8;
        border: 2px solid #8f8f8f;
        border-top: 0;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        z-index: 10000;
        line-height: 40px;
        vertical-align: middle;
        display: flex;
        align-items: center;
        padding: 0 15px;
    }
    .hacked-btn {
        height: 30px;
        padding: 0 10px;
        border-radius: 8px;
        margin-right: 10px;
        background: #fc0;
        border: 1px solid #212746;
    }
    .hacked-log {
        color: #fff;
        display: inline-block;
    }
    .hacked-link {
        height: 30px;
        vertical-align: middle;
        padding: 0 10px;
        color: black !important;
        border-radius: 8px;
        display: inline-block;
        background: #fc0;
        border: 1px solid #212746;
        line-height: 30px;
        margin-right: 10px;
    }
    .hacked-btn:hover,
    .hacked-link:hover {
        text-decoration: none;
        color: #741919 !important;
    }
    `);
    panel.id = "hacked-panel";
    document.body.append(panel);
    setupCollectEnv();
})();
