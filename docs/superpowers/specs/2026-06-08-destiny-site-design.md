# 命理独立站 MVP 设计规格

## 项目概述

面向美国市场的命理/风水咨询独立站，中英双语，核心目标：引导访客完成预约咨询。

- 目标客户：在美华人（50%）+ 对东方文化感兴趣的西方人（50%）
- 核心转化路径：访问首页 → 建立信任 → 点击预约 → 提交表单

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | Next.js 16 (App Router) + TypeScript |
| 样式 | Tailwind CSS 4 |
| 动画 | GSAP + ScrollTrigger |
| 国际化 | next-intl，`/en` + `/zh` 路由 |
| 表单后端 | Next.js API Route + Resend |
| SEO | meta/OG/sitemap/结构化数据 |
| 部署 | Vercel |

## 视觉风格：中西融合 + 高端质感

### 设计原则

- Mobile First（预计 80%+ 流量来自社交分享）
- 大留白、大间距（section 间 150-200px spacing）
- 高端感：通过排版层级、动画质感、克制的配色传达专业度
- 东方元素作为点缀而非主题——线条八卦图腾、水墨纹理、朱印装饰

### 配色方案

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#0a0a0a` | 深色主背景 |
| `--bg-secondary` | `#141414` | 卡片/section 区分 |
| `--text-primary` | `#f5f5f5` | 主文字 |
| `--text-secondary` | `#a0a0a0` | 副文字 |
| `--accent` | `#c9a84c` | 金色 CTA / 高亮 |
| `--accent-red` | `#8b2020` | 朱红点缀（印章、分隔线） |

### 字体

- 中文标题：Noto Serif SC（思源宋体）— 文化感
- 英文标题：Cabinet Grotesk 或 Satoshi — 现代高端感
- 正文：系统无衬线字体栈（性能优先）

## 页面结构："1+1"

两个页面，中英各一份：

```
/[locale]       → 首页（长滚动，5 个 section）
/[locale]/book  → 预约/联系页
```

## 首页设计

### Section 1: Hero

- 全屏高度（100vh）
- 大标题：一句话定位，宽排版（避免超过 2 行换行）
- 副标题：核心价值主张
- 主 CTA 按钮："预约免费咨询" / "Book a Free Consultation"，金色
- 背景：深色 + 淡水墨纹理（CSS 渐变或轻量 SVG）
- 装饰：角落八卦线条图腾，低透明度
- 动画：标题文字逐字/逐行 reveal（GSAP SplitText 效果），CTA 按钮延迟淡入

### Section 2: Services

- 标题："服务项目" / "Services"
- 3-4 张卡片，bento grid 布局（桌面端 2x2，移动端纵向堆叠）
- 每张卡片：线条图标 + 服务名 + 一句话描述 + "了解详情→"（跳预约页）
- 不显示价格
- 服务项：八字命盘、紫微斗数、风水勘察、流年运势
- 动画：卡片随滚动 stagger 入场
- 底部次级 CTA

### Section 3: About

- 标题："关于" / "About"
- 左右分栏（桌面端），上下堆叠（移动端）
- 左侧：品牌形象照（占位图）
- 右侧：从业背景、学习传承、专业资质，2-3 段简短文字
- 语调：温暖、专业、有故事感
- 动画：图片视差滚动，文字淡入

### Section 4: Testimonials

- 标题："客户反馈" / "Testimonials"
- 2-3 张评价卡片（MVP 虚拟数据占位）
- 每张：头像占位 + 姓名 + 星级评分 + 评价文字
- 布局：横向排列或轮播
- 动画：卡片滑入

### Section 5: Footer CTA + Footer

- 大字 CTA 重复引导："开始你的命理之旅" / "Begin Your Journey"
- CTA 按钮跳转预约页
- Footer：联系方式（邮箱/微信/WhatsApp）、语言切换、版权信息
- 装饰：朱红印章元素

### 全局交互

- 固定顶部导航栏：Logo + 锚点导航（Services / About / Testimonials）+ 语言切换 + "预约" CTA 按钮
- 导航栏滚动后加背景模糊（backdrop-blur）
- 平滑滚动（scroll-behavior: smooth 或 GSAP ScrollToPlugin）
- 每个 section 底部都有次级 CTA 按钮指向预约页

## 预约页设计

### 表单字段

| 字段 | 类型 | 必填 |
|------|------|------|
| 姓名 | text | 是 |
| 邮箱 | email | 是 |
| 出生日期 | date | 是 |
| 出生时间 | time | 否（注明"如知道请填写"） |
| 咨询类型 | select（八字/紫微/风水/择日/其他） | 是 |
| 留言 | textarea | 否 |

### 页面布局

- 左侧（桌面端）或顶部（移动端）：表单
- 右侧或底部：联系方式卡片（微信二维码、WhatsApp、邮箱）
- 提示文案："提交后 24 小时内回复" / "We'll respond within 24 hours"

### 表单提交流程

1. 用户填写表单 → 点击提交
2. 前端验证 → POST `/api/contact`
3. API Route 用 Resend 发送邮件到站长邮箱（包含所有表单数据）
4. 前端显示成功提示（"已收到，我们会尽快联系你"）
5. 失败则显示错误提示 + 引导用户通过备用联系方式联系

## SEO 策略（基础）

- 每页设置独立的 title / description（中英各一套）
- Open Graph 标签（分享卡片）
- `sitemap.xml` 自动生成
- 结构化数据：LocalBusiness schema（命理咨询属于 ProfessionalService）
- `robots.txt`

## 国际化方案

- next-intl，默认语言英文（`/en`），中文为 `/zh`
- 导航栏语言切换按钮
- 所有文案通过 messages JSON 管理（`messages/en.json`、`messages/zh.json`）
- URL 结构：`/en`、`/en/book`、`/zh`、`/zh/book`

## GSAP 动画规范（参考 gpt-taste skill）

使用 GSAP ScrollTrigger 实现滚动驱动动画：

- Hero 文字：SplitText 逐字/逐行 reveal，ease: "power3.out"
- Section 标题：从下方 fadeIn + slideUp
- 卡片组：stagger 入场（每张间隔 0.1s）
- About 图片：视差效果（y 轴偏移跟随滚动）
- 导航栏：滚动超过 Hero 后加背景
- 所有动画尊重 `prefers-reduced-motion`，禁用时直接显示无动画

## 文件结构

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx          # 首页
│   │   ├── book/
│   │   │   └── page.tsx      # 预约页
│   │   └── layout.tsx        # locale layout
│   ├── api/
│   │   └── contact/
│   │       └── route.ts      # 表单提交 API
│   ├── layout.tsx            # root layout
│   └── globals.css
├── components/
│   ├── Header.tsx            # 固定导航栏
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Testimonials.tsx
│   ├── FooterCTA.tsx
│   ├── BookingForm.tsx
│   ├── ContactInfo.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── animations.ts         # GSAP 动画配置
│   └── resend.ts             # 邮件发送逻辑
└── messages/
    ├── en.json
    └── zh.json
```

## MVP 不做

- 博客/MDX 内容系统
- 在线支付/Stripe
- 服务详情独立页
- 用户账户
- Calendly 集成
- 后台管理

## 成功标准

- 首页加载 < 3s（Lighthouse Performance > 90）
- 中英切换流畅无闪烁
- 表单提交成功率 > 99%（邮件送达）
- 移动端体验流畅，动画不卡顿
- 所有 CTA 可点击，转化路径畅通
