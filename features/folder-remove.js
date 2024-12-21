const configModule = require('./config');

module.exports = {
    feature: {
        mode: "none",
        args: {
            enter: (action) => {
                try {
                    const config = configModule.getConfig();
                    if (!config.backupFolder) {
                        window.utools.showNotification('未设置备份文件夹');
                        return;
                    }

                    configModule.removeBackupFolder();
                    window.utools.showNotification('备份文件夹已移除');
                    window.utools.hideMainWindow();
                    window.utools.outPlugin();
                } catch (error) {
                    window.utools.showNotification('移除备份文件夹失败：' + error.message);
                }
            }
        }
    }
}; 