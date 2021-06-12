# 目标在根据组件内的类型文件快速生成文档到项目中的 Readme 文档中

## CLI-读取组件文件生成文档

## CLI-约束规范，自动生成组件的模板文件

## 个人思考

1. 尽量利用编码来生成文档，而不是依靠注释
2. 组件有函数组件以及 class 组件
3. 直接取每个组件中的 Prop interface 来生成文档

## 工作任务拆分

1. 约定组件编码规范

2. 设计开发模块

a: 遍历寻找所有的组件
b: 解析组件获取 params
c: 生成文档
d: 增加配置文件