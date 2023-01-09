<p align="center">
<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/logo-bg.14xj395kpgak.png" alt="有度·UDO" width="180">
</p>
<h1 align="center">有度·UDO</h1>

## 项目介绍
本仓库为开源项目[有度·UDO](https://github.com/GTechdigi/udo)的**Admin面板**。`UDO`数据监控是一款对数据同步、数据生成、数据预测做出监控的程序。

## 功能
**Dashboard**
> 仪表盘

<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Dashboard.5jovfxy0pz00.png" alt="Dashboard" width="480">

**数据源管理**
> 目前支持数据源的类型有 `Mysql`、`Hive`、`ClickHouse`、` Elasticsearch`

<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Datasource.5xzxsg6uxzc0.png" alt="Datasource" width="480">

**项目管理**
> 用户可以被添加到多个项目中，基于项目创建规则和任务，用户只能看到自己所在项目的规则和任务,只有管理员才可以看到所有

<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Projects.340bbf2452e0.png" alt="Projects" width="480">

**数据监控**
> 具备数据及时性、数据同步、数据一致性、业务监控四种数据监控类型。支持企业微倍群聊机器人报警，支持邮件报警

<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Monitoring.yqsywm1hjnk.png" alt="Monitoring" width="480">

**调度任务**
> 支持调度任务
<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Task.b7pvo7pvcu8.png" alt="Task" width="480">

**日志管理**
> 支持日志管理
<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Logs.4v5y2wmlwsy0.png" alt="Logs" width="480">

**用户管理**
> 简易的用户管理模块，支持账号登录、域账号登录

<img src="https://cdn.staticaly.com/gh/poezhang/image-hosting@main/UDO/Users.73khqy9pfos0.png" alt="Logs" width="480">

## 部署
在继续阅读文档的**部署章节**之前，确保已经部署了本项目对应的后台服务。

部署本项目需要使用`Web服务器`例如`Nginx`作为**静态文件服务器**，`dist`目录为构建产物。为了接下来行文方便，我们假设对应的后台服务部署在：`http(s)://yourhost/api`，那么本项目部署后的期望地址是：`http(s)://yourhost`。

### 在Nodejs平台部署
或者，更简单的，也可以使用本仓库中提供的简单的静态文件服务器。在当前目录下使用以下命令开启：

```sh
npm run serve
```

## 开发
可使用下面的命令安装依赖、开启本地服务并重新构建。

启动本地开发服务器前，需要修改`vue.config.js`配置文件中的代理服务器的配置。`devServer.proxy[rule].target`字段即为**代理服务器**的目标地址。

```sh
# 安装依赖
npm install

# 开启本地服务
# 在此之前需要修改vue.config.js的代理地址
npm run dev

# 构建
npm run build
```

## 感谢
> 特别感谢社区中优秀的开源项目的贡献

[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)