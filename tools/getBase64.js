function getBase64(url) {
    //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
    let Img = new Image(),
        dataURL = "";
    Img.src = url;
    Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
        let canvas = document.createElement("canvas"), //创建canvas元素
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        dataURL = canvas.toDataURL("image/png"); //转换图片为dataURL
        window.prompt(dataURL);
    };
}
