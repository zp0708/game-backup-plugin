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

                // 显示所有可删除的备份位置
                const items = backupLocations.map(location => ({
                    title: location.path === config.backupRoot ? 
                        `删除: ${location.name} (当前使用)` : 
                        `删除: ${location.name}`,
                    description: location.sourcePath,
                    icon: "logo.png",
                    location: location
                }));

                callbackSetList(items);
            },
            select: (action, itemData) => {
                if (!itemData.location) return;

                try {
                    configModule.removeBackupLocation(itemData.location.name);
                    window.utools.showNotification(`已删除备份位置: ${itemData.location.name}`);
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification("删除失败：" + error.message);
                }
            }
        }
    }
}; 