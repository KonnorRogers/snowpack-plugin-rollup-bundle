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
cd ../../examples/snowpacker
yarn install
yarn link snowpack-plugin-rollup-bundle
yarn snowpack build
```

Then check out the `build/`directory.

### Expected output

```bash
src/snowpacker/
  assets/
  stylesheets/
  entrypoints/
  javascript/
```

Becomes:

```bash
build/
  snowpacks/
    entrypoint1.hash.js
    entrypoint2.hash.js
    css/
      stylesheet1.hash.css
      stylesheet2.hash.css
    assets/
      asset1.hash.png
      asset2.hash.jpg
```

## Testing

```bash
git clone https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle/tree/development/
cd snowpack-plugin-rollup-bundle
yarn install
yarn test
```
