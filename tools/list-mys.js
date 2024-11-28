import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url'

/*
 * 脚本功能：根据角色ID列表，从API获取角色信息，并生成对应的YAML文件
 * 使用方法：在命令行中运行 `node list-mys.js` 即可
 * 注意事项：需要安装 `node-fetch`、`fs`、`path`、`js-yaml` 模块
 * 本程序用于获取 `hs-qiqi-cv-plugin` 中的角色配音信息
 * 返回,生成`data`文件夹,按照角色名称生成对应的YAML文件
 * By MapleLeaf
**/


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_URL = `https://api-takumi-static.mihoyo.com/hoyowiki/genshin/wapi/entry_page?app_sn=ys_obc&entry_page_id={entry_page_id}&lang=zh-cn`
const ID = '角色对应ID.yaml';

function readRoleIdsFromYAML(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContent);
    const entryIds = Object.values(data).map(value => value); // 提取所有的ID
    return entryIds;
  } catch (error) {
    console.error('读取 YAML 文件出错:', error.message);
    return [];
  }
}

async function fetchAndGenerateYAML(entry_page_id) {
  const url = API_URL.replace("{entry_page_id}", entry_page_id);
  try {
    const response = await fetch(url);
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

    // 去重
    const yamlData = {
      简述: new Set(),
      详细: new Set(),
      中文: [],
      英文: [],
      韩文: [],
      日文: [],
    };

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

    yamlData.简述 = Array.from(yamlData.简述);
    yamlData.详细 = Array.from(yamlData.详细);

    // 创建 data 文件夹（如果不存在）
    const dirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // 写入 YAML 文件
    const yamlString = yaml.dump(yamlData, { lineWidth: -1 });
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, yamlString, 'utf8');
    console.log(`数据已成功写入文件: ${filePath}`);
  } catch (error) {
    console.error('发生错误:', error.message);
  }
}

async function generateYAMLForMultipleEntries(entry_ids) {
  for (const entry_id of entry_ids) {
    await fetchAndGenerateYAML(entry_id);
  }
}

console.log('__dirname', __dirname);
console.log('ID', ID);
const roleIdFilePath = path.join(__dirname,ID);
console.log('path.join', roleIdFilePath);


// 从文件中获取所有角色的 ID
const entry_ids = readRoleIdsFromYAML(roleIdFilePath);

// 生成 YAML 文件
if (entry_ids.length > 0) {
  generateYAMLForMultipleEntries(entry_ids);
} else {
  console.error('没有找到有效的角色 ID');
}
