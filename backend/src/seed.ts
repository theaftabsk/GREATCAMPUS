import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialQuestions = [
  // SECTION 1: Communication & Customer Handling (10 Qs)
  {
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "A walk-in customer expresses frustration about a delay in servicing their account. As an ARM, what is your most appropriate initial response?",
    optionA: "Explain that the branch is understaffed today and ask them to return later.",
    optionB: "Listen actively, acknowledge their concern with empathy, and assure them of immediate assistance.",
    optionC: "Direct them immediately to the branch manager without listening to the issue.",
    optionD: "Inform them that delay is standard procedure for security checks.",
    correctAnswer: "B",
  },
  {
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "When explaining a financial product to a customer who has no prior banking knowledge, which communication style should you adopt?",
    optionA: "Use technical banking acronyms to demonstrate expertise.",
    optionB: "Keep the explanation simple, clear, and relatable using plain language.",
    optionC: "Hand them a detailed product manual and ask them to read it at home.",
    optionD: "Speak rapidly to cover all product features within 2 minutes.",
    correctAnswer: "B",
  },
  {
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "A high-net-worth customer asks for details about an insurance policy you are not fully certain about. What should you do?",
    optionA: "Guess the answer and provide an approximate figure to maintain confidence.",
    optionB: "Politely inform them that you will confirm the exact details with the specialist and follow up promptly.",
    optionC: "Refuse to answer and transfer the call without explanation.",
    optionD: "Advise the customer to search the internet for details.",
    correctAnswer: "B",
  },
  {
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "Which non-verbal cue indicates that a customer is engaged and listening during your sales pitch?",
    optionA: "Looking repeatedly at their wristwatch.",
    optionB: "Maintaining steady eye contact and nodding occasionally.",
    optionC: "Folding arms tightly across the chest and leaning back.",
    optionD: "Checking notifications on their mobile phone.",
    correctAnswer: "B",
  },
  {
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "What is the primary objective of asking open-ended questions during a customer interaction?",
    optionA: "To limit the conversation to yes or no answers.",
    optionB: "To uncover the customer's financial needs, goals, and underlying concerns.",
    optionC: "To complete the interaction as quickly as possible.",
    optionD: "To prevent the customer from raising objections.",
    correctAnswer: "B",
  },

  // SECTION 2: Basic English (10 Qs)
  {
    section: "english",
    sectionName: "Basic English",
    question: "Choose the word that is most nearly OPPOSITE in meaning to 'TRANSPARENT':",
    optionA: "Clear",
    optionB: "Opaque",
    optionC: "Lucid",
    optionD: "Apparent",
    correctAnswer: "B",
  },
  {
    section: "english",
    sectionName: "Basic English",
    question: "Identify the correctly spelled word suitable for a formal business letter:",
    optionA: "Recommendation",
    optionB: "Recomendation",
    optionC: "Recommondation",
    optionD: "Ricommendation",
    correctAnswer: "A",
  },
  {
    section: "english",
    sectionName: "Basic English",
    question: "Fill in the blank with the appropriate preposition: 'The candidate was well-prepared _____ the interview.'",
    optionA: "with",
    optionB: "for",
    optionC: "about",
    optionD: "on",
    correctAnswer: "B",
  },

  // SECTION 3: Mental Ability & Reasoning (10 Qs)
  {
    section: "reasoning",
    sectionName: "Mental Ability & Reasoning",
    question: "Complete the logical series: 4, 9, 19, 39, 79, ____",
    optionA: "119",
    optionB: "149",
    optionC: "159",
    optionD: "169",
    correctAnswer: "C",
  },
  {
    section: "reasoning",
    sectionName: "Mental Ability & Reasoning",
    question: "If 'BANK' is coded as 'CBOL', how will 'LOAN' be coded in the same pattern?",
    optionA: "MPBO",
    optionB: "MPBN",
    optionC: "KNZM",
    optionD: "NQBP",
    correctAnswer: "A",
  },

  // SECTION 4: Basic Maths & Numerical Ability (10 Qs)
  {
    section: "maths",
    sectionName: "Basic Maths & Numerical Ability",
    question: "What is the Simple Interest earned on ₹50,000 invested at an annual interest rate of 8% for 3 years?",
    optionA: "₹8,000",
    optionB: "₹12,000",
    optionC: "₹14,000",
    optionD: "₹16,000",
    correctAnswer: "B",
  },
  {
    section: "maths",
    sectionName: "Basic Maths & Numerical Ability",
    question: "A product is priced at ₹4,000. If a discount of 15% is offered during a bank campaign, what is the final selling price?",
    optionA: "₹3,200",
    optionB: "₹3,400",
    optionC: "₹3,500",
    optionD: "₹3,600",
    correctAnswer: "B",
  },

  // SECTION 5: Banking & Financial Awareness (10 Qs)
  {
    section: "banking",
    sectionName: "Banking & Financial Awareness",
    question: "What does the financial term 'KYC' stand for in banking compliance?",
    optionA: "Know Your Customer",
    optionB: "Keep Your Cash",
    optionC: "Key Yield Calculation",
    optionD: "Know Your Credit",
    correctAnswer: "A",
  },
  {
    section: "banking",
    sectionName: "Banking & Financial Awareness",
    question: "Which instrument is typically issued by a bank to guarantee fixed returns over a specified tenure?",
    optionA: "Equity Shares",
    optionB: "Fixed Deposit (FD)",
    optionC: "Mutual Fund SIP",
    optionD: "Commercial Paper",
    correctAnswer: "B",
  },

  // SECTION 6: Sales Orientation & Situational Judgement (10 Qs)
  {
    section: "sales",
    sectionName: "Sales Orientation & Situational Judgement",
    question: "A customer visits the branch to renew a ₹2 Lakh Fixed Deposit. How should an ARM approach cross-selling insurance?",
    optionA: "Insist that renewing the FD requires mandatory insurance purchase.",
    optionB: "Appreciate their habit of saving, then inquire about their health protection plan to explore suitability.",
    optionC: "Avoid mentioning insurance because FD customers never buy insurance.",
    optionD: "Hand them an insurance brochure without any conversation.",
    correctAnswer: "B",
  },
  {
    section: "sales",
    sectionName: "Sales Orientation & Situational Judgement",
    question: "When a customer states 'I already have enough savings and don't need insurance', how should you respond?",
    optionA: "Argue that savings are useless without insurance.",
    optionB: "Acknowledge their strong savings habit, then explain how insurance preserves those savings during emergencies.",
    optionC: "Close the discussion immediately.",
    optionD: "Offer a cash discount.",
    correctAnswer: "B",
  }
];

async function main() {
  console.log("Seeding NestJS Enterprise Database...");

  const tenant = await prisma.tenant.upsert({
    where: { slug: "greatcampus" },
    update: {},
    create: {
      name: "GREATCAMPUS",
      slug: "greatcampus",
    },
  });

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: "admin123" },
    create: {
      username: "admin",
      password: "admin123",
      name: "HR System Administrator",
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  const assessment = await prisma.assessment.upsert({
    where: { id: "default-assessment" },
    update: {},
    create: {
      id: "default-assessment",
      title: "Assistant Relationship Manager – Banca Channel",
      tenantId: tenant.id,
      durationMins: 65,
      passingMarksPercent: 60,
    },
  });

  for (let i = 0; i < initialQuestions.length; i++) {
    const q = initialQuestions[i];
    await prisma.question.create({
      data: {
        assessmentId: assessment.id,
        section: q.section,
        sectionName: q.sectionName,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: 1,
        difficulty: "Medium",
      },
    });
  }

  console.log("NestJS database seeded with tenant, admin, and assessment questions!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
