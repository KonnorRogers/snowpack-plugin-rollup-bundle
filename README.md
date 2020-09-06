# snowpack-plugin-rollup-bundle

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
cd pkg/dist-node
yarn link
```

### Using in example directory

```bash
cd __tests__/example_dir
yarn install
yarn link snowpack-plugin-rollup-bundle
yarn snowpack build
```

Then check out the `build/`directory.

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
