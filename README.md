# snowpack-plugin-rollup-bundle

A snowpack plugin to build your files for production using Rollup.

This plugin was developed as a way of integrating Snowpack with Rails.
I'm more than happy to support any issues you may have. Currently, this
package was built with my gem called `Snowpacker` in mind. Feel free to
file issues, submit PR's, etc.

## Usage

```bash
yarn add snowpack-plugin-rollup-bundle [--dev]
# OR
npm install snowpack-plugin-rollup-bundle [--save-dev]
```

```js
// snowpack.config.js

const plugins = [
  // ...
  [
    "snowpack-plugin-rollup-bundle",
    {
      emitHtmlFiles: boolean,
      preserveSourceFiles: boolean,

      // equivalent to inputOptions.input from Rollup
      entrypoints: string | string [] | { [entryName: string]: string }

      extendConfig: (config) => {
        // https://rollupjs.org/guide/en/#outputoptions-object
        config.outputOptions = { ... }

        // https://rollupjs.org/guide/en/#outputoptions-object
        config.inputOptions = { ... }

        return config
      }
    }
  ]
]

module.exports = {
  plugins: plugins
}
```

### Plugin Options

#### `emitHtmlFiles`

`type: boolean`

`default: false`

If your source directory contains HTML files, this will rewrite your
script tags. This will not rewrite stylesheet tags (this actually
injects stylesheets into your head) and will not rewrite asset paths.

#### `preserveSourceFiles`

`type: boolean`

`default: false`

This is meant as a debugging tool. This will put the original build
files from Snowpack into a `_source_` directory.

#### `entrypoints`

`type: string | string [] | { [entryName: string]: string }`

`this is required`

arrays and objects will be parsed normally.

A string will be passed as a parameter to glob.sync()

[https://github.com/isaacs/node-glob](https://github.com/isaacs/node-glob)
for more info on glob

#### `extendConfig`

`type: function(): object | object`


## Requirements

- Node >= 10

## What it does

This plugin will bundle your specified `entrypoints` for production.
Each entrypoint has a corresponding css file. This plugin will also
generate a top level `manifest.json` file with the locations of all your
hashed files. Heres how a typical project would get bundled:

### input

```bash
src/
  assets/
  stylesheets/
  entrypoints/
    entrypoint1.js
    entrypoint2.js
  javascript/
  web_modules/
    |- react
```

### output

```bash
build/
  chunks/
    react-hash.chunk.js

  entrypoints/
    entrypoint1-hash.js
    entrypoint2-hash.js

  css/
    # 1 css file per entrypoint
    entrypoint1-hash.css
    entrypoint2-hash.css

  assets/
    asset1-hash.png
    asset2-hash.jpg

  manifest.json # A manifest of all file locations
```

Note: CSS files with correspond with an entrypoint file and will not
maintain your naming from a stylesheets directory.

## Developing locally

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle
cd snowpack-plugin-rollup-bundle
yarn install
yarn build
```


### Using in example directory

```bash
cd __tests__/example_dir
yarn install
yarn snowpack build
```

Then you must manually copy the HTML file from the `src/` directory
and then fix the entrypoint route to the hashed version. You must
also add in the generated CSS file.

Then you can run:

```bash
yarn servor build
```

Then navigate to `localhost:8080` to see the final build.

## Testing

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle/tree/development/
cd snowpack-plugin-rollup-bundle
yarn install
yarn test
```

You can then view the generated build in the `__tests__/example_dir/build` directory.

### Using docker

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle/tree/development/
cd snowpack-plugin-rollup-bundle
source docker.env

docker-compose up --build

# OR

docker-compose run --rm web bash -c "yarn build && yarn test"
```



## Roadmap

- [x] Change hashing from `x.hash.ext` to `x-hash.ext`

- [x] Cypress testing to ensure build and dev work the same

- [x] Support emitting HTML files with proper `<script>` and `<link
rel="stylesheet">` tags.
