const fs = require("fs");
const path = require("path");

// 获取配置或使用默认值
function getConfig() {
    const config = window.utools.dbStorage.getItem('sekiro-config') || {};
    return {
        backupRoot: config.backupRoot || '',  // 当前选中的备份根目录
        sourceDir: config.sourceDir || '',    // 当前选中的游戏存档目录
        backupLocations: config.backupLocations || [], // 保存所有添加的备份位置
        backupFolder: config.backupFolder || ''  // 全局备份文件夹路径
    };
}

// 添加新的备份位置
function addBackupLocation(name, backupPath, sourcePath) {
    const config = getConfig();
    if (!config.backupLocations) {
        config.backupLocations = [];
    }
    config.backupLocations.push({ 
        name, 
        path: backupPath,
        sourcePath: sourcePath
    });
    window.utools.dbStorage.setItem('sekiro-config', config);
}

// 添加删除备份位置的函数
function removeBackupLocation(name) {
    const config = getConfig();
    if (!config.backupLocations) return;

    // 找到要删除的位置的索引
    const index = config.backupLocations.findIndex(loc => loc.name === name);
    if (index === -1) return;

    // 如果删除的是当前选中的位置，清除当前选择
    if (config.backupRoot === config.backupLocations[index].path) {
        config.backupRoot = '';
        config.sourceDir = '';
    }

    // 从数组中删除
    config.backupLocations.splice(index, 1);
    window.utools.dbStorage.setItem('sekiro-config', config);
}

// 获取当前备份信息
function getCurrentBackupInfo() {
    const config = getConfig();
    const currentBackupLocation = config.backupLocations.find(
        loc => loc.path === config.backupRoot
    );
    return {
        name: currentBackupLocation ? currentBackupLocation.name : '未选择',
        path: config.backupRoot || '未设置',
        sourcePath: config.sourceDir || '未设置'
    };
}

// 添加设置备份文件夹的函数
function setBackupFolder(folderPath) {
    const config = getConfig();
    config.backupFolder = folderPath;
    window.utools.dbStorage.setItem('sekiro-config', config);
}

// 添加移除备份文件夹的函数
function removeBackupFolder() {
    const config = getConfig();
    config.backupFolder = '';
    window.utools.dbStorage.setItem('sekiro-config', config);
}

module.exports = {
    getConfig,
    addBackupLocation,
    removeBackupLocation,
    getCurrentBackupInfo,
    setBackupFolder,
    removeBackupFolder
}; 