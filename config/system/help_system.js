/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 
* */

export const helpCfg = {
  title: '枫叶帮助',
  subTitle: '[枫叶插件] Yunzai-Bot&hs-qiqi-Plugin',
  columnCount: 4,
  colWidth: 300,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 0,
    headerBgColor: 'rgba(255, 222, 142, 0.44)',
    rowBgColor1: 'rgba(255, 166, 99, 0.23)',
    rowBgColor2: 'rgba(251, 113, 107, 0.35)'
  }
}

export const helpList = [{
  "group": "功能类",
  "list": [{
    "icon": 1,
    "title": "绑定", "desc": "在群里，直接通过群名片绑定"
  },
   {
    "icon": 5,
    "title": "拉黑词帮助", "desc": "触发拉黑词，就通知主人"
  },  {
    "icon": 3,
    "title": "早安|晚安", "desc": "记录睡眠时间"
  },
 {
    "icon": 8,
    "title": "我第几(睡觉|起床)", "desc": "查看记录的排名"
 },{
    "icon": 16,
    "title": "全部抽卡记录", "desc": "简单地调用云崽，出3张图"
 },{
    "icon": 33,
    "title": "拼接＋[视频链接]", "desc": "解析爱奇艺、芒果、优酷、哔哩的视频链接，腾讯视频的链接不用‘拼接’二字，自动解析，告别VIP"
 },{
    "icon": 9,
    "title": "ai回复概率+[数字]", "desc": "默认100%,改成0就是关闭ai"
  },{
    "icon": 15,
     "title": "(开启|关闭)ai全局模式", "desc": "全局模式，ai会接收群聊所有消息"
   },{
    "icon": 18,
     "title": "(开启|关闭)ai概率语音", "desc": "让ai的回复有概率为小爱语音回复"
   },{
     "icon":35,
     "title":"戳一戳","desc":"使用前请在枫叶设置打开,戳机器人发送本地语音等"
   },
  {
     "icon":65,
     "title":"几点了","desc":"查看现在时间，没用的功能+1"
 },{
     "icon":75,
     "title":"今日新闻","desc":"api获取今日新闻"
  }
  ]
},



{
"group": "娱乐类",
  "list":  [ {
    "icon": 7,
    "title": "丁真帮助", "desc": "芝士雪豹 鲲鲲"
  }, {
    "icon": 12,
     "title": "涩涩|枫叶涩涩帮助|涩图撤回时间", "desc": "r18建议关闭,默认关闭，关闭后只听主人的命令"
   },{
    "icon": 2,
    "title": "数字炸弹", "desc": "命令后缀可加：中级|高级|地狱|炼狱"
  },
 {
    "icon": 26,
    "title": "结束数字炸弹", "desc": "不想玩了，可结束命令"
  },
  {
    "icon": 21,
    "title": "(关闭|开启)数字炸弹涩涩", "desc": "最后是否奖励图片，默认开启"
  },
   {"icon":56,
     "title":"ai","desc":"与openai对话，命令前缀为ai，私人key，额度可能会不足，key可更改"
   },
  {
    "icon": 55,
    "title": "#填写", "desc": "填写openai密钥"
    },
 {
    "icon": 47,
    "title": "青年大学习", "desc": "返回本期青年大学习完成截图，大学生以假乱真的神器"
    },
  {
    "icon": 38,
    "title": "#这周讨伐谁", "desc": "让机器人来选择你该讨伐谁吧！"
    }
  ]
},



{"group": "原神语音命令",
  "list":  [ {
    "icon": 8,
    "title": "xx语音", "desc": "支持中文，英语，韩语，日语，如:丽莎日语语音"
  }, {
    "icon": 14,
     "title": "高清语音(开启|关闭)", "desc": "pc端听不了高清语音，看情况开启哟"
   },{
    "icon": 16,
    "title": "xx语音列表", "desc": "xx角色的全部语音,回复:序号，不加类型默认中文"
  }
  ]
},


{
"group": "随机类游戏",
  "list":  [ {
    "icon": 10,
     "title": "今日运气", "desc": "看看今天运气怎么样"
   },{
     "icon": 9,
    "title": "娶群主", "desc": "发送娶群主使用"
  },{
      "icon":15,
      "title":"群友老婆|老公","desc":"查看群友老婆|老公"
  },{
     "icon": 4,
     "title": "开奖", "desc": "发送:开奖,抽奖游戏"
  }
  ]
},




{
"group": "管理员功能",
  "auth": "master",
  "list":  [{
    "icon": 26,
    "title": "只听我的|听大家的", "desc": "管理Bot对群消息的处理"
  },{
    "icon": 11,
    "title": "枫叶设置", "desc": "管理枫叶插件"
  },{
      "icon":13,
      "title":"枫叶更新","desc":"更新枫叶插件"
  },{
      "icon":14,
      "title":"枫叶强制更新","desc":"强制更新枫叶插件"
  },{
      "icon":19,
      "title":"枫叶(开启/关闭)全部设置","desc":"开启/关闭全部设置"
  },
 {
      "icon":40,
      "title":"闭嘴@群员","desc":"让某位不听话的群员闭嘴"
  },
   {
      "icon":39,
      "title":"放开@群员","desc":"不听话的群员听话后可将其解除禁言"
  }
  ]

}]

export const isSys = true
