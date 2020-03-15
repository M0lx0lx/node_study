note
=======

******************************************
> ###vue
******************************************

******************************************
> ###Git
###模式
>* 功能驱动式

******************************************

#node
>https构建
 * 1.生成一个名为key.pem的私钥文件的命令：`openssl genrsa 1024 > key.pem`
 * 2.生成名为key-cert.pem的证书的命令：`openssl req -x509 -new -key key.pem > key-cert.pem`
 * 3.使用时引入这两个文件即可

******************************************

#mysql
>基本使用命令：
>>Windows 系统下
    * 启动:`mysqld --console`
    * 关闭：`mysqladmin -u root shutdown -p`
    * 连接：`mysql -u user_name -p`
>基本管理命令：
    *使用某一数据库：`use database_name`
    *显示所有数据库：`show databases`
    *显示当前库的所有表：`show tables`
    *显示表的所有属性：`show columns from table_name`
    *显示表的详细索引信息：`show index from table_name`
    *显示库管理系统的性能及统计信息：`show stable status [from db_name][like 'pattern_name'][/G]`


******************************************



#浏览器环境
##script 元素
* 字符的编码 `charset="utf-8"`
* Hash 签名验证脚本的一致性 `integrity="sha256-TvVUHzSfftWg1rcfL6TIJ0XKEGrgLyEq6lEpcmrG9qs="`
###事件属性
 `<button id="myBtn" `**`onclick`**`="console.log(this.id)">点击</button>`
###URL 协议
* URL支持javascript:协议 
`<a href="javascript:console.log('Hello')">点击</a>`
###加载流程
1. 边下载HTML页面边解析；
2. 遇到script元素就暂停解析，把网页渲染的控制权转交给JavaScript引擎；
3. 如果引用了外部脚本就下载该脚本再执行，否则就直接执行代码;
4. JavaScript引擎执行完毕，控制权交还渲染引擎，恢复往下解析 HTML 网页。
###defer 属性
>延迟脚本的执行，等到 DOM 加载生成后，再执行脚本。
###async 属性
>使用另一个进程下载脚本，下载时不会阻塞渲染，下载完后即执行。
###脚本的动态加载
```
['a.js', 'b.js'].forEach(function(src) {
  var js = document.createElement('script');
  js.src = src;
  js.onload = function() { //加载完成后回调
      done();
    };
    js.onerror = function() { //加载失败后回调
      done(new Error('Failed to load script ' + src));
    };
  js.async = false; //是否非顺序执行
  document.head.appendChild(js);
});
```
###加载使用的协议
1. 默认采用 HTTP 协议下载'example.js'
2. 自定义协议'https://example.js'
3. 根据页面本身的协议来决定加载协议'//example.js'
#浏览器的组成    
##渲染引擎
1. Firefox：Gecko 引擎
2. Safari：WebKit 引擎
3. Chrome：Blink 引擎
4. IE: Trident 引擎
5. Edge: EdgeHTML 引擎
##重流和重绘
###优化技巧
* 底层 DOM 元素的变动代替高层 DOM 的变动
* 使用 class 一次性改变样式
* 使用documentFragment操作 DOM
* 使用window.requestAnimationFrame()，它可以把代码推迟到下一次重流时执行
  ```
    // 重绘代价低
    function doubleHeight(element) {
      var currentHeight = element.clientHeight;
    
      window.requestAnimationFrame(function () {
        element.style.height = (currentHeight * 2) + 'px';
      });
    }
    all_my_elements.forEach(doubleHeight);
  ```
* 使用虚拟 DOM（virtual DOM）库
##JavaScript 引擎
******************************************

   
#Git
##常用的
```
cherry-pick  //合并其他分支的某一次提交
            --abort  //撤销上一次提交
	    --continue  //解决冲突后继续

git stash //把自己修改的代码储藏起来

git stash list //查看储藏列表

git stash pop stash@{0}//提取第几个代码，不传默认取第一个

```
合并多个连续的commit：
`rebase -i  // ` 
`--abort  //取消`
`pick //第一个`
`squalsh //非第一个commit合并至第一个`
合并至前一个commit，并重新massage：
`git commit --amend -m`
当我们需要删除暂存区或分支上的文件, 同时工作区也不需要这个文件了, 可以使用
```
git rm file_path
```
当我们需要删除暂存区或分支上的文件, 但本地又需要使用, 只是不希望这个文件被版本控制, 可以使用
```
git rm --cached file_path
```



`实现push只输入一次账号：git config --global credential.helper store`



******************************************
#markdown
> 1. 标题 `#`
> 1. 分块  ``
> 1. 列表 
> 1. 链接 `[]()`
> 1. 代码
> * *强调1*  **强调1** _强调2_ __强调2__
******************************************

 ![an example](http://www.lilongxian.club/public/my_.jpg "开心学习，开心成长")
[我的鸡汤博客](http://www.lilongxian.club "this's my home")