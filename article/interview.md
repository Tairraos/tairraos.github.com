#前端工程师面试问题解达
来源: (https://github.com/darcyclarke/Front-end-Developer-Interview-Questions)

## 一般问题

* 你使用哪些版本管理系统？
```
CVS,SVN,GIT
```

* 你常用的开发环境是怎样的？比如操作系统，文本编辑器，浏览器，及其他工具等。
```
WIN7,
Eclipse/Aptana/Titanium,Editplus,Notepas++,Sblime Text
Chrome，Firefox
fiddler4,Firefox,
```

* 你能描述一下你制作一个网页的工作流程吗？
```
画图，用HTML堆结构*，hardcode内容，切图做sprite，写css*，写js*/整理hardcode内容, 调试*，deliver。
带*的是在过程中多次修改的
```

* 你能描述一下渐进增强和优雅降级之间的不同吗?
	* 如果提到了特性检测，可以加分。

* 请解释一下什么是语义化的HTML。

* 你更喜欢在哪个浏览器下进行开发？你使用那些开发人员工具？

* 你如何对网站的文件和资源进行优化？
	* 期待的解决方案包括：
		* 文件合并
		* 文件最小化/文件压缩
		* 使用CDN托管
		* 缓存的使用
		* 其他

* 为什么利用多个域名来存储网站资源会更有效？
	* 浏览器一次可以从一个域名下做多少资源？

* 请说出三种减低页面加载时间的方法。（加载时间指感知的时间或者实际加载时间）

* 如果你接到了一个使用Tab来缩进代码的项目，但是你喜欢空格，你会怎么做？
	* 建议这个项目使用像EditorConfig(http://editorconfig.org)之类的规范
	* 为了保持一致性，转换成项目原有的风格
	* 直接使用VIM的retab命令

* 请写一个简单的幻灯效果页面
	* 如果不使用JS来完成，可以加分。

* 你都使用那些工作来测试代码的性能？
	* 例如JSPerf (http://jsperf.com/)
	* 例如Dromaeo (http://dromaeo.com/) 
	* 其它。

* 如果今年你打算熟练掌握一项新技术，那会是什么？
```
用JS写处理数据，比如audio或video解码，压缩解压ZIP之类。
```

* 请谈一下你对网页标准和标准制定机构重要性的理解。

* 什么是FOUC？你如何来避免FOUC？
```
Flash of Unstyled Content, css文件加载过迟引起的现象。
解决方式：使用<link，不使用 @import, 并且在<head>段就加载CSS样式 
```

## HTML相关问题

* 文档类型的作用是什么？你知道多少种文档类型？

* 浏览器标准模式和怪异模式之间的区别是什么？

* 使用XHTML的局限有那些？
	* 如果页面使用'application/xhtml+xml'会有什么问题吗？

* 如果网页内容需要支持多语言，你会怎么做？
	* 在设计和开发多语言网站时，有哪些问题你必须要考虑？

* 在HTML5的页面中可以使用XHTML的语法吗？

* 在HTML5中如何使用XML？

* 'data-'属性的作用是什么？
```
HTML5 TAG的自定义属性，可以自己添加存储一些必要的数据或控制值
```

* 如果把HTML5看作做一个开放平台，那它的构建模块有那些？
```
DOM容器, CSS渲染, JS引擎, Canvas, Video, Audio, SVC, local storage
```

* 请描述一下cookies，sessionStorage和localStorage的区别？ 
Cookie,保存在浏览器缓存目录里，大小有限，条目数量也有限（不同浏览器限制不同）。通常用来记录一些临时数据。每次交互页面都会被传送到服务器端占用流量。
local Storage容量大很多，并且可以使用

## JS相关问题

* 你使用过那些Javascript库？

* 你是否研究过你所使用的JS库或者框架的源代码？

* 什么是哈希表？

* 'undefined'变量和'undeclared'变量分别指什么？
```
undefined是关键词，已经声明但是还没有赋值的变量，未使用过的数组元素，未定义的对象属性，值都等于undefined，当然，也可以手动把undefined当作值赋给变量。
undeclared应该是指not defined，没有声明过的变量，尝试输出没有声明的变量出抛not defined错，在严格模式，给没有声明过的变量赋值也会抛not defined错。
```

* 闭包是什么，如何使用它，为什么要使用它？
	* 你喜欢的使用闭包的模式是什么？
```
闭包就是用function作用域封装起来的一个独立空间，由于被function外部所引用，整个作用域里的代码不会被回收机制回收。
用闭包封装代码可以减少代码间（包内和包外）的变量污染。
我通常用IIFE(Immediately invoked function expression)封装作用域，在作用域里把方法return给某个全局命名空间的属性。
```

* 请举出一个匿名函数的典型用例？
```
document.body.addEventListener('click',function(){alert('body was clicked.')});
```

* 请解释什么是Javascript的模块模式，并举出实用实例。
	* 如果有提到无污染的命名空间，可以考虑加分。
	* 如果你的模块没有自己的命名空间会怎么样？

* 你如何组织自己的代码？是使用模块模式，还是使用经典继承的方法？

* 请指出Javascript宿主对象和内置对象的区别？

* 指出下列代码的区别：
```javascript
function Person(){} var person = Person() var person = new Person()
```
```
Person是Function
var person=Person();是Person的返回值，没有返回值的话，等于undefined, 如果Person里有对this的操作，this=undefined，在非严格模式下，this指向window，在严格模式下报错。
var person=new Person();先把Persion的prototype给了person, 然后执行Person()，如果Person里有对this的操作，this指向person，
```

* '.call'和'.apply'的区别是什么？

* 请解释'Funciton.prototype.bind'的作用？

* 你如何优化自己的代码？
```
一言难尽，review代码的过程中进行重构和优化。使用可读性更强的变量名和方法名，重新封装和拆封方法，简化合并逻辑，
```

* 你能解释一下JavaScript中的继承是如何工作的吗？

* 在什么时候你会使用'document.write()'？
	* 大多数生成的广告代码依旧使用'document.write()'，虽然这种用法会让人很不爽。
```
基本不使用document.write
它基本上用在script写在<body>结束前
或需要注入内容到window.open出来的窗体里
```

* 请指出浏览器特性检测，特性推断和浏览器UA字符串嗅探的区别？

* 请尽可能详尽的解释AJAX的工作原理。

* 请解释JSONP的工作原理，以及它为什么不是真正的AJAX。

* 你使用过JavaScript的模板系统吗？
	* 如有使用做，请谈谈你都使用过那些类似库文件。比如Mustache.js,Handlebars等等。

* 请解释变量声明提升。

* 请描述下事件冒泡机制。

* "attribute"和"property"的区别是什么？

* 为什么扩展JavaScript内置对象是个坏做法？

* 为什么扩展JavaScript内置对象是个好做法？

* 请指出document load和document ready的区别。(这是个问题的问题）

* '=='和'==='有什么不同？
'=='在类型不同的值比较时，先按规则转换两边被比较的值类型， '==='在类型不同的值比较时，直接返回false

* 你如何获取浏览器URL中查询字符串中的参数。
根据业务情况来决定取参数方法的复杂程度。
  如果指定某个非数组参数名，直接正则从location.search里抓取。
  如果要全部参数，先替换掉最location.search开头的'?'，split('&')，然后遍历split出来的数组，生成新的参数数组。
  如果可能有数组参数情况，在遍历的时候要添加额外的逻辑
  如果要考虑容错，比如连贯的&&号，不含等于号的纯值，超过一个等于号的错误表达式。在遍历时再添加额外的逻辑
最后用decodeURIComponent()还原被编码的值

* 请解释一下JavaScript的同源策略。
same-origin policy
为安全性考虑，只允许JS读取相同来源的URL内容。缺省情况包括完整的域名，端口号和协议
其中域名是可以松动的条件，设置document.domain为父域，可以允许访问同一 父域下的不同子域名。
可以用jsonp来解决跨域访问。

* 请解释一下事件代理。

* 请描述一下JavaScript的继承模式。

* 如何实现下列代码：
```javascript
[1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]
```
回答：
```javascript
Array.prototype.duplicator=function(){ 
  return this.valueOf().concat(this.valueOf());
};
```

* 描述一种JavaScript memoization(避免重复运算)的策略。

* 什么是三元条件语句？
三元表达式，提供一个条件和两个备选表达式，通过条件结果的真假来选择用某个备选表达式作为整个表达式的结果。
(condition)?foo:bar;

* 函数的参数元是什么？

* 什么是"use strict"?使用它的好处和坏处分别是什么？

## JS代码示例：

```javascript
~~3.14
```
问题：上面的语句的返回值是什么？
**答案：3**

```javascript
"i'm a lasagna hog".split("").reverse().join("");
```
问题：上面的语句的返回值是什么？
**答案："goh angasal a m'i"** 

```javascript
( window.foo || ( window.foo = "bar" ) );
```
问题：window.foo的值是什么？
**答案："bar"**
只有window.foo为假时的才是上面答案，否则就是它本身的值。

```javascript
var foo = "Hello"; (function() { var bar = " World"; alert(foo + bar); })(); alert(foo + bar);
```
问题：上面两个alert的结果是什么
**答案: "Hello World" & ReferenceError: bar is not defined** 

```javascript
var foo = [];
foo.push(1);
foo.push(2);
```
问题：foo.length的值是什么？
**答案：'2'**

```javascript
var foo = {};
foo.bar = 'hello';
```
问题：foo.length的值是什么？
**答案: `undefined`

```javascript
foo = foo||bar
```
问题: 这行代码是什么意思? 
**答案: if(!foo) foo = bar

```javascript
foo>>1
```
问题: 这行代码是什么意思? 
**答案: Math.floor(foo/2)

```javascript
foo|0
foo+.5|0
```
问题: 这行代码是什么意思? 
**答案: parseInt(foo) & Math.round(foo)

```javascript
function foo(bar1, bar2, bar3){}
```
问题: 如何获取参数的个数?
**答案: foo.length //this example is 3


## jQuery相关问题

* 解释"chaining"。
在使用jquery选择器结果对DOM操作时，jQuery的绝大多数DOM方法会以jQuery选择器结果作为方法的返回值，
这样，如果要对同一选择器的结果进行多个方法的调用的话，只需要用'.'连接这些方法而不需要多次执行选择器。

* 解释"deferreds"。

* 你知道那些针对jQuery的优化方法。

* 请解释'.end()'的用途。

* 你如何给一个事件处理函数命名空间，为什么要这样做？

* 请说出你可以传递到jQuery方法的四种不同值。
	* 选择器（字符串），HTML（字符串），回调函数，HTML元素，对象，数组，元素数组，jQuery对象等。

* 什么是效果队列？

* 请指出'.get()','[]','eq()',的区别。
jQuery选择器的标准返回的是jQuery对象数组，.eq()可以取数组中的其中一个，返回仍为jQuery对象，可以使用jQuery方法
.get和[]等效，返回的是DOM对象，可以使用浏览器的DOM方法。

* 请指出'.bind()','.live()'和'.delegate()'的区别。
bind是把事件绑到具体的选择器结果上，可以是单个的，也可以是批量的。
live和delegate的运作方式非常接近。
$(selector,[context]).live(event,fn);
$(context).delegate(selector,event,fn);
live把事件绑在context上，context缺省为document。live在工作的时候只取了selector的文本字串，当event发生并冒泡到context上的时候，比较发生事件的target是否和selector配置,是的话就执行fn。
虽然selector只被当作字符串存储，但是在调用live前，selector被sizzle执行并选择出了结果，该结果并没有被使用，如果没有链式后缀，那sizzle选出这个结果的过程就是多余的
delegate就是调整参数位置的live。把selector当作字符串传入，避免了多余的sizzle选择。
所以，bind只能对存在的元素进行绑定，live和delegate可以对不存在的元素绑定事件。
但是bind是在事件冒泡的顶端接收到事件的, 被绑定的fn在执行顺序上要优先于live和delegate.

* 请指出'$'和'$.fn'的区别？或者说出'$.fn'的用途。

* 请优化下列选择器：
```javascript
$(".foo div#bar:eq(0)")
```


## CSS相关问题

* 描述css reset的作用和用途。

* 描述下浮动和它的工作原理。

* 清除浮动的方法有那些，分别适用于什么情形。

* 解释css sprites,如何使用。

* 你最喜欢的图片替换方法是什么，你如何选择使用。

* 讨论CSS hacks，条件引用或者其他。 

* 如何为有功能限制的浏览器提供网页。
	* 你会使用那些技术和处理方法。

* 如何视觉隐藏网页内容，只让它们在屏幕阅读器中可用。

* 你使用过网格系统吗？如果使用过，你最喜欢哪种？

* 你使用过meidia queries（媒体查询）吗，或者移动网站相关的CSS布局。

* 你熟悉SVG样式的书写吗？

* 如何优化网页的打印样式。

* 在书写高效CSS文件时会有哪些问题需要考虑。

* 你使用CSS预处理器吗？(SASS,Compass,Stylus,LESS)
	* 如果使用，描述你的喜好。

* 你是否接触过使用非标准字体的设计？
	* 字体服务，Google Webfonts, Typekit,等等。

* 请解释浏览器是如何根据CSS选择器选择对应元素的。

