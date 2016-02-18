|Q: # 前端工程师面试问卷
|:-
|A: 
贡献者：Xiaole Tao (xiaole.tao@gmail.com)

最后更新：2016.1.20

---
<span id="category"></span>
### 目录

[Web规范](#standard)

[HTML和CSS](#seg2)

[JavaScript](#seg3)

[开发](#seg4)

[常见坑](#seg5)

[相关技能](#seg6)

[全栈工程师](#seg7)

[附：使用方法](#appendix)

---

## Web规范

|Q: 说说DOCTYPE的作用
|:-
|A: DOCTYPE标签用于为SGML(标准通用标记语言,Standard Generalized Markup language)声明文档类型。它的目的是告诉文档解析器应该使用什么样的DTD来解析文档。HTML4和XML都需要通过DOCTYPE声明DTD。HTML5不基于SGML，使用DOCTYPE仅仅为了规范浏览器行为，并不需要指定具体的DTD。

|Q: 说说 DTD 的作用
|:-
|A: DTD(文档类型定义，Document Type Definition)，用于描述一套语法规则。解析器根据声明中指定的DTD来验证HTML文档内容格式是否符合指定的规则。

[回目录](#category)<span id="standard"></span>

## HTML5

|Q: 请列举几个HTML5里为语义化新增加的标签。
|:-
|A: article, aside, figure, figcaption; audio, video, canvas, source; header, footer, section, hgroup, datalist, summary, nav; keygen, mark, meter; command, output, time, progress... 仅列举语义明显的，未及全部。


|Q: 请列举几个被 HTML5 废弃了的 HTML 标签 和 属性
|:-
|A: 


|Q: Audio
|:-
|A:

|Q: Video
|:-
|A:

|Q: Canvas
|:-
|A:

|Q: WebGL
|:-
|A:

|Q: file api
|:-
|A:

|Q: device api
|:-
|A:

|Q: Web worker
|:-
|A:

|Q: Websocket
|:-
|A:

|Q: WebStorage
|:-
|A:

|Q: indexedDb
|:-
|A:

|Q: viewport
|:-
|A:

|Q: touch事件
|:-
|A:

|Q: drag drop
|:-
|A:

|Q: 严格模式
|:-
|A:

|Q: 布局
|:-
|A:

## 浏览器

|Q: 内核差异
|:-
|A:

|Q: 兼容处理
|:-
|A:

|Q: 移动端
|:-
|A:

|Q: 响应式
|:-
|A:

|Q: 跨域访问
|:-
|A:

|Q: JSONP
|:-
|A:

|Q: 协议限制(http不能嵌套https内容)
|:-
|A:

|Q: reflow
|:-
|A: 

## HTTP

|Q: MIME是用来做什么的？
|:-
|A: MIME(多用途互联网邮件扩展类型，Multipurpose Internet Mail Extensions)用于描述文件扩展名和对应类型的关系。WEB访问的时候，服务器根据被请求文件扩展名，在response header里返回对应的类型。浏览器会根据服务器返回的文件类型使用指定应用程序来打开。多用于指定媒体文件的打开方式。

|Q: HTTP AUTH
|:-
|A:

|Q: HTTP安全
|:-
|A:

|Q: HTTP响应状态值为200表示什么意思?
|:-
|A: 服务器请求握手成功。

|Q: HTTP响应状态值为304表示什么意思?
|:-
|A: 服务器不返回内容，浏览器将从本地缓存里获取文件内容。

|Q: HTTP响应状态值为403表示什么意思?
|:-
|A: 服务器拒绝请求。被请求的文件在服务器上不具有可读属性会返回403，需要有HTTP AUTH的网页认证失败也会返回403。

|Q: HTTP响应状态值为404表示什么意思?
|:-
|A: 服务器找不到请求文件。

|Q: HTTP响应状态值为500表示什么意思?
|:-
|A: 服务器内部错误，无法完成请求。通常是服务器解析动态内容时遇到运行时错误。

|Q: HTTP响应状态值为501表示什么意思?
|:-
|A: 服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码。

|Q: HTTP响应状态值为502和504表示什么意思?
|:-
|A: 服务器作为网关或代理，无法访问上游服务器。上游服务器握手失败返回502，上游服务器超时错返回504。

|Q: HTTP响应状态值为503表示什么意思?
|:-
|A: 暂停服务。在服务器启停过程中服务器会自动返回503。通常网站程序在设置成维护状态的时候也会返回503。

<span id="seg2"></span>

## css

|Q:选择器优先级
|:-
|A:

|Q: 增强的伪类
|:-
|A:

|Q: 盒模型
|:-
|A:

|Q: 弹性布局
|:-
|A:

|Q: css media
|:-
|A:

|Q: Css reset
|:-
|A:

|Q: Css hack
|:-
|A:

|Q: css sprite
|:-
|A:

|Q: web font
|:-
|A:

|Q: transition
|:-
|A:

|Q: 3d
|:-
|A:

<span id="seg3"></span>
##JavaScript

|Q: 请说一下ECMAScript与JavaScript的关系
|:-
|A: ECMAScript即ECMA-262，JavaScript是ECMA-262的一种实现。HTML4时代的浏览器里，JS是ES 3实现。目前浏览器里的JS大都是基于ES 5进行实现。

|Q: 请列举几个ES5增加的特性
|:-
|A: 严格模式；getter和setter函数；字符串映射为字符数组；关键字也可以做属性名；Array.isArray，Array.prototype.every，Array.prototype.some，Array.prototype.forEach，Array.prototype.map，Array.prototype.filter，String.prorotype.trim，Function.prototype.bind，JSON.parse，JSON.stringify，Date.now，Object.keys... 仅列举常用的，未及全部。

|Q: JS有哪些基本类型
|:-
|A: String, Number, Boolean, Object, Null, Undefined。typeof可以获取

|Q: JS有等效于false的值
|:-
|A: String, Number, Boolean, Object, Null, Undefined。typeof可以获取


|Q: 继承
|:-
|A:

|Q: 请说一下JS的类型数组和ArrayBuffer
|:-
|A: 类型数组是一种每个元素值的类型都固定的数组。有8种类型：Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array。ArrayBuffer是一个指定字节数的数组，通过下标对每个字节进行访问。XHR的时候可以指定responseType为‘arraybuffer’，返回的内容可以直接赋值给类型为ArrayBuffer的对象，再通过该对象创建类型数组，对数据进行处理。类型数组多用于处理WebSocket，WebAudio之类的二进制内容。

|Q: JS的闭包
|:-
|A: 

|Q: 原型链
|:-
|A: 

|Q: JSON
|:-
|A: 

|Q: 正则
|:-
|A: 

|Q: 作用域
|:-
|A: 

|Q: 模块化
|:-
|A: 

|Q: 自定义事件
|:-
|A: 

|Q: 事件机制
|:-
|A: 

|Q: 异步回调
|:-
|A: 

|Q: lazy load
|:-
|A: 

|Q: 模板引擎
|:-
|A: 

|Q: MVC
|:-
|A: 

|Q: 前后端分离
|:-
|A: 

|Q: Nodejs
|:-
|A: 

|Q: Minify
|:-
|A: 

|Q: 常用框架和工具
|:-
|A: 

|Q: 内存泄漏
|:-
|A: 

|Q: 线程
|:-
|A: 

|Q: 安全
|:-
|A: 

|Q: XML解析
|:-
|A: 

<span id="seg4"></span>
##4 开发


|Q: 环境搭建
|:-
|A: 


|Q: 单元测试
|:-
|A: 


|Q: 安全测试
|:-
|A: 


|Q: 性能测试
|:-
|A: 


|Q: 压力测试
|:-
|A: 


|Q: 性能调优
|:-
|A: 


|Q: i18n/l10n
|:-
|A: 

|Q: Minify
|:-
|A: 

|Q: 调试方法（worker
|:-
|A: 

|Q: source map)
|:-
|A: 

|Q: Scrum协作
|:-
|A: 

|Q: 版本管理
|:-
|A: 

|Q: SSH KEY
|:-
|A: 

<span id="seg5"></span>
##5 常见坑

|Q: PNG不能显示 - IE PNG补丁
|:-
|A: 

|Q: 浏览器渲染不一致 - CSS RESRT
|:-
|A: 

|Q: HTTP调用HTTPS
|:-
|A: 

|Q: IFRAME的SRC并非同一域 - SRC写成about:blank
|:-
|A: 

|Q: 然后用ajax get把页面加载进去
|:-
|A: 

|Q: AJAX的URL不是同一个域 - JSONP
|:-
|A: 

<span id="seg6"></span>
##6 相关技能
|Q: 画图切图
|:-
|A: 

|Q: 制表
|:-
|A: 

|Q: 压缩图片
|:-
|A: 

|Q: TypeScript
|:-
|A: 

|Q: CoffeeScript
|:-
|A: 

|Q: less/sass
|:-
|A: 

|Q: 流行的JS工具库
|:-
|A: 

|Q: 和开发框架
|:-
|A: 

|Q: HTTP(s) Request/Response
|:-
|A: 

|Q: Load balance
|:-
|A: 

|Q: 服务器端语言
|:-
|A: 

|Q: J2EE
|:-
|A: 

|Q: PHP
|:-
|A: 

|Q: python
|:-
|A: 

|Q: ruby
|:-
|A: 

|Q: perl
|:-
|A: 

|Q: .net
|:-
|A: 

<span id="seg7"></span>
##7 全栈工程师

|Q: TCP/IP
|:-
|A: 

|Q: Socket
|:-
|A: 

|Q: 主要的RFC
|:-
|A: 

|Q: Video
|:-
|A: 

|Q: Audio
|:-
|A: 

|Q: WEBGL
|:-
|A: 

|Q: 系统架构
|:-
|A: 

|Q: 数据库
|:-
|A: 

|Q: TA
|:-
|A: 

|Q: UED
|:-
|A: 

|Q: 流程图
|:-
|A: 

|Q: UML
|:-
|A: 

|Q: 思维导图
|:-
|A: 

|Q: Native开发
|:-
|A: 

|Q: Mobile开发
|:-
|A: 

|Q: 主流编程语言
|:-
|A: 

|Q: UNIX/Linux
|:-
|A: 

|Q: WIN
|:-
|A: 

|Q: MAC
|:-
|A: 

|Q: Mail system
|:-
|A: 

|Q: FTP
|:-
|A: 

|Q: SSH
|:-
|A: 

|Q: WebServer
|:-
|A: 

|Q: DB
|:-
|A: 

|Q: TOMCAT
|:-
|A: 

|Q: SEO
|:-
|A: 

|Q: 英语
|:-
|A: 

<span id="appendix"></span>
##附：使用方法

面试目标：本面试问卷用于测试职位候选人的前端知识深度及广度。每题根据面试者回答, 评估得分, 范围为0-5分。

* 0 - 不知道 / 认知错误
* 1 - 听说过 / 有所认知
* 2 - 感兴趣 / 认知正确
* 3 - 使用过 / 初步了解
* 4 - 较善长 / 深刻理解
* 5 - 专家级 / 深入研究
