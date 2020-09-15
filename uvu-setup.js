import { shellRun } from "./src/utils"

const { status } = shellRun("yarn install && yarn build")

if (status) throw "Unable to build your package."


