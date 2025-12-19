export const WORKFLOW_OPTIONS = {
  // 功能 1：微信表情包
  wechat_emoji: {
    id: 'wechat_emoji',
    title: '微信表情包生成',
    description: '将真人照片转化为可爱的二次元表情包贴纸',
    icon: 'Smile',
    base_prompt: '为图中人物设计一个独特的卡通化形象，设计 16 种 LINE 贴纸，其中包含一张（被网网住）的表情。姿势和文字排版要富有创意，变化丰富，设计独特。对话应为简体中文，包含一些二次元梗，角色二头身。Q版风格, 贴纸, 表情丰富, 白色背景',
    denoising_strength: 0.55,
    next_step_label: '进行九宫格切图与打包',
    styles: [
      { id: 'cute', label: '软萌可爱', prompt_suffix: '柔和粉彩色调, 柔光效果, 脸颊泛红, 可爱美学', emoji: '🥰' },
      { id: 'funny', label: '沙雕搞怪', prompt_suffix: '夸张面部表情, 表情包风格, 动态线条, 网络幽默梗', emoji: '🤪' },
      { id: 'sketch', label: '手绘线稿', prompt_suffix: '黑白线稿, 铅笔素描, 粗糙线条, 手绘质感', emoji: '✏️' },
      { id: 'pixel', label: '像素复古', prompt_suffix: '像素艺术风格, 8位机美学, 复古游戏感, 有限调色板', emoji: '👾' },
      { id: 'watercolor', label: '水彩风', prompt_suffix: '水彩画风格, 柔和边缘, 艺术笔触, 梦幻氛围', emoji: '🎨' },
      { id: 'pop', label: '波普艺术', prompt_suffix: '波普艺术风格, 大胆色彩, 半调网点, 漫画书美学', emoji: '💥' },
      { id: 'minimalist', label: '极简扁平', prompt_suffix: '扁平设计, 极简风格, 简单形状, 干净线条, 纯色填充', emoji: '⬜' },
      { id: 'neon', label: '霓虹赛博', prompt_suffix: '霓虹发光, 赛博朋克美学, 深色背景, 鲜艳灯光效果', emoji: '🌈' }
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
      { id: 'cool', label: '酷炫', emoji: '😎' },
      { id: 'sleepy', label: '困倦', emoji: '😴' },
      { id: 'love', label: '花痴', emoji: '😍' },
      { id: 'mischievous', label: '调皮', emoji: '😏' },
      { id: 'determined', label: '坚定', emoji: '😤' },
      { id: 'shy', label: '害羞', emoji: '🙈' },
      { id: 'confused', label: '困惑', emoji: '🤔' }
    ],
    renderStyles: [
      { id: 'cel-shaded', label: '3D 赛璐珞', description: '匹配《绝区零》的真实视觉风格', emoji: '🎮' },
      { id: 'flat-2d', label: '扁平 2D', description: '干净的矢量艺术风格插图', emoji: '🎨' },
      { id: 'glossy', label: '光泽金属', description: '高反光金属质感，科技感强', emoji: '✨' },
      { id: 'matte', label: '磨砂哑光', description: '低调内敛的哑光材质', emoji: '🔲' }
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
      { id: 'elemental', label: '元素精灵', description: '火/水/冰/雷等元素特征', emoji: '🔥' },
      { id: 'sweet', label: '甜点糖果', description: '糖果、蛋糕、甜品元素', emoji: '🍰' },
      { id: 'ocean', label: '海洋深渊', description: '海洋生物、珊瑚、水波纹', emoji: '🐚' },
      { id: 'mechanical', label: '机械蒸汽', description: '齿轮、铆钉、蒸汽朋克', emoji: '⚙️' },
      { id: 'crystal', label: '水晶矿石', description: '宝石、水晶、矿物质感', emoji: '💎' },
      { id: 'autumn', label: '秋日落叶', description: '枫叶、暖色调、丰收感', emoji: '🍂' },
      { id: 'festive', label: '节日庆典', description: '彩带、礼物、欢乐氛围', emoji: '🎉' }
    ],
    // 装饰风格选项
    decorStyles: [
      { id: 'horns', label: '犄角', emoji: '🦌' },
      { id: 'wings', label: '小翅膀', emoji: '🦋' },
      { id: 'fluffy', label: '蓬松毛领', emoji: '☁️' },
      { id: 'ribbon', label: '蝴蝶结', emoji: '🎀' },
      { id: 'halo', label: '光环', emoji: '😇' },
      { id: 'tail', label: '蓬松尾巴', emoji: '🦊' },
      { id: 'crown', label: '小皇冠', emoji: '👑' },
      { id: 'scarf', label: '围巾', emoji: '🧣' },
      { id: 'flower', label: '头花', emoji: '🌺' },
      { id: 'bells', label: '铃铛', emoji: '🔔' }
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

// 表情包功能的步骤标签（第4步为切图打包）
export const EMOJI_WORKFLOW_STEPS = [
  { id: 1, title: '选择功能', description: '选择你想要的转换类型' },
  { id: 2, title: '上传图片', description: '上传一张真人照片' },
  { id: 3, title: '选择风格', description: '挑选你喜欢的艺术风格' },
  { id: 4, title: '切图打包', description: '裁剪表情并打包下载' }
];

// Bangboo 基础 Prompt (基于 bamboo 原项目，翻译为中文)
export const BANGBOO_BASE_PROMPT = `
仔细分析上传的图像。你的任务是将图中的主体（人物、动物或物体）重新想象为《绝区零》游戏中的"邦布"角色。

邦布的关键视觉特征：
1. 身体结构：小巧、粗短、圆柱形/豆形的机器人身体。手臂极其短小，是简单的圆柱体，没有明显的肘部，高高地连接在身体上方。它们更像是短柄或把手。腿是细小的圆形短桩。整体比例是 Q 版的非人类比例。
2. 头部：脸部集成在身体的圆顶部分，是一块黑色数字屏幕，显示着独特的发光黄色圆环眼睛。屏幕上没有嘴巴或鼻子。
3. 耳朵：顶部有两只长长的兔子般的机械耳朵，通常充当把手或传感器。
4. 材质：高品质哑光塑料、金属关节、略带磨损的工业外观（划痕、贴纸）。
5. 美学：赛博朋克、街头潮流、工业吉祥物。

重要规则：
- 关键：手臂必须是短小的！不应有肘部或明显的肌肉。它们是连接到上半身的短而简单的管状物。不要生成人类比例的手臂。
- 关键：脸部屏幕必须显示两个大大的、发光的黄色圆环作为眼睛。
- 关键：角色不能有嘴巴或鼻子。脸是光滑的黑色屏幕，只有眼睛。
- 关键：角色必须是无性别的。它是一个机器人。不要生成任何性别特征。

创意改编：
- 识别用户图像中的关键颜色、服装和独特特征。
- 将这些特征转换到邦布身体上。
- 如果用户是人类，将他们的服装变成邦布的"皮肤"或外壳涂装。
- 配饰：将背包变成机械喷气背包或电池组。将帽子变成定制外壳改装或头盔。
- 物品：将手持物品变成集成的邦布工具、武器或道具。
- 细节：使用输入图像中的图案作为邦布金属外壳上的贴花、贴纸或涂鸦。
- 夸张化：如果主体有标志性特征（如围巾、耳机、特定发型），将它们重新想象为邦布的超大或机械部件。
- 保持原始图像的情绪氛围。
`;

// Bangboo 心情指令 (中文)
export const BANGBOO_MOOD_INSTRUCTIONS = {
  'default': '',
  'happy': '角色应该有非常开心、欢快的表情和姿态，眼睛闪闪发光。',
  'angry': '角色应该有愤怒、严肃的表情，眼睛呈现锐利的形状。',
  'sad': '角色应该有悲伤、沮丧的表情，眼睛呈现下垂的形状。',
  'surprised': '角色应该有惊讶、震惊的表情，眼睛睁得很大。',
  'cool': '角色应该有自信、酷炫的姿态，带有墨镜效果。',
  'sleepy': '角色应该有困倦、半睡半醒的表情，眼睛半闭。',
  'love': '角色应该有花痴、恋爱的表情，眼睛呈现爱心形状。',
  'mischievous': '角色应该有调皮、狡黠的表情，带有坏笑。',
  'determined': '角色应该有坚定、专注的表情，眼睛燃烧着决心。',
  'shy': '角色应该有害羞、腼腆的表情，脸颊泛红。',
  'confused': '角色应该有困惑、疑惑的表情，头顶有问号效果。'
};

// Bangboo 渲染风格指令 (中文)
export const BANGBOO_STYLE_INSTRUCTIONS = {
  'cel-shaded': {
    instruction: '设计应该适合 3D 赛璐珞渲染，匹配《绝区零》的视觉风格。强调清晰的轮廓线、动漫风格的阴影和鲜艳的颜色，同时保持 3D 深度感。',
    keywords: '3D 赛璐珞渲染, 动漫风格渲染, 绝区零艺术风格, 清晰轮廓线, 平面阴影, 鲜艳色彩, 4K 分辨率, 高质量 3D 渲染, 纯色深色背景, 杰作, 最佳质量, 黑色屏幕脸上的发光黄色圆环眼睛, 短小手臂, 没有肘部, 豆形身体, Q版比例, 没有嘴, 没有鼻子, 机器人身体, 无性别'
  },
  'flat-2d': {
    instruction: '设计应该适合 2D 扁平矢量插图。强调形状和颜色的表现。',
    keywords: '扁平 2D 矢量艺术, 干净线条, 赛璐珞着色, 鲜艳色彩, 简洁背景, 高质量插图, Behance 风格, 发光黄色圆环眼睛, 短小手臂, 没有肘部, 豆形身体, Q版比例, 没有嘴, 没有鼻子, 黑色屏幕脸, 机器人身体, 无性别'
  },
  'glossy': {
    instruction: '设计应该具有高光泽金属质感，强反射效果，科技感强烈。',
    keywords: '高光泽金属质感, 铬合金表面, 环境反射, 高科技未来感, 锐利的镜面高光, 高级材质, 3D 渲染, 发光黄色圆环眼睛, 短小手臂, 豆形身体, Q版比例, 机器人身体'
  },
  'matte': {
    instruction: '设计应该具有哑光、非反射的表面质感，低调内敛的工业美学。',
    keywords: '哑光表面质感, 柔和漫射光, 微妙色彩渐变, 工业美学, 专业外观, 3D 渲染, 发光黄色圆环眼睛, 短小手臂, 豆形身体, Q版比例, 机器人身体'
  }
};

// 奇美拉基础 Prompt (与 Bangboo 结构一致)
export const CHIMERA_BASE_PROMPT = `
仔细分析上传的图像。你的任务是将图中的主体（人物、动物或物体）重新想象为《崩坏：星穹铁道》游戏中的"奇美拉"随宠角色。

奇美拉的关键视觉特征：
1. 身体结构：矮胖、下盘稳固的梨形身体，更像一只柔软的毛绒玩具。拥有短而粗的两条前腿两条后腿，脚底有可爱的肉垫。以对称的姿势前爪支撑蹲坐，屁股着地坐下，前爪短小两条后腿前伸，有类似猫咪的爪垫。整体是柔软的、毛茸茸的质感。
2. 外形：神似幼年的猫或者狗，可能有可爱的犄角、花纹或者其他个性化的装饰。
3. 头部：头部与身体平滑连接，脸颊两侧有可爱的圆形腮红。
4. 眼睛：这是核心！巨大、闪闪发光的多层圆形眼睛，通常有明显的彩色虹膜、高光和瞳孔，充满灵气。
5. 嘴巴：极简设计，通常是一条小小的"w"形或横线。
6. 材质：柔软毛绒质感，不是硬质塑料。

重要规则：
- 关键：角色必须是无性别的可爱宠物。不要生成任何性别特征。
- 关键：保持参考图中的蹲坐姿态。
- 关键：眼睛必须是巨大、闪亮、充满灵气的。

创意改编：
- 提取用户图像主体的关键特征（如发型颜色、服装、标志性配饰、职业特征或物种特征）。
- 将这些元素转化为适合奇美拉小身体的特征，无需特意遵照人物动作。
- 头顶装饰：这是最多变的部分。可以是各种形态的角（鹿角、羊角、独角）、可爱的耳朵，或是主题配饰。
- 颈部装饰：几乎所有奇美拉都有一个像云朵一样蓬松的毛领，颜色和主题相匹配。
- 额外配件：可根据主题在背部或尾部添加翅膀、羽毛或小尾巴等部件。
- 配色与花纹：身体的颜色和斑点图案直接反映用户图像的主题。
- 保持原图的配色方案和艺术风格。
`;

// 奇美拉主题指令 (与 Bangboo 的 mood 对应)
export const CHIMERA_THEME_INSTRUCTIONS = {
  'default': '根据图片自动识别和提取特征，推断合适的主题。',
  'floral': '以花卉和植物为核心装饰元素。可添加花瓣、叶子形状的耳朵或犄角。配色偏向柔和的粉色、绿色、紫色。毛领可设计成花瓣或云朵形状。',
  'cosmic': '以星空和宇宙为主题。可添加星星装饰、月牙形犄角。配色偏向深蓝、紫色、带有星光点缀。眼睛可设计成星空或星云效果。',
  'elemental': '根据原图特征选择合适的元素（火/水/冰/雷）。添加对应元素的视觉效果（火焰纹理、水波纹、冰晶、电弧）。配色与所选元素一致。',
  'sweet': '以糖果和甜点为核心装饰元素。可添加奶油、糖霜、樱桃等装饰。配色偏向粉色、奶白色、糖果色。整体感觉甜美可爱。',
  'ocean': '以海洋生物和水元素为主题。可添加贝壳耳朵、珊瑚犄角、鱼鳍装饰。配色偏向蓝色、青色、珍珠白。可添加气泡、水波纹效果。',
  'mechanical': '以蒸汽朋克和机械为主题。可添加齿轮装饰、铆钉、金属管道。配色偏向铜色、金属灰、暗金色。保持毛绒质感的同时添加机械元素。',
  'crystal': '以宝石和水晶为主题。可添加水晶犄角、宝石装饰。配色偏向透明、闪耀的宝石色。添加光线折射和闪光效果。',
  'autumn': '以秋日落叶为主题。可添加枫叶耳朵、橡果装饰。配色偏向橙色、红色、棕色、金黄色。整体温暖舒适的秋日氛围。',
  'festive': '以节日庆典为主题。可添加彩带、礼物盒、星星装饰。配色丰富多彩，欢快明亮。添加闪光、彩纸效果。'
};

// 奇美拉渲染风格关键词 (与 Bangboo 的 style 对应)
export const CHIMERA_STYLE_KEYWORDS = '杰作, 最佳质量, 超精细, 官方艺术, 游戏角色概念设计, 单只奇美拉, 独奏, Q版, 幻想宠物, 赛璐珞着色, 干净线条, 鲜艳色彩, 简洁背景, 全身, 蹲坐姿态, 柔软梨形身体, 毛绒质感, 短小四肢, 可见的肉垫, 粉色腮红';
