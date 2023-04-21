import fs from 'node:fs'
import Ver from './components/Version.js'
import chalk from 'chalk'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

try {
  global.uploadRecord = (await import("./model/uploadRecord.js")).default
} catch (err) {
  global.uploadRecord = segment.record
}

const files = fs.readdirSync('./plugins/hs-qiqi-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

logger.info(chalk.cyan('-----------(∗❛ั∀❛ั∗)✧*。--------------'))
logger.info(`~\t${chalk.yellow(`欢迎使用枫叶插件${Ver.ver}`)}\t~`)
logger.info(`~\t${chalk.green('原作者->')}${'  '}${chalk.cyan('kesally&七七(2770706493)')}\t`)
logger.info(`~\t${chalk.green('枫叶群')}${'  '}${chalk.underline('779217677')}\t~`)
logger.info(`~\t${chalk.green('我们的频道')}${'  '}${chalk.underline('https://pd.qq.com/s/13ptnp2ew')}\t~`)
logger.info(`~\t${chalk.green('ikun群')}${'  '}${chalk.underline('707499227')}\t~`)
logger.info(chalk.magenta('------------------------------------'))


files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
    let name = files[i].replace('.js', '')

    if (ret[i].status != 'fulfilled') {
        logger.error(`载入插件错误：${logger.red(name)}`)
        logger.error(ret[i].reason)
        continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
