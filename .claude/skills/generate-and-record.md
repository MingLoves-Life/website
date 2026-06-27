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

JSON 结构：
```json
{
  "locale": "zh",
  "birthInfo": { "year": 2000, "month": 4, "day": 19, "timeIndex": 8, "gender": "female" },
  "bazi": { "yearPillar": "...", "monthPillar": "...", "dayPillar": "...", "hourPillar": "...", "zodiac": "...", "nayin": "...", "dayElement": "...", "strongest": "...", "missing": [] },
  "reading": {
    "overview": { "keywords": [...], "body": "..." },
    "decades": [{ "label": "...", "theme": "...", "score": N, "detail": "..." }, ...],
    "annual": { "firstHalf": "...", "secondHalf": "...", "keyMonths": [...], "rating": N },
    "career": { "rating": N, "advice": "...", "direction": "...", "bestMonths": [...] },
    "wealth": { "rating": N, "mode": "...", "advice": "...", "bestMonths": [...] },
    "love": { "rating": N, "romanceMonths": [...], "soulmate": "...", "direction": "...", "advice": "..." },
    "health": { "areas": [...], "vulnerableMonths": [...], "remedy": "..." },
    "allies": { "helpful": [...], "harmful": [...] },
    "timing": { "跳槽": "...", "签约": "...", "搬家": "...", "表白": "..." }
  }
}
```

### 第二阶段：自动录制

1. 确保 dev server 正在运行（`npm run dev`），如未运行则启动
2. 执行录制脚本：
```bash
node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal true \
  --output ./recordings
```
3. 脚本会在移动端视口（390x844, iPhone 14 Pro）下：
   - 打开 free-reading 页面
   - 填写出生年月日、选择性别、选择时辰
   - 点击提交按钮
   - 等待加载动画结束、结果显示
   - 添加 `?reveal=true` 展示完整解读内容（无模糊）
   - 缓慢滚动到页面最底部
   - 全程录制视频
4. 视频保存在 `./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.webm`

## 注意事项

- timeIndex 映射：子(0) 丑(1) 寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子夜(12)
- gender: male/female
- 如果用户说"不知道时辰"，用 timeIndex=6（午时，默认白天）
- 录制使用 Playwright 内置视频录制，输出 .webm 格式
- 如需 mp4 格式，可后续用 ffmpeg 转换：`ffmpeg -i input.webm -c:v libx264 output.mp4`
