const fs = require("fs");
const path = require("path");
const configModule = require('./features/config');
const backupModule = require('./features/backup');
const selectModule = require('./features/select');
const addModule = require('./features/add');
const openModule = require('./features/open');
const removeModule = require('./features/remove');
const useModule = require('./features/use');
const deleteModule = require('./features/delete');
const deleteClearModule = require('./features/delete-clear');
const folderModule = require('./features/folder');
const folderRemoveModule = require('./features/folder-remove');

window.exports = {
    "backup": backupModule.feature,
    "bu-select": selectModule.feature,
    "bu-add": addModule.feature,
    "bu-open": openModule.feature,
    "bu-remove": removeModule.feature,
    "bu-use": useModule.feature,
    "bu-delete": deleteModule.feature,
    "bu-delete-clear": deleteClearModule.feature,
    "bu-folder": folderModule.feature,
    "bu-folder-remove": folderRemoveModule.feature
};