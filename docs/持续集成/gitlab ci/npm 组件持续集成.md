# npm 组件持续集成


<br />一般中大型公司都有自己的 npm 私服，往上面发布公司内部的组件，这个也最好做到通过 gitlab 来构建发布<br />开源的私服有很多（我自己的话推荐用 Nexus），接下来这个脚本是每种私服都通用的<br />

<a name="yQa6q"></a>
## .gitlab-ci.yml 配置
```yaml
image: node:latest

stages:
  - install_deps
  - build
  - publish-master
  - dev-master

install_deps:
  stage: install_deps
  only:         
    - master
  script:  # script 就是你要执行的脚本了
    - npm install

build:
  stage: build
  only: 
    - master
    - dev
  script: 
    - npm run build
    
dev-master:
  stage: dev-master
  only: 
    - dev
  script: # 这里建议也是把 deploy.js 放到远端，好更新，我这里简单写下
    - node deploy.js dev   
publish-master:
  stage: publish-master
  only: 
    - master
  script: # 这里建议也是把 deploy.js 放到远端，好更新，我这里简单写下
    - node deploy.js master


```
<a name="AI9TK"></a>
## deploy.js

<br />首先 我们在 自己本地 做 `npm publish` 之前,都需要执行 一次 `npm login`

`npm login`的本质就是 往当前用户的 .npmrc 写入你的登录信息，我们可以执行下 `cat ~/.npmrc`,看下内容

![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589105853261-b790506e-ad84-4043-9074-86f2931fdec5.png#align=left&display=inline&height=434&margin=%5Bobject%20Object%5D&name=image.png&originHeight=434&originWidth=1150&size=102944&status=done&style=none&width=1150)<br />那在 gitlab-ci 里面，我们只要把这段存储到 gitlab-ci 那台机器的 `~/.npmrc`下面，然后执行 `npm publish 就好了`

那现在还有个问题就是，自己在开发过程并不是想 别人能拉到我发布的代码，这个时候 npm 的tag 就派上用场了,先看看 vue 的版本 ,执行下 `npm info `<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589106124795-025b54e2-7824-4e0f-965e-da6988cae9f3.png#align=left&display=inline&height=448&margin=%5Bobject%20Object%5D&name=image.png&originHeight=806&originWidth=1238&size=236657&status=done&style=stroke&width=688)<br />
<br />可以看到 dist-tags 有3个，我们默认在执行 `npm install vue`的时候，是获取 latest 这个tag的

所以我们发布的时候只要做到 不同的分支 走不同的 tag 就好了
```javascript
const fs = require('fs')
const path = require('path')
const os = require('os')
const { exec} = require('child_process') 
const  npmrcText = `registry=xxxxxx` // 把某个人的 ～/.npmrc copy 进来
const env = process.env.args[2]


function deploy(){
	 fs.writeFileSync(path.resolve(os.homedir(),'.npmrc'),npmrcText) // 将发布人信息写入本地
   const argsArray = ['publish'].concat(['--tag',env === 'master' ? 'latest' : 'beta'])
  execa('npm',argsArray);
}

async function execa(a,arry = []){
    return new Promise((resolve,reject) => {
        exec(`${a} ${arry.join(' ')}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(stdout)
        })
    })
}
```

<br />npm 发布的 核心逻辑就这些，这里面版本是根据 package.json 的版本控制的，也可以通过 npm version 来自动更新版本<br />

```javascript

npm 包 的版本号一般都是x.y.z的形式(开发包一般用x.y.z-a)
其中x表示主版本号，通常有重大改变或者达到里程碑才改变；
y表示次要版本号，或二级版本号，在保证主体功能基本不变的情况下，如果适当增加了新功能可以更新此版本号；
z表示尾版本号或者补丁号，一些小范围的修修补补就可以更新补丁号。
第一版本通常是0.0.1或者1.0.0，当修改了代码，需要更新版本号重新发布到npm，
不知道的小伙伴（年轻的我）肯定会手动修改package.json的version字段，而高级的玩法是直接使用npm version <update_type>命令自动搞定。
详细用法可通过npm help version查看，这里只介绍最常用的三种。


1.npm version patch => z+1
2.npm version minor => y+1 && z=0
3.npm version major => x+1 && y=0 && z=0
4.npm version prerelease => x=0 && y=0 && z=0 && a+1
```


