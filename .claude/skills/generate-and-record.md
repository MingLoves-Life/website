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

### 第一阶段：生成解读 JSON

1. 解析用户提供的出生信息，提取：year, month, day, gender, timeIndex
2. 用 `npx tsx` 执行 `getReading()` 获取八字基础数据：
```bash
cat > /tmp/compute.mjs << 'EOF'
import { getReading } from '/path/to/project/src/lib/reading.ts';
const r = await getReading({ year: YYYY, month: M, day: D, timeIndex: T, gender: 'female', locale: 'zh' });
console.log(JSON.stringify(r, null, 2));
EOF
npx tsx /tmp/compute.mjs
```
3. 参照 `references/reading_engine_guide.md` 中的规则，基于八字数据生成完整双语解读内容
4. 将生成的内容组装为标准 JSON 格式（参考 `public/readings/` 下现有文件）
5. 保存到 `public/readings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.json`

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

1. 确保 dev server 正在运行且页面可访问：
```bash
# 健康检查：验证页面返回 200，否则重启
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/zh/free-reading)
if [ "$STATUS" != "200" ]; then
  lsof -ti:3000 | xargs kill 2>/dev/null
  sleep 2
  npx next dev --port 3000 &>/tmp/next-dev.log &
  sleep 10
fi
```
2. 清空目标输出目录（避免残留文件干扰 rename 逻辑）：
```bash
rm -rf ./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/
```
3. 录制中文视频：
```bash
node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale zh --reveal full \
  --output ./recordings
```
4. 录制英文视频：
```bash
node scripts/record-reading.mjs \
  --year {YYYY} --month {M} --day {D} \
  --gender {gender} --time {timeIndex} \
  --locale en --reveal full \
  --output ./recordings
```
5. 输出：`./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/zh.webm` 和 `en.webm`

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

长图输出：`./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/zh.png` 和 `en.png`

### 第四阶段：生成 TikTok 发布文案

在子目录下生成 `tiktok.md`，内容包含 Title、Caption、Hashtags。

**文案策略（TikTok美区增长转化）：**

1. **Title（视频标题）**：英文，15字以内，制造悬念/好奇心。从 reading 中提取最吸引人的一个点：
   - 缺某元素 → "You're missing Water — here's why you overthink"
   - 高分模块 → "Career score 5/5 — born to lead"
   - 大运阶段 → "Born in 88? Age 34-44 is your PEAK"
   - 桃花月 → "Your soulmate month is November 👀"

2. **Caption（正文描述）**：英文，2-3句。结构：
   - Hook扩展（1句解释标题的悬念）
   - 价值点（1句告诉观众他们能获得什么）
   - CTA（引导到 bio link 做免费测算）

3. **Hashtags**：10-15个，混合：
   - 高流量：#astrology #zodiac #spiritualtiktok #fyp #manifest
   - 精准：#chineseastrology #bazi #birthchart #fiveelement #destinyreading
   - 场景：#careeradvice #lovelife #2026predictions

4. **个性化规则**：每次根据实际 reading 数据提取不同亮点，不要用模板化文案。优先选择最有反差感/意外感的数据点。

输出文件：`./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}/tiktok.md`

格式示例：
```markdown
# TikTok Post

## Title
Born in 1988? Age 34-44 is your POWER decade 🔥

## Caption
Your BaZi chart shows a rare "Eating God controls Killing" pattern forming right now — meaning this is when raw talent finally meets strategic power. Most people peak once. Your chart says you're just getting started.

👉 Link in bio for your free Five Element reading

## Hashtags
#chineseastrology #bazi #birthchart #astrology #zodiac #fyp #spiritualtiktok #manifest #fiveelement #destinyreading #careeradvice #2026predictions #peakera
```

### 第五阶段：转换视频格式（webm → mp4）

Playwright 录制输出 .webm 格式，TikTok 等平台需要 .mp4。录制完成后自动转换：

```bash
DIR=./recordings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}

# 中文版
ffmpeg -y -i "$DIR/zh.webm" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$DIR/zh.mp4"

# 英文版
ffmpeg -y -i "$DIR/en.webm" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$DIR/en.mp4"
```

参数说明：
- `-preset medium`：编码速度与质量平衡
- `-crf 23`：视觉质量（18=近无损，23=默认好质量，28=较小文件）
- `-movflags +faststart`：将 moov atom 前置，适合网络播放/上传
- `-y`：覆盖已有文件

转换完成后可选择删除 .webm 源文件以节省空间：
```bash
rm "$DIR/zh.webm" "$DIR/en.webm"
```

## 注意事项

- timeIndex 映射：子(0) 丑(1) 寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子夜(12)
- gender: male/female
- 如果用户说"不知道时辰"，用 timeIndex=6（午时，默认白天）
- 录制使用 Playwright 内置视频录制，输出 .webm 格式，第五阶段转为 .mp4
- 录制失败会留下 0 字节 `page@*.webm` 残留文件，务必在录制前清空目标目录
- Dev server 偶尔会出现路由 404（尤其是长时间运行后），录制前做健康检查
- ffmpeg 依赖：需要 `brew install ffmpeg`（本机已安装）
