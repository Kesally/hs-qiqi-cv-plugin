import fetch from 'node-fetch';
import fs from 'fs';
import yaml from 'js-yaml';

/*
 * 获取米游社全部原神角色ID
 * 运行后会在当前目录下生成`角色对应ID.yaml`文件，内容为角色:ID的键值对
 * 本程序用于获取 `hs-qiqi-cv-plugin` 中的角色配音信息
 * By MapleLeaf
**/

const API_URL = 'https://api-takumi-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list?app_sn=ys_obc&channel_id=25';

async function fetchAndWriteToYaml() {
  try {
    const response = await fetch(API_URL);
    const jsonData = await response.json();

    if (jsonData.retcode !== 0) {
      throw new Error('接口返回错误');
    }

    const list = jsonData?.data?.list?.[0]?.list || [];
    if (list.length === 0) {
      throw new Error('未找到有效的列表数据');
    }

    const yamlData = {};

    // 遍历列表并提取 title 和 content_id
    for (const item of list) {
      const { title, content_id } = item;
      if (title && content_id) {
        yamlData[title] = content_id;
      }
    }

    if (Object.keys(yamlData).length === 0) {
      throw new Error('没有提取到有效的标题和内容 ID');
    }

    // 写入 YAML
    const fileName = '角色对应ID.yaml';
    const yamlString = yaml.dump(yamlData, { lineWidth: -1 });
    fs.writeFileSync(fileName, yamlString, 'utf8');
    console.log(`数据已成功写入文件: ${fileName}`);
  } catch (error) {
    console.error('发生错误:', error.message);
  }
}

// 执行
fetchAndWriteToYaml();
