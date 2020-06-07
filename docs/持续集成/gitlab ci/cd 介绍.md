# gitlab ci/cd 介绍

<a name="BZD06"></a>
## 一个最简单的 ci
1. 在项目根目录创建一个 .gitlab-ci.yml 的文件
1. 添加内容
```yaml
image: node:latest
stages:
  - test
test
	stage: test
  script:  
    -  echo 'hello,world!'
```

1. push 代码到 gitlab 
1. 打开 gitlab 项目的地址，点击 左侧的 CI/CD下就能看到你构建

![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589001479081-455eced8-98f2-4048-a1eb-e2c9fc155f56.png#align=left&display=inline&height=613&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1226&originWidth=3080&size=612376&status=done&style=none&width=1540)
<a name="oksxw"></a>
## 一个常见的ci
```yaml
//.gitlab-ci.yml

# image 标记 使用的 docker 镜像，这里我们使用 nodejs 镜像
image: node:latest

# variables 是定义环境变量，可以在直接获取
variables:
  HCNAME: "hucheng"
 cache:
    paths:
      - node_modules/
      
# stages 定义 执行步骤，包含了需要执行的job，类似第一步干嘛，第二步干嘛，接着干嘛
stages:
  - install_deps
  - build
  - deploy

# install_deps 就是job，job下面的 stage 字段和上面一一对应起来
install_deps:
  stage: install_deps
  only:   					#  这里的 only 标记 在下面3个分支下面，push代码后，执行当前job，，only 支持 branch，tag，change，正则
    - develop
    - preview
    - master
  script:  # script 就是你要执行的脚本了
    -  echo $HCNAME && npm install

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
    - npm run build

deploy:
  stage: deploy
  only: 
    - develop
    - preview
    - master
  script:
    - npm run publish

```


<a name="NOMWx"></a>
## .gitlab-ci.yml 常用到的 几个配置
.gitlab-ci.yml 配置非常多，把常用的解释下，详细的直接翻文档就好

[https://docs.gitlab.com/ee/ci/yaml/README.html#onlyexcept-advanced](https://docs.gitlab.com/ee/ci/yaml/README.html#onlyexcept-advanced)
<a name="QWRBZ"></a>
### stages
例子中 stages 值为一个数组（p.s. 用 - 代表数组和 markdown 类似）。包含了三个 job，test, build, deployr 分别实现自动测试，打包项目和部署。下方的 stage 必须在全局定义的 stages 内。
<a name="hUz5H"></a>
### variables
值为键值对象，为了后续的流程，此处定义了开发项目和部署项目的 namespace 和 repo_name。同 shell 类似，后续使用其值需要加上 $ 符号。定义的变量也有对应的作用域，定义在顶层就可以作为全局变量供所有 job 使用，如果是一些 job 特有的变量，就定义在 job 内部。gitlab 默认提供了很多全局变量给我们使用，我自己总结下来有下面这些
<a name="NurOd"></a>
#### 默认自带
```javascript
function getVariable(){
  const env = process.env;
  return {
    server: {
      name: env.CI_SERVER_NAME,
      revision: env.CI_SERVER_REVISION,
      version: env.CI_SERVER_VERSION,
    },
    commit: {
      commit_messge: env.CI_COMMIT_MESSAGE,
      ref: env.CI_COMMIT_REF_NAME,
      refSlug: env.CI_COMMIT_REF_SLUG,
      sha: env.CI_COMMIT_SHA,
      tag: env.CI_COMMIT_TAG,
    },
    job: {
      id: parseInt(env.CI_JOB_ID, 10),
      manual: parseBool(env.CI_JOB_MANUAL),
      name: env.CI_JOB_NAME,
      stage: env.CI_JOB_STAGE,
      token: env.CI_JOB_TOKEN,
    },
    pipeline: {
      id: parseInt(env.CI_PIPELINE_ID, 10),
      triggered: parseBool(env.CI_PIPELINE_TRIGGERED),
    },
    project: {
      dir: env.CI_PROJECT_DIR,
      id: parseInt(env.CI_PROJECT_ID, 10),
      name: env.CI_PROJECT_NAME,
      namespace: env.CI_PROJECT_NAMESPACE,
      path: env.CI_PROJECT_PATH,
      url: env.CI_PROJECT_URL,
      repo: env.CI_REPOSITORY_URL,
    },
    debug: parseBool(env.CI_DEBUG_TRACE),
    registry: env.CI_REGISTRY === undefined ? undefined : {
      registry: env.CI_REGISTRY,
      image: env.CI_REGISTRY_IMAGE,
    },
    environment: env.CI_ENVIRONMENT_NAME === undefined ? undefined : {
      name: env.CI_ENVIRONMENT_NAME,
      slug: env.CI_ENVIRONMENT_SLUG ,
    },
    runner: {
      id: parseInt(env.CI_RUNNER_ID, 10),
      description: env.CI_RUNNER_DESCRIPTION,
      tags: (env.CI_RUNNER_TAGS || '').split(',').map(x => x.trim()).filter(x => x.length > 0),
    },
    user: {
      id: parseInt(env.GITLAB_USER_ID, 10),
      email: env.GITLAB_USER_EMAIL,
    },
  }
}


```
<a name="jTCMD"></a>
#### ci中定义
```yaml
# variables 是定义环境变量，可以在直接获取
variables:
  HCNAME: "hucheng"
```
<a name="wD6db"></a>
#### 通过项目定义
这个是直接在gitlab 站点上定义，有的场景挺少的，我自己是还没用过的<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589083841865-f22774c0-1c3f-4802-833f-b4b60300b9a5.png#align=left&display=inline&height=1302&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1302&originWidth=2982&size=547860&status=done&style=none&width=2982)
<a name="Fe0Jq"></a>
### before_script
值为数组，每一个元素其实就是一个 linux 命令，写的时候装作自己在写 shell 就好。该部分主要生成了后续构建需要的镜像标签，切换当前目录等。为了 debug 方便，这些变量最好打印。类似的，如果在 job 完成后有一些时候操作，可以定义 after_script。需要注意的是如果定义在顶层，内部的命令会在每个 job 运行之前执行，如果某些 job 需要特别的预操作，可以在 job 内部再配置一个 before_script 对象，它会复写外部的全局预操作。
<a name="I94Xz"></a>
### test_stage
名为 `test` 的 `job` 的具体配置，一般是个复合对象。
<a name="Kox3s"></a>
### stage
`job` 对应的 `stage`，如果有多个 `job` 对应同一个 `stage`，在执行时会并行执行这些 `job`。
<a name="QVt5U"></a>
### script
这个 job 执行的命令，此处是进入的项目仓库目录，并且执行了一个 shell 脚本，这个脚本定义了执行项目的所有单元测试。一般建议如果要执行的命令过多，就把这些命令写成脚本放在项目内。CICD 流程直接执行这个脚本。
<a name="VBWTa"></a>
### artifacts
这个对象用来定义 `job` 的产出，比如我们让 `test_stage` 产出一个 html 格式的报告，显示每个单元测试的执行情况（报告生成相关代码写在项目内）。数组内的 `paths` 和 `when` 分别定义报告的路径和产出场景。此处表示报告放置于根目录下，任何时候都要提供报告。设定正确后，就可以 Gitlab 的 pipline 页面上可以下载相关文件。下面标红的就是标记可以下载下来的<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589084131449-b5e5cf32-8ab7-435e-99d8-9e41b74ceb34.png#align=left&display=inline&height=1276&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1276&originWidth=3102&size=334528&status=done&style=none&width=3102)
<a name="3D5cT"></a>
### allow_failure
见名知意，如果值为 true，那么即使没通过测试，也可以执行后续的 `job`.
<a name="4FO4y"></a>
### build_stage
该步骤在测试通过的基础上，把项目编译打包，方便后续部署。
<a name="8Z4OP"></a>
### when
此处的 `when` 定义在 `job` 内的顶层，值为 manual 表示其需要在 Gitlab 上手动触发（页面上点击按钮即可）。
<a name="s0Sjv"></a>
### only
`only` 指明了 `job` 的执行场景，可以是分支名，表明只有 master 分支可以执行 `build`，如果要用排除法反向指定，可以用 `except`。

