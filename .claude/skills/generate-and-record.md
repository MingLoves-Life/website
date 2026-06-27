---
name: generate-and-record
description: 给定一个人的出生信息，用AI生成命理解读JSON，然后自动录制移动端浏览器中填写表单、生成结果、滚动浏览的全过程视频
---

# 生成解读 + 录制视频 自动化流程

## 输入格式

用户提供出生信息，格式示例：
- "2000年4月19日 女 申时" 
- "1995-03-15 male hour:3"
- 任意包含年月日、性别、时辰的自然语言描述

## 流程

### 第一阶段：AI 生成解读 JSON

1. 解析用户提供的出生信息，提取：year, month, day, gender, timeIndex
2. 调用 `命理解读师` skill 生成完整解读内容
3. 将生成的内容组装为标准 JSON 格式（参考 `public/readings/2000-04-19-f-8.json`）
4. 保存到 `public/readings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.json`

**重要规则：所有文本字段必须返回双语格式 `{ "zh": "中文内容", "en": "English content" }`，不允许返回纯字符串。** 页面会根据用户当前语言自动选择显示哪种。

JSON 结构：
```json
{
  "locale": "zh",
  "birthInfo": { "year": 2000, "month": 4, "day": 19, "timeIndex": 8, "gender": "female" },
  "bazi": { "yearPillar": "...", "monthPillar": "...", "dayPillar": "...", "hourPillar": "...", "zodiac": "...", "nayin": "...", "dayElement": "...", "strongest": "...", "missing": [] },
  "reading": {
    "overview": { "keywords": [...], "body": "简要概述", "detailed": "2-3段深度命格分析" },
    "decades": [{ "label": "...", "theme": "...", "score": N, "detail": "一句话概述", "detailed": "该步运的详细分析、具体建议、注意事项" }, ...],
    "annual": { "firstHalf": "...", "secondHalf": "...", "keyMonths": [...], "rating": N, "detailed": "流年详细分析，含月份级建议" },
    "career": { "rating": N, "advice": "简要建议", "direction": "...", "bestMonths": [...], "detailed": "详细行业分析、发展节奏、具体行动建议" },
    "wealth": { "rating": N, "mode": "...", "advice": "简要建议", "bestMonths": [...], "detailed": "详细财运分析、投资方向、理财策略" },
    "love": { "rating": N, "romanceMonths": [...], "soulmate": "...", "direction": "...", "advice": "简要建议", "detailed": "详细正缘画像、恋爱课题、具体择偶建议" },
    "health": { "areas": [...], "vulnerableMonths": [...], "remedy": "简要调理方向", "detailed": "详细健康分析、高危时段、具体调养方案" },
    "allies": { "helpful": [...], "harmful": [...], "detailed": "详细贵人/小人分析、实际应用建议" },
    "timing": { "跳槽": "...", "签约": "...", "搬家": "...", "表白": "...", "detailed": "每个时间点的详细择时依据和注意事项" }
  }
}
```

### 页面展示三级模式

- `?reveal=` 无参数：全部模糊（访客）
- `?reveal=basic`：简单字段可见，detailed 模糊（免费用户）
- `?reveal=full`：全部可见（付费用户）
- `?reveal=true`（向后兼容）= basic

### 第二阶段：录制视频（中文+英文）

1. 确保 dev server 正在运行（`npm run dev`），如未运行则启动
2. 录制中文视频：
```bash
node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal full \
  --output ./recordings
```
3. 录制英文视频：
```bash
node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale en --reveal full \
  --output ./recordings
```
4. 视频保存在 `./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}-{locale}.webm`

### 第三阶段：截取长图（中文+英文）

```bash
node scripts/screenshot-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal full

node scripts/screenshot-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale en --reveal full
```

长图保存在 `./screenshots/{YYYY}-{MM}-{DD}-{g}-{timeIndex}-{locale}.png`

## 注意事项

- timeIndex 映射：子(0) 丑(1) 寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子夜(12)
- gender: male/female
- 如果用户说"不知道时辰"，用 timeIndex=6（午时，默认白天）
- 录制使用 Playwright 内置视频录制，输出 .webm 格式
- 如需 mp4 格式，可后续用 ffmpeg 转换：`ffmpeg -i input.webm -c:v libx264 output.mp4`
