# Webpack-TypeScript-Babel

# Basic Setup
```shell
npm init -y
```
## Install Webpack
```shell
npm install --save-dev webpack webpack-cli
```

## Add files
```diff
  project
+ |- index.html
```
```html
<!doctype html>
<html>
  <head>
    <title>Getting Started</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```
```diff
  project
+ |- /src/index.js
```
```js
function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```
### Adjust package.json
```diff
  {
+   "private": true,
-   "main": "index.js",
  }
```

## Creating a Bundle
### Tweak the directory structure
```diff
  project
+ |- /dist/index.html
- |- index.html
```
### Add lodash properly
```shell
npm install --save lodash
```
#### src/index.js
```diff
+ import _ from 'lodash';
  function component() {
    const element = document.createElement('div');

-   // Lodash, currently included via a script, is required for this line to work
  ...
```
#### dist/index.html
```diff
  <head>
    <title>Getting Started</title>
-   <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
-   <script src="./src/index.js"></script>
+   <script src="main.js"></script>
  </body>
```

Run
```shell
npx webpack
```
It will take our script at src/index.js as the entry point, and will generate dist/main.js as the output.

## Adding a configuration file
```diff
  project
+ |- webpack.config.js
```
### webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

Run the build again but instead using our new configuration file:
```shell
npx webpack --config webpack.config.js
```

## NPM Scripts

### package.json
```diff
{
  ...
    "scripts": {
-      "test": "echo \"Error: no test specified\" && exit 1"
+      "test": "echo \"Error: no test specified\" && exit 1",
+      "build": "webpack"
    },
  ...
  }
```
Now the
```shell
npm run build
```
command can be used in place of the npx command.

# Asset Management
## Setup
### dist/index.html
```diff
    <head>
-    <title>Getting Started</title>
+    <title>Asset Management</title>
    </head>
    <body>
-     <script src="main.js"></script>
+     <script src="bundle.js"></script>
    </body>
```
### webpack.config.js
```diff
  module.exports = {
    ...
    output: {
-     filename: 'main.js',
+     filename: 'bundle.js',
    ...
  };
```

## Loading CSS
### Install the style-loader and css-loader
```shell
npm install --save-dev style-loader css-loader
```
### Add them to the module configuration (webpack.config.js)
```diff
  module.exports = {
    ...
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader',
+         ],
+       },
+     ],
+   },
```
### Add a new style.css file to the project and import it in the index.js
```diff
  project
+  |- /src/style.css
```
#### src/style.css
```css
.hello { color: red; }
```
#### src/index.js
```diff
  import _ from 'lodash';
+ import './style.css';

  function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.classList.add('hello');
  ...
```

## Loading Images
```shell
npm install --save-dev file-loader
```
### webpack.config.js
```diff
  ...
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader',
+         ],
+       },
  ...
```

```diff
  project
+  |- /src/icon.png
```

### src/index.js
```diff
+ import Icon from './icon.png';
  ...
+   // Add the image to our existing div.
+   const myIcon = new Image();
+   myIcon.src = Icon;
+
+   element.appendChild(myIcon);
 ...
```

### src/style.css
```diff
  .hello {
    color: red;
+   background: url('./icon.png');
  }
```

## Loading Fonts
### webpack.config.js
```diff
  ...
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader',
+         ],
+       },
  ...
```
```diff
  project
  |- /src
+   |- my-font.woff
+   |- my-font.woff2
```
### src/style.css
```diff
+ @font-face {
+   font-family: 'MyFont';
+   src:  url('./my-font.woff2') format('woff2'),
+         url('./my-font.woff') format('woff');
+   font-weight: 600;
+   font-style: normal;
+ }

  .hello {
    color: red;
+   font-family: 'MyFont';
    background: url('./icon.png');
  }
```

## Loading Data
To import CSVs, TSVs, and XML we will use the csv-loader and xml-loader.
```shell
npm install --save-dev csv-loader xml-loader
```
### webpack.config.js
```diff
  ...
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader',
+         ],
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader',
+         ],
+       },
  ...
```
Add some data files to the project:
```diff
  project
+  |- /src/data.xml
```
### src/data.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```
Now we can import any one of those four types of data (JSON, CSV, TSV, XML) and the imported variable will contain parsed JSON for easy consumption.
### src/index.js
```diff
+ import Data from './data.xml';
  ...
+   console.log(Data);
  ...
```

# Output Management
## Preparation
```diff
  project
+  |- /src/print.js
```
### src/print.js
```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```
### src/index.js
```diff
+ import printMe from './print.js';

  function component() {
    const element = document.createElement('div');
+   const btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

+   btn.innerHTML = 'Click me and check the console!';
+   btn.onclick = printMe;
+
+   element.appendChild(btn);
  ...
```
### dist/index.html
```diff
  <!doctype html>
  <html>
    <head>
-     <title>Asset Management</title>
+     <title>Output Management</title>
+     <script src="./print.bundle.js"></script>
    </head>
    <body>
-     <script src="./bundle.js"></script>
+     <script src="./app.bundle.js"></script>
    </body>
  </html>
```
### webpack.config.js
```diff
  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js',
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```
## HtmlWebpackPlugin
```shell
npm install --save-dev html-webpack-plugin
```
### webpack.config.js
```diff
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management',
+     }),
+   ],
  ...
```
## Cleaning up the /dist folder
```shell
npm install --save-dev clean-webpack-plugin
```
### webpack.config.js
```diff
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  ...
    plugins: [
+     new CleanWebpackPlugin(),
  ...
```

# Development
## Using source maps
### webpack.config.js
```diff
  module.exports = {
+   mode: 'development',
+   devtool: 'inline-source-map',
  ...
```
## Choosing a Development Tool
There are a couple of different options available in webpack that help you automatically compile your code whenever it changes:

+ webpack's Watch Mode
+ webpack-dev-server
+ webpack-dev-middleware

## Using Watch Mode
### package.json
```diff
  ...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "watch": "webpack --watch",
      "build": "webpack"
    },
  ...
```
```shell
npm run watch
```
Webpack compiles your code and it doesn't exit the command line because the script is currently watching your files.
The only downside is that you have to refresh your browser in order to see the changes. It would be much nicer if that would happen automatically as well, so let's try webpack-dev-server which will do exactly that.

## Using webpack-dev-server
```shell
npm install --save-dev webpack-dev-server
```
### webpack.config.js
```diff
  module.exports = {
+   devServer: {
+     contentBase: './dist',
+   },
  ...
```
This tells webpack-dev-server to serve the files from the dist directory on localhost:8080.
### package.json
```diff
  ...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
+     "start": "webpack-dev-server --open",
      "build": "webpack"
    },
  ...
```
## Using webpack-dev-middleware
webpack-dev-middleware is a wrapper that will emit files processed by webpack to a server. This is used in webpack-dev-server internally, however it's available as a separate package to allow more custom setups if desired. We'll take a look at an example that combines webpack-dev-middleware with an express server.
```shell
npm install --save-dev express webpack-dev-middleware
```
### webpack.config.js
```diff
  module.exports = {
    ...
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/',
    },
  };
```
The publicPath will be used within our server script as well in order to make sure files are served correctly on http://localhost:3000. We'll specify the port number later.

### Setting up our custom express server
```diff
  project
+ |- server.js
```
### server.js
```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
### package.json
```diff
  ...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --open",
+     "server": "node server.js",
      "build": "webpack"
    },
    ...
```

# Code Splitting
There are three general approaches to code splitting available:
+ Entry Points: Manually split code using entry configuration.
+ Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
+ Dynamic Imports: Split code via inline function calls within modules.

## Entry Points
```diff
  project
+ |- /src/another-module.js
```

### another-module.js
```js
import _ from 'lodash';
console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```

### webpack.config.js
```diff
module.exports = {
  entry: {
    ...
+   another: './src/another-module.js',
  },
};
```

## Prevent Duplication
### webpack.config.js
```diff
  module.exports = {
    ...
+   optimization: {
+     splitChunks: {
+       chunks: 'all',
+     },
+   },
  };
```

## Dynamic Imports
```diff
  project
- |- /src/another-module.js
```
### webpack.config.js
```diff
  module.exports = {
    entry: {
      ...
-     another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
+     chunkFilename: '[name].bundle.js',
      publicPath: 'dist/',
      path: path.resolve(__dirname, 'dist'),
    },
-   optimization: {
-     splitChunks: {
-       chunks: 'all',
-     },
-   },
  };
```

Now, instead of statically importing lodash, we'll use dynamic importing to separate a chunk:

### src/index.js
```diff
- import _ from 'lodash';
-
- function component() {
+ function getComponent() {
-   const element = document.createElement('div');
-
-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
+     const element = document.createElement('div');
+
+     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+     return element;
+
+   }).catch(error => 'An error occurred while loading the component');
  }

- document.body.appendChild(component());
+ getComponent().then(component => {
+   document.body.appendChild(component);
+ })
```

# Caching
## Output Filenames
### webpack.config.js
```diff
  module.exports = {
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
-       title: 'Output Management',
+       title: 'Caching',
      }),
    ],
    output: {
-     filename: 'bundle.js',
+     filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

## Extracting Boilerplate
Set runtimeChunk to 'single' to create a single runtime bundle for all chunks.
### webpack.config.js
```diff
  module.exports = {
    ...
+   optimization: {
+     runtimeChunk: 'single',
+   },
  };
```
Set runtimeChunk to 'cacheGroups' to extract third-party libraries.
### webpack.config.js
```diff
  module.exports = {
    ...
    optimization: {
      runtimeChunk: 'single',
+     splitChunks: {
+       cacheGroups: {
+         vendor: {
+           test: /[\\/]node_modules[\\/]/,
+           name: 'vendors',
+           chunks: 'all',
+         },
+       },
+     },
    },
  };
```

## Module Identifiers
```
project
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- print.js
|- /node_modules
```
### print.js
```js
export default function print(text) {
   console.log(text);
};
```
### src/index.js
```diff
+ import Print from './print';

  function component() {
    ...
+   element.onclick = Print.bind(null, 'Hello webpack!');
    ...
```
### webpack.config.js
```diff
  module.exports = {
    ...
    optimization: {
+     moduleIds: 'hashed',
    ...
```

# TypeScript

## Basic Setup
```shell
npm install --save-dev typescript ts-loader
```
```diff
  project
  |- package.json
+ |- tsconfig.json
  |- webpack.config.js
  |- /src
    |- index.js
+   |- index.ts
```
### tsconfig.json
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```
### webpack.config.js
```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

## Source Maps
### tsconfig.json
```diff
  {
    "compilerOptions": {
      ...
+     "sourceMap": true,
    }
  }
```
### webpack.config.js
```diff
  module.exports = {
+   devtool: 'inline-source-map',
    ...
  };
```

## Using Third Party Libraries
When installing third party libraries from __npm__, it is important to remember to install the typing definition for that library. These definitions can be found at [TypeSearch](https://microsoft.github.io/TypeSearch/).

For example if we want to install __lodash__ we can run the following command to get the typings for it:
```shell
npm install --save-dev @types/lodash
```

## Importing Other Assets
To use non-code assets with TypeScript, we need to defer the type for these imports. This requires a __custom.d.ts__ file which signifies custom definitions for TypeScript in our project. Let's set up a declaration for _.svg_ files:
### custom.d.ts
```ts
declare module "*.svg" {
  const content: any;
  export default content;
}
```
Here we declare a new module for SVGs by specifying any import that ends in _.svg_ and defining the module's content as any. We could be more explicit about it being a url by defining the type as string. The same concept applies to other assets including CSS, SCSS, JSON and more.
