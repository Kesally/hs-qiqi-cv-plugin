const Path = process.cwd();
const Plugin_Name = 'hs-qiqi-plugin'
const Plugin_Path = `${Path}/plugins/${Plugin_Name}`;
import Version from './Version.js'
import Data from './Data.js'
import Common from './Common.js'
import Config from './Config.js'
import render from './common-lib/render.js';
export {render, Common, Config, Data, Version, Path, Plugin_Name, Plugin_Path}