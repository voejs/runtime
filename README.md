# @voejs/runtime

它是一个基于`webpack`的插件，用于辅助开发者是一哦那个开发模式和打包模式来创建应用。它是一种动态`loader`模式的生成器。

# Install

```shell
npm i @voejs/runtime --save-dev
```

# Usage

它分为2中模式

- 开发模式
- 打包模式

## In Development

```javascript
const Loader = require('@voejs/runtime');
const loader = new Loader({ cwd: __dirname });
loader.watch();
process.on('SIGINT', () => loader.stop());
```

## In Production

```javascript
const Loader = require('@voejs/runtime');
const loader = new Loader({ cwd: __dirname });
loader.build();
```

## Use In Webpack

```javascript
const VoeRuntime = require('@voejs/runtime');
module.exports = {
  ...
  plugins: [
    new VoeRuntime({
      cwd: '...'
    })
  ],
  ...
}
```