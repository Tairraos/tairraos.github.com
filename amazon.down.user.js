// ==UserScript==
// @name         Amazon 搜索页抓取机
// @namespace    http://tampermonkey.net/
// @version      1.7
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
    let panel = document.createElement("div");
    let data = {};
    let fixnum = (num) => (num ? String(num).replace(/[^\d\.\+\-]/g, "") : "");
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

    function getDate() {
        return new Date().toISOString().replace(/T/, " ").replace(/\..*/, "");
    }

    function collect() {
        let domProdList = document.querySelectorAll(
            "div[data-asin][data-uuid]"
        );

        domProdList.forEach((domProd) => {
            let asin = domProd.getAttribute("data-asin"),
                product_id = domProd.getAttribute("data-uuid"),
                jungle = document.querySelectorAll(
                    `#embedCard-${asin}-regular-${product_id}>div>div`
                );
            if (!domProd.querySelector("a").href.match(/\/sspa\/click/)) {
                data[asin] = {
                    //From Amazon
                    page_url: domProd.querySelector("a").href,
                    image1: domProd.querySelector("img").src,
                    stars_avg: document
                        .querySelector(".a-icon-alt")
                        .innerText.replace(/ .*/, ""),
                    review_count: domProd
                        .querySelector(
                            "a.s-underline-text span.s-underline-text"
                        )
                        .innerText.replace(/,/, ""),
                    price_offer: fixnum(
                        domProd.querySelector(".a-price .a-offscreen").innerText
                    ),
                    asin: asin,
                    product_name: domProd
                        .querySelector("h2")
                        .textContent.trim(),
                    product_id: domProd.getAttribute("data-uuid"),
                    //From Jungle
                    category_first:
                        jungle[4].textContent.split(" in ")[1] || "",
                    category_last: jungle[5].textContent.split(" in ")[1] || "",
                    sales_month: fixnum(
                        jungle[3].querySelector("[class^=DataWrapper]")
                            .textContent
                    ),
                    sales_day: fixnum(
                        jungle[7].querySelector("[class^=DataWrapper]")
                            .textContent
                    ),
                    bsr_first: fixnum(jungle[4].textContent.split(" in ")[0]),
                    bsr_last: fixnum(jungle[5].textContent.split(" in ")[0]),
                    brand: jungle[6].querySelector("[class^=DataWrapper]")
                        .textContent,
                    page_release: jungle[9].querySelector(
                        "[class^=DataWrapper]"
                    ).textContent,
                };
            }
        });
        document.querySelector(".hacked-log").innerText = `已抓取 ${
            Object.keys(data).length
        } 条数据`;
        document
            .querySelector(".hacked-log")
            .prepend(
                getDownloadLink(
                    "下载数据",
                    `amazon-data[${getDate()}].json`,
                    JSON.stringify(data)
                )
            );
    }

    function getDownloadLink(text, filename, content) {
        let ele = document.createElement("a");
        ele.className = "hacked-link";
        ele.innerHTML = text;
        ele.download = filename;
        ele.href = URL.createObjectURL(new Blob([content]));
        return ele;
    }

    panel.id = "hacked-panel";
    document.body.append(panel);

    GM_addStyle(`
    #hacked-panel {
        position: fixed;
        width: 350px;
        height: 50px;
        top: 0;
        left: calc(50% - 90px);
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
        margin: 0px 10px 0 15px;
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
        margin-right: 10px;
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

    setupCollectEnv();
})();
