# 命理独立站项目规划

## 项目定位

- 面向美国市场的命理/风水咨询独立站
- 中英双语（next-intl）
- 核心目的：引流获客，让客户预约付费咨询
- 命理方向：八字、紫微斗数、风水、择日等综合命理

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS
- next-intl（国际化，中英切换）
- Calendly 嵌入或自建预约表单
- 部署：Vercel
- 博客：MDX 或 Notion API

## 页面结构

```
src/app/
├── [locale]/           # 国际化路由
│   ├── page.tsx        # 首页 Home
│   ├── about/          # 关于我
│   ├── services/       # 服务列表
│   │   └── [slug]/     # 单项服务详情
│   ├── blog/           # 博客/知识
│   │   └── [slug]/     # 单篇文章
│   ├── testimonials/   # 客户评价
│   └── book/           # 预约/联系
├── layout.tsx
└── globals.css
```

## 各页面内容规划

### 1. 首页 (Home)
- Hero：一句话定位 + CTA 预约按钮
- 服务概览（3-4 张卡片）
- 客户评价精选
- 简短自我介绍引导到 About

### 2. 关于我 (About)
- 个人背景、学习传承
- 专业资质/从业年限
- 品牌形象照片

### 3. 服务 (Services)
- 分项：八字命盘、紫微斗数、风水勘察、流年运势、择日等
- 每项：适合谁、包含什么、时长、价格、Book Now CTA

### 4. 博客 (Blog/Insights)
- SEO 内容：命理科普、风水贴士、节气运势
- 中英双语文章
- 用于 Google 自然流量

### 5. 预约 (Book/Contact)
- 在线预约表单（姓名、出生日期时间、咨询类型）
- 集成 Calendly 或自建日历
- 联系方式：邮箱、微信、WhatsApp

### 6. 客户评价 (Testimonials)
- 真实案例（脱敏）
- 评分 + 文字

## 当前进度

- [x] 项目已用 create-next-app 初始化（destiny-site/）
- [ ] 安装 next-intl，配置国际化路由
- [ ] 搭建页面骨架（各路由文件）
- [ ] 公共组件：Header、Footer、CTA Button、语言切换
- [ ] 首页布局
- [ ] 其他页面布局
- [ ] 博客 MDX 集成
- [ ] 预约表单/Calendly 集成
- [ ] 部署配置

## 项目路径

```
/Users/tal/Desktop/studyspace/ff/destiny-site/
```

## 所在分支

```
feat/image-page-redesign（临时共用，后续可独立分支）
```
