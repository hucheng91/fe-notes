# vue多页应用模版、增量构建

多页和单页的区别在于，很多时候多页项目是很多人参与开发的，每个人的需求对应的 一个应用,我们在打包构建的时候，希望仅仅构建自己负责的那个页面，这样快，发布的时候只想发布自己的模块，这样不会影响到别人的模块(这个又叫增量更新构建)，下面就这2个痛点一一处理掉

假设项目结构如下
```javascript
---apps
--------demo1
----------index.js
----------App.vue
--------demo2
----------index.js
----------App.vue
```
vue.config.js 配置
```javascript
module.exports = {
  pages: {
    demo1: {
      entry: 'src/demo1/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    demo2: {
      entry: 'src/demo2/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  outputDir: path.resolve(__dirname, `./dist`),
};
```

<br />这样配置就存在一个问题，每次都会把 apps 目录下的页面都构建一次，假设这个库是个 活动页的仓库，apps下面有十几目录就完蛋了，构建一次会把人急死，部署也是问题，都构建，都上传的话，对线上影响比较大，接下来，我们做增量构建，假设 demo1 改变了，只构建 demo1 这个目录<br />修改` package.json`
```javascript
 "scripts": {
    "start": "node build/cli.js serve",
     "dev": "npm start",
    "build": "node build/cli.js build",
 }    
```
build/cli.js 内容如下
```javascript
/*
 * @Author: hucheng
 * @Date: 2020-05-10 18:45:52
 * @Description: here is des
 */
const { execSync } = require('child_process');
const { log } = console;
const { getPageNames } = require('./utils');

const action = process.argv[2];

// eslint-disable-next-line camelcase
const fn_map = {
    serve: vueServe,
    build: vueBuild,
}
if (!fn_map[action]) {
    throw new Error('No action matched');
}
fn_map[action]();

function vueServe () {
    const chalk = require('chalk');
    const inquirer = require('inquirer');
    const fuzzy = require('fuzzy');

    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

    function searchPages (answers, input) {
        input = input || '';
        return new Promise(resolve => {
            const fuzzyResult = fuzzy.filter(input, getPageNames());
            resolve(fuzzyResult.map(el => el.original));
        });
    }

    inquirer
        .prompt([
            {
                type: 'autocomplete',
                name: 'page',
                message: 'Select a page to serve',
                pageSize: 10,
                source: searchPages
            }
        ])
        .then(({ page: pageName }) => {
            log(`${chalk.blue.bold('Waiting For Server Start...')}`);
            execSync(`PAGE_NAME=${pageName} npx vue-cli-service serve`, { stdio: 'inherit' });
        });
}
function vueBuild () {
    const pageName = process.argv[3];
    const env = process.argv[4];

    if (!pageName) {
        console.error('No page specific');
        process.exit(0);
    }

    if (!['qa', 'pre', 'prd'].includes(env)) {
        console.error('Environment qa/pre/prd must specific');
        process.exit(0);
    }

    execSync(
        `rm -rf ./dist/${pageName} && PAGE_NAME=${pageName} npx vue-cli-service build --mode ${env}`,
        { stdio: 'inherit' }
    );
}


```

<br />本地开发阶段 我们执行 `npm run dev`<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589118473461-ef1a962b-ff5d-489e-bc09-e8b4da86617e.png#align=left&display=inline&height=530&margin=%5Bobject%20Object%5D&name=image.png&originHeight=530&originWidth=1650&size=147352&status=done&style=none&width=1650)<br />这样我们就可以选择构建那个目录，看上面的  vueServe 这个方法，当我们选择某个 页面时，会往环境变量 `PAGE_NAME` 存储选择需要构建的目录<br />
<br />接下里看 vue.config.js
```javascript
/*
 * @Author: hucheng
 * @Date: 2020-05-10 17:05:56
 * @Description: here is des
 */
/* eslint-disable */
const path  = require("path");
const { getPageEntries } = require("./build/utils");

const { PAGE_NAME } = process.env;
console.log(getPageEntries(PAGE_NAME) );
module.exports = {
  pages: getPageEntries(PAGE_NAME),
  outputDir: path.resolve(__dirname, `./dist/${PAGE_NAME}`),
  publicPath:  `/${PAGE_NAME}/`,
  indexPath: "index.html",
  chainWebpack: config => {
    config.resolve
        .alias
        .set('@', path.posix.join(__dirname, `apps/${PAGE_NAME}/`))
   
},
devServer: {
  open: true,
  openPage: `pages/${PAGE_NAME}/index.html`
}
};
```

<br />通过 PAGE_NAME 来确定需要构建的目录，这样就完成了 webpack 只构建 我们选择的那个目录，大大减少构建时间

接下来是 走 gitalb-ci.yml 构建阶段
```yaml
build:
  stage: build
  only: 
    - develop
    - preview
    - master
  artifacts: # artifacts 标记，当前job 执行完成后，在 gitalb 网页可以下载的文件，会出现个下载按钮，可以下载这个目录
    paths:
      - ./dist
  script: 
    - bash ./build/cli.sh
```
看下 ./build/cli.sh，我们需要实现的是，找到 是那个 目录发生了改变，在上面本地开发阶段我们 可以通过选择<br />对应的目录来决定打包哪个目录，在构建阶段是没有这个交互的，那我们怎么办，我们是不是可以通过某种手段，获取到 变更的目录就好来，这个时候 `git diff ` 就派上用场了，看 cli.sh 代码
```bash
#!/bin/bash
set -e

# get env by current branch name
branch=$CI_COMMIT_REF_NAME
if [ "$branch" = "develop" ]; then
    env=qa
elif [ "$branch" = "preview" ]; then
    env=pre
elif [ "$branch" = "master" ]; then
    env=prd
else
    echo "[CI] Current branch is invaild"
fi

# diff modifed page for building,这里是重点
search_dir=apps
counter=0
for path in "$search_dir"/*; do
    if [ $(git diff HEAD~ --name-only | grep "$path") ]; then
        page_name=$(basename $path)
        echo "[CI] Page \"$page_name\" has been modified"
        echo "[CI] Start building"
        npm run build $page_name $env
        counter=$((counter + 1))
    fi
done

if [ "$counter" -eq "0" ]; then
    echo "[CI] No page has been modifed"
    echo "[CI] Skip Building"
fi
```
通过 `git diff` 就能确定是需要去构建哪个目录了，接下来逻辑就和上面一样了
