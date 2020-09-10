# snowpack-plugin-rollup-bundle

A snowpack plugin to build your files for production using Rollup.

## Issues

Currently, this only generates build files but will not rewrite your
HTML scripts. If you would like to see this feature, I would be happy to
add it. For now, this project is purely for the use of Snowpacker.

## Developing locally

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle/tree/development/
cd snowpack-plugin-rollup-bundle
yarn install
yarn build
```

### Using in example directory

```bash
cd __tests__/example_dir
yarn install
yarn snowpack build
yarn servor build
```

Then navigate to `localhost:8080` to see the final build.

### Expected input

```bash
src/
  assets/
  stylesheets/
  entrypoints/
    entrypoint1.js
    entrypoint2.js
  javascript/
```

### Expected output

```bash
build/
  chunks/
    chunk1.hash.js
  entrypoints/
    entrypoint1.hash.js
    entrypoint2.hash.js
  css/
    entrypoint1.hash.css
    entrypoint2.hash.css
  assets/
    asset1.hash.png
    asset2.hash.jpg
```

Note: CSS files with correspond with an entrypoint file and will not maintain your naming from a stylesheets directory.
## Testing

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle/tree/development/
cd snowpack-plugin-rollup-bundle
yarn install
yarn test
```

You can then view the generated build in the `__tests__/example_dir/build` directory.
