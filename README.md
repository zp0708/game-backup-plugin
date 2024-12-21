# Game Backup Save Manager

一个用于管理游戏存档备份的 uTools 插件。支持多个游戏存档的管理，可以创建、恢复、删除备份，并支持全局备份文件夹。

## 命令说明

### 基础配置命令

#### bu-add
- 功能：添加新的备份位置
- 用法：
  1. 输入备份名称（如：只狼、黑魂3等）
  2. 选择要备份的游戏存档文件夹
  3. 插件会自动在存档文件夹的同级目录创建备份文件夹

#### bu-select
- 功能：选择当前要使用的备份位置
- 用法：
  - 直接从列表中选择要使用的备份位置
  - 已选择的备份会显示"(已选择)"标记
  - 全局备份文件夹会显示"[全局备份文件夹]"标记

#### bu-remove
- 功能：删除已添加的备份位置
- 用法：
  - 从列表中选择要删除的备份位置
  - 删除后相关的配置信息会被移除，但实际文件夹不会被删除

### 全局备份文件夹命令

#### bu-folder
- 功能：设置全局备份文件夹
- 用法：
  1. 输入文件夹名称（默认为 backup）
  2. 选择要创建全局备份文件夹的位置
  3. 设置后，所备份都会存放在这个文件夹下的对应游戏子文件夹中
  4. 当设置OneDrive文件夹路径时，可以实现云同步

#### bu-folder-remove
- 功能：移除全局备份文件夹设置
- 用法：
  - 直接执行命令即可移除全局备份文件夹设置
  - 移除后会恢复使用各个备份位置自己的目录

### 备份操作命令

#### backup
- 功能：创建新的存档备份
- 用法：
  1. 默认使用时间戳作为备份名称，也可以自定义
  2. 按回车确认后会创建备份
  - 备份会保存在 saved 目录下

#### bu-use
- 功能：使用（恢复）已有的备份
- 用法：
  - 从列表中选择要恢复的备份
  - 会将选中的备份复制到游戏存档位置

#### bu-delete
- 功能：删除备份
- 用法：
  - 从列表中选择要删除的备份
  - 删除的备份会移动到 deleted 目录下

#### bu-delete-clear
- 功能：清空已删除的备份
- 用法：
  - 直接执行命令即可清空 deleted 目录
  - 此操作不可恢复，请谨慎使用

#### bu-open
- 功能：打开当前备份位置的文件夹
- 用法：
  - 直接执行命令即可打开文件夹

## 目录结构

### 普通备份位置 