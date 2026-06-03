# Focustime 番茄钟应用

一款基于番茄工作法的移动专注助手应用，帮助用户通过"专注25分钟 – 休息5分钟"的循环提升工作效率。

## 功能特性

### ⏱️ 计时器
- 圆形进度条可视化显示剩余时间
- 三种计时模式：专注 / 短休息 / 长休息
- 支持开始、暂停、重置操作
- 后台计时支持（应用进入后台时继续计时）
- 计时结束震动反馈

### 📋 任务管理
- 添加任务并设置预估番茄数
- 任务分为"进行中"和"已完成"两组
- 实时显示任务完成进度
- 滑动删除任务
- 点击选择当前专注任务
- 与计时器联动，完成番茄自动更新任务进度

### 📊 数据统计
- 今日专注时长统计
- 累计完成番茄数
- 近7天专注时长柱状图
- 任务完成率饼图

### ⚙️ 设置
- 自定义专注时长（15-60分钟）
- 自定义短休息时长（5-15分钟）
- 自定义长休息时长（10-30分钟）
- 长休息间隔设置（每几个番茄后触发）
- 通知提醒开关
- 震动反馈开关
- 主题切换（浅色/深色）

## 技术栈

- **框架**: React Native + Expo SDK 56
- **语言**: TypeScript
- **状态管理**: Zustand
- **本地存储**: AsyncStorage
- **导航**: React Navigation (底部 Tab)
- **通知**: Expo Notifications
- **震动**: Expo Haptics
- **图形**: react-native-svg
- **图表**: react-native-chart-kit
- **手势**: react-native-gesture-handler

## 项目结构

```
focustime/
├── App.tsx                          # 主入口（导航配置）
├── src/
│   ├── components/                  # 可复用组件
│   │   ├── CircularProgress.tsx   # 圆形进度条
│   │   ├── TaskItem.tsx            # 任务列表项
│   │   └── StatsChart.tsx          # 统计图表
│   ├── screens/                     # 页面组件
│   │   ├── TimerScreen.tsx         # 计时器页面
│   │   ├── TasksScreen.tsx         # 任务管理页面
│   │   ├── StatsScreen.tsx         # 统计页面
│   │   └── SettingsScreen.tsx      # 设置页面
│   ├── store/                       # Zustand 状态管理
│   │   ├── useTimerStore.ts        # 计时器状态
│   │   ├── useTaskStore.ts         # 任务状态
│   │   ├── useSettingStore.ts      # 设置状态
│   │   └── useStatsStore.ts        # 统计状态
│   ├── hooks/                       # 自定义 Hooks
│   │   └── useBackgroundTimer.ts   # 后台计时钩子
│   ├── utils/                       # 工具函数
│   │   ├── storage.ts              # 本地存储
│   │   └── notifications.ts         # 通知与震动
│   └── types/                       # TypeScript 类型
│       └── index.ts
└── package.json
```

## 安装步骤

### 前置要求
- Node.js >= 18.0.0
- npm 或 yarn
- Expo Go (iOS/Android) 或开发环境

### 安装依赖

```bash
cd focustime
npm install
```

## 运行应用

### 方式一：使用 Expo Go（推荐用于预览）

```bash
npx expo start
```

然后用 Expo Go 扫描显示的二维码。

### 方式二：使用模拟器

**Android:**
```bash
npx expo start --android
```

**iOS (需要 macOS):**
```bash
npx expo start --ios
```

### 方式三：Web 预览
```bash
npx expo start --web
```

## 构建独立应用

### 安装 EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 配置构建
```bash
eas build:configure
```

### 构建 Android APK
```bash
eas build -p android --profile preview
```

### 构建 iOS IPA (需要 macOS)
```bash
eas build -p ios --profile preview
```

## 核心功能说明

### 后台计时实现

应用使用时间戳计算方式确保计时的准确性：

1. 开始时记录 `startTime = Date.now()`
2. 每秒计算经过时间：`elapsed = (Date.now() - startTime) / 1000`
3. 剩余时间：`remaining = initialSeconds - elapsed`
4. 进入后台时暂停 interval，记录 `pausedAt`
5. 回到前台时计算时间差，更新剩余时间

### 数据持久化

使用 AsyncStorage 存储以下数据：
- `@focustime_tasks` - 任务列表
- `@focustime_stats` - 每日统计数据
- `@focustime_settings` - 用户设置
- `@focustime_timer_state` - 计时器状态（后台恢复用）

## 已知问题

1. **Expo Go 通知限制**: 从 Expo SDK 53 开始，本地通知在 Expo Go 中可能无法正常工作。这是 Expo Go 的限制，独立构建后通知功能完全正常。

2. **应用被强制终止**: 如果应用被系统强制终止，计时器和通知将无法继续。这是移动操作系统的限制，所有计时器应用都有此问题。

## 开发说明

### TypeScript 严格模式
项目使用 TypeScript 严格模式，确保类型安全。

### 代码规范
- 使用函数式组件 + Hooks
- 状态管理采用 Zustand 切片模式
- 注释关键逻辑（尤其是后台计时部分）

## 许可证

MIT License

## 作者

张付

---

**使用番茄工作法，让专注成为习惯！** 🍅
