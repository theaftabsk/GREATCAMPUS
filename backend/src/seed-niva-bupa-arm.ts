import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nivaBupaArmQuestions = [
  // SECTION 1 – COMMUNICATION & CUSTOMER HANDLING (Q1-Q10) -> Pick 5 Random
  {
    subjectName: "Section 1: Communication & Customer Handling",
    sectionName: "Communication & Customer Handling",
    questionsToAsk: 5,
    questions: [
      {
        question: `A bank customer says:\n"I came to discuss my fixed deposit. I don't want another sales pitch."\nWhat is the most effective response?`,
        optionA: `"Insurance is important, so please hear me out."`,
        optionB: `"Understood. Let's first complete your FD discussion."`,
        optionC: `"Most customers eventually need additional protection."`,
        optionD: `"I can explain the policy in just two minutes."`,
        correctAnswer: "B",
      },
      {
        question: `A customer says:\n"My employer already provides health insurance, so buying another policy seems unnecessary."\nWhich response demonstrates the strongest need-discovery approach?`,
        optionA: `"Employer insurance usually has insufficient coverage."`,
        optionB: `"Additional insurance provides greater financial security."`,
        optionC: `"May I understand the cover, dependants and continuity of your existing plan?"`,
        optionD: `"Our policy can supplement your employer's insurance."`,
        correctAnswer: "C",
      },
      {
        question: `A customer is visibly irritated because an insurance document has not arrived. You discover that the document was generated but delivery has been delayed.\nWhat should you do?`,
        optionA: "Explain the delay and provide the next expected step.",
        optionB: "Tell the customer that delivery is handled elsewhere.",
        optionC: "Ask the customer to contact the insurer directly.",
        optionD: "Apologise and promise delivery by tomorrow.",
        correctAnswer: "A",
      },
      {
        question: `A customer asks:\n"Will this policy definitely pay for my father's treatment?"\nYou have not examined the policy terms or medical details.\nWhat is the most appropriate response?`,
        optionA: `"It should be covered if the policy is active."`,
        optionB: `"Most treatments are covered under health insurance."`,
        optionC: `"Yes, provided the premium has been paid."`,
        optionD: `"Let's check the applicable terms before I answer."`,
        correctAnswer: "D",
      },
      {
        question: `During a conversation, a customer gives short answers and appears uncomfortable discussing personal financial matters.\nWhat should the RM do?`,
        optionA: "Continue asking detailed financial questions.",
        optionB: "Explain why the information is necessary and proceed sensitively.",
        optionC: "Recommend a standard product without further questions.",
        optionD: "End the conversation and approach the customer later.",
        correctAnswer: "B",
      },
      {
        question: `A customer says:\n"I don't understand why you are asking about my family members when we are discussing my banking relationship."\nWhat is the best response?`,
        optionA: "Explain that understanding dependants helps assess protection needs.",
        optionB: "Tell the customer that the information is mandatory.",
        optionC: "Ask the customer to complete the form independently.",
        optionD: "Explain that every bank customer is asked these questions.",
        correctAnswer: "A",
      },
      {
        question: `A customer is interested in health insurance but says the premium is higher than expected.\nWhat should the RM do first?`,
        optionA: "Offer the lowest-priced policy immediately.",
        optionB: "Explain why the premium is reasonable.",
        optionC: "Understand the customer's priorities and affordability.",
        optionD: "Suggest reducing the level of coverage.",
        correctAnswer: "C",
      },
      {
        question: `An RM has five minutes before the next scheduled appointment. A customer raises a complicated service issue.\nWhat is the best approach?`,
        optionA: "Give a quick answer and leave.",
        optionB: "Ask the customer to return another day.",
        optionC: "Transfer the customer without understanding the issue.",
        optionD: "Establish the issue and agree on the appropriate next step.",
        correctAnswer: "D",
      },
      {
        question: `A customer says:\n"My previous advisor told me something different from what you're saying."\nWhat should the RM do?`,
        optionA: "Defend the previous advisor.",
        optionB: "Ask what was communicated and verify the applicable information.",
        optionC: "Tell the customer that advice can differ.",
        optionD: "Continue with the current product explanation.",
        correctAnswer: "B",
      },
      {
        question: `Which approach best demonstrates consultative customer handling?`,
        optionA: "Present benefits before asking questions.",
        optionB: "Ask questions, understand needs and then recommend.",
        optionC: "Offer several products and let customers compare.",
        optionD: "Start with the product most frequently purchased.",
        correctAnswer: "B",
      },
    ],
  },

  // SECTION 2 – ADVANCED ENGLISH (Q11-Q20) -> Pick 5 Random
  {
    subjectName: "Section 2: Advanced English",
    sectionName: "Advanced English",
    questionsToAsk: 5,
    questions: [
      {
        question: `Choose the sentence that is grammatically correct.`,
        optionA: "Neither the RM nor the branch manager were aware of the change.",
        optionB: "Neither the RM or the branch manager was aware of the change.",
        optionC: "Neither the RM nor the branch manager was aware of the change.",
        optionD: "Neither RM nor branch manager were aware about the change.",
        correctAnswer: "C",
      },
      {
        question: `Read the statement:\n"The customer's reluctance was not attributable to the premium alone; rather, it appeared to stem from uncertainty about the extent of coverage."\nWhat does the statement imply?`,
        optionA: "The premium was the customer's only concern.",
        optionB: "The customer had rejected the product because it was expensive.",
        optionC: "The customer was mainly concerned about payment frequency.",
        optionD: "The customer's hesitation involved uncertainty about coverage.",
        correctAnswer: "D",
      },
      {
        question: `Choose the word that best completes the sentence:\n"The RM should ______ the customer's existing financial commitments before recommending additional protection."`,
        optionA: "assess",
        optionB: "assessment",
        optionC: "assessed",
        optionD: "assessing",
        correctAnswer: "A",
      },
      {
        question: `Read the passage:\nA customer may have substantial savings and still face a significant financial vulnerability if an unexpected medical expense requires immediate payment. Savings provide liquidity, whereas insurance is designed to transfer specified risks subject to policy conditions. The two therefore serve different financial purposes.\nWhich conclusion is best supported?`,
        optionA: "Savings are unsuitable for handling healthcare expenses.",
        optionB: "Insurance should replace all forms of personal savings.",
        optionC: "Savings and insurance can address different aspects of financial risk.",
        optionD: "Customers with substantial savings do not need health insurance.",
        correctAnswer: "C",
      },
      {
        question: `Which sentence communicates the idea most precisely?`,
        optionA: "The customer was explained the policy conditions.",
        optionB: "The policy conditions were explained clearly to the customer.",
        optionC: "The customer had explained regarding the policy conditions.",
        optionD: "The policy conditions explained the customer clearly.",
        correctAnswer: "B",
      },
      {
        question: `In the sentence below, what does "prudent" most nearly mean?\n"It would be prudent to verify the policy conditions before making a commitment."`,
        optionA: "Commercial",
        optionB: "Immediate",
        optionC: "Persuasive",
        optionD: "Sensible",
        correctAnswer: "D",
      },
      {
        question: `Read the statement:\n"Although customer engagement increased significantly, conversion remained unchanged. This suggests that the issue may lie less in the quantity of interactions and more in what occurs during those interactions."\nWhich inference is strongest?`,
        optionA: "Customer engagement should be reduced.",
        optionB: "The product is unsuitable for the customer segment.",
        optionC: "The quality of customer interactions warrants examination.",
        optionD: "Higher activity levels generally reduce conversion.",
        correctAnswer: "C",
      },
      {
        question: `Choose the grammatically correct sentence.`,
        optionA: "Had the RM verified the information, the misunderstanding might have been avoided.",
        optionB: "Had the RM verified the information, the misunderstanding will be avoided.",
        optionC: "If the RM had verified the information, the misunderstanding is avoided.",
        optionD: "If the RM verified the information, the misunderstanding might had been avoided.",
        correctAnswer: "A",
      },
      {
        question: `What does "notwithstanding" most nearly mean in the following sentence?\n"Notwithstanding the customer's existing cover, the RM explored whether additional protection was appropriate."`,
        optionA: "Because of",
        optionB: "Despite",
        optionC: "Before",
        optionD: "Instead of",
        correctAnswer: "B",
      },
      {
        question: `Read the statement:\n"The branch recorded its strongest quarterly sales, yet customer retention declined and service complaints increased."\nWhich conclusion is most defensible?`,
        optionA: "Sales growth was entirely driven by poor service.",
        optionB: "The branch should stop pursuing aggressive sales targets.",
        optionC: "Customer retention has no relationship with sales performance.",
        optionD: "Sales achievement alone is insufficient to judge overall performance.",
        correctAnswer: "D",
      },
    ],
  },

  // SECTION 3 – MENTAL ABILITY & REASONING (Q21-Q30) -> Pick 5 Random
  {
    subjectName: "Section 3: Mental Ability & Reasoning",
    sectionName: "Mental Ability & Reasoning",
    questionsToAsk: 5,
    questions: [
      {
        question: `Find the next number:\n7, 15, 31, 63, 127, ?`,
        optionA: "253",
        optionB: "254",
        optionC: "255",
        optionD: "257",
        correctAnswer: "C",
      },
      {
        question: `Find the missing number:\n2, 6, 12, 20, 30, 42, ?`,
        optionA: "54",
        optionB: "56",
        optionC: "58",
        optionD: "60",
        correctAnswer: "B",
      },
      {
        question: `Six candidates-P, Q, R, S, T and U-are ranked from first to sixth.\n• P ranks above R.\n• R ranks above S.\n• Q ranks above T.\n• T ranks above U.\n• S ranks above U.\nWhich candidate cannot be ranked first?`,
        optionA: "P",
        optionB: "Q",
        optionC: "R",
        optionD: "S",
        correctAnswer: "D",
      },
      {
        question: `A person walks 10 km east, turns left and walks 6 km, then turns left and walks 10 km.\nWhere is the person relative to the starting point?`,
        optionA: "6 km north",
        optionB: "6 km south",
        optionC: "10 km east",
        optionD: "10 km west",
        correctAnswer: "A",
      },
      {
        question: `All RMs are employees. Some employees are graduates. No graduate employee is below 21.\nWhich statement must be true?`,
        optionA: "Every graduate is an RM.",
        optionB: "Some RMs are graduates.",
        optionC: "Every RM is an employee.",
        optionD: "Every employee is above 21.",
        correctAnswer: "C",
      },
      {
        question: `If:\nBANK → CBOL\nand\nCREDIT → DSFEJU\nusing the same rule, then LOAN becomes:`,
        optionA: "MPBO",
        optionB: "MPAO",
        optionC: "LPBO",
        optionD: "MQBO",
        correctAnswer: "A",
      },
      {
        question: `Five activities must follow these rules:\n• A occurs before C.\n• B occurs before D.\n• C occurs before E.\n• D occurs before E.\nWhich activity could occur first?`,
        optionA: "E",
        optionB: "C",
        optionC: "D",
        optionD: "A",
        correctAnswer: "D",
      },
      {
        question: `A sequence follows the rule:\n3 → 12\n5 → 30\n7 → 56\n9 → 90\nWhich number should replace the question mark?\n11 → ?`,
        optionA: "110",
        optionB: "121",
        optionC: "132",
        optionD: "144",
        correctAnswer: "C",
      },
      {
        question: `Four people-A, B, C and D-sit in a row.\n• A sits to the left of B.\n• C sits to the right of B.\n• D sits to the left of A.\nWho must occupy the leftmost position?`,
        optionA: "A",
        optionB: "B",
        optionC: "C",
        optionD: "D",
        correctAnswer: "D",
      },
      {
        question: `A statement says:\n"Every customer who receives a recommendation has completed a needs assessment."\nWhich situation would directly contradict this statement?`,
        optionA: "A customer receives a recommendation after assessment.",
        optionB: "A customer completes assessment but receives no recommendation.",
        optionC: "A customer receives a recommendation without completing assessment.",
        optionD: "A customer does not complete assessment and receives no recommendation.",
        correctAnswer: "C",
      },
    ],
  },

  // SECTION 4 – ADVANCED NUMERICAL & MATHEMATICAL REASONING (Q31-Q40) -> Pick 5 Random
  {
    subjectName: "Section 4: Advanced Numerical & Mathematical Reasoning",
    sectionName: "Advanced Numerical & Mathematical Reasoning",
    questionsToAsk: 5,
    questions: [
      {
        question: `An RM contacts 240 customers.\n• 75% are successfully reached.\n• 60% of those reached agree to a meeting.\n• 40% of meetings result in proposals.\n• 75% of proposals convert.\nHow many policies are expected?`,
        optionA: "28",
        optionB: "30",
        optionC: "32",
        optionD: "36",
        correctAnswer: "B",
      },
      {
        question: `A branch's business increases from ₹48 lakh to ₹60 lakh. In the following quarter, it declines by 20%.\nCompared with the original ₹48 lakh, the final figure is:`,
        optionA: "5% higher",
        optionB: "10% higher",
        optionC: "20% higher",
        optionD: "The same",
        correctAnswer: "D",
      },
      {
        question: `An RM's conversion rate rises from 16% to 20%.\nWhat is the relative percentage increase?`,
        optionA: "20%",
        optionB: "22.5%",
        optionC: "25%",
        optionD: "30%",
        correctAnswer: "C",
      },
      {
        question: `Three RMs generate business in the ratio 3 : 5 : 7. Their combined business is ₹12 lakh.\nHow much does the highest-producing RM generate?`,
        optionA: "₹4.8 lakh",
        optionB: "₹5.2 lakh",
        optionC: "₹5.6 lakh",
        optionD: "₹6.0 lakh",
        correctAnswer: "C",
      },
      {
        question: `A branch has a target of 600 policies.\n• Team A achieves 120% of its 150-policy target.\n• Team B achieves 90% of its 200-policy target.\n• Team C achieves 80% of its 150-policy target.\n• Team D achieves 95 policies.\nHow many policies does the branch achieve?`,
        optionA: "515",
        optionB: "525",
        optionC: "535",
        optionD: "545",
        correctAnswer: "B",
      },
      {
        question: `An RM currently converts 20% of qualified prospects. The number of qualified prospects increases by 25%.\nHow much must the conversion rate increase to produce 50% more policies than before?`,
        optionA: "20%",
        optionB: "22.5%",
        optionC: "25%",
        optionD: "30%",
        correctAnswer: "A",
      },
      {
        question: `The average monthly business of 5 RMs is ₹4.8 lakh.\nFour RMs generate ₹3.6 lakh, ₹4.2 lakh, ₹5.1 lakh and ₹6.3 lakh.\nWhat must the fifth RM have generated?`,
        optionA: "₹4.2 lakh",
        optionB: "₹4.5 lakh",
        optionC: "₹4.8 lakh",
        optionD: "₹5.0 lakh",
        correctAnswer: "B",
      },
      {
        question: `A bank has 1,200 eligible customers.\n• 40% are contacted.\n• 50% of contacted customers show interest.\n• 60% of interested customers attend a meeting.\n• 50% of meetings lead to proposals.\n• 80% of proposals convert.\nHow many policies should result?`,
        optionA: "96",
        optionB: "108",
        optionC: "112",
        optionD: "115",
        correctAnswer: "A",
      },
      {
        question: `An RM has achieved ₹7.2 lakh in the first 12 working days. There are 8 working days remaining.\nTo finish the month at ₹12 lakh, what average daily business is required for the remaining days?`,
        optionA: "₹52,000",
        optionB: "₹55,000",
        optionC: "₹60,000",
        optionD: "₹65,000",
        correctAnswer: "C",
      },
      {
        question: `A branch increases sales by 30%, while the number of active RMs increases by 20%.\nApproximately what happens to sales per RM?`,
        optionA: "It rises by about 8.3%.",
        optionB: "It rises by exactly 10%.",
        optionC: "It rises by about 12%.",
        optionD: "It falls by about 8.3%.",
        correctAnswer: "A",
      },
    ],
  },

  // SECTION 5 – BANKING & FINANCIAL AWARENESS (Q41-Q50) -> Pick 5 Random
  {
    subjectName: "Section 5: Banking & Financial Awareness",
    sectionName: "Banking & Financial Awareness",
    questionsToAsk: 5,
    questions: [
      {
        question: `A customer keeps ₹5 lakh in a savings account and asks why the bank may still recommend a fixed deposit for part of the amount.\nWhat is the most appropriate explanation?`,
        optionA: "Fixed deposits eliminate all financial risk.",
        optionB: "Fixed deposits may provide a different return structure for funds held for a defined period.",
        optionC: "Savings accounts cannot be used for long-term savings.",
        optionD: "Fixed deposits provide guaranteed higher returns in every situation.",
        correctAnswer: "B",
      },
      {
        question: `A customer pays only the minimum amount due on a credit card rather than the full outstanding balance.\nWhich statement is generally most accurate?`,
        optionA: "The remaining balance may continue to attract applicable interest or charges.",
        optionB: "Paying the minimum amount automatically clears the outstanding balance.",
        optionC: "The customer's credit limit will necessarily increase.",
        optionD: "No additional cost arises if the minimum is paid on time.",
        correctAnswer: "A",
      },
      {
        question: `A customer's credit score has declined after repeated missed loan repayments.\nWhat does this most directly indicate?`,
        optionA: "The customer's income has necessarily declined.",
        optionB: "The customer's investment portfolio has lost value.",
        optionC: "The customer's creditworthiness may have been negatively affected.",
        optionD: "The customer's bank account has become inactive.",
        correctAnswer: "C",
      },
      {
        question: `A customer asks why a bank assesses income, existing liabilities and repayment history before approving a loan.\nWhat is the primary reason?`,
        optionA: "To determine whether the customer qualifies for insurance.",
        optionB: "To estimate the customer's investment returns.",
        optionC: "To establish the customer's tax liability.",
        optionD: "To assess repayment capacity and credit risk.",
        correctAnswer: "D",
      },
      {
        question: `Which statement best distinguishes saving from investing?`,
        optionA: "Saving generally emphasizes preserving accessible funds, while investing seeks growth with varying risk.",
        optionB: "Saving always produces lower returns than investing.",
        optionC: "Investing guarantees higher returns over longer periods.",
        optionD: "Saving and investing represent identical financial decisions.",
        correctAnswer: "A",
      },
      {
        question: `A customer wants to keep an emergency fund entirely in a high-risk investment because the potential return is attractive.\nWhat is the most appropriate observation?`,
        optionA: "Higher potential returns always justify higher risk.",
        optionB: "Emergency funds should generally consider liquidity and capital stability.",
        optionC: "Emergency funds should always be invested in equities.",
        optionD: "Risk becomes irrelevant when the investment horizon is short.",
        correctAnswer: "B",
      },
      {
        question: `A customer has income of ₹1 lakh per month and total monthly loan obligations of ₹60,000.\nWhich conclusion is most reasonable?`,
        optionA: "The customer has no capacity to save.",
        optionB: "The customer's repayment burden warrants careful assessment.",
        optionC: "The customer should automatically receive a new loan.",
        optionD: "The customer is financially secure because income exceeds liabilities.",
        correctAnswer: "B",
      },
      {
        question: `What is the primary purpose of diversification in an investment portfolio?`,
        optionA: "To eliminate investment risk completely.",
        optionB: "To guarantee a positive annual return.",
        optionC: "To spread exposure across different investments.",
        optionD: "To concentrate capital in the strongest asset.",
        correctAnswer: "C",
      },
      {
        question: `A customer asks why inflation matters when comparing returns on savings.\nWhich explanation is most appropriate?`,
        optionA: "Inflation determines the customer's credit score.",
        optionB: "Inflation reduces the purchasing power of money over time.",
        optionC: "Inflation guarantees higher bank interest rates.",
        optionD: "Inflation affects only customers who borrow money.",
        correctAnswer: "B",
      },
      {
        question: `A customer has substantial assets but also significant outstanding debt.\nWhich statement is most accurate?`,
        optionA: "High assets necessarily mean the customer has strong liquidity.",
        optionB: "The customer's financial position should be viewed using both assets and liabilities.",
        optionC: "Outstanding debt does not matter when assets are substantial.",
        optionD: "Asset ownership automatically indicates strong repayment capacity.",
        correctAnswer: "B",
      },
    ],
  },

  // SECTION 6 – SALES ORIENTATION & SITUATIONAL JUDGEMENT (Q51-Q60) -> Pick 5 Random
  {
    subjectName: "Section 6: Sales Orientation & Situational Judgement",
    sectionName: "Sales Orientation & Situational Judgement",
    questionsToAsk: 5,
    questions: [
      {
        question: `You are given 40 eligible customers. After contacting 30, only three show interest.\nWhat should you examine first?`,
        optionA: "Whether the customer list is fundamentally unsuitable.",
        optionB: "Whether your opening, targeting and need-discovery approach is effective.",
        optionC: "Whether the sales target should be reduced.",
        optionD: "Whether customers should be contacted only by senior RMs.",
        correctAnswer: "B",
      },
      {
        question: `A customer says:\n"I don't need health insurance because I have enough money in my savings account."\nWhat is the strongest response?`,
        optionA: `"Savings may not be enough because healthcare costs are increasing."`,
        optionB: `"You should buy insurance because everyone needs it."`,
        optionC: `"May I understand how you have planned for a large unexpected medical expense?"`,
        optionD: `"Insurance provides benefits that savings cannot provide."`,
        correctAnswer: "C",
      },
      {
        question: `Your monthly sales target is ₹15 lakh. After 15 working days, you have generated ₹5 lakh.\nWhat should concern you most?`,
        optionA: "The absolute business achieved.",
        optionB: "The gap between current run rate and required run rate.",
        optionC: "The number of customers contacted.",
        optionD: "The number of days already completed.",
        correctAnswer: "B",
      },
      {
        question: `A customer appears interested but repeatedly postpones the decision.\nWhich action demonstrates the strongest sales judgment?`,
        optionA: "Increase pressure to create urgency.",
        optionB: "Offer a discount without understanding the hesitation.",
        optionC: "Ask what unresolved concern is preventing a decision.",
        optionD: "Stop following up to avoid irritating the customer.",
        correctAnswer: "C",
      },
      {
        question: `A high-value customer asks you to recommend a policy. You know that a competitor's product may actually suit the customer's stated need better.\nWhat should you do?`,
        optionA: "Recommend your product because the bank expects business.",
        optionB: "Recommend the more appropriate solution based on the customer's needs.",
        optionC: "Avoid giving a recommendation and let the customer decide.",
        optionD: "Present only your product's advantages.",
        correctAnswer: "B",
      },
      {
        question: `You have consistently achieved your activity targets but missed your sales targets.\nWhat does this most strongly suggest?`,
        optionA: "Your activity levels are necessarily too low.",
        optionB: "Your customers are unsuitable.",
        optionC: "Your conversion effectiveness needs examination.",
        optionD: "Your sales target is probably unrealistic.",
        correctAnswer: "C",
      },
      {
        question: `An RM discovers that a colleague is telling customers that purchasing insurance is mandatory for receiving a banking service.\nWhat should the RM do?`,
        optionA: "Ignore it because the colleague is generating business.",
        optionB: "Repeat the practice only for high-value customers.",
        optionC: "Discuss the concern privately and escalate appropriately if required.",
        optionD: "Confront the colleague in front of the customer.",
        correctAnswer: "C",
      },
      {
        question: `A customer asks a technical question and the RM is unsure of the answer. The customer appears ready to purchase.\nWhat should the RM do?`,
        optionA: "Give the most likely answer to avoid losing the sale.",
        optionB: "Acknowledge the uncertainty and verify the information.",
        optionC: "Redirect the discussion to another product benefit.",
        optionD: "Ask the customer to research the answer independently.",
        correctAnswer: "B",
      },
      {
        question: `An RM notices that customers who receive a detailed needs assessment convert at a significantly higher rate than customers who receive a standard product presentation.\nWhat should the RM do?`,
        optionA: "Increase product presentations to all customers.",
        optionB: "Study and strengthen the needs-discovery approach.",
        optionC: "Reduce the number of customers receiving detailed assessments.",
        optionD: "Assume the difference is caused by customer demographics.",
        correctAnswer: "B",
      },
      {
        question: `Which candidate demonstrates the strongest potential for an Assistant Relationship Manager – Banca role?`,
        optionA: "A candidate who is highly persuasive but sometimes overlooks customer concerns.",
        optionB: "A candidate who is technically knowledgeable but uncomfortable initiating conversations.",
        optionC: "A candidate who is target-driven and willing to make aggressive commitments.",
        optionD: "A candidate who listens, analyses needs, explains clearly and follows through.",
        correctAnswer: "D",
      },
    ],
  },
];

async function seedNivaBupaArm() {
  console.log('🚀 Seeding Niva Bupa Assistant Relationship Manager Assessment...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'greatcampus' },
    update: {},
    create: {
      name: 'NIVA BUPA Assessment Platform',
      slug: 'greatcampus',
    },
  });

  // Create or Update Assessment
  const assessment = await prisma.assessment.upsert({
    where: { slug: 'niva-bupa-arm-banca-assessment' },
    update: {
      name: 'Niva Bupa Health Insurance - Assistant Relationship Manager Assessment',
      description: '30 Random Questions per attempt from a pool of 60 questions covering Communication, Advanced English, Reasoning, Numerical Reasoning, Banking & Financial Awareness, and Situational Judgement.',
      durationMins: 30,
      passingPercentage: 50.0,
      maxProctorWarnings: 3,
      status: 'ACTIVE',
    },
    create: {
      tenantId: tenant.id,
      name: 'Niva Bupa Health Insurance - Assistant Relationship Manager Assessment',
      slug: 'niva-bupa-arm-banca-assessment',
      description: '30 Random Questions per attempt from a pool of 60 questions covering Communication, Advanced English, Reasoning, Numerical Reasoning, Banking & Financial Awareness, and Situational Judgement.',
      durationMins: 30,
      passingPercentage: 50.0,
      maxProctorWarnings: 3,
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Assessment Ready: ${assessment.name} (${assessment.id})`);

  // Delete existing subjects for clean refresh if any exist under this assessment
  await prisma.assessmentSubject.deleteMany({
    where: { assessmentId: assessment.id },
  });

  let totalQuestionsInserted = 0;
  let subjectOrder = 1;

  for (const group of nivaBupaArmQuestions) {
    const subject = await prisma.assessmentSubject.create({
      data: {
        assessmentId: assessment.id,
        name: group.subjectName,
        displayOrder: subjectOrder++,
      },
    });

    const section = await prisma.subjectSection.create({
      data: {
        subjectId: subject.id,
        name: group.sectionName,
        questionsToAsk: group.questionsToAsk,
        displayOrder: 1,
      },
    });

    for (const q of group.questions) {
      await prisma.question.create({
        data: {
          sectionId: section.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          marks: 1.0,
          status: 'ACTIVE',
        },
      });
      totalQuestionsInserted++;
    }

    console.log(`  ➕ Subject added: "${group.subjectName}" (Pool: ${group.questions.length}, Ask: ${group.questionsToAsk})`);
  }

  console.log(`🎉 Complete! Total ${totalQuestionsInserted} pool questions added. Each candidate will receive 30 random questions in 30 minutes!`);
}

seedNivaBupaArm()
  .catch((e) => {
    console.error('❌ Error seeding Niva Bupa ARM questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
