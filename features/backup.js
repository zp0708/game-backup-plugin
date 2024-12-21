const fs = require("fs");
const path = require("path");
const configModule = require('./config');

function copyFolderRecursive(source, target) {
    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);

        if (fs.statSync(sourcePath).isDirectory()) {
            fs.mkdirSync(targetPath);
            copyFolderRecursive(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

// 确保目录存在，如果不存在则创建
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

module.exports = {
    feature: {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                const currentBackup = configModule.getCurrentBackupInfo();
                const now = new Date();
                const defaultName = now.getFullYear().toString() +
                    (now.getMonth() + 1).toString().padStart(2, "0") +
                    now.getDate().toString().padStart(2, "0") +
                    "_" +
                    now.getHours().toString().padStart(2, "0") +
                    now.getMinutes().toString().padStart(2, "0") +
                    now.getSeconds().toString().padStart(2, "0");

                callbackSetList([{
                    title: `${currentBackup.name}/${defaultName}`,
                    description: "按回车确认备份，或输入新的名称",
                    icon: "",
                    defaultName: defaultName
                }]);
            },
            search: (action, searchWord, callbackSetList) => {
                const currentBackup = configModule.getCurrentBackupInfo();
                const folderName = searchWord.trim() || action.payload;
                callbackSetList([{
                    title: `${currentBackup.name}/${folderName}`,
                    description: "按回车确认备份",
                    icon: "",
                    folderName: folderName
                }]);
            },
            select: async (action, itemData) => {
                try {
                    const config = configModule.getConfig();
                    const currentBackup = configModule.getCurrentBackupInfo();
                    
                    if (!config.sourceDir) {
                        throw new Error('请先选择要备份的文件夹');
                    }

                    const folderName = itemData.folderName || itemData.defaultName;
                    
                    // 确定备份目标目录
                    const baseDir = config.backupFolder || config.backupRoot;
                    if (!baseDir) {
                        throw new Error('请先设置备份位置');
                    }

                    // 确保必要的目录结构存在
                    ensureDir(baseDir);
                    // 如果是全局文件夹，添加备份名子目录
                    const backupNameDir = config.backupFolder ? path.join(baseDir, currentBackup.name) : baseDir;
                    ensureDir(backupNameDir);
                    const savedDir = path.join(backupNameDir, 'saved');
                    ensureDir(savedDir);
                    const deletedDir = path.join(backupNameDir, 'deleted');
                    ensureDir(deletedDir);

                    // 设置目标目录
                    const targetDir = path.join(savedDir, folderName);

                    if (!fs.existsSync(config.sourceDir)) {
                        throw new Error('要备份的文件夹不存在');
                    }

                    if (fs.existsSync(targetDir)) {
                        window.utools.showNotification("备份文件夹已存在，请使用其他名称");
                        return;
                    }

                    // 创建备份
                    fs.mkdirSync(targetDir);
                    copyFolderRecursive(config.sourceDir, targetDir);
                    
                    window.utools.showNotification("存档备份成功：" + folderName);
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification("备份失败：" + error.message);
                }
            }
        }
    }
}; 