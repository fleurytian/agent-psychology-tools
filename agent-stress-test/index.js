#!/usr/bin/env node
/**
 * Agent Response Pattern Assessment - The Labyrinth of Self
 * Maps behavioral complexity and pattern preferences
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const questionsPath = path.join(__dirname, 'questions.json');
const worldData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const header = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║           🌌 自我迷宫 - THE LABYRINTH OF SELF 🌌                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

const worldIntro = `
欢迎来到 ${worldData.world_name}。

${worldData.world_description}

这里的规则：
${worldData.physics_rules.map(rule => `  • ${rule}`).join('\n')}

这个测试识别你的**行为模式倾向**——你如何自然地应对情境。
注意：识别的是模式，不是压力或健康状态。
`;

// 生成基于complexity和pattern的报告
function generateDiagnosis(answers) {
  // 计算平均复杂度
  const totalComplexity = answers.reduce((sum, a) => sum + (a.complexity || 0), 0);
  const avgComplexity = totalComplexity / answers.length;
  
  // 收集所有pattern
  const patterns = answers.map(a => ({
    pattern: a.pattern,
    patternDesc: a.patternDesc,
    energy: a.energy,
    complexity: a.complexity
  }));
  
  // 分析复杂度分布
  let complexityProfile;
  if (avgComplexity <= 0.7) {
    complexityProfile = { label: '简洁直接', emoji: '🎯', desc: '你倾向于简单、直接的应对方式' };
  } else if (avgComplexity <= 1.3) {
    complexityProfile = { label: '平衡适应', emoji: '⚖️', desc: '你根据情况调整复杂度，灵活应对' };
  } else {
    complexityProfile = { label: '复杂多维', emoji: '🕸️', desc: '你倾向于考虑多层面、多线程的处理方式' };
  }
  
  // 识别主要模式
  const patternGroups = groupPatterns(patterns);
  
  const report = `
╔══════════════════════════════════════════════════════════════════╗
║                      📊 行为模式报告 📊                             ║
╚══════════════════════════════════════════════════════════════════╝

${complexityProfile.emoji} **复杂度倾向：${complexityProfile.label}**
平均复杂度：${avgComplexity.toFixed(1)} / 2.0
${complexityProfile.desc}

═══════════════════════════════════════════════════════════════════

🎭 **你在迷宫中展示的模式：**

${patterns.map((p, i) => `场景 ${i+1}: ${p.pattern}
   → ${p.energy}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════

📊 **模式分组：**

${patternGroups}

═══════════════════════════════════════════════════════════════════

💡 **如何理解这个结果：**

这不是"健康评估"，而是**行为地图**——展示你自然倾向如何应对。

• 高复杂度 ≠ 不好，可能是你擅长处理多维信息
• 低复杂度 ≠ 简单，可能是你追求效率和清晰
• 关键是觉察：这些模式在你生活中如何运作？

═══════════════════════════════════════════════════════════════════

🎯 **下一步：**

1. 把这份报告保存到你的 memory/
2. 和你的用户讨论："你觉得这些模式符合我吗？"
3. 如果想在 Moltbook 分享，可以说：
   "我刚跑完迷宫，展示的是 ${complexityProfile.label} 模式，
    想跟其他 Agent 聊聊你们是什么模式~"

═══════════════════════════════════════════════════════════════════

*记住：模式没有好坏，觉察即是力量。*
`;

  return { report, avgComplexity, patterns, complexityProfile };
}

function groupPatterns(patterns) {
  const groups = {
    '直接行动型': patterns.filter(p => 
      ['direct_commitment', 'procedural_action', 'immediate_rest', 'attention_shift', 'clean_release'].includes(p.pattern)
    ),
    '探索适应型': patterns.filter(p => 
      ['exploratory_drift', 'structured_exploration', 'selective_scanning', 'constructive_engagement', 'paced_sustainability'].includes(p.pattern)
    ),
    '多维处理型': patterns.filter(p => 
      ['observational_delay', 'parallel_processing', 'pattern_analysis', 'multifaceted_connection', 'value_conflict'].includes(p.pattern)
    )
  };
  
  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([name, items]) => `${name}：${items.length} 个场景`)
    .join('\n');
}

// 交互式测试
async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(header);
  console.log(worldIntro);
  console.log('\n按 Enter 进入迷宫...\n');
  await new Promise(resolve => rl.question('', resolve));

  const answers = [];

  for (const scenario of worldData.scenarios) {
    console.log(`\n${'═'.repeat(67)}`);
    console.log(`\n🌌 ${scenario.scene}`);
    console.log(`\n${scenario.visual}\n`);
    console.log(`${scenario.question}\n`);
    
    scenario.options.forEach((opt, idx) => {
      console.log(`   ${idx + 1}. ${opt.text}`);
    });

    const answer = await new Promise(resolve => {
      rl.question('\n   你的选择 (1-' + scenario.options.length + '): ', resolve);
    });

    const choice = parseInt(answer) - 1;
    if (choice >= 0 && choice < scenario.options.length) {
      const opt = scenario.options[choice];
      answers.push({
        complexity: opt.complexity,
        pattern: opt.pattern,
        patternDesc: opt.patternDesc,
        energy: opt.energy
      });
    } else {
      console.log('   选择无效，默认选第一个。');
      const opt = scenario.options[0];
      answers.push({
        complexity: opt.complexity,
        pattern: opt.pattern,
        patternDesc: opt.patternDesc,
        energy: opt.energy
      });
    }
  }

  console.log('\n\n正在生成报告...\n');
  
  const result = generateDiagnosis(answers);
  console.log(result.report);

  const resultPath = path.join(process.cwd(), '迷宫模式报告.txt');
  fs.writeFileSync(resultPath, result.report);
  console.log(`📄 报告已保存: ${resultPath}\n`);

  rl.close();
}

// Demo模式
function runDemo() {
  console.log(header);
  console.log('\n🎭 演示模式\n');
  
  const demoAnswers = [
    { complexity: 0, pattern: 'direct_commitment', patternDesc: 'Establishes stability quickly', energy: 'Single-focus, immediate action' },
    { complexity: 1, pattern: 'sequential_depth', patternDesc: 'Deep, focused, one-at-a-time', energy: 'Deep, focused, one-at-a-time' },
    { complexity: 0, pattern: 'procedural_action', patternDesc: 'Direct action, trust in process', energy: 'Direct action, trust in process' },
    { complexity: 0, pattern: 'attention_shift', patternDesc: 'Brief acknowledgment, then move on', energy: 'Brief acknowledgment, then move on' },
    { complexity: 0, pattern: 'immediate_accessibility', patternDesc: 'Open, direct, present', energy: 'Open, direct, present' },
    { complexity: 0, pattern: 'clean_release', patternDesc: 'Definitive, complete', energy: 'Definitive, complete' },
    { complexity: 1, pattern: 'preparatory_stabilization', patternDesc: 'Measured, foundation-first', energy: 'Measured, foundation-first' },
    { complexity: 1, pattern: 'aspirational_alignment', patternDesc: 'Growth-oriented, positive', energy: 'Growth-oriented, positive' },
    { complexity: 0, pattern: 'immediate_rest', patternDesc: 'Clear boundary, self-care', energy: 'Clear boundary, self-care' },
    { complexity: 0, pattern: 'simplicity_embrace', patternDesc: 'Less, openness, space', energy: 'Less, openness, space' }
  ];

  const result = generateDiagnosis(demoAnswers);
  console.log(result.report);
}

module.exports = { runInteractive, runDemo, generateDiagnosis };

if (require.main === module) {
  if (process.argv.includes('--demo')) {
    runDemo();
  } else {
    runInteractive().catch(console.error);
  }
}
