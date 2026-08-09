import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'greatcampus' },
    update: {},
    create: {
      name: 'GREATCAMPUS Assessment Platform',
      slug: 'greatcampus',
    },
  });

  // 2. Create Default Admin Account
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: 'admin123' },
    create: {
      tenantId: tenant.id,
      username: 'admin',
      password: 'admin123',
      name: 'HR Super Administrator',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created Admin user:', admin.username);

  // 3. Create Assessment 1: Bank Manager Assessment
  const bankExam = await prisma.assessment.upsert({
    where: { slug: 'bank-manager-assessment' },
    update: {
      name: 'Bank Manager Assessment',
      durationMins: 60,
      passingPercentage: 50,
      maxProctorWarnings: 3,
    },
    create: {
      tenantId: tenant.id,
      name: 'Bank Manager Assessment',
      slug: 'bank-manager-assessment',
      description: 'Comprehensive evaluation for Banking Operations, Financial Compliance, and Team Leadership.',
      durationMins: 60,
      passingPercentage: 50,
      maxProctorWarnings: 3,
    },
  });

  // 4. Create Assessment 2: Influencer Assessment
  const influencerExam = await prisma.assessment.upsert({
    where: { slug: 'influencer-marketing-assessment' },
    update: {
      name: 'Influencer & Social Media Marketing Assessment',
      durationMins: 60,
      passingPercentage: 50,
      maxProctorWarnings: 3,
    },
    create: {
      tenantId: tenant.id,
      name: 'Influencer & Social Media Marketing Assessment',
      slug: 'influencer-marketing-assessment',
      description: 'Assessment for Content Creators, Brand Pitching, Engagement Analytics, and Campaign Management.',
      durationMins: 60,
      passingPercentage: 50,
      maxProctorWarnings: 3,
    },
  });

  // Helper function to populate 2 Subjects, 6 Sections each, 10 Questions each (Total 120 Questions per Exam)
  async function seedExamQuestions(
    assessmentId: string,
    subjectsData: Array<{
      name: string;
      sections: Array<{
        name: string;
        questionsToAsk: number;
        sampleQuestions: Array<{ q: string; a: string; b: string; c: string; d: string; ans: string }>;
      }>;
    }>
  ) {
    let subjectOrder = 1;
    for (const sub of subjectsData) {
      const subject = await prisma.assessmentSubject.create({
        data: {
          assessmentId,
          name: sub.name,
          displayOrder: subjectOrder++,
        },
      });

      let sectionOrder = 1;
      for (const sec of sub.sections) {
        const section = await prisma.subjectSection.create({
          data: {
            subjectId: subject.id,
            name: sec.name,
            questionsToAsk: sec.questionsToAsk,
            displayOrder: sectionOrder++,
          },
        });

        // Add 10 questions per section to reach full pool
        for (let i = 0; i < 10; i++) {
          const sample = sec.sampleQuestions[i % sec.sampleQuestions.length];
          await prisma.question.create({
            data: {
              sectionId: section.id,
              question: `[Q${i + 1}] ${sample.q}`,
              optionA: sample.a,
              optionB: sample.b,
              optionC: sample.c,
              optionD: sample.d,
              correctAnswer: sample.ans,
              marks: 1,
            },
          });
        }
      }
    }
  }

  // --- SEED BANK MANAGER EXAM ---
  // Delete existing subjects for clean seed
  await prisma.assessmentSubject.deleteMany({ where: { assessmentId: bankExam.id } });

  await seedExamQuestions(bankExam.id, [
    {
      name: 'Subject 1: Banking & Financial Awareness',
      sections: [
        {
          name: 'General Banking Operations',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is the primary function of a Commercial Bank?', a: 'Issuing Currency Notes', b: 'Accepting Deposits & Granting Loans', c: 'Determining Tax Rates', d: 'Stock Market Trading', ans: 'B' },
            { q: 'What does KYC stand for in Banking?', a: 'Know Your Customer', b: 'Know Your Capital', c: 'Keep Your Cash', d: 'Key Yield Calculation', ans: 'A' },
            { q: 'Which account type does not earn interest?', a: 'Savings Account', b: 'Current Account', c: 'Fixed Deposit', d: 'Recurring Deposit', ans: 'B' },
          ],
        },
        {
          name: 'RBI & Monetary Policy',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is Repo Rate?', a: 'Rate at which RBI lends short-term money to commercial banks', b: 'Rate paid on savings deposits', c: 'Foreign exchange conversion rate', d: 'Inflation measurement rate', ans: 'A' },
            { q: 'What does CRR stand for?', a: 'Credit Reserve Ratio', b: 'Cash Reserve Ratio', c: 'Capital Return Rate', d: 'Current Reserve Reference', ans: 'B' },
            { q: 'Who regulates banking in India?', a: 'SEBI', b: 'IRDAI', c: 'Reserve Bank of India', d: 'Ministry of Finance', ans: 'C' },
          ],
        },
        {
          name: 'Loans & Credit Risk',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What does NPA stand for in banking terms?', a: 'Net Profit Addition', b: 'Non-Performing Asset', c: 'National Payment Account', d: 'Non-Payment Assessment', ans: 'B' },
            { q: 'After how many days of non-payment is a loan classified as NPA?', a: '30 Days', b: '60 Days', c: '90 Days', d: '180 Days', ans: 'C' },
            { q: 'What is a CIBIL score used for?', a: 'Income tax calculation', b: 'Evaluating creditworthiness', c: 'Calculating interest on FD', d: 'Passport verification', ans: 'B' },
          ],
        },
        {
          name: 'Customer Service & Communication',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'How should a manager handle an escalated customer grievance?', a: 'Ignore it', b: 'Listen patiently, investigate facts, and provide resolution within TAT', c: 'Tell customer to file court case', d: 'Blame junior staff', ans: 'B' },
            { q: 'What is Banking Ombudsman?', a: 'Senior Auditor', b: 'Quasi-judicial authority appointed by RBI to resolve customer complaints', c: 'IT Support officer', d: 'Branch Manager', ans: 'B' },
            { q: 'Which document is mandatory for opening a new bank account?', a: 'Driving License only', b: 'Officially Valid Document (PAN/Aadhaar)', c: 'Electricity Bill only', d: 'School Certificate', ans: 'B' },
          ],
        },
        {
          name: 'Digital Banking & Security',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is UPI?', a: 'Universal Payment Index', b: 'Unified Payments Interface', c: 'United Privacy Institute', d: 'User Protection Infrastructure', ans: 'B' },
            { q: 'What is 2FA in online banking?', a: 'Two-Factor Authentication', b: 'Two-File Attachment', c: 'Secondary Financial Agent', d: 'Dual Account Access', ans: 'A' },
            { q: 'Never share which detail over call or SMS?', a: 'Bank IFSC Code', b: 'Branch Name', c: 'OTP / CVV / PIN', d: 'Account Holder Name', ans: 'C' },
          ],
        },
        {
          name: 'Financial Calculations & Interest',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'Formula for Simple Interest:', a: 'P * R * T / 100', b: 'P (1 + r)^n', c: 'P + R + T', d: 'P / R * T', ans: 'A' },
            { q: 'If Principal is $10,000, Rate is 10%, Time is 2 years, SI is:', a: '$1,000', b: '$2,000', c: '$12,000', d: '$500', ans: 'B' },
            { q: 'Compound interest pays interest on:', a: 'Principal only', b: 'Principal + Accumulated Interest', c: 'Profit margin only', d: 'Tax amount', ans: 'B' },
          ],
        },
      ],
    },
    {
      name: 'Subject 2: Management & Leadership',
      sections: [
        {
          name: 'Team Leadership & Supervision',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is the key trait of an effective Branch Manager?', a: 'Micromanagement', b: 'Clear communication, delegation, and motivating team', c: 'Working alone', d: 'Avoiding responsibilities', ans: 'B' },
            { q: 'How do you address underperformance in a team member?', a: 'Publicly reprimand', b: 'Provide constructive feedback, training, and clear performance goals', c: 'Fire immediately', d: 'Ignore the problem', ans: 'B' },
          ],
        },
        {
          name: 'Decision Making & Ethics',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'If offered a personal favor to clear a suspicious loan, a manager should:', a: 'Accept it', b: 'Refuse, report breach of code of conduct to compliance team', c: 'Delay loan', d: 'Ask for higher favor', ans: 'B' },
            { q: 'What is Conflict of Interest?', a: 'Working overtime', b: 'Situation where personal interest clashes with professional duty', c: 'Disagreement between competitors', d: 'Team meeting', ans: 'B' },
          ],
        },
        {
          name: 'Target Planning & Sales Orientation',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'How to achieve quarterly branch target?', a: 'Push unnecessary products', b: 'Segment customer base, train staff on product cross-selling, track daily pipeline', c: 'Wait until last week of quarter', d: 'Reduce interest rates unlawfully', ans: 'B' },
            { q: 'Cross-selling means:', a: 'Selling competitors product', b: 'Offering additional relevant financial products to existing customers', c: 'Selling products across state borders', d: 'Canceling old accounts', ans: 'B' },
          ],
        },
        {
          name: 'Audit & Compliance Management',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is the purpose of Internal Audit?', a: 'Find fault in individuals', b: 'Verify compliance with policies, operational accuracy, and risk mitigation', c: 'Prepare publicity reports', d: 'Calculate salaries', ans: 'B' },
            { q: 'AML stands for:', a: 'Asset Management Limited', b: 'Anti-Money Laundering', c: 'Automatic Money Transfer', d: 'Account Maintenance Layer', ans: 'B' },
          ],
        },
        {
          name: 'Problem Solving & Critical Thinking',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'Root Cause Analysis helps to:', a: 'Identify fundamental reason behind operational failures', b: 'Blame junior staff', c: 'Increase product prices', d: 'Shorten working hours', ans: 'A' },
            { q: 'What is SMART goal setting?', a: 'Specific, Measurable, Achievable, Relevant, Time-bound', b: 'Simple, Massive, Action-oriented, Rapid, Tough', c: 'Standard, Monthly, Annual, Regional, Tactical', d: 'Strategic, Methodical, Analytical, Rational, Timely', ans: 'A' },
          ],
        },
        {
          name: 'Business Strategy & Growth',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'SWOT Analysis evaluates:', a: 'Strengths, Weaknesses, Opportunities, Threats', b: 'Sales, Wealth, Operations, Targets', c: 'Securities, Warrants, Options, Treasury', d: 'Systems, Workflows, Optimization, Training', ans: 'A' },
            { q: 'Customer Retention is:', a: 'Keeping existing customers satisfied and active', b: 'Blocking customer account exits', c: 'Charging exit fees', d: 'Acquiring new walk-ins only', ans: 'A' },
          ],
        },
      ],
    },
  ]);
  console.log('✅ Seeded Bank Manager Assessment (120 Questions Pool, 60 Attempt Questions)');

  // --- SEED INFLUENCER ASSESSMENT ---
  await prisma.assessmentSubject.deleteMany({ where: { assessmentId: influencerExam.id } });

  await seedExamQuestions(influencerExam.id, [
    {
      name: 'Subject 1: Social Media Strategy & Analytics',
      sections: [
        {
          name: 'Content Strategy & Planning',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is a Content Calendar used for?', a: 'Tracking employee attendance', b: 'Planning and scheduling posts across channels', c: 'Calculating ad budgets', d: 'Design logo', ans: 'B' },
            { q: 'What is Organic Reach?', a: 'Number of unique viewers without paid promotion', b: 'Reach obtained via paid ads', c: 'Follower count', d: 'Website clicks from email', ans: 'A' },
          ],
        },
        {
          name: 'Audience Engagement & Community',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'Engagement Rate is calculated as:', a: '(Total Interactions / Total Reach) * 100', b: 'Followers / Likes', c: 'Ad Spend / Impressions', d: 'Comments * Shares', ans: 'A' },
            { q: 'How to build strong audience trust?', a: 'Buy fake followers', b: 'Post authentic content, engage in comments, provide value', c: 'Post once every 3 months', d: 'Turn off comments', ans: 'B' },
          ],
        },
        {
          name: 'Video & Short-Form Content',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is the most crucial part of a short video reel/TikTok?', a: 'Ending credits', b: 'First 3-second hook', c: 'Background color', d: 'Video title font size', ans: 'B' },
            { q: 'Which aspect ratio is standard for vertical short videos?', a: '16:9', b: '9:16', c: '4:3', d: '21:9', ans: 'B' },
          ],
        },
        {
          name: 'Platform Algorithms & SEO',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What signals algorithms to promote content?', a: 'High watch time, shares, and saves', b: 'Deleting posts often', c: 'Using 100 irrelevant hashtags', d: 'Changing profile picture daily', ans: 'A' },
            { q: 'Social Media SEO involves:', a: 'Optimizing profile bio, captions, and alt-text with relevant keywords', b: 'Paying search engines', c: 'Coding HTML', d: 'Hiding hashtags', ans: 'A' },
          ],
        },
        {
          name: 'Social Media Analytics & KPIs',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What does CTR stand for?', a: 'Click-Through Rate', b: 'Customer Trend Index', c: 'Content Total Reach', d: 'Creative Transfer Ratio', ans: 'A' },
            { q: 'What measures return on paid campaigns?', a: 'ROAS (Return on Ad Spend)', b: 'Follower Gain', c: 'Profile Views', d: 'Story Count', ans: 'A' },
          ],
        },
        {
          name: 'Digital Trends & Viral Marketing',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is Trend Jacking?', a: 'Hacking competitor accounts', b: 'Leveraging trending news or memes for brand visibility', c: 'Stealing artwork', d: 'Buying ads on news channels', ans: 'B' },
            { q: 'UGC stands for:', a: 'User-Generated Content', b: 'Universal Growth Campaign', c: 'Ultimate Graphic Creator', d: 'Underground Gaming Community', ans: 'A' },
          ],
        },
      ],
    },
    {
      name: 'Subject 2: Content Creation & Brand Pitching',
      sections: [
        {
          name: 'Brand Collaborations & Sponsorships',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What document does an influencer send to brands with stats?', a: 'Resume', b: 'Media Kit', c: 'Tax Return', d: 'Bank Statement', ans: 'B' },
            { q: 'What is CPM in sponsorship deals?', a: 'Cost Per Mille (Thousand Impressions)', b: 'Cost Per Member', c: 'Creative Production Method', d: 'Campaign Planning Model', ans: 'A' },
          ],
        },
        {
          name: 'Negotiation & Pricing',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'How should an influencer determine sponsored post rates?', a: 'Random guess', b: 'Based on reach, engagement rate, production effort, and usage rights', c: 'Copying competitor exactly', d: 'Free product trade only', ans: 'B' },
            { q: 'What are Content Usage Rights?', a: 'Rights granting the brand permission to re-use influencer content in ads', b: 'Rights to delete creator account', c: 'Free lifetime product access', d: 'Copyright transfer to platform', ans: 'A' },
          ],
        },
        {
          name: 'Copywriting & Storytelling',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'A Call-To-Action (CTA) example:', a: 'Click the link in bio to learn more!', b: 'Thanks for reading', c: 'This post took 2 hours to edit', d: 'No comments please', ans: 'A' },
            { q: 'Storytelling in marketing creates:', a: 'Emotional connection and higher retention', b: 'Boredom', c: 'Instant refunds', d: 'Legal conflicts', ans: 'A' },
          ],
        },
        {
          name: 'Influencer Ethics & Disclosure',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'Legal requirement when posting paid promotions:', a: 'Clear disclosure like #ad or #sponsored', b: 'Hide sponsorship info', c: 'Only mention brand in direct message', d: 'Delete post after 24 hours', ans: 'A' },
            { q: 'Promoting dishonest or harmful products results in:', a: 'Loss of audience trust and legal penalties', b: 'Better algorithm push', c: 'Verified badge', d: 'Free publicity', ans: 'A' },
          ],
        },
        {
          name: 'Project Management & Campaign Execution',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'What is a Campaign Brief?', a: 'Document detailing brand goals, key messages, deliverables, and guidelines', b: 'Payment receipt', c: 'Short text message', d: 'Audience comment list', ans: 'A' },
            { q: 'Deliverables in a contract specify:', a: 'Exact output expected (e.g. 1 Reel, 2 Stories)', b: 'Influencers home address', c: 'Brand founder biography', d: 'Phone model used', ans: 'A' },
          ],
        },
        {
          name: 'Crisis Management & Public Relations',
          questionsToAsk: 5,
          sampleQuestions: [
            { q: 'How to handle online backlash or negative viral trend?', a: 'Address transparently, apologize if wrong, and outline corrective actions', b: 'Block all followers and delete account', c: 'Argue aggressively in comments', d: 'Blame audience', ans: 'A' },
            { q: 'PR stands for:', a: 'Public Relations', b: 'Personal Reach', c: 'Page Rank', d: 'Post Reaction', ans: 'A' },
          ],
        },
      ],
    },
  ]);
  console.log('✅ Seeded Influencer Assessment (120 Questions Pool, 60 Attempt Questions)');

  // 5. Create Sample Candidate assigned to Bank Manager Assessment
  const candidate = await prisma.candidate.upsert({
    where: { referenceId: 'REF-BANK-1001' },
    update: {
      assessmentId: bankExam.id,
    },
    create: {
      name: 'Aftab SK',
      email: 'aftab@example.com',
      phone: '+91 98765 43210',
      referenceId: 'REF-BANK-1001',
      assessmentId: bankExam.id,
      status: 'REGISTERED',
    },
  });
  console.log('✅ Seeded Sample Candidate:', candidate.name, 'Assigned Exam:', bankExam.name);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
