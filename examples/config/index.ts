// @ts-nocheck
import deepmerge from "deepmerge"
import customConfig from "./config"
import { setting } from "./default"

const config = deepmerge(setting, customConfig)

export { config }
export default config
