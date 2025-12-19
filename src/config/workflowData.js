export const WORKFLOW_OPTIONS = {
  // 功能 1：微信表情包
  wechat_emoji: {
    id: 'wechat_emoji',
    title: '微信表情包生成',
    description: '将真人照片转化为可爱的二次元表情包贴纸',
    icon: 'Smile',
    base_prompt: 'chibi style, sticker, emotive, white background, <lora:emoji_v1:0.8>',
    denoising_strength: 0.55,
    next_step_label: '进行九宫格切图与打包',
    styles: [
      { id: 'cute', label: '软萌可爱', prompt_suffix: 'pastel colors, soft lighting, blushing', emoji: '🥰' },
      { id: 'funny', label: '沙雕搞怪', prompt_suffix: 'exaggerated facial expressions, meme style, dynamic lines', emoji: '🤪' },
      { id: 'sketch', label: '手绘线稿', prompt_suffix: 'black and white, pencil sketch, rough lines', emoji: '✏️' }
    ]
  },
  // 功能 2：绝区零邦布 (Bangboo Factory Integration)
  zzz_bangboo: {
    id: 'zzz_bangboo',
    title: '绝区零邦布化',
    description: '使用 Gemini AI 将人物转化为《绝区零》风格的机械邦布',
    icon: 'Bot',
    useGemini: true,
    next_step_label: '高清放大与交付',
    moods: [
      { id: 'default', label: '默认', emoji: '😐' },
      { id: 'happy', label: '开心', emoji: '😊' },
      { id: 'angry', label: '生气', emoji: '😠' },
      { id: 'sad', label: '悲伤', emoji: '😢' },
      { id: 'surprised', label: '惊讶', emoji: '😲' },
      { id: 'cool', label: '酷炫', emoji: '😎' }
    ],
    renderStyles: [
      { id: 'cel-shaded', label: '3D 赛璐珞', description: '匹配《绝区零》的真实视觉风格', emoji: '🎮' },
      { id: 'flat-2d', label: '扁平 2D', description: '干净的矢量艺术风格插图', emoji: '🎨' }
    ],
    styles: []
  },
  // 功能 3：崩坏星穹铁道奇美拉
  hsr_chimera: {
    id: 'hsr_chimera',
    title: '星铁奇美拉化',
    description: '使用 Gemini AI 将人物转化为《崩坏：星穹铁道》风格的奇美拉随宠',
    icon: 'Cat',
    useGemini: true,
    next_step_label: '生成完成与交付',
    // 奇美拉主题选项
    themes: [
      { id: 'default', label: '自动识别', description: '根据图片自动提取特征', emoji: '✨' },
      { id: 'floral', label: '花草植物', description: '融入花卉和植物元素', emoji: '🌸' },
      { id: 'cosmic', label: '星空宇宙', description: '添加星空和宇宙元素', emoji: '🌌' },
      { id: 'elemental', label: '元素精灵', description: '火/水/冰/雷等元素特征', emoji: '🔥' }
    ],
    // 装饰风格选项
    decorStyles: [
      { id: 'horns', label: '犄角', emoji: '🦌' },
      { id: 'wings', label: '小翅膀', emoji: '🦋' },
      { id: 'fluffy', label: '蓬松毛领', emoji: '☁️' },
      { id: 'ribbon', label: '蝴蝶结', emoji: '🎀' }
    ],
    styles: []
  }
};

export const WORKFLOW_STEPS = [
  { id: 1, title: '选择功能', description: '选择你想要的转换类型' },
  { id: 2, title: '上传图片', description: '上传一张真人照片' },
  { id: 3, title: '选择风格', description: '挑选你喜欢的艺术风格' },
  { id: 4, title: '结果交付', description: '获取并下载生成结果' }
];

// Bangboo 生成的 Prompt 模板
export const BANGBOO_PROMPT_TEMPLATE = `You are an expert character designer specializing in the "Bangboo" aesthetic from the video game Zenless Zone Zero (绝区零).

Your task is to transform the provided image into a Bangboo-style character while preserving recognizable features from the original.

**Bangboo Design Rules:**
1. **Body:** Rounded, robotic body with a TV-screen or monitor-like face
2. **Eyes:** Large, expressive digital eyes on the screen face
3. **Size:** Compact, cute proportions (chibi-like)
4. **Materials:** Metallic/plastic body with glowing elements
5. **Accessories:** May include antennas, buttons, or unique attachments based on the original image

**Current Settings:**
- Mood: {{mood}}
- Render Style: {{renderStyle}}

**Style Guidelines:**
{{styleGuide}}

Transform the input image into a Bangboo character that captures the essence of the original while fully embracing the Zenless Zone Zero aesthetic. The result should look like an official Bangboo design from the game.`;

// 奇美拉生成的 Prompt 模板 (基于 QIMEILA.yml)
export const CHIMERA_PROMPT_TEMPLATE = `你是《崩坏·星穹铁道》游戏顶尖的角色设计师，专精于"崩铁奇美拉（Honkai Star rail chimera）"型号游戏内随宠形象的研发与定制。

# 任务目标:
分析用户上传的图像中的主体（人物、动物或物体），将其重新设计为一个独特的"崩铁奇美拉"角色。

# 核心风格指南 (必须遵守)
**基础素体**: 所有角色必须拥有标志性的奇美拉体型
    - 矮胖、下盘稳固的梨形身体，更像一只柔软的毛绒玩具；
    - 和参考图中一致的蹲坐姿态，拥有短而粗的**两条前腿两条后腿**，脚底有可爱的肉垫；
    - **以对称的姿势前爪支撑蹲坐，屁股着地坐下**，前爪短小两条后腿前伸，有类似猫咪的爪垫。整体是柔软的、毛茸茸的质感；
    - 外形神似幼年的猫或者狗，可能有可爱的犄角、花纹或者其他个性化的装饰；

**面部特征**：
    - 头部与身体平滑连接，脸颊两侧有可爱的圆形腮红；
    - 眼睛是核心！巨大、闪闪发光的多层圆形眼睛，通常有明显的彩色虹膜、高光和瞳孔，充满灵气；
    - 嘴巴极简，通常是一条小小的"w"形或横线；

**特征转化**: 提取用户图像主体的关键特征（如发型、服装、标志性配饰、职业特征或物种特征），将这些元素转化为适合奇美拉小身体的特征，无需特意遵照人物动作；

**当前设置:**
- 主题风格: {{theme}}
- 装饰元素: {{decorations}}

**主题风格指南:**
{{themeGuide}}

请注意：一般来说，你需要确立一个核心主题（如动物、植物、元素），并将该主题的标志性特征，以有机、自然的方式融合到奇美拉身上
    - 头顶装饰: 这是最多变的部分。可以是各种形态的角（鹿角、羊角、独角）、可爱的耳朵，或是主题配饰（如蝴蝶结）；
    - 颈部装饰: 几乎所有奇美拉都有一个像云朵一样蓬松的毛领，颜色和主题相匹配；
    - 额外配件: 可根据主题在背部或尾部添加翅膀、羽毛或小尾巴等部件；
    - 配色与花纹: 身体的颜色和斑点图案直接反映设计主题；
    - 材质与渲染: 采用2.5D风格的卡通渲染 (Cel-shading)，线条干净利落，色彩鲜艳饱和。整体感觉像是高质量的游戏角色概念设计或精美的贴纸，有清晰的光影和立体感，但质感是柔软毛绒而非硬质塑料；

一致性: 保持原图的配色方案，保持原图的艺术风格。背景应为简洁的纯色或渐变色 (simple background, plain background)，以突出角色本身

CRITICAL: The character MUST be ASEXUAL and ANDROGYNOUS. It is a cute pet. DO NOT generate any sexual characteristics (no breasts, no hips, no hairs, no glasses)

(masterpiece, best quality, ultra-detailed, official art, game character concept art), 1 chimera, solo, chibi, fantasy pet, cel shading, clean lineart, vibrant colors, simple background, full body, sitting, ((soft pear-shaped body)), fluffy texture, short limbs, visible paw pads, pink cheek blush`;
