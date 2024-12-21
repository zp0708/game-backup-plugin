const fs = require("fs");
const path = require("path");
const configModule = require('./config');

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

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

                    const backupNameDir = config.backupFolder ? path.join(baseDir, currentBackup.name) : baseDir;
                    const deletedDir = path.join(backupNameDir, 'deleted');

                    if (fs.existsSync(deletedDir)) {
                        deleteFolderRecursive(deletedDir);
                        fs.mkdirSync(deletedDir);
                        window.utools.showNotification("已清空删除文件夹");
                    } else {
                        window.utools.showNotification("删除文件夹不存在");
                    }
                    
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification("清空失败：" + error.message);
                }
            }
        }
    }
}; 