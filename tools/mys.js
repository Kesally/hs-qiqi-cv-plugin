import fetch from 'node-fetch';
import fs from 'fs';
import yaml from 'js-yaml';

/*
 * 获取单个角色的对应 简述,内容,音频链接等
 * 将`API_URL`中的`entry_page_id`替换为想要获取的角色ID运行程序即可
 * 运行后会在当前目录下生成`角色名.yaml`文件，内容为角色的简述、内容、音频链接等
 * 本程序用于获取 `hs-qiqi-cv-plugin` 中的角色配音信息
 * By MapleLeaf
**/
const API_URL = 'https://api-takumi-static.mihoyo.com/hoyowiki/genshin/wapi/entry_page?app_sn=ys_obc&entry_page_id=501624&lang=zh-cn';

async function fetchAndProcessData() {
  try {
    const response = await fetch(API_URL);
    const jsonData = await response.json();

    const dataName = jsonData?.data?.page?.name || '原神';
    const pageName = jsonData?.page || 'page';
    const fileName = `${dataName}.yaml`;

    const modules = jsonData?.data?.[pageName]?.modules || [];

    let targetComponents = [];
    for (const module of modules) {
      if (module.name === "配音展示") {
        targetComponents = module.components || [];
        break;
      }
    }

    if (!Array.isArray(targetComponents) || targetComponents.length === 0) {
      throw new Error('未找到 name 为 "配音展示" 的组件数据');
    }

    // Set 去重
    const yamlData = {
      简述: new Set(),
      详细: new Set(),
      中文: [],
      英文: [],
      韩文: [],
      日文: [],
    };

    // 提取组件中的内容
    for (const component of targetComponents) {
      const componentData = JSON.parse(component.data || '{}');
      const voiceList = componentData?.list || [];

      for (const voice of voiceList) {
        const { tab_name, table } = voice;
        for (const entry of table || []) {
          const { name, content, audio_url } = entry;

          if (name) yamlData.简述.add(name);
          if (content) yamlData.详细.add(content);

          // 分类音频
          switch (tab_name) {
            case '汉语':
              yamlData.中文.push(audio_url);
              break;
            case '英语':
              yamlData.英文.push(audio_url);
              break;
            case '韩语':
              yamlData.韩文.push(audio_url);
              break;
            case '日语':
              yamlData.日文.push(audio_url);
              break;
            default:
              break;
          }
        }
      }
    }

    // 将 Set 转换为数组
    yamlData.简述 = Array.from(yamlData.简述);
    yamlData.详细 = Array.from(yamlData.详细);

    // 写入 YAML
    const yamlString = yaml.dump(yamlData, { lineWidth: -1 });
    fs.writeFileSync(fileName, yamlString, 'utf8');
    console.log(`数据已成功写入文件: ${fileName}`);
  } catch (error) {
    console.error('发生错误:', error.message);
  }
}

// 执行
fetchAndProcessData();
