# snowpack-plugin-rollup-bundle

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
