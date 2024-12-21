const fs = require("fs");
const path = require("path");
const configModule = require('./config');

function copyFolderRecursive(source, target) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        if (fs.statSync(sourcePath).isDirectory()) {
            fs.mkdirSync(targetPath, { recursive: true });
            copyFolderRecursive(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

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
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                try {
                    const config = configModule.getConfig();
                    const currentBackup = configModule.getCurrentBackupInfo();
                    
                    const baseDir = config.backupFolder || config.backupRoot;
                    if (!baseDir) {
                        callbackSetList([{
                            title: "未选择备份位置",
                            description: "请先设置备份位置",
                            icon: "logo.png"
                        }]);
                        return;
                    }

                    const backupNameDir = config.backupFolder ? path.join(baseDir, currentBackup.name) : baseDir;
                    const savedDir = path.join(backupNameDir, 'saved');

                    if (!fs.existsSync(savedDir)) {
                        callbackSetList([{
                            title: "没有找到备份文件夹",
                            description: savedDir,
                            icon: "logo.png"
                        }]);
                        return;
                    }

                    const folders = fs.readdirSync(savedDir)
                        .filter(item => fs.statSync(path.join(savedDir, item)).isDirectory())
                        .map(folder => {
                            const folderPath = path.join(savedDir, folder);
                            return {
                                title: `${currentBackup.name}/${folder}`,
                                description: `${new Date(fs.statSync(folderPath).mtime).toLocaleString()} - 点击使用此存档`,
                                icon: "logo.png",
                                folder: folder,
                                time: fs.statSync(folderPath).mtime.getTime()
                            };
                        })
                        .sort((a, b) => b.time - a.time);

                    if (folders.length === 0) {
                        callbackSetList([{
                            title: "没有找到任何备份存档",
                            description: savedDir,
                            icon: "logo.png"
                        }]);
                        return;
                    }

                    callbackSetList(folders);
                } catch (error) {
                    console.error('获取备份列表失败:', error);
                    callbackSetList([{
                        title: "获取备份列表失败",
                        description: error.message,
                        icon: "logo.png"
                    }]);
                }
            },
            select: async (action, itemData) => {
                if (!itemData.folder) return;

                try {
                    const config = configModule.getConfig();
                    const currentBackup = configModule.getCurrentBackupInfo();
                    const baseDir = config.backupFolder || config.backupRoot;
                    const backupNameDir = config.backupFolder ? path.join(baseDir, currentBackup.name) : baseDir;
                    const sourceDir = path.join(backupNameDir, 'saved', itemData.folder);
                    const targetDir = config.sourceDir;

                    if (!fs.existsSync(sourceDir)) {
                        throw new Error('备份文件夹不存在');
                    }

                    if (fs.existsSync(targetDir)) {
                        // 删除目标目录中的所有内容
                        fs.readdirSync(targetDir).forEach(file => {
                            const curPath = path.join(targetDir, file);
                            if (fs.statSync(curPath).isDirectory()) {
                                deleteFolderRecursive(curPath);
                            } else {
                                fs.unlinkSync(curPath);
                            }
                        });
                    } else {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }

                    // 复制备份到目标目录
                    copyFolderRecursive(sourceDir, targetDir);
                    window.utools.showNotification("存档已恢复");
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification("恢复失败：" + error.message);
                }
            }
        }
    }
}; 