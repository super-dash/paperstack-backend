# 开发者注记

## 第三方软件文档

- [`TypeORM`文档](https://typeorm.io)

## 特殊的软件包依赖

- **Bcrypt3.0.6** 暂时不能升级到3.0.7，因为3.0.7没有发布Windows平台上的预编译软件，而Windows平台上难以编译。
- **Validator12.0.0** ~~`tsconfig.json`中不能启用`esModuleInterop`，否则`tsc`会报循环引用错误。十分有毒。~~ 使用`import validator from "validator"`方式导入似乎不会产生问题，有待进一步研究。
