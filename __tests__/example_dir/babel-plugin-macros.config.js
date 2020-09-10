// module.exports = {
//   importAll: {
//     transformModulePath(modulePath, importingPath) {
//       const projectRoot = path.join(__dirname, "../../")
//       const modulePathWithoutExt = modulePath.replace(/\.js$/, '')
//       const absolutePath = path.resolve(
//         path.dirname(importingPath),
//         modulePathWithoutExt,
//       )

//       const pathRelativeToRoot = path.relative(projectRoot, absolutePath)
//       return pathRelativeToRoot
//     }
//   }
// }
