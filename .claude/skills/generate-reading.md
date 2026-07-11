---
name: generate-reading
description: 给定一个人的出生信息，用AI生成命理解读JSON并保存到 public/readings/
---

# 生成命理解读 JSON

## 输入格式

用户提供出生信息，格式示例：
- "2000年4月19日 女 申时" 
- "1995-03-15 male hour:3"
- 任意包含年月日、性别、时辰的自然语言描述

timeIndex 映射：子(0) 丑(1) 寅(2) 卯(3) 辰(4) 巳(5) 午(6) 未(7) 申(8) 酉(9) 戌(10) 亥(11) 子夜(12)

**不知道时辰：用 timeIndex=6（午时，默认白天）**

## 流程

### Step 1 — 获取八字基础数据

```bash
cat > /tmp/compute.mjs << 'EOF'
import { getReading } from '/Users/tal/Desktop/studyspace/destiny-site/src/lib/reading.ts';
const r = await getReading({ year: YYYY, month: M, day: D, timeIndex: T, gender: 'male', locale: 'zh' });
console.log(JSON.stringify(r, null, 2));
EOF
cd /Users/tal/Desktop/studyspace/destiny-site && npx tsx /tmp/compute.mjs
```

### Step 2 — 生成完整双语解读

参照 `references/reading_engine_guide.md` 中的规则，基于 Step 1 的八字数据，生成完整解读内容。

**重要规则：所有文本字段必须返回双语格式 `{ "zh": "中文内容", "en": "English content" }`，不允许返回纯字符串。**

JSON 结构：
```json
{
  "locale": "zh",
  "birthInfo": { "year": 2000, "month": 4, "day": 19, "timeIndex": 8, "gender": "female" },
  "bazi": { "yearPillar": "...", "monthPillar": "...", "dayPillar": "...", "hourPillar": "...", "zodiac": "...", "nayin": "...", "dayElement": "...", "strongest": "...", "missing": [] },
  "reading": {
    "overview": { "keywords": [...], "body": { "zh": "...", "en": "..." }, "detailed": { "zh": "...", "en": "..." } },
    "decades": [{ "label": { "zh": "...", "en": "..." }, "theme": { "zh": "...", "en": "..." }, "score": N, "detail": { "zh": "...", "en": "..." }, "detailed": { "zh": "...", "en": "..." } }, ...],
    "annual": { "firstHalf": { "zh": "...", "en": "..." }, "secondHalf": { "zh": "...", "en": "..." }, "keyMonths": [{ "zh": "...", "en": "..." }], "rating": N, "detailed": { "zh": "...", "en": "..." } },
    "career": { "rating": N, "advice": { "zh": "...", "en": "..." }, "direction": { "zh": "...", "en": "..." }, "bestMonths": [{ "zh": "...", "en": "..." }], "detailed": { "zh": "...", "en": "..." } },
    "wealth": { "rating": N, "mode": { "zh": "...", "en": "..." }, "advice": { "zh": "...", "en": "..." }, "bestMonths": [{ "zh": "...", "en": "..." }], "detailed": { "zh": "...", "en": "..." } },
    "love": { "rating": N, "romanceMonths": [{ "zh": "...", "en": "..." }], "soulmate": { "zh": "...", "en": "..." }, "direction": { "zh": "...", "en": "..." }, "advice": { "zh": "...", "en": "..." }, "detailed": { "zh": "...", "en": "..." } },
    "health": { "areas": [{ "zh": "...", "en": "..." }], "vulnerableMonths": [{ "zh": "...", "en": "..." }], "remedy": { "zh": "...", "en": "..." }, "detailed": { "zh": "...", "en": "..." } },
    "allies": { "helpful": [{ "zh": "...", "en": "..." }], "harmful": [{ "zh": "...", "en": "..." }], "detailed": { "zh": "...", "en": "..." } },
    "timing": { "跳槽": { "zh": "...", "en": "..." }, "签约": { "zh": "...", "en": "..." }, "搬家": { "zh": "...", "en": "..." }, "表白": { "zh": "...", "en": "..." }, "detailed": { "zh": "...", "en": "..." } }
  }
}
```

### Step 3 — 保存文件

保存到 `public/readings/{YYYY}-{MM}-{DD}-{g}-{timeIndex}.json`

其中 `{g}` = `m`（男）或 `f`（女）。

### Step 4 — 确认输出

告知用户：
- 文件路径
- 命盘亮点（1-2个最有冲击力的解读点，用于后续视频制作）
- 提示可用 `record-reading` skill 继续录制视频
