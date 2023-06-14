// ==UserScript==
// @name         Amazon 搜索页抓取机
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Collect amazon search page data
// @author       Xiaole Iota
// @match        https://www.amazon.com/s*
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
        data = {};

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
        let domProdList = document.querySelectorAll("div[data-asin][data-uuid]");

        domProdList.forEach((domProd) => {
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
                    product_id: domProd.getAttribute("data-uuid")
                };

                let jungle = document.querySelector(`#embedCard-${asin}-regular-${product_id}`),
                    jungleData = jungle
                        ? domInner(jungle)
                              .replace(/:\n/g, ":")
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
        document.querySelector(".hacked-log").prepend(getDownloadLink("下载数据", `amazon-data[${getDate()}].json`, JSON.stringify(data)));
    }

    function getDownloadLink(text, filename, content) {
        let ele = document.createElement("a");
        ele.className = "hacked-link";
        ele.innerHTML = text;
        ele.download = filename;
        ele.href = URL.createObjectURL(new Blob([content]));
        return ele;
    }

    GM_addStyle(`
    #hacked-panel {
        position: fixed;
        width: 420px;
        height: 50px;
        top: 0;
        left: calc(50% - 70px);
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
    }
    .hacked-btn {
        height: 30px;
        padding: 0 10px;
        border-radius: 8px;
        margin: 0px 10px;
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
