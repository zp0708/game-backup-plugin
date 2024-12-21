const fs = require("fs");
const path = require("path");
const configModule = require('./config');

module.exports = {
    feature: {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                const config = configModule.getConfig();
                const backupLocations = config.backupLocations || [];
                
                if (backupLocations.length === 0) {
                    callbackSetList([{
                        title: "没有找到备份位置",
                        description: "请先使用 bu-add 添加备份位置",
                        icon: "logo.png"
                    }]);
                    return;
                }

                // 添加所有备份位置
                const items = backupLocations.map(location => {
                    const isSelected = location.path === config.backupRoot;
                    const isGlobalFolder = config.backupFolder && config.backupFolder === location.path;
                    let title = location.name;
                    if (isSelected) title += ' (已选择)';
                    if (isGlobalFolder) title += ' [全局备份文件夹]';

                    return {
                        title: title,
                        description: location.sourcePath,
                        icon: "logo.png",
                        location: location
                    };
                });

                callbackSetList(items);
            },
            select: async (action, itemData) => {
                if (!itemData.location) return;

                const config = configModule.getConfig();
                config.backupRoot = itemData.location.path;
                config.sourceDir = itemData.location.sourcePath;
                
                window.utools.dbStorage.setItem('sekiro-config', config);
                window.utools.showNotification("备份位置已设置");
                window.utools.hideMainWindow();
                window.utools.outPlugin();
            }
        }
    }
}; 