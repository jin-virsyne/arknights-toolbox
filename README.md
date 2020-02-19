# Arknights Toolbox

### Author: [Hera](https://github.com/heravynch)

## Issues

Any suggestion or bugs can be raised in [Issue](https://github.com/heravynch/arknights-toolbox/issues)。

## Getting Started

1. 确保你的开发环境中包括 Node.js(10.9.0 或更高版本) 和 npm/yarn 包管理器
    * 获取 Node.js，请转到 [nodejs.org](https://nodejs.org)。
    * 获取 [yarn](https://baike.baidu.com/item/yarn)，请转到[yarnpkg.com](https://yarnpkg.com/zh-Hans/docs/install#windows-stable)（非必须安装，该网站可能需要梯子）
        ```bash
        # 检查 Node.js 版本
        node -v
        # 检查 npm 版本
        npm -v
        ```
2. 安装 cnpm 命令行工具（推荐）
    ```bash
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    ```
3. 安装 Angular CLI
    ```bash
    cnpm install -g @angular/cli
    # 检查 Angular 版本
    ng version
    ```
4. 克隆项目
    ```bash
    git clone https://github.com/graueneko/aktools.git
    cd aktools
    cnpm i -s
    # yarn 用户：
    # yarn
    ng serve -o
    ```


#### Important 

1. 开发请注意移动优先(Mobile First);
2. 尽管代码格式可能会随 TSLint 的配置不同发生变化，还请尽可能减少 PR 中未修改部分的代码变动;
3. 可以适量引入新图片、数据文件，但请勿加入过多、过大，以免国内网络访问过慢。

#### Developer tools may required:

1. [Angular 8 中文文档](https://angular.cn/docs), or [Angular 8 Docs(en)](https://angular.io/docs)
2. [Blox Material Components](https://blox.src.zone/material/components)
3. [Angular Flex Layout](https://github.com/angular/flex-layout)

## Building and deploying

```bash
ng build --prod --base-href "http[s]://*YOUR_URL*/"
```

可部署的 site 版本将生成在 `./dist/aktools` 目录下。

## 发布
请参照 `publish.sh.example` 中说明修改脚本内容，之后可用于一键发布。
