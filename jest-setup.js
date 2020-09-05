import { shellRun } from "./src/utils"

export default async function globalSetup() {
  await shellRun("yarn build")
}
