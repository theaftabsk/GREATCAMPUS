import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nivaBupaQuestions30 = [
  // SECTION 1: COMMUNICATION & CUSTOMER HANDLING (Q1 - Q5)
  {
    sectionName: 'Communication & Customer Handling',
    sectionOrder: 1,
    question: `A bank customer says: "I came to discuss my fixed deposit. I don't want another sales pitch." What is the most effective response?`,
    optionA: `Insurance is important, so please hear me out.`,
    optionB: `Understood. Let's first complete your FD discussion.`,
    optionC: `Most customers eventually need additional protection.`,
    optionD: `I can explain the policy in just two minutes.`,
    correctAnswer: `B`,
    marks: 1,
  },
  {
    sectionName: 'Communication & Customer Handling',
    sectionOrder: 1,
    question: `A customer is visibly irritated because an insurance document has not arrived. You discover that the document was generated, but delivery has been delayed. What should you do?`,
    optionA: `Explain the delay and provide the next expected step.`,
    optionB: `Tell the customer that delivery is handled by the operations department.`,
    optionC: `Ask the customer to contact the insurer directly.`,
    optionD: `Apologise and promise delivery by tomorrow.`,
    correctAnswer: `A`,
    marks: 1,
  },
  {
    sectionName: 'Communication & Customer Handling',
    sectionOrder: 1,
    question: `A customer asks: "Will this policy definitely pay for my father's treatment?" You have not examined the policy terms or medical details. What is the most appropriate response?`,
    optionA: `It should be covered if the policy is active.`,
    optionB: `Most treatments are covered under health insurance.`,
    optionC: `Yes, provided the premium has been paid.`,
    optionD: `Let's check the applicable terms before I answer.`,
    correctAnswer: `D`,
    marks: 1,
  },
  {
    sectionName: 'Communication & Customer Handling',
    sectionOrder: 1,
    question: `During a conversation, a customer gives short answers and appears uncomfortable discussing personal financial matters. What should the RM do?`,
    optionA: `Continue asking detailed financial questions.`,
    optionB: `Explain why the information is necessary and proceed sensitively.`,
    optionC: `Recommend a standard product without further questions as that it goes well with the customer.`,
    optionD: `End the conversation and approach the customer later.`,
    correctAnswer: `B`,
    marks: 1,
  },
  {
    sectionName: 'Communication & Customer Handling',
    sectionOrder: 1,
    question: `Which approach best demonstrates consultative customer handling?`,
    optionA: `Present benefits before asking questions.`,
    optionB: `Ask questions, understand needs, and then recommend.`,
    optionC: `Offer several products and let customers compare and make a decision.`,
    optionD: `Start with the product most frequently purchased.`,
    correctAnswer: `B`,
    marks: 1,
  },

  // SECTION 2: ADVANCED ENGLISH (Q6 - Q10)
  {
    sectionName: 'Advanced English',
    sectionOrder: 2,
    question: `Read the statement: "The customer's reluctance was not attributable to the premium alone; rather, it appeared to stem from uncertainty about the extent of coverage." What does the statement imply?`,
    optionA: `The premium was the customer's only concern.`,
    optionB: `The customer had rejected the product because it was expensive.`,
    optionC: `The customer was mainly concerned about payment frequency.`,
    optionD: `The customer's hesitation involved uncertainty about coverage.`,
    correctAnswer: `D`,
    marks: 1,
  },
  {
    sectionName: 'Advanced English',
    sectionOrder: 2,
    question: `Read the passage: A customer may have substantial savings and still face a significant financial vulnerability if an unexpected medical expense requires immediate payment. Savings provide liquidity, whereas insurance is designed to transfer specified risks subject to policy conditions. The two therefore serve different financial purposes. Which conclusion is best supported?`,
    optionA: `Savings are unsuitable for handling healthcare expenses in the future during any emergency.`,
    optionB: `Insurance should replace all forms of personal savings.`,
    optionC: `Savings and insurance can address different aspects of financial risk.`,
    optionD: `Customers with substantial savings do not need health insurance.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Advanced English',
    sectionOrder: 2,
    question: `Read the statement: "Although customer engagement increased significantly, conversion remained unchanged. This suggests that the issue may lie less in the quantity of interactions and more in what occurs during those interactions." Which inference is strongest?`,
    optionA: `Customer engagement should be reduced.`,
    optionB: `The product is unsuitable for the customer segment.`,
    optionC: `The quality of customer interactions warrants examination.`,
    optionD: `Higher activity levels generally reduce conversion.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Advanced English',
    sectionOrder: 2,
    question: `Choose the grammatically correct sentence.`,
    optionA: `Had the RM verified the information, the misunderstanding might have been avoided.`,
    optionB: `Had the RM verified the information, the misunderstanding will be avoided.`,
    optionC: `If the RM had verified the information, the misunderstanding is avoided.`,
    optionD: `If the RM verified the information, the misunderstanding might had been avoided.`,
    correctAnswer: `A`,
    marks: 1,
  },
  {
    sectionName: 'Advanced English',
    sectionOrder: 2,
    question: `Read the statement: "The branch recorded its strongest quarterly sales, yet customer retention declined and service complaints increased." Which conclusion is most defensible?`,
    optionA: `Sales growth was entirely driven by poor service.`,
    optionB: `The branch should stop pursuing aggressive sales targets as it is effecting the servcie.`,
    optionC: `Customer retention has no relationship with sales performance.`,
    optionD: `Sales achievement alone is insufficient to judge overall performance.`,
    correctAnswer: `D`,
    marks: 1,
  },

  // SECTION 3: MENTAL ABILITY & REASONING (Q11 - Q15)
  {
    sectionName: 'Mental Ability & Reasoning',
    sectionOrder: 3,
    question: `Six candidates - P, Q, R, S, T and U - are ranked from first to sixth. • P ranks above R. • R ranks above S. • Q ranks above T. • T ranks above U. • S ranks above U. Which candidate cannot be ranked first?`,
    optionA: `P`,
    optionB: `Q`,
    optionC: `R`,
    optionD: `S`,
    correctAnswer: `D`,
    marks: 1,
  },
  {
    sectionName: 'Mental Ability & Reasoning',
    sectionOrder: 3,
    question: `A person walks 10 km east, turns left and walks 6 km, then turns left and walks 10 km. Where is the person relative to the starting point?`,
    optionA: `6 km north`,
    optionB: `6 km south`,
    optionC: `10 km east`,
    optionD: `10 km west`,
    correctAnswer: `A`,
    marks: 1,
  },
  {
    sectionName: 'Mental Ability & Reasoning',
    sectionOrder: 3,
    question: `If BANK → CBOL and CREDIT → DSFEJU using the same rule, then LOAN becomes:`,
    optionA: `MPBO`,
    optionB: `MPAO`,
    optionC: `LPBO`,
    optionD: `MQBO`,
    correctAnswer: `A`,
    marks: 1,
  },
  {
    sectionName: 'Mental Ability & Reasoning',
    sectionOrder: 3,
    question: `Five activities must follow these rules: • A occurs before C. • B occurs before D. • C occurs before E. • D occurs before E. Which activity could occur first?`,
    optionA: `E`,
    optionB: `C`,
    optionC: `D`,
    optionD: `A`,
    correctAnswer: `D`,
    marks: 1,
  },
  {
    sectionName: 'Mental Ability & Reasoning',
    sectionOrder: 3,
    question: `A sequence follows the rule: 3 → 12, 5 → 30, 7 → 56, 9 → 90. Which number should replace the question mark? 11 → ?`,
    optionA: `110`,
    optionB: `121`,
    optionC: `132`,
    optionD: `144`,
    correctAnswer: `C`,
    marks: 1,
  },

  // SECTION 4: ADVANCED NUMERICAL & MATHEMATICAL REASONING (Q16 - Q20)
  {
    sectionName: 'Advanced Numerical & Mathematical Reasoning',
    sectionOrder: 4,
    question: `Three RMs generate business in the ratio 3 : 5 : 7. Their combined business is ₹12 lakh. How much does the highest-producing RM generate?`,
    optionA: `₹4.8 lakh`,
    optionB: `₹5.2 lakh`,
    optionC: `₹5.6 lakh`,
    optionD: `₹6.0 lakh`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Advanced Numerical & Mathematical Reasoning',
    sectionOrder: 4,
    question: `A branch has a target of 600 policies. • Team A achieves 120% of its 150-policy target. • Team B achieves 90% of its 200-policy target. • Team C achieves 80% of its 150-policy target. • Team D achieves 95 policies. How many policies does the branch achieve?`,
    optionA: `515`,
    optionB: `525`,
    optionC: `535`,
    optionD: `545`,
    correctAnswer: `B`,
    marks: 1,
  },
  {
    sectionName: 'Advanced Numerical & Mathematical Reasoning',
    sectionOrder: 4,
    question: `A bank has 1,200 eligible customers. • 40% are contacted. • 50% of contacted customers show interest. • 60% of interested customers attend a meeting. • 50% of meetings lead to proposals. • 80% of proposals convert. How many policies should result?`,
    optionA: `96`,
    optionB: `108`,
    optionC: `112`,
    optionD: `115`,
    correctAnswer: `A`,
    marks: 1,
  },
  {
    sectionName: 'Advanced Numerical & Mathematical Reasoning',
    sectionOrder: 4,
    question: `An RM has achieved ₹7.2 lakh in the first 12 working days. There are 8 working days remaining. To finish the month at ₹12 lakh, what average daily business is required for the remaining days?`,
    optionA: `₹52,000`,
    optionB: `₹55,000`,
    optionC: `₹60,000`,
    optionD: `₹65,000`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Advanced Numerical & Mathematical Reasoning',
    sectionOrder: 4,
    question: `A branch increases sales by 30%, while the number of active RMs increases by 20%. Approximately what happens to sales per RM?`,
    optionA: `It rises by about 8.3%.`,
    optionB: `It rises by exactly 10%.`,
    optionC: `It rises by about 12%.`,
    optionD: `It falls by about 8.3%.`,
    correctAnswer: `A`,
    marks: 1,
  },

  // SECTION 5: BANKING & FINANCIAL AWARENESS (Q21 - Q25)
  {
    sectionName: 'Banking & Financial Awareness',
    sectionOrder: 5,
    question: `A customer's credit score has declined after repeated missed loan repayments. What does this most directly indicate?`,
    optionA: `The customer's income has necessarily declined.`,
    optionB: `The customer's investment portfolio has lost value, and he is confused.`,
    optionC: `The customer's creditworthiness may have been negatively affected.`,
    optionD: `The customer's bank account has become inactive.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Banking & Financial Awareness',
    sectionOrder: 5,
    question: `A customer asks why a bank assesses income, existing liabilities and repayment history before approving a loan. What is the primary reason?`,
    optionA: `To determine whether the customer qualifies for insurance.`,
    optionB: `To estimate the customer's investment returns.`,
    optionC: `To establish the customer's tax liability.`,
    optionD: `To assess repayment capacity and credit risk.`,
    correctAnswer: `D`,
    marks: 1,
  },
  {
    sectionName: 'Banking & Financial Awareness',
    sectionOrder: 5,
    question: `A customer has income of ₹1 lakh per month and total monthly loan obligations of ₹60,000. Which conclusion is most reasonable?`,
    optionA: `The customer has no capacity to save.`,
    optionB: `The customer's repayment burden warrants careful assessment.`,
    optionC: `The customer should automatically receive a new loan.`,
    optionD: `The customer is financially secure because income exceeds liabilities.`,
    correctAnswer: `B`,
    marks: 1,
  },
  {
    sectionName: 'Banking & Financial Awareness',
    sectionOrder: 5,
    question: `What is the primary purpose of diversification in an investment portfolio?`,
    optionA: `To eliminate investment risk completely.`,
    optionB: `To guarantee a positive annual return.`,
    optionC: `To spread exposure across different investments.`,
    optionD: `To concentrate capital in the strongest asset.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Banking & Financial Awareness',
    sectionOrder: 5,
    question: `A customer asks why inflation matters when comparing returns on savings. Which explanation is most appropriate?`,
    optionA: `Inflation determines the customer's credit score which affects his borrowing capability.`,
    optionB: `Inflation reduces the purchasing power of money over time.`,
    optionC: `Inflation guarantees higher bank interest rates.`,
    optionD: `Inflation affects only customers who borrow money.`,
    correctAnswer: `B`,
    marks: 1,
  },

  // SECTION 6: SALES ORIENTATION & SITUATIONAL JUDGEMENT (Q26 - Q30)
  {
    sectionName: 'Sales Orientation & Situational Judgement',
    sectionOrder: 6,
    question: `A customer appears interested but repeatedly postpones the decision. Which action demonstrates the strongest sales judgment?`,
    optionA: `Increase pressure to create urgency.`,
    optionB: `Offer a discount without understanding the hesitation.`,
    optionC: `Ask what unresolved concern is preventing a decision.`,
    optionD: `Stop following up to avoid irritating the customer.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Sales Orientation & Situational Judgement',
    sectionOrder: 6,
    question: `You have consistently achieved your activity targets but missed your sales targets. What does this most strongly suggest?`,
    optionA: `Your activity levels are necessarily too low.`,
    optionB: `Your customers are unsuitable.`,
    optionC: `Your conversion effectiveness needs examination.`,
    optionD: `Your sales target is probably could be unrealistic and discuss this with your boss.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Sales Orientation & Situational Judgement',
    sectionOrder: 6,
    question: `An RM discovers that a colleague is telling customers that purchasing insurance is mandatory for receiving a banking service. What should the RM do?`,
    optionA: `Ignore it because the colleague is generating business.`,
    optionB: `Repeat the practice only for high-value customers as they are the ones who help you achieve your targets.`,
    optionC: `Discuss the concern privately and escalate appropriately if required.`,
    optionD: `Confront the colleague in front of the customer.`,
    correctAnswer: `C`,
    marks: 1,
  },
  {
    sectionName: 'Sales Orientation & Situational Judgement',
    sectionOrder: 6,
    question: `A customer asks a technical question, and the RM is unsure of the answer. The customer appears ready to purchase. What should the RM do?`,
    optionA: `Give the most likely answer to avoid losing the sale.`,
    optionB: `Acknowledge the uncertainty and verify the information.`,
    optionC: `Redirect the discussion to another product benefit.`,
    optionD: `Ask the customer to research the answer independently.`,
    correctAnswer: `B`,
    marks: 1,
  },
  {
    sectionName: 'Sales Orientation & Situational Judgement',
    sectionOrder: 6,
    question: `Which candidate demonstrates the strongest potential for an Assistant Relationship Manager – Banca role?`,
    optionA: `A candidate who is highly persuasive but sometimes overlooks customer concerns.`,
    optionB: `A candidate who is technically knowledgeable but uncomfortable initiating conversations.`,
    optionC: `A candidate who is target-driven and willing to make aggressive commitments.`,
    optionD: `A candidate who listens, analyses needs, explains clearly and follows through.`,
    correctAnswer: `D`,
    marks: 1,
  },
];

async function seed() {
  console.log('Seeding 30 Niva Bupa ARM Banca Questions & Assessment Configuration...');

  // 1. Create or Update Tenant
  let tenant = await prisma.tenant.findFirst({ where: { slug: 'niva-bupa' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Niva Bupa Health Insurance',
        slug: 'niva-bupa',
      },
    });
  }

  // 2. Create or Update Assessment (30 Questions, 22 Mins Duration, 30 Total Score)
  let assessment = await prisma.assessment.findFirst({
    where: { slug: 'aa-2812' },
  });

  if (!assessment) {
    assessment = await prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        name: 'Agency Unit Manager & ARM Banca Assessment',
        slug: 'aa-2812',
        description: 'Advanced Graduate & Post-Graduate Assessment for Assistant Relationship Manager - Banca Channel',
        durationMins: 22,
        passingPercentage: 50,
        maxProctorWarnings: 3,
        status: 'ACTIVE',
      },
    });
  } else {
    assessment = await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        name: 'Agency Unit Manager & ARM Banca Assessment',
        description: 'Advanced Graduate & Post-Graduate Assessment for Assistant Relationship Manager - Banca Channel',
        durationMins: 22,
        passingPercentage: 50,
        maxProctorWarnings: 3,
        status: 'ACTIVE',
      },
    });
  }

  // 3. Clear existing questions & attempt questions cleanly
  await prisma.attemptQuestion.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.question.deleteMany({});

  // 4. Insert 30 Questions into database
  for (let i = 0; i < nivaBupaQuestions30.length; i++) {
    const q = nivaBupaQuestions30[i];
    await prisma.question.create({
      data: {
        assessmentId: assessment.id,
        sectionName: q.sectionName,
        sectionOrder: q.sectionOrder,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        order: i + 1,
      },
    });
  }

  const count = await prisma.question.count();
  console.log(`✅ SUCCESS: ${count} Questions seeded cleanly!`);
  console.log(`Assessment Configured: Duration = ${assessment.durationMins} Mins, Total Score = ${count}`);
}

seed()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
