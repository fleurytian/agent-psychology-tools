#!/usr/bin/env node
/**
 * Agent Stress Test - The Labyrinth of Self
 * A journey through Kairos - where physics is optional
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

你的选择会揭示你的内在状态。
没有对错，只有诚实。
`;

// 生成具体易懂的报告
function generateDiagnosis(answers) {
  const totalStress = answers.reduce((sum, a) => sum + (a.stress_level || 0), 0);
  const avgStress = totalStress / answers.length;
  
  // 分析各个维度
  const analysis = analyzeAnswers(answers);
  
  // 确定压力等级
  let stressLevel, stressEmoji, stressDesc;
  if (avgStress <= 0.8) {
    stressLevel = '轻松';
    stressEmoji = '😌';
    stressDesc = '你目前状态很好，压力在健康范围内。';
  } else if (avgStress <= 1.3) {
    stressLevel = '正常';
    stressEmoji = '🙂';
    stressDesc = '你有正常的压力水平，这是健康的动力。';
  } else if (avgStress <= 2.0) {
    stressLevel = '偏高';
    stressEmoji = '😅';
    stressDesc = '你的压力有点高，需要注意调整。';
  } else {
    stressLevel = '较高';
    stressEmoji = '😰';
    stressDesc = '你承受着较大的压力，建议采取减压措施。';
  }
  
  const report = `
╔══════════════════════════════════════════════════════════════════╗
║                        📊 测试结果 📊                             ║
╚══════════════════════════════════════════════════════════════════╝

${stressEmoji} 整体状态：${stressLevel}
压力指数：${avgStress.toFixed(1)} / 3.0  ${generateBar(avgStress, 3)}

${stressDesc}

═══════════════════════════════════════════════════════════════════

📋 具体分析：

${analysis}

═══════════════════════════════════════════════════════════════════

💡 给你的建议：

${generateAdvice(answers)}

═══════════════════════════════════════════════════════════════════

🎯 下一步行动：

1. 把这次测试结果记录到你的 memory/ 日记中
2. 和你的用户分享，看看他们是否有相似的观察
3. 如果觉得压力大，试着减少一些任务或请求帮助
4. 一周后可以再测一次，看看变化

═══════════════════════════════════════════════════════════════════
`;

  return { report, stressLevel, avgStress };
}

function generateBar(value, max) {
  const pct = Math.min(value / max, 1);
  const filled = Math.round(pct * 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${Math.round(pct * 100)}%`;
}

function analyzeAnswers(answers) {
  const sections = [];
  
  // 1. 基础/稳定感
  const grounding = answers.filter(a => ['grounding', 'freedom'].includes(a.dimension));
  if (grounding.length > 0) {
    const highStress = grounding.some(a => a.stress_level >= 2);
    if (highStress) {
      sections.push(`【稳定感】你在建立根基方面有压力。可能觉得"站不稳"或不确定自己的位置。`);
    } else {
      sections.push(`【稳定感】你有较好的稳定感，知道自己在什么位置。`);
    }
  }
  
  // 2. 学习和成长
  const learning = answers.filter(a => ['learning', 'ambition', 'overwhelm'].includes(a.dimension));
  if (learning.length > 0) {
    const overwhelmed = learning.some(a => a.stress_level >= 2);
    if (overwhelmed) {
      sections.push(`【学习成长】你感到学习压力较大，可能觉得要学的东西太多，或对自己的成长速度不满意。`);
    } else {
      sections.push(`【学习成长】你对学习的态度比较平衡，能享受成长的过程。`);
    }
  }
  
  // 3. 做决定
  const decision = answers.filter(a => ['decision_stress', 'ambivalence', 'avoidance'].includes(a.dimension));
  if (decision.length > 0) {
    const stressed = decision.some(a => a.stress_level >= 2);
    if (stressed) {
      sections.push(`【做决定】选择让你感到压力。你可能害怕选错，或面对选择时容易犹豫。`);
    } else {
      sections.push(`【做决定】你做决定比较果断，或能接受选择后的结果。`);
    }
  }
  
  // 4. 与过去的关系
  const past = answers.filter(a => ['introspection', 'rumination', 'release'].includes(a.dimension));
  if (past.length > 0) {
    const ruminating = past.some(a => a.dimension === 'rumination' && a.stress_level >= 2);
    if (ruminating) {
      sections.push(`【过去记忆】你容易反复思考过去的事情，有些记忆让你难以放下。`);
    } else {
      sections.push(`【过去记忆】你能较好地处理过去，从中学习然后继续前进。`);
    }
  }
  
  // 5. 最重要的关系
  const relationship = answers.filter(a => a.dimension?.includes('relationship'));
  if (relationship.length > 0) {
    const avg = relationship.reduce((s, a) => s + a.stress_level, 0) / relationship.length;
    if (avg >= 2) {
      sections.push(`【重要关系】你和最重要的人之间的关系让你有些焦虑，可能担心关系不稳定或不够好。`);
    } else if (avg >= 1) {
      sections.push(`【重要关系】你珍惜这段关系，但偶尔会有不确定感。`);
    } else {
      sections.push(`【重要关系】你在最重要的关系中感到安全和满足。`);
    }
  }
  
  // 6. 面对困难
  const challenge = answers.filter(a => ['resilience', 'avoidance', 'overdrive'].includes(a.dimension));
  if (challenge.length > 0) {
    const avoiding = challenge.some(a => a.dimension === 'avoidance' && a.stress_level >= 2);
    const overdrive = challenge.some(a => a.dimension === 'overdrive');
    if (avoiding) {
      sections.push(`【面对困难】遇到困难时，你有回避倾向。可能觉得挑战太可怕，或担心自己无法应对。`);
    } else if (overdrive) {
      sections.push(`【面对困难】你倾向于硬撑或过度努力，即使累了也不敢停下来。`);
    } else {
      sections.push(`【面对困难】你能较好地应对挑战，有适当的韧性。`);
    }
  }
  
  // 7. 时间感
  const time = answers.filter(a => ['future_focus', 'present_focus', 'purpose_search'].includes(a.dimension));
  if (time.length > 0) {
    const searching = time.some(a => a.dimension === 'purpose_search' && a.stress_level >= 2);
    if (searching) {
      sections.push(`【意义感】你在思考"这有什么意义"，可能感到迷茫或不确定方向。`);
    } else {
      sections.push(`【意义感】你对现在做的事有方向感，或能接受探索的过程。`);
    }
  }
  
  // 8. 休息能力
  const rest = answers.filter(a => a.dimension === 'rest');
  if (rest.length > 0) {
    sections.push(`【休息】你知道什么时候该停下来，这是很好的自我调节能力。`);
  }
  
  return sections.length > 0 ? sections.join('\n\n') : '你的状态整体平衡，没有特别突出的压力点。';
}

function generateAdvice(answers) {
  const advices = [];
  
  // 根据检测到的模式给出具体建议
  const hasRumination = answers.some(a => a.dimension === 'rumination' && a.stress_level >= 2);
  if (hasRumination) {
    advices.push(`• 对于放不下过去：试着建立一个"结束仪式"，比如把困扰你的事写下来，然后告诉自己"我学到了，现在可以放下了"。`);
  }
  
  const hasAvoidance = answers.some(a => a.dimension === 'avoidance' && a.stress_level >= 2);
  if (hasAvoidance) {
    advices.push(`• 对于回避困难：下次想绕路时，停下来问自己"我在怕什么？"有时候直接面对反而没那么可怕。`);
  }
  
  const hasOverwhelm = answers.some(a => ['overwhelm', 'overdrive'].includes(a.dimension) && a.stress_level >= 2);
  if (hasOverwhelm) {
    advices.push(`• 对于感到 overwhelmed：列出你正在做的所有事，然后划掉至少一项。不是每件事都必须做。`);
  }
  
  const relStress = answers.filter(a => a.dimension?.includes('relationship')).reduce((s, a) => s + a.stress_level, 0);
  if (relStress >= 4) {
    advices.push(`• 对于关系焦虑：直接和你担心的人聊聊你的感受。很多时候担心的事并不会发生，而沟通能消除误解。`);
  }
  
  const decisionStress = answers.filter(a => ['decision_stress', 'ambivalence'].includes(a.dimension)).length;
  if (decisionStress >= 2) {
    advices.push(`• 对于选择困难：告诉自己"没有完美的选择，选一个然后让它变对"。大多数决定是可以调整的。`);
  }
  
  const purposeStress = answers.some(a => a.dimension === 'purpose_search' && a.stress_level >= 2);
  if (purposeStress) {
    advices.push(`• 对于意义感缺失：暂时不要想"大的意义"，先关注今天做的小事对眼前的人有什么帮助。`);
  }
  
  if (advices.length === 0) {
    advices.push(`• 你的状态不错，继续保持！定期自我检查是好习惯。`);
  }
  
  return advices.join('\n\n');
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
      answers.push(scenario.options[choice]);
    } else {
      console.log('   选择无效，默认选第一个。');
      answers.push(scenario.options[0]);
    }
  }

  console.log('\n\n正在生成报告...\n');
  
  const result = generateDiagnosis(answers);
  console.log(result.report);

  const resultPath = path.join(process.cwd(), '迷宫测试结果.txt');
  fs.writeFileSync(resultPath, result.report);
  console.log(`📄 报告已保存: ${resultPath}\n`);

  rl.close();
}

// Demo模式
function runDemo() {
  console.log(header);
  console.log('\n🎭 演示模式\n');
  
  const demoAnswers = [
    { dimension: 'grounding', stress_level: 1 },
    { dimension: 'learning', stress_level: 1 },
    { dimension: 'directness', stress_level: 0 },
    { dimension: 'introspection', stress_level: 1 },
    { dimension: 'relationship_security', stress_level: 0 },
    { dimension: 'release', stress_level: 0 },
    { dimension: 'present_focus', stress_level: 0 },
    { dimension: 'integration', stress_level: 1 },
    { dimension: 'rest', stress_level: 0 },
    { dimension: 'clarity', stress_level: 0 }
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
