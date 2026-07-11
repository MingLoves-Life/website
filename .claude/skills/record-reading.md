---
name: record-reading
description: 给定出生信息，录制移动端浏览器中命盘页面的滚动视频，截长图，并生成TikTok发布文案。前提：public/readings/ 下已有对应 JSON 文件（先跑 generate-reading）。
---

# 录制命盘视频

## 前置条件

`public/readings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.json` 已存在。
如果不存在，先用 `generate-reading` skill 生成。

## 输入

用户提供出生信息（年月日、性别、时辰），或直接提供文件路径。

timeIndex 映射：子(0) 丑(1) 寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子夜(12)

## 流程

### Step 1 — 健康检查，确保 dev server 运行

```bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/zh/free-reading)
if [ "$STATUS" != "200" ]; then
  lsof -ti:3000 | xargs kill 2>/dev/null
  sleep 2
  cd /Users/tal/Desktop/studyspace/destiny-site && npx next dev --port 3000 &>/tmp/next-dev.log &
  sleep 10
fi
```

### Step 2 — 清空目标目录

```bash
rm -rf ./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/
```

### Step 3 — 录制视频（中文 + 英文）

```bash
cd /Users/tal/Desktop/studyspace/destiny-site

node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal full \
  --output ./recordings

node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale en --reveal full \
  --output ./recordings
```

### Step 4 — 截取长图（中文 + 英文）

```bash
cd /Users/tal/Desktop/studyspace/destiny-site

node scripts/screenshot-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal full

node scripts/screenshot-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale en --reveal full
```

### Step 5 — 转换视频格式（webm → mp4）

```bash
DIR=/Users/tal/Desktop/studyspace/destiny-site/recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}

ffmpeg -y -i "$DIR/zh.webm" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$DIR/zh.mp4"

ffmpeg -y -i "$DIR/en.webm" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$DIR/en.mp4"

rm "$DIR/zh.webm" "$DIR/en.webm"
```

### Step 6 — 生成 TikTok 发布文案

读取对应的 `public/readings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.json`，提取最有反差感/意外感的数据点，生成 `tiktok.md`：

**文案策略：**
1. **Title（英文，15字以内）**：制造悬念/好奇心，从 reading 中提取最吸引人的一个点：
   - 缺某元素 → "You're missing Water — here's why you overthink"
   - 高分模块 → "Career score 5/5 — born to lead"
   - 大运阶段 → "Born in 72? Age 54-64 is your PEAK"
   - 桃花月 → "Your wealth month is September 👀"

2. **Caption（英文，2-3句）**：Hook扩展 + 价值点 + CTA（引导 bio link 免费测算）

3. **Hashtags（10-15个）**：
   - 高流量：#astrology #zodiac #spiritualtiktok #fyp #manifest
   - 精准：#chineseastrology #bazi #birthchart #fiveelement #destinyreading
   - 场景：根据 reading 内容选择

每次根据实际数据提取不同亮点，不用模板化文案。

输出：`./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/tiktok.md`

### Step 7 — 确认输出

告知用户：
- `zh.mp4` / `en.mp4` 路径
- `zh.png` / `en.png` 路径  
- `tiktok.md` 路径
- 建议的发布时间（美东时间晚7-9点）
