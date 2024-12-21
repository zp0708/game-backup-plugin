const fs = require("fs");
const path = require("path");
const configModule = require('./config');

module.exports = {
    feature: {
        mode: "none",
        args: {
            enter: (action) => {
                try {
                    const config = configModule.getConfig();
                    const currentBackup = configModule.getCurrentBackupInfo();
                    
                    const baseDir = config.backupFolder || config.backupRoot;
                    if (!baseDir) {
                        window.utools.showNotification('请先设置备份位置');
                        return;
                    }

                    const openDir = config.backupFolder ? 
                        path.join(baseDir, currentBackup.name) : 
                        baseDir;
                    
                    window.utools.shellOpenPath(openDir);
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification("打开备份文件夹失败：" + error.message);
                }
            }
        }
    }
}; 