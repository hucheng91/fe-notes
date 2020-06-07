
# 一个常用的 cli

<a name="xqvY0"></a>
## 常用到的几个库

<br />这个解释网上很多，避免啰嗦重复，我这里做简单的梳理，具体详细的使用可以搜下网上
<a name="6p2Y9"></a>
### commander
这是用来编写指令和处理命令行的，具体用法如下：
```javascript
const program = require("commander");
// 定义指令
program
  .version('0.0.1')
  .command('init', 'Generate a new project from a template')
  .action(() => {
    // 回调函数
  })
// 解析命令行参数
program.parse(process.argv);
```
回忆一下，我们曾用过的 vue init 的命令就是这样声明的。
<a name="xrHrI"></a>
### inquirer
这是个输入交互库，就是你在创建项目的时候，输入项目名，项目描述等等
<a name="b58xz"></a>
### chalk
这是用来修改控制台输出内容样式的，比如颜色啊<br />

<a name="Wltfn"></a>
### ora
这是一个好看的加载，就是你下载的时候会有个转圈圈的那种效果<br />

<a name="3g9vG"></a>
### download-git-repo
看名字很明显了，这是用来下载远程模板的，支持 GitHub、 GitLab 和 Bitbucket 等

<a name="hQB6l"></a>
## 一个最简单的 cli

- 首先我们要创建一个文件夹，并取名叫 fe-cli
- 在该目录下执行 npm init 命令，一路回车，就会生成一个生成 package.json 文件，在 package.json 里面写入以下依赖并执行 npm install 安装，如下
```javascript
"dependencies": {
    "chalk": "^2.4.2",
    "commander": "^2.19.0",
    "download-git-repo": "^1.1.0",
    "inquirer": "^6.2.2",
    "ora": "^3.2.0"
}
```
新建一个 bin 文件夹，并在 bin 目录下新建一个无后缀名的 lord-ring 文件，并写上：
```javascript
#!/usr/bin/env node
console.log('hello');
```

- 这个文件就是我们整个脚手架的入口文件，我们用 node ./bin/lord-ring 运行一下，就能在控制台打印出 hello
- 
- 这里要注意开头的 #!/usr/bin/env node 这个语句必须加上，主要是为了让系统看到这一行的时候，会沿着该路径去查找 node 并执行，主要是为了兼容 Mac ，确保可执行。
- 
- 每次输入 node ./bin/xr 这个命令有点麻烦，没关系，我们可以在 package.json 里面写入以下内容：
```javascript
 "bin": {
    "lord-ring": "bin/lord-ring"
  },
```
然后在根目录下执行 npm link（就是把命令挂载到全局的意思），这样我们每次只要输入 lord-ring，就可以直接运行了 

我写了个简单 cli 放到 github 上面，地址：[https://github.com/hucheng91/fe-cli](https://github.com/hucheng91/fe-cli)<br />效果如下：<br />![fe-cli.gif](https://cdn.nlark.com/yuque/0/2020/gif/117116/1588981632258-e82ccd6c-10bf-4342-8c82-210a33293efc.gif#align=left&display=inline&height=1506&margin=%5Bobject%20Object%5D&name=fe-cli.gif&originHeight=1506&originWidth=2310&size=8497422&status=done&style=none&width=2310)
<a name="aXJcg"></a>
## 根据模版创建项目
一般每个公司都会有自己的单页，多页项目模版，组件模版，不同的就是项目名，gitlab 地址，我们通过 cli 创建项目后，push 到仓库里去，一般我们会有很多个模版，模版这个数组，最好做成一个 ajax 请求，从服务端获取数据，这样动态更新比较方便，类似这样数据结构
```json
[
    {
        "id": 1,
        "name": "npm-sdk-component",
        "description": " npm sdk 模版",
        "url": "github:hucheng91/npm-sdk-template-rollupdemo"
    },
    {
        "id": 2,
        "name": "npm-vue-component",
        "description": "vue 组件 模版",
        "url": "github:github.com/hucheng91/npm-sdk-template-rollupdemo"
    }
]
```


<a name="QBj88"></a>
## 全局安装好么？
我们经常看到很多 cli 安装是  ` npm i xxx/cli -g`,这种全局安装的方式，不是特别推荐，更好的方式是随着项目走，这样更新版本也很方便，npx 用起来也很舒服，看下 egg  初始化方式<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1588982448924-ed5632f5-0ea2-4a75-a661-2d8b9d811b16.png#align=left&display=inline&height=1514&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1514&originWidth=2384&size=602338&status=done&style=none&width=2384)<br />
<br />我自己更推荐这种跟者项目走的方式，不推荐全局安装<br />

<a name="EmLzh"></a>
## 版本更新问题
经常我们新增模版，或者更改逻辑后，需要通知到使用方更新 cli，我们能不能做个好提示来更新 cli，因为跟着项目走，这种更新也只影响当前项目，影响范围比较小,可以在执行命令的前埋一个更新接口，去请求一个接口，接口返回最新版本和更新内容，然后比较本地版本和最新版本，发现本地版本比较旧，按照更新接口下发的更新内容提示用户更新了什么，这样用户就能很好的决定他是否需要更新了
<a name="30BfK"></a>
## yeoman
yeoman 是一个把我们上面逻辑抽象包装的一个 cli 框架，帮助我们快速生成一套既定的项目架构、文件、配置，如果不想自己写，也可以直接用 yeoman，使用参见

[如何快速开发一个自己的项目脚手架?](https://mp.weixin.qq.com/s/a9Zn6KS3GJ7D7Ytp2gn6gg)<br />

<a name="eKK3o"></a>
## 结合 gitlab 创建仓库
有的公司对 gitlab 权限管制有些严格，只要一小部分人有 创建项目的权限，那每次找人给权限也是个麻烦事，我们可以往前在走一步，ci把项目创建好后，直接 通过 gitlab 的 api 把项目创建好，通过 git config 获取 当前用户邮箱，把当前用户 加入到项目所属成员里去，然后 push 项目，最后做个企微/钉订/邮件/other 通知用户当前项目的 gitlab 目录<br />具体可以参见 demo<br />[https://github.com/hucheng91/fe-cli](https://github.com/hucheng91/fe-cli)<br />
<br />
<br />
<br />

