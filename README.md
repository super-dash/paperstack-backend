# PaperStack API Server

[![Build Status](https://travis-ci.com/super-dash/paperstack-api-server.svg?branch=master)](https://travis-ci.com/super-dash/paperstack-api-server)

## 开发

服务器软件运行于Node.js 12，所使用的工具、语言和框架为：

1. yarn
2. TypeScript
3. Express.js
4. TypeORM

请参阅：[开发者注记](docs/developer.md)

### 开发阶段常用指令

1. `yarn start:dev:watch` 启动开发服务器，服务器会随着src文件夹下代码的变动而自动重启。
2. `yarn build` 编译`src`文件夹下的TypeScript源代码。
3. `yarn clean` 清理废物（删除`bin`和`log`文件夹）。

---

## 部署

> 软件目前还没有到能够部署的阶段，开发时仅仅是使用文件型数据库SQLite3。
> PostgreSQL仅仅在生产环境下使用。

软件的运行环境为：

- Node.js 12
- PostgreSQL

本节后续部分假定上述环境已经完成基本安装，以在`CentOS 7`上部署为例，大致描述部署过程。

### 为PaperStack API Server创建PostgreSQL用户和数据库

```sh
sudo -u -i postgres # 切换为postgres用户
createuser paperstack # 创建用户paperstack
createdb paperstack -O paperstack # 创建用户paperstack的同名数据库并指定paperstack用户为Owner

psql
\password paperstack # 为paperstack创建密码
\q
exit # 登出postgress用户
```

可以`paperstack`用户身份验证配置：

```sh
psql -U paperstack -d paperstack -h localhost -p 5432 # 尝试使用paperstack用户身份登录
```

### 安装依赖和配置PaperStack API Server

```sh
git clone https://github.com/super-dash/paperstack-api-server.git && cd paperstack-api-server
yarn install
cp conf/config.example.yml.conf conf/config.yml # 需要在配置文件中填入正确的信息
```
