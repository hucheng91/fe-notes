<!--
 * @Author: hucheng
 * @Date: 2020-05-16 17:17:03
 * @Description: here is des
--> 
# gitlab restful api

平常我们在写 cli 过程中一定会遇到需要用到某个仓库的信息比如你需要统计某个内部的 vue 组件有哪些项目用到了， 需要去扫某个 group 下面的所有仓库的   `package.json` 信息，或者是通过 cli 创建的项目后，需要通过 api 去某个 group下创建一个项目（如果不这样，你可能需要手动去创建，这样整个流程不连贯），然后把本地创建的这个项目和 gitlab 上创建的关联起来，还有很多场景，所有 gitlab 提供很多 api 来给开发者用，基本开发者在 gitlab 上各种操作(创建项目，mr，打 tag，统计代码量 ......)的都能用 api 的处理<br />
<br />官方 api 地址 [https://docs.gitlab.com/ee/api/](https://docs.gitlab.com/ee/api/)，这里我列几个简单使用

api提供来几种认证方式，这里我主要写用 token 的方式<br />

<a name="5MBgi"></a>
### GitLab API获取Projects数据


```bash
http://gitlab.xxxxxxx.com/api/v3/projects/id/repository/branches?private_token=abcdefghijk
```
通过官方文档的说明，如果要获取一个工程的分支数据，除了private_token参数必填之外，还需要知道这个工程的id，但从GitLab操作界面上并没有工程id查看的入口。

private token参数可以通过界面入口查看，一般在profile->account路径下。

假设Token参数为 `23423423asdfadfas`，URL 域名参数替换成自己的，这边用 xxxxxxx 字符串代替，接着用Linux命令在终端测试获取下数据：
```bash
curl --header "PRIVATE-TOKEN:23423423asdfadfas" "http://gitlab.xxxxxxx.com/api/v3/projects"
```


<a name="K6iBu"></a>
### GitLab API获取指定Project数据

<br />如果GitLab上有几百个工程，总不能把所有的都获取下来再去过滤吧，通过查看API文档可以用search参数去过滤想要获取的project数据，比如这边要查找的是 test 项目的数据。<br />

```bash
curl --header "PRIVATE-TOKEN:23423423asdfadfas" "http://gitlab.xxxxxxx.com/api/v3/projects?search=test"
```
<a name="6rg6d"></a>
### node.js 常用的几个库
因为 gitlab 只提供的api，用起来不是太方面，社区有很多语言封装的 api ，node.js 常用的库是<br />
<br />[https://github.com/jdalrymple/gitbeaker](https://github.com/jdalrymple/gitbeaker)<br />[https://github.com/moul/node-gitlab](https://github.com/moul/node-gitlab)

## gitlab webhook 使用


<br />webhook 在工作中用到的地方非常多，类似发布订阅概念（语雀也是有 hook 的），gitlab 在 project 层面提供来很多 webhook，这个功能在消息提示方便还是挺好用的，gitlab api 也提供了对应的api来创建hook<br />我看到有的团队是用这个结合 jenkins 用<br />参见:<br />[Gitlab通过Webhook实现Push代码触发jenkins自动构建](https://mp.weixin.qq.com/s?src=11&timestamp=1589083120&ver=2329&signature=Lc8b3mf4t0QzBsUjzB6ob8R*3e1jGqK8Rjw20316MLE7bTBI4*RErs6ZJ5ixsbs1iKAIK7S4LlYQOyyOhmoxZlxsHxyrRIn23BR-tS-Asn84UqeS4MgAJE2393zv2G0j&new=1)<br />[一点也不复杂， GitLab Webhook 自动部署代码](https://mp.weixin.qq.com/s?src=11&timestamp=1589083120&ver=2329&signature=1u4vBZLdSA4Fjn7pSK6jgix4i2voHArIyMnRREYO1MnajYThWE8X*blvL9i6SqCezVqlyeKfpVxHIWtPuuLILqPXW5cr5iUoMePrye4vnbHSlPZQTyM*elDysQ*E7-eK&new=1)<br />
<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/117116/1589084321494-16078537-5762-4990-9403-809a6e7394c2.png#align=left&display=inline&height=1712&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1712&originWidth=3492&size=681911&status=done&style=none&width=3492)<br />

