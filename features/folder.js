const fs = require("fs");
const path = require("path");
const configModule = require('./config');

module.exports = {
    feature: {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                callbackSetList([{
                    title: "backup",
                    description: "按回车确认文件夹名称，或输入新的名称",
                    icon: "logo.png",
                    name: "backup"
                }]);
            },
            search: (action, searchWord, callbackSetList) => {
                const name = searchWord.trim();
                callbackSetList([{
                    title: name || "backup",
                    description: "按回车确认文件夹名称",
                    icon: "logo.png",
                    name: name || "backup"
                }]);
            },
            select: async (action, itemData) => {
                const folderName = itemData.name;

                // 选择要备份的文件夹
                const appDataPath = path.join(process.env.USERPROFILE, 'AppData');
                const result = await window.utools.showOpenDialog({
                    title: '选择备份根目录',
                    defaultPath: appDataPath,
                    properties: ['openDirectory']
                });

                if (!result || !result.length) return;
                const selectedPath = result[0];
                
                try {
                    const backupDir = path.join(selectedPath, folderName);
                    
                    // 创建备份文件夹
                    if (!fs.existsSync(backupDir)) {
                        fs.mkdirSync(backupDir, { recursive: true });
                    }

                    // 保存到配置
                    configModule.setBackupFolder(backupDir);

                    window.utools.showNotification('备份文件夹已设置');
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification('设置备份文件夹失败：' + error.message);
                }
            }
        }
    }
}; 