import fs from "fs"
import YAML from "yaml"

class Yaml {
  // 读
  getread(path) {
    try {
      const file = fs.readFileSync(path, "utf8")
      return YAML.parse(file)
    } catch (e) {
      console.error(e)
      return false
    }
  }

  getwrite(path, data) {
    try {
      const 数据 = YAML.stringify(data)
      fs.writeFileSync(path, 数据, "utf8")
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

export default new Yaml()
