// ==UserScript==
// @name         Amazon 搜索页抓取机
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Collect amazon search page data
// @author       Xiaole Iota
// @match        https://www.amazon.com/s*
// @icon         https://tairraos.github.io/lemade.ico
// @downloadURL  https://tairraos.github.io/amazon.down.user.js
// @grant        none
// ==/UserScript==

// ***********************************************
// tamper monkey 插件，从 amazon 搜索结果页抓取产品信息
// ***********************************************
(function () {
    var data = {};

    function getButton(text, fnClick) {
        let btn = document.createElement("button");
        btn.innerText = text;
        btn.className = "hacked-btn";
        btn.setAttribute("style", "height: 30px; padding: 0 10px; border-radius: 8px; margin: 4px 10px; background: #fc0;");
        btn.addEventListener("click", fnClick);
        return btn;
    }

    function getLog() {
        let span = document.createElement("span");
        span.innerText = "已抓取 0 条数据";
        span.className = "hacked-log";
        span.setAttribute("style", "    color: #fff; margin: 4px 0; height: 30px; line-height: 30px;");
        return span;
    }

    function setupCollectEnv() {
        document.querySelector("#nav-xshop").append(getButton(`抓取数据`, collect));
        document.querySelector("#nav-xshop").append(getLog());
    }

    function getDate() {
        let today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    }
    function collect() {
        let domProdList = document.querySelectorAll("div[data-asin][data-uuid]");

        domProdList.forEach((domProd) => {
            let asin = domProd.getAttribute("data-asin");
            if (!domProd.querySelector("a").href.match(/\/sspa\/click/)) {
                data[asin] = {
                    page_url: domProd.querySelector("a").href,
                    image1: domProd.querySelector("img").src,
                    stars_avg: document.querySelector(".a-icon-alt").innerText.replace(/ .*/, ""),
                    review_count: domProd.querySelector("a.s-underline-text span.s-underline-text").innerText.replace(/,/, ""),
                    price_offer: domProd.querySelector(".a-price .a-offscreen").innerText.replace(/[^\d\.]/g, ""),
                    asin: domProd.querySelector("h2").textContent.trim(),
                    product_name: domProd.querySelector("h2").textContent.trim(),
                    product_id: domProd.getAttribute("data-uuid")
                };
            }
        });
        document.querySelector(".hacked-log").innerText = `已抓取 ${Object.keys(data).length} 条数据`;
        document.querySelector(".hacked-log").prepend(getDownloadLink("下载数据", `amazon-data[${getDate()}].json`, JSON.stringify(data)));
    }

    function getDownloadLink(text, filename, content) {
        let ele = document.createElement("a");
        ele.setAttribute(
            "style",
            "height: 28px;vertical-align: middle;padding: 0 10px;color: black;border-radius: 8px;margin-right: 10px;display: inline-block;background: #fc0;"
        );
        ele.className = "hacked-link";
        ele.innerHTML = text;
        ele.download = filename;
        ele.href = URL.createObjectURL(new Blob([content]));
        return ele;
    }

    setupCollectEnv();
})();
