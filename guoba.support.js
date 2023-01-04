import path from 'path'
import lodash from 'lodash'
import { Config } from './components/index.js'
import YamlReader from './model/YamlReader.js'
/**
 *  支持锅巴
 *  锅巴插件：https://gitee.com/guoba-yunzai/guoba-plugin.git
 *  组件类型，可参考 https://vvbin.cn/doc-next/components/introduction.html
 *  https://antdv.com/components/overview-cn/
 */
const Path = process.cwd();
const Plugin_Name = 'hs-qiqi-plugin'
const Plugin_Path = `${Path}/plugins/${Plugin_Name}`;
export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'hs-qiqi-plugin',
      title: '枫叶插件',
      author: '@Kesally @huasheng @qiqi',
      authorLink: 'https://gitee.com/kesally',
      link: 'https://gitee.com/kesally/hs-qiqi-cv-plugin',
      isV3: true,
      isV2: false,
      description: '枫叶是Yunzai-Bot的扩展插件，可能提供有用或者没用的功能(?)',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      // icon: 'emojione-monotone:baby-chick',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      // iconColor: '#ffff99',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: `${Plugin_Path}/resources/img/tb.png`,
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          field: 'laheici',
          label: '拉黑词',
          bottomHelpMessage: '是否开启群拉黑词功能',
          component: 'Switch',
        },
        {
          field: 'cyc',
          label: '戳一戳',
          bottomHelpMessage: '是否开启戳一戳功能',
          component: 'Switch',
        },
        {
          field: 'dz',
          label: '丁真.蔡徐坤表情包功能',
          bottomHelpMessage: '是否开启丁真.蔡徐坤表情包功能',
          component: 'Switch',
        },
        {
          field: 'smsj',
          label: '睡眠时间',
          bottomHelpMessage: '是否开启计算睡眠时间功能',
          component: 'Switch',
        },
        {
          field: 'szzd',
          label: '数字炸弹',
          bottomHelpMessage: '是否开启数字炸弹游戏',
          component: 'Switch',
        },
        {
          field: 'jryq',
          label: '随机类游戏',
          bottomHelpMessage: '是否开启随机类游戏',
          component: 'Switch',
        },
        {
          field: 'ss',
          label: '涩涩',
          bottomHelpMessage: '是否开启涩涩功能',
          component: 'Switch',
        },
        {
          field: 'openai',
          label: 'OpenAi功能',
          bottomHelpMessage: '是否开启OpenAi功能',
          component: 'Switch',
        }
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData() {
        return Config.Yaml
      },

      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData(data, { Result }) {

        let keys = Object.keys(data);

        //写入
        keys.forEach(key => {
          let path = `${Plugin_Path}/config/set.pz.yaml`
          new YamlReader(path).set(key, data[key])
        });

        return Result.ok({}, '保存成功喽~')
      },
    },
  }
}
