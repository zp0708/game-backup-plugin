const fs = require("fs");
const path = require("path");
const configModule = require('./config');

module.exports = {
    feature: {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                callbackSetList([{
                    title: "添加新的备份位置",
                    description: "请输入备份名称，回车后选择要备份的文件夹",
                    icon: "logo.png"
                }]);
            },
            search: (action, searchWord, callbackSetList) => {
                const name = searchWord.trim();
                if (!name) {
                    callbackSetList([{
                        title: "请输入备份名称",
                        description: "输入名称后按回车继续",
                        icon: "logo.png"
                    }]);
                    return;
                }

                callbackSetList([{
                    title: name,
                    description: "按回车选择要备份的文件夹",
                    icon: "logo.png",
                    name: name
                }]);
            },
            select: async (action, itemData) => {
                if (!itemData.name) return;

                // 选择要备份的文件夹
                const appDataPath = path.join(process.env.USERPROFILE, 'AppData');
                const sourceResult = await window.utools.showOpenDialog({
                    title: '选择要备份的文件夹',
                    defaultPath: appDataPath,
                    properties: ['openDirectory']
                });

                if (!sourceResult || !sourceResult.length) return;
                const sourcePath = sourceResult[0];
                const parentDir = path.dirname(sourcePath);
                
                try {
                    const backupDir = path.join(parentDir, itemData.name);
                    
                    // 检查文件夹是否已存在
                    if (fs.existsSync(backupDir)) {
                        window.utools.showNotification('该备份名称在选择的位置已存在');
                        return;
                    }

                    // 创建主文件夹
                    fs.mkdirSync(backupDir);

                    // 创建子文件夹
                    const subDirs = ['saved', 'deleted'];
                    for (const dir of subDirs) {
                        fs.mkdirSync(path.join(backupDir, dir));
                    }

                    // 保存到数据库，包含源文件夹路径
                    configModule.addBackupLocation(itemData.name, backupDir, sourcePath);

                    window.utools.showNotification('备份位置创建成功');
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification('创建备份失败：' + error.message);
                }
            }
        }
    }
}; 