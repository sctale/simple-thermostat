# 小空调（Simple Thermostat ZH）

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

小空调是 [simple-thermostat](https://github.com/nervetattoo/simple-thermostat) 的中文本地化分支，专为 Home Assistant 2026.x 用户打造。

在原版基础上全面升级：lit v3 兼容、中文界面、新增摆风模式支持。

![预览](https://github.com/nervetattoo/simple-thermostat/raw/master/thermostat-card.png)

## 功能特点

- **中文界面**：模式名称（制热 / 制冷 / 风速 / 自动 / 除湿 / 摆风）、传感器标签、编辑器全部中文
- **lit v3**：兼容 Home Assistant 2026.x 及以上版本
- **更小更简洁**：交互简洁、占用空间小
- **模块化**：支持嵌入传感器数据（湿度、能耗、运行时长等）
- **新支持**：`swing_horizontal` 水平摆风模式（HASS 2026.x 新增）

## 安装要求

Home Assistant 0.84 或更高版本（推荐 HASS 2026.3+）

## 安装方式

### 方式一：HACS（推荐）

1. 确保 HACS 已安装
2. 在 HACS 搜索「simple-thermostat-zh」或「小空调」
3. 点击安装
4. 在 Lovelace 资源中添加：

```yaml
resources:
  - url: /hacsfiles/simple-thermostat-zh/simple-thermostat.js
    type: module
```

### 方式二：手动安装

1. 从 [Releases](https://github.com/sctale/simple-thermostat/releases) 下载最新版 `simple-thermostat.js`
2. 保存到 `configuration/www` 目录
3. 在 Lovelace 资源配置：

```yaml
resources:
  - url: /local/simple-thermostat.js?v=1
    type: module
```

## 基础配置示例

```yaml
type: custom:simple-thermostat
entity: climate.hvac
```

### 紧凑模式（隐藏控制按钮）

```yaml
type: custom:simple-thermostat
entity: climate.hvac
layout:
  step: row
header: false
control: false
```

## 完整配置参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `entity` | string | 温控实体 ID **（必填）** |
| `header` | false / object | 标题栏配置（见下方） |
| `setpoints` | false / object | 温度设定点配置 |
| `control` | false / string[] / object | 控制模式配置 |
| `sensors` | false / array | 传感器列表（v2/v3格式） |
| `layout.step` | row / column | 温度调节按钮排列方向 |
| `layout.mode.names` | boolean | 是否显示模式名称 |
| `layout.mode.icons` | boolean | 是否显示模式图标 |
| `layout.mode.headings` | boolean | 是否显示模式分类标题 |
| `layout.sensors.type` | list / table | 传感器渲染方式 |
| `layout.sensors.labels` | boolean | 是否显示传感器标签 |
| `service` | object | 自定义服务调用 |
| `unit` | string / bool | 温度单位（false 隐藏） |
| `decimals` | number | 小数位数（0 或 1） |
| `step_size` | number | 每次调节步进值（默认 0.5） |
| `fallback` | string | 无数据时显示的占位文本 |

## 标题栏配置（header）

```yaml
header:
  name: 我的空调        # 自定义名称（留空则用法兰名）
  icon: mdi:air-conditioner  # 自定义图标
  toggle:               # 可选：附带一个开关实体
    entity: switch.plug
    name: 电源开关
```

## 传感器配置示例（v3）

```yaml
type: custom:simple-thermostat
entity: climate.hvac
sensors:
  - entity: sensor.humidity
    label: 室内湿度
    template: "{{state.attributes.current_humidity}}%"
  - entity: sensor.power_consumption
    label: 今日能耗
    template: "{{state|kWh}}"
```

## 与原版（nervetattoo/simple-thermostat）的主要区别

| 对比项 | 原版 | 小空调 |
|--------|------|----------|
| lit 版本 | lit-element 2.x | lit 3.x |
| HASS 兼容性 | ~2025.x | 2026.x+ |
| 语言 | 英文 | 中文（默认） |
| swing_horizontal | ❌ | ✅ |
| 构建工具 | Rollup 2.x | Rollup 4.x |
| TypeScript | 4.2 | 5.3 |

## 更新日志

### v3.0.0

- 全面升级至 lit v3，兼容 Home Assistant 2026.x
- 升级 TypeScript 5.3 + Rollup 4.x
- 中文本地化（模式名、标签、编辑器）
- 新增 `swing_horizontal`（水平摆风）模式支持

---

<a href="https://www.buymeacoffee.com/nervetattoo"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=nervetattoo&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>

（原版作者：Raymond Julin @ nervetattoo）
