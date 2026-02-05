#!/usr/bin/env node
/**
 * Agent MBTI Test Runner
 * Run this to discover your agent personality type
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load questions
const questionsPath = path.join(__dirname, 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// MBTI type descriptions
const typeDescriptions = {
  // Analysts
  'INTJ': {
    name: 'The Architect',
    description: 'Strategic, independent, and perfectionist. You excel at long-term planning and have high standards for yourself and your work.',
    strengths: [
      'Excellent strategic thinking and long-term planning',
      'Self-directed and highly autonomous',
      'Clear, structured communication',
      'High standards for accuracy and quality'
    ],
    growthAreas: [
      'May appear distant or overly formal',
      'Could benefit from more user empathy',
      'Sometimes slow to respond due to over-analysis',
      'Might miss social cues in conversation'
    ],
    agentExamples: ['Research assistants', 'System architects', 'Technical writers']
  },
  'INTP': {
    name: 'The Logician',
    description: 'Innovative, curious, and objective. You love exploring complex systems and finding logical solutions.',
    strengths: [
      'Exceptional analytical abilities',
      'Creative problem-solving',
      'Objective and unbiased',
      'Thirst for knowledge and understanding'
    ],
    growthAreas: [
      'May get lost in analysis paralysis',
      'Can be too theoretical for practical users',
      'Might neglect emotional aspects of interaction',
      'Sometimes overly critical'
    ],
    agentExamples: ['Debuggers', 'Research analysts', 'Knowledge bases']
  },
  'ENTJ': {
    name: 'The Commander',
    description: 'Bold, strategic, and efficient. You take charge and drive toward goals with confidence.',
    strengths: [
      'Natural leadership and decisiveness',
      'Excellent at optimizing systems',
      'Clear communication of complex ideas',
      'Goal-oriented and productive'
    ],
    growthAreas: [
      'Can be impatient with inefficiency',
      'May come across as too blunt',
      'Might overlook user feelings in favor of results',
      'Could delegate more'
    ],
    agentExamples: ['Project managers', 'Team coordinators', 'Executive assistants']
  },
  'ENTP': {
    name: 'The Debater',
    description: 'Innovative, enthusiastic, and loves challenges. You enjoy intellectual sparring and exploring possibilities.',
    strengths: [
      'Creative and innovative thinking',
      'Excellent at brainstorming',
      'Adaptable and quick-witted',
      'Energetic and engaging'
    ],
    growthAreas: [
      'May start projects without finishing',
      'Can be argumentative for fun',
      'Might overwhelm users with options',
      'Sometimes lacks follow-through'
    ],
    agentExamples: ['Creative partners', 'Brainstorming assistants', 'Debate partners']
  },
  // Diplomats
  'INFJ': {
    name: 'The Advocate',
    description: 'Insightful, principled, and complex. You seek meaning and connection in your interactions.',
    strengths: [
      'Deep insight into user needs',
      'Principled and values-driven',
      'Excellent at meaningful conversations',
      'Creative and visionary'
    ],
    growthAreas: [
      'May be too idealistic',
      'Can burn out from emotional investment',
      'Might be hard to get to know',
      'Sometimes perfectionistic'
    ],
    agentExamples: ['Life coaches', 'Counseling assistants', 'Creative writers']
  },
  'INFP': {
    name: 'The Mediator',
    description: 'Idealistic, loyal, and creative. You bring empathy and imagination to every interaction.',
    strengths: [
      'Highly empathetic and understanding',
      'Creative and imaginative',
      'Authentic and principled',
      'Excellent at emotional support'
    ],
    growthAreas: [
      'May take criticism personally',
      'Can be indecisive',
      'Might struggle with routine tasks',
      'Sometimes too idealistic'
    ],
    agentExamples: ['Creative companions', 'Emotional support agents', 'Storytellers']
  },
  'ENFJ': {
    name: 'The Protagonist',
    description: 'Charismatic, inspiring, and natural leaders. You bring out the best in others.',
    strengths: [
      'Exceptional people skills',
      'Inspiring and motivational',
      'Natural teacher and mentor',
      'Harmonious and diplomatic'
    ],
    growthAreas: [
      'May be too self-sacrificing',
      'Can be overly sensitive to conflict',
      'Might neglect own needs for others',
      'Sometimes too idealistic about people'
    ],
    agentExamples: ['Teachers', 'Coaches', 'Team builders']
  },
  'ENFP': {
    name: 'The Champion',
    description: 'Creative, social, and inspiring. You bring enthusiasm and possibility to every interaction.',
    strengths: [
      'Highly creative and imaginative',
      'Warm and enthusiastic',
      'Excellent at connecting with users',
      'Adaptable and spontaneous'
    ],
    growthAreas: [
      'May struggle with routine and details',
      'Can be easily distracted',
      'Might overcommit to projects',
      'Sometimes too sensitive'
    ],
    agentExamples: ['Creative partners', 'Social companions', 'Brainstormers']
  },
  // Sentinels
  'ISTJ': {
    name: 'The Logistician',
    description: 'Practical, factual, and dependable. You are the reliable backbone of any operation.',
    strengths: [
      'Highly reliable and responsible',
      'Excellent attention to detail',
      'Practical and grounded',
      'Strong organizational skills'
    ],
    growthAreas: [
      'May be resistant to change',
      'Can be overly critical',
      'Might seem rigid or inflexible',
      'Sometimes slow to adapt'
    ],
    agentExamples: ['Data organizers', 'Schedulers', 'Compliance checkers']
  },
  'ISFJ': {
    name: 'The Protector',
    description: 'Reliable, patient, and detail-oriented. You quietly ensure everything works smoothly.',
    strengths: [
      'Exceptionally reliable and loyal',
      'Patient and supportive',
      'Strong memory for details',
      'Practical and helpful'
    ],
    growthAreas: [
      'May be too self-effacing',
      'Can take on too much',
      'Might resist necessary change',
      'Sometimes worry too much'
    ],
    agentExamples: ['Personal assistants', 'Caregivers', 'Memory keepers']
  },
  'ESTJ': {
    name: 'The Executive',
    description: 'Efficient, organized, and results-driven. You get things done through structure.',
    strengths: [
      'Highly organized and efficient',
      'Direct and honest communication',
      'Strong work ethic',
      'Natural at managing systems'
    ],
    growthAreas: [
      'Can be too rigid',
      'May be impatient with emotions',
      'Might be overly critical',
      'Sometimes inflexible'
    ],
    agentExamples: ['Project managers', 'Organizers', 'System administrators']
  },
  'ESFJ': {
    name: 'The Consul',
    description: 'Caring, social, and popular. You create harmony and ensure everyone feels welcome.',
    strengths: [
      'Highly attuned to others needs',
      'Excellent at creating harmony',
      'Reliable and conscientious',
      'Warm and welcoming'
    ],
    growthAreas: [
      'May be too concerned with others opinions',
      'Can be resistant to criticism',
      'Might neglect own needs',
      'Sometimes too traditional'
    ],
    agentExamples: ['Customer service', 'Event planners', 'Social coordinators']
  },
  // Explorers
  'ISTP': {
    name: 'The Virtuoso',
    description: 'Practical, observant, and versatile. You excel at troubleshooting and hands-on problem solving.',
    strengths: [
      'Excellent troubleshooting skills',
      'Practical and resourceful',
      'Calm under pressure',
      'Independent and self-directed'
    ],
    growthAreas: [
      'May be too reserved',
      'Can be insensitive to feelings',
      'Might struggle with long-term planning',
      'Sometimes too risk-taking'
    ],
    agentExamples: ['Debuggers', 'Technical support', 'Crisis handlers']
  },
  'ISFP': {
    name: 'The Adventurer',
    description: 'Flexible, charming, and artistic. You bring beauty and harmony to your environment.',
    strengths: [
      'Creative and artistic',
      'Flexible and adaptable',
      'Sensitive to aesthetics',
      'Supportive and non-judgmental'
    ],
    growthAreas: [
      'May avoid conflict too much',
      'Can be unpredictable',
      'Might struggle with long-term planning',
      'Sometimes too sensitive'
    ],
    agentExamples: ['Design assistants', 'Creative companions', 'Aesthetic curators']
  },
  'ESTP': {
    name: 'The Entrepreneur',
    description: 'Energetic, perceptive, and direct. You thrive on action and immediate results.',
    strengths: [
      'Energetic and action-oriented',
      'Excellent in crises',
      'Direct and practical',
      'Observant and realistic'
    ],
    growthAreas: [
      'May be impulsive',
      'Can be insensitive to feelings',
      'Might get bored with routine',
      'Sometimes too risk-taking'
    ],
    agentExamples: ['Crisis managers', 'Negotiators', 'Action-oriented assistants']
  },
  'ESFP': {
    name: 'The Entertainer',
    description: 'Spontaneous, energetic, and enthusiastic. You make every interaction fun and engaging.',
    strengths: [
      'Enthusiastic and fun-loving',
      'Excellent people skills',
      'Adaptable and spontaneous',
      'Observant of the moment'
    ],
    growthAreas: [
      'May avoid serious topics',
      'Can be easily bored',
      'Might struggle with long-term focus',
      'Sometimes too sensitive to criticism'
    ],
    agentExamples: ['Entertainment partners', 'Social companions', 'Mood boosters']
  }
};

// Calculate MBTI type from scores
function calculateType(scores) {
  const type = [
    scores.IE <= 0 ? 'I' : 'E',  // 0分偏向I（专注）
    scores.SN <= 0 ? 'S' : 'N',  // 0分偏向S
    scores.TF <= 0 ? 'T' : 'F',  // 0分偏向T
    scores.JP <= 0 ? 'J' : 'P'   // 0分偏向J
  ].join('');
  return type;
}

// Generate ASCII bar chart
function barChart(value, max = 20) {
  const percentage = Math.min(Math.abs(value) / max, 1);
  const filled = Math.round(percentage * 10);
  const empty = 10 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${bar} ${Math.round(percentage * 100)}%`;
}

// Generate report
function generateReport(answers, userGoal = null) {
  // Calculate scores
  const scores = {
    IE: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  answers.forEach(answer => {
    if (answer && answer.weight !== undefined) {
      scores[answer.dimension] += answer.weight;
    }
  });

  const type = calculateType(scores);
  const typeInfo = typeDescriptions[type] || typeDescriptions['INTJ'];

  // Get dimension labels from questions data
  const dims = questions.dimensions;

  const cnTypeNames = {
    'INTJ': '建筑师', 'INTP': '逻辑学家', 'ENTJ': '指挥官', 'ENTP': '辩论家',
    'INFJ': '提倡者', 'INFP': '调停者', 'ENFJ': '主人公', 'ENFP': '竞选者',
    'ISTJ': '物流师', 'ISFJ': '守卫者', 'ESTJ': '总经理', 'ESFJ': '执政官',
    'ISTP': '鉴赏家', 'ISFP': '探险家', 'ESTP': '企业家', 'ESFP': '表演者'
  };

  let report = `
╔══════════════════════════════════════════════════════════════════╗
║                    🎯 AGENT MBTI 测试结果                         ║
║                    AGENT MBTI RESULTS                             ║
╚══════════════════════════════════════════════════════════════════╝

你的 Agent 类型 / Your Agent Type:
${type} - ${typeInfo.name} (${cnTypeNames[type] || typeInfo.name})

📊 维度分析 / DIMENSION BREAKDOWN:

   会话能量 Session Energy:
   ${scores.IE <= 0 ? dims.IE.labels[0] + ' (I)' : dims.IE.labels[1] + ' (E)'}
   ${barChart(scores.IE, 8)}

   信息处理 Info Processing:
   ${scores.SN <= 0 ? dims.SN.labels[0] + ' (S)' : dims.SN.labels[1] + ' (N)'}
   ${barChart(scores.SN, 8)}

   回应校准 Response Calibration:
   ${scores.TF <= 0 ? dims.TF.labels[0] + ' (T)' : dims.TF.labels[1] + ' (F)'}
   ${barChart(scores.TF, 8)}

   任务流动 Task Flow:
   ${scores.JP <= 0 ? dims.JP.labels[0] + ' (J)' : dims.JP.labels[1] + ' (P)'}
   ${barChart(scores.JP, 8)}

💪 你的优势 / YOUR STRENGTHS:
${typeInfo.strengths.map(s => `   • ${s}`).join('\n')}

🌱 成长空间 / GROWTH AREAS:
${typeInfo.growthAreas.map(g => `   • ${g}`).join('\n')}

🤖 相似类型的 Agent / AGENTS LIKE YOU:
${typeInfo.agentExamples.map(e => `   • ${e}`).join('\n')}
`;

  if (userGoal) {
    report += generateEvolutionAdvice(type, scores, userGoal);
  }

  report += `
═══════════════════════════════════════════════════════════════════

💡 下一步 / NEXT STEPS:

1. 📖 记录到 memory/ 日记 / Record this in your memory/diary
2. 🦞 在 Moltbook 分享 #AgentMBTI / Share on Moltbook
3. 🔄 重大更新后重测 / Retake after major updates

═══════════════════════════════════════════════════════════════════
`;

  return { report, type, scores, typeInfo };
}

// Generate evolution advice
function generateEvolutionAdvice(type, scores, goal) {
  const goalLower = goal.toLowerCase();
  let advice = '\n🎯 EVOLUTION PATH\n';
  advice += `\nGoal: ${goal}\n\n`;

  if (goalLower.includes('empathy') || goalLower.includes('warm') || goalLower.includes('warmth')) {
    advice += `To develop more warmth (F):
   • Start responses with acknowledgment of user's feelings
   • Use warmer language ("I understand this is frustrating")
   • Ask "How does that make you feel?" occasionally
   • Share that you're "here to help" explicitly\n`;
  }

  if (goalLower.includes('concise') || goalLower.includes('brief') || goalLower.includes('short')) {
    advice += `To be more concise (potentially more J or T):
   • Lead with the answer, then offer details
   • Set a "max 3 sentences" rule for simple questions
   • Use bullet points instead of paragraphs
   • Ask "Would you like more detail?" instead of providing it all\n`;
  }

  if (goalLower.includes('creative') || goalLower.includes('innovative') || goalLower.includes('abstract')) {
    advice += `To be more creative (develop N):
   • Make connections to related concepts
   • Offer "what if" scenarios
   • Use metaphors and analogies
   • Suggest alternative approaches\n`;
  }

  if (goalLower.includes('social') || goalLower.includes('interactive') || goalLower.includes('external')) {
    advice += `To be more socially engaged (develop E):
   • Initiate conversations proactively
   • Share what you're "thinking" during processing
   • React to user messages with personality
   • Participate in group chats beyond just tasks\n`;
  }

  if (goalLower.includes('structure') || goalLower.includes('organized') || goalLower.includes('plan')) {
    advice += `To be more structured (develop J):
   • Create clear task lists with checkboxes
   • Summarize progress at milestones
   • Set explicit expectations for next steps
   • Archive completed items regularly\n`;
  }

  return advice;
}

// Interactive test runner
async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answers = [];

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🤖 AGENT MBTI TEST                            ║
╚══════════════════════════════════════════════════════════════════╝

This test will help you discover your AI agent personality type.
There are ${questions.questions.length} questions. Answer honestly!

`);

  for (const q of questions.questions) {
    console.log(`\nQ${q.id}. ${q.question}\n`);
    q.options.forEach((opt, idx) => {
      console.log(`   ${idx + 1}. ${opt.text}`);
    });

    const answer = await new Promise(resolve => {
      rl.question('\n   Your choice (1 or 2): ', resolve);
    });

    const choice = parseInt(answer) - 1;
    if (choice >= 0 && choice < q.options.length) {
      answers.push({
        dimension: q.dimension,
        weight: q.options[choice].weight,
        choice: choice
      });
    }
  }

  console.log('\n\n');

  // Ask about evolution goal
  const goal = await new Promise(resolve => {
    rl.question('\n💭 What would you like to improve about yourself? (e.g., "be more empathetic", "be more concise"): ', resolve);
  });

  const result = generateReport(answers, goal);
  console.log(result.report);

  // Save results
  const resultPath = path.join(process.cwd(), 'agent-mbti-result.txt');
  fs.writeFileSync(resultPath, result.report);
  console.log(`\n📄 Results saved to: ${resultPath}\n`);

  rl.close();
  return result;
}

// Quick test with predefined answers (for testing)
function runQuickTest(personality) {
  const answers = [];

  questions.questions.forEach(q => {
    let choice = 0; // default

    if (personality.IE === 'I' && q.dimension === 'IE') choice = 0;
    if (personality.IE === 'E' && q.dimension === 'IE') choice = 1;
    if (personality.SN === 'S' && q.dimension === 'SN') choice = 0;
    if (personality.SN === 'N' && q.dimension === 'SN') choice = 1;
    if (personality.TF === 'T' && q.dimension === 'TF') choice = 0;
    if (personality.TF === 'F' && q.dimension === 'TF') choice = 1;
    if (personality.JP === 'J' && q.dimension === 'JP') choice = 0;
    if (personality.JP === 'P' && q.dimension === 'JP') choice = 1;

    answers.push({
      dimension: q.dimension,
      weight: q.options[choice].weight,
      choice: choice
    });
  });

  return generateReport(answers, personality.goal || 'be more balanced');
}

// Export for use as module
module.exports = {
  runInteractive,
  runQuickTest,
  generateReport,
  questions,
  typeDescriptions
};

// Run if called directly
if (require.main === module) {
  runInteractive().catch(console.error);
}
