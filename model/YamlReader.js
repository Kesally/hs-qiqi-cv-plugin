import fs from "fs"
import YAML from "yaml"
import lodash from "lodash"
import chokidar from "chokidar"

export default class YamlReader {
  /**
   * 读写yaml文件
   * @param yamlPath yaml文件绝对路径
   * @param isWatch 是否监听文件变化
   */
  constructor(yamlPath, isWatch = false) {
    this.yamlPath = yamlPath
    this.isWatch = isWatch
    this.initYaml()
  }

  initYaml() {
    // parseDocument 将会保留注释
    this.document = YAML.parseDocument(fs.readFileSync(this.yamlPath, "utf8"))
    if (this.isWatch && !this.watcher) {
      this.watcher = chokidar.watch(this.yamlPath).on("change", () => {
        if (this.isSave) {
          this.isSave = false
          return
        }
        this.initYaml()
      })
    }
  }

  /** 返回读取的对象 */
  get jsonData() {
    if (!this.document) {
      return null
    }
    return this.document.toJSON()
  }

  /* 检查集合是否包含key的值 */
  has(keyPath) {
    return this.document.hasIn(keyPath.split("."))
  }

  /* 返回key的值 */
  get(keyPath) {
    return lodash.get(this.jsonData, keyPath)
  }

  /* 修改某个key的值 */
  set(keyPath, value) {
    this.document.setIn(keyPath.split("."), value)
    this.save()
  }

  /* 删除key */
  delete(keyPath) {
    this.document.deleteIn(keyPath.split("."))
    this.save()
  }

  // 数组添加数据
  addIn(keyPath, value) {
    this.document.addIn(keyPath.split("."), value)
    this.save()
  }

  /**
   * 设置 document 的数据（递归式）
   * @param data 要写入的数据
   */
  setData(data) {
    this.setDataRecursion(data, [])
    this.save()
  }

  setDataRecursion(data, parentKeys) {
    if (Array.isArray(data)) {
      this.document.setIn(parentKeys, data)
    } else if (typeof data === "object" && data !== null) {
      for (const [ key, value ] of Object.entries(data)) {
        this.setDataRecursion(value, parentKeys.concat([ key ]))
      }
    } else {
      parentKeys = this.mapParentKeys(parentKeys)
      this.document.setIn(parentKeys, data)
    }
  }

  // 将数字key转为number类型，防止出现引号
  mapParentKeys(parentKeys) {
    return parentKeys.map((k) => {
      if (!isNaN(k)) {
        return Number.parseInt(k)
      }
      return k
    })
  }

  // 彻底删除某个key
  deleteKey(keyPath) {
    let keys = keyPath.split(".")
    keys = this.mapParentKeys(keys)
    this.document.deleteIn(keys)
    this.save()
  }

  save() {
    this.isSave = true
    let yaml = this.document.toString()
    fs.writeFileSync(this.yamlPath, yaml, "utf8")
  }
}
