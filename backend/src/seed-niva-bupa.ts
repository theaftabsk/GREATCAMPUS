import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nivaBupaQuestions = [
  // SECTION 1 – COMMUNICATION & COMPREHENSION (Q1-Q10)
  {
    subjectName: "Section 1: Communication & Comprehension",
    sectionName: "Communication & Comprehension",
    questionsToAsk: 10,
    questions: [
      {
        question: `A customer says: "I already have ₹5 lakh of health insurance from my employer. Why should I consider another policy?" Which response demonstrates the strongest consultative approach?`,
        optionA: "Additional insurance provides broader financial protection and makes more sense.",
        optionB: "Employer coverage may not always be sufficient.",
        optionC: "May I understand your existing cover and family needs first?",
        optionD: "Our policy can provide you with higher protection.",
        correctAnswer: "C",
      },
      {
        question: `A customer says: "Your advisor told me the treatment was covered. Why are you asking for additional documents now?" What should the Agency Unit Manager do first?`,
        optionA: "Review the case and clarify the applicable requirement.",
        optionB: "Explain that additional documents are normally required.",
        optionC: "Ask the customer to contact the claims team.",
        optionD: "Tell the customer the earlier advice may have been incorrect.",
        correctAnswer: "A",
      },
      {
        question: `Read the following statement: "The benefit is payable subject to the policy being active, completion of the applicable waiting period, and satisfaction of all relevant terms and conditions." Which interpretation is most accurate?`,
        optionA: "The benefit is available whenever the policy is active.",
        optionB: "The benefit depends on several specified conditions.",
        optionC: "The waiting period applies only to selected customers.",
        optionD: "The benefit is payable whenever treatment is medically necessary.",
        correctAnswer: "B",
      },
      {
        question: `A customer explains that she has employer-sponsored insurance but is worried about losing the cover if she changes jobs. What should the advisor do?`,
        optionA: "Explain that employer insurance is usually temporary.",
        optionB: "Recommend an additional policy immediately.",
        optionC: "Focus the discussion on increasing the sum insured.",
        optionD: "Explore her continuity concern before recommending anything.",
        correctAnswer: "D",
      },
      {
        question: `An advisor tells a prospect: "If you purchase this policy, you will never have to worry about medical expenses." What is the most important concern with this statement?`,
        optionA: "It may create an unrealistic expectation of coverage.",
        optionB: "It does not explain the premium structure.",
        optionC: "It uses language that is too informal.",
        optionD: "It does not mention the application procedure.",
        correctAnswer: "A",
      },
      {
        question: `During a meeting, a customer discusses affordability, existing coverage, family members and previous medical expenses. What should the advisor do before recommending a product?`,
        optionA: "Explain the most comprehensive available option.",
        optionB: "Focus first on the customer's affordability concern.",
        optionC: "Summarize the key needs and confirm understanding.",
        optionD: "Ask the customer to provide the information later.",
        correctAnswer: "C",
      },
      {
        question: `A customer says: "I want to discuss this with my spouse before making a decision." Which response is most appropriate?`,
        optionA: "Explain why delaying the decision could be risky.",
        optionB: "Ask when would be a suitable time to reconnect.",
        optionC: "Offer an incentive for making the decision today.",
        optionD: "Ask the customer to decide before ending the meeting.",
        correctAnswer: "B",
      },
      {
        question: `Read the statement: "The customer may qualify for the benefit, provided all applicable conditions are satisfied." The word "provided" most nearly indicates:`,
        optionA: "A probability",
        optionB: "A recommendation",
        optionC: "A condition",
        optionD: "A guarantee",
        correctAnswer: "C",
      },
      {
        question: `A customer says: "I understand the premium, but I already have another policy and don't know whether additional cover makes sense." What should the advisor do?`,
        optionA: "Explain why having two policies can be beneficial.",
        optionB: "Recommend the new policy based on the customer's income.",
        optionC: "Ask about the existing policy before discussing options.",
        optionD: "Tell the customer to compare both policies independently.",
        correctAnswer: "C",
      },
      {
        question: `Which response best demonstrates active listening?`,
        optionA: `"I understand your concern. What aspect worries you most?"`,
        optionB: `"Many customers have the same concern about insurance."`,
        optionC: `"Let me explain why our product is suitable."`,
        optionD: `"You should consider the policy because healthcare costs rise."`,
        correctAnswer: "A",
      },
    ],
  },

  // SECTION 2 – ADVANCED ENGLISH (Q11-Q20)
  {
    subjectName: "Section 2: Advanced English",
    sectionName: "Advanced English",
    questionsToAsk: 10,
    questions: [
      {
        question: `Choose the grammatically correct sentence.`,
        optionA: "Neither the manager nor the advisor were aware of the change.",
        optionB: "Neither the manager nor the advisors was aware of the change.",
        optionC: "Neither the manager nor the advisors were aware of the change.",
        optionD: "Neither the managers nor the advisor were aware of the change.",
        correctAnswer: "C",
      },
      {
        question: `In the sentence below, what does "apprehensive" most nearly mean? "The customer remained apprehensive about committing to the policy."`,
        optionA: "Uncertain or concerned",
        optionB: "Interested but uninformed",
        optionC: "Confident about proceeding",
        optionD: "Unwilling to discuss alternatives",
        correctAnswer: "A",
      },
      {
        question: `Read the passage: Employer-sponsored health insurance can provide valuable protection. However, its adequacy depends on factors such as the sum insured, family members covered, policy conditions and continuity after employment changes. Therefore, simply having employer-sponsored insurance does not establish that additional cover is unnecessary. Which conclusion is best supported?`,
        optionA: "Employer-sponsored insurance is inadequate for most employees.",
        optionB: "Additional insurance should always be purchased.",
        optionC: "Employer insurance generally ends after a job change.",
        optionD: "Existing coverage should be evaluated before deciding on additional coverage.",
        correctAnswer: "D",
      },
      {
        question: `Which sentence is the most professionally appropriate?`,
        optionA: "Send these documents today or the proposal will stop.",
        optionB: "Kindly share the required documents so we can proceed.",
        optionC: "These documents are compulsory, so send them immediately.",
        optionD: "You need to provide these papers before we can do anything.",
        correctAnswer: "B",
      },
      {
        question: `Consider this statement: "Unless the required documents are received, the proposal cannot proceed." Which interpretation is logically correct?`,
        optionA: "The proposal may proceed with some documents missing.",
        optionB: "The proposal will automatically be rejected.",
        optionC: "The required documents are necessary for progression.",
        optionD: "The documents can be submitted after the proposal proceeds.",
        correctAnswer: "C",
      },
      {
        question: `Choose the grammatically correct sentence.`,
        optionA: "The advisor explained the waiting period to the customer.",
        optionB: "The advisor has explained the waiting period to the customer.",
        optionC: "The advisor explained clearly the waiting period to the customer.",
        optionD: "The advisor explained the waiting period clearly to the customer.",
        correctAnswer: "D",
      },
      {
        question: `Read the statement: "The branch increased customer meetings by 30%, but the conversion rate remained unchanged." Which inference is most reasonable?`,
        optionA: "Increasing activity alone did not improve conversion.",
        optionB: "Customers became less interested in insurance.",
        optionC: "The advisor's meetings were generally unsuccessful.",
        optionD: "The branch should reduce customer meetings to at least save time.",
        correctAnswer: "A",
      },
      {
        question: `What does "mitigate" mean in this sentence? "Early intervention can mitigate the impact of customer dissatisfaction."`,
        optionA: "Measure",
        optionB: "Reduce",
        optionC: "Predict",
        optionD: "Explain",
        correctAnswer: "B",
      },
      {
        question: `Choose the grammatically correct sentence.`,
        optionA: "Had the advisor verified the information, the error might have been avoided.",
        optionB: "Had the advisor verified the information, the error would have been avoided.",
        optionC: "If the advisor had verified the information, the error might be avoided.",
        optionD: "If the advisor verified the information, the error might have been avoided.",
        correctAnswer: "A",
      },
      {
        question: `Read the statement: "The branch achieved its highest sales volume this quarter. However, customer complaints increased significantly, and documentation errors remained above acceptable levels." Which conclusion is most defensible?`,
        optionA: "The branch should reduce its sales targets.",
        optionB: "Customer complaints are unavoidable during growth.",
        optionC: "Sales volume alone does not establish overall effectiveness.",
        optionD: "Documentation requirements are restricting business growth.",
        correctAnswer: "C",
      },
    ],
  },

  // SECTION 3 – MENTAL ABILITY & REASONING (Q21-Q30)
  {
    subjectName: "Section 3: Mental Ability & Reasoning",
    sectionName: "Mental Ability & Reasoning",
    questionsToAsk: 10,
    questions: [
      {
        question: `Find the next number: 5, 11, 23, 47, 95, ?`,
        optionA: "181",
        optionB: "189",
        optionC: "191",
        optionD: "195",
        correctAnswer: "C",
      },
      {
        question: `If each letter in HEALTH is moved one position, then the next by 2 and the next 3, and so forth forward in the alphabet, how would CLAIM be coded?`,
        optionA: "DNDMR",
        optionB: "DMBIM",
        optionC: "CLBJN",
        optionD: "ENCKO",
        correctAnswer: "A",
      },
      {
        question: `Five candidates P, Q, R, S and T are ranked from highest to lowest.\n• P ranks above R.\n• Q ranks above S.\n• R ranks above S.\n• S ranks above T.\nWho must rank above S?`,
        optionA: "P and Q only",
        optionB: "R and Q only",
        optionC: "P, R and Q",
        optionD: "R, S and Q",
        correctAnswer: "B",
      },
      {
        question: `A person walks 6 km north, then 8 km east, then 6 km south, and finally 5 km east. Where is the person relative to the starting point?`,
        optionA: "11 km east",
        optionB: "11 km west",
        optionC: "6 km north",
        optionD: "6 km south",
        correctAnswer: "A",
      },
      {
        question: `All Agency Unit Managers are employees. Some employees are graduates. Which statement must be true?`,
        optionA: "Some graduates are Agency Unit Managers.",
        optionB: "All graduates are Agency Unit Managers.",
        optionC: "Every Agency Unit Manager is an employee.",
        optionD: "No graduate can become an Agency Unit Manager.",
        correctAnswer: "C",
      },
      {
        question: `Find the next pair: AZ, BY, CX, DW, ?`,
        optionA: "FU",
        optionB: "EV",
        optionC: "EW",
        optionD: "FV",
        correctAnswer: "B",
      },
      {
        question: `Four activities must occur in the following order:\n• Training before assessment\n• Assessment before interview\n• Interview before final selection\nWhich activity must occur last?`,
        optionA: "Training",
        optionB: "Assessment",
        optionC: "Interview",
        optionD: "Final selection",
        correctAnswer: "D",
      },
      {
        question: `If: 4 → 20, 6 → 42, 8 → 72, Then: 10 → ?`,
        optionA: "100",
        optionB: "110",
        optionC: "120",
        optionD: "130",
        correctAnswer: "C",
      },
      {
        question: `Five tasks P, Q, R, S and T must be scheduled.\n• P occurs before Q.\n• R occurs before S.\n• Q occurs before T.\n• S occurs before T.\nWhich task could be scheduled first?`,
        optionA: "T",
        optionB: "Q",
        optionC: "P",
        optionD: "S",
        correctAnswer: "C",
      },
      {
        question: `A candidate says: "If I receive the offer, I will join the company." The candidate has not yet received an offer. Which conclusion is logically valid?`,
        optionA: "The candidate will not join.",
        optionB: "The candidate has rejected the company.",
        optionC: "The candidate may join if an offer is received.",
        optionD: "The company has decided not to hire the candidate.",
        correctAnswer: "C",
      },
    ],
  },

  // SECTION 4 – APPLIED MATHEMATICAL REASONING (Q31-Q40)
  {
    subjectName: "Section 4: Applied Mathematical Reasoning",
    sectionName: "Applied Mathematical Reasoning",
    questionsToAsk: 10,
    questions: [
      {
        question: `An advisor contacts 240 prospects. Of these, 60% agree to a meeting. Of those who meet, 25% submit a proposal. Finally, 80% of submitted proposals are converted. How many policies are converted?`,
        optionA: "24",
        optionB: "28",
        optionC: "30",
        optionD: "32",
        correctAnswer: "C",
      },
      {
        question: `A branch's business increased from ₹48 lakh to ₹60 lakh in one quarter. In the following quarter, business declined by 20%. What was the business in the second quarter?`,
        optionA: "₹48 lakh",
        optionB: "₹50 lakh",
        optionC: "₹52 lakh",
        optionD: "₹54 lakh",
        correctAnswer: "A",
      },
      {
        question: `An advisor's conversion rate rises from 16% to 20%. What is the percentage increase in the conversion rate, rather than the increase in percentage points?`,
        optionA: "20%",
        optionB: "25%",
        optionC: "30%",
        optionD: "40%",
        correctAnswer: "B",
      },
      {
        question: `Three advisors generate business in the ratio 3 : 4 : 5. Together they generate ₹9.6 lakh. How much does the highest-performing advisor generate?`,
        optionA: "₹3.2 lakh",
        optionB: "₹3.6 lakh",
        optionC: "₹4.0 lakh",
        optionD: "₹4.4 lakh",
        correctAnswer: "C",
      },
      {
        question: `A branch has a target of 500 policies. At the end of the month:\n• Advisor A achieves 120% of an individual target of 100.\n• Advisor B achieves 90% of a target of 150.\n• Advisor C achieves 80% of a target of 150.\n• The remaining advisors together achieve 95 policies.\nHow many policies has the branch achieved?`,
        optionA: "435",
        optionB: "445",
        optionC: "455",
        optionD: "465",
        correctAnswer: "B",
      },
      {
        question: `An advisor's monthly conversion rate is 25%. After improving the number of qualified meetings by 20%, the advisor wants to increase the number of policies sold by 44%. Assuming the conversion rate changes as well, what conversion rate is required?`,
        optionA: "28%",
        optionB: "30%",
        optionC: "32%",
        optionD: "35%",
        correctAnswer: "B",
      },
      {
        question: `A team has 10 advisors. The average productivity of the first 6 advisors is 18 policies each. The average productivity of all 10 advisors is 20 policies each. What is the average productivity of the remaining 4 advisors?`,
        optionA: "21",
        optionB: "22",
        optionC: "23",
        optionD: "24",
        correctAnswer: "B",
      },
      {
        question: `A branch receives 1,000 leads.\n• 70% are contacted.\n• 60% of contacted leads are qualified.\n• 50% of qualified leads attend a meeting.\n• 40% of meetings result in proposals.\n• 75% of proposals convert.\nHow many policies are expected?`,
        optionA: "54",
        optionB: "60",
        optionC: "63",
        optionD: "70",
        correctAnswer: "C",
      },
      {
        question: `An advisor's monthly target is ₹12 lakh. In the first 15 working days, the advisor achieves ₹7.2 lakh. There are 10 working days remaining. At the same daily run rate, approximately how much will the advisor achieve for the full month?`,
        optionA: "₹11.4 lakh",
        optionB: "₹12.0 lakh",
        optionC: "₹12.8 lakh",
        optionD: "₹13.2 lakh",
        correctAnswer: "D",
      },
      {
        question: `A branch's sales increased by 25%, while its number of active advisors increased by 20%. What happened to sales per advisor, assuming the starting numbers are used as the base?`,
        optionA: "Increased by about 4.2%",
        optionB: "Increased by exactly 5%",
        optionC: "Increased by exactly 10%",
        optionD: "Decreased by about 4.2%",
        correctAnswer: "A",
      },
    ],
  },

  // SECTION 5 – SALES ORIENTATION & JOB READINESS (Q41-Q50)
  {
    subjectName: "Section 5: Sales Orientation & Job Readiness",
    sectionName: "Sales Orientation & Job Readiness",
    questionsToAsk: 10,
    questions: [
      {
        question: `You approach 30 prospects. Only three agree to continue the conversation. What should you examine first?`,
        optionA: "Whether the product should be changed.",
        optionB: "The objections and patterns in the responses.",
        optionC: "Whether the target should be reduced.",
        optionD: "Whether you should focus on existing contacts.",
        correctAnswer: "B",
      },
      {
        question: `A prospect says: "I am young and healthy, so health insurance is unnecessary." Which response demonstrates the strongest sales judgment?`,
        optionA: `"Healthcare costs are increasing every year."`,
        optionB: `"Most young people eventually need health insurance."`,
        optionC: `"What financial impact would an unexpected hospitalization create?"`,
        optionD: `"You should buy insurance while you are still healthy."`,
        correctAnswer: "C",
      },
      {
        question: `You have missed your business target for two consecutive months. What should you review first?`,
        optionA: "Your activity, conversion and follow-up patterns.",
        optionB: "Whether the market has become more competitive.",
        optionC: "Whether your monthly target is realistic.",
        optionD: "Whether customers prefer another insurer.",
        correctAnswer: "A",
      },
      {
        question: `A prospect understands the product but says: "I need to discuss it with my family." What is the most appropriate next step?`,
        optionA: "Explain why postponing the decision is risky.",
        optionB: "Ask when you can reconnect after the discussion.",
        optionC: "Offer an incentive for deciding immediately.",
        optionD: "Ask the prospect to make a provisional commitment.",
        correctAnswer: "B",
      },
      {
        question: `Your manager gives you a challenging monthly target. What demonstrates the strongest approach?`,
        optionA: "Ask whether the target can be revised as that will be helpful.",
        optionB: "Focus mainly on easy-to-convert prospects.",
        optionC: "Wait until the first review to assess progress.",
        optionD: "Break the target into measurable weekly activities.",
        correctAnswer: "D",
      },
      {
        question: `A prospect rejects your recommendation after a detailed discussion. What should you do?`,
        optionA: "Ask what influenced the decision.",
        optionB: "Explain the product again.",
        optionC: "Move immediately to another prospect.",
        optionD: "Stop contacting the prospect.",
        correctAnswer: "A",
      },
      {
        question: `You are assigned a territory where you have very few existing contacts. What is the strongest response?`,
        optionA: "Request a territory with established customers.",
        optionB: "Wait for referrals from experienced advisors as these are best prospects to contact.",
        optionC: "Map the territory and create a prospecting plan.",
        optionD: "Focus only on centrally generated leads.",
        correctAnswer: "C",
      },
      {
        question: `A prospect raises a technical question that you cannot answer confidently. What should you do?`,
        optionA: "Provide the answer you believe is likely.",
        optionB: "Acknowledge the question and verify the information.",
        optionC: "Move to another product benefit.",
        optionD: "Ask the customer to contact the insurer directly as that is the best way to get clarification.",
        correctAnswer: "B",
      },
      {
        question: `Another advisor consistently converts more prospects from the same customer segment. What would demonstrate the strongest learning orientation?`,
        optionA: "Continue using your existing method.",
        optionB: "Ask the manager for similar prospects.",
        optionC: "It is possible to assume that the advisor receives better leads.",
        optionD: "Understand which practices may be driving the difference.",
        correctAnswer: "D",
      },
      {
        question: `Which situation best demonstrates genuine sales orientation?`,
        optionA: "Preferring customers who already intend to purchase.",
        optionB: "Maintaining effort while learning from rejection.",
        optionC: "Focusing mainly on products that are easy to explain.",
        optionD: "Avoiding prospects who raise difficult objections, as that wastes a lot of time.",
        correctAnswer: "B",
      },
    ],
  },

  // SECTION 6 – APPLIED INSURANCE AWARENESS (Q51-Q55)
  {
    subjectName: "Section 6: Applied Insurance Awareness",
    sectionName: "Applied Insurance Awareness",
    questionsToAsk: 5,
    questions: [
      {
        question: `A policy contains a waiting period for a particular condition. Which interpretation is most appropriate?`,
        optionA: "The condition can never be covered under the policy.",
        optionB: "The customer cannot renew the policy during that period the waiting period of the policy.",
        optionC: "Coverage may become available after the specified period and applicable conditions.",
        optionD: "The customer must pay an additional premium until the period ends.",
        correctAnswer: "C",
      },
      {
        question: `A customer has paid the premium and asks whether every future medical expense will automatically be reimbursed. Which response is most accurate?`,
        optionA: "Reimbursement depends on the applicable policy terms and conditions.",
        optionB: "Payment of premium on time always guarantees medical reimbursement.",
        optionC: "Most medical expenses become payable once the policy starts.",
        optionD: "Claims are normally approved when all premiums are current.",
        correctAnswer: "A",
      },
      {
        question: `Why is accurate disclosure of relevant health information important when applying for insurance?`,
        optionA: "It guarantees approval of future claims easily by the company.",
        optionB: "It eliminates the need for underwriting.",
        optionC: "It ensures the premium cannot change later.",
        optionD: "It helps the insurer assess the proposal appropriately.",
        correctAnswer: "D",
      },
      {
        question: `A customer asks whether a claim will definitely be approved before it has been assessed. What is the most appropriate response?`,
        optionA: "Complete documentation generally ensures approval.",
        optionB: "The outcome depends on the policy terms and claim assessment.",
        optionC: "Claims are normally approved when the policy is active and never when inactive.",
        optionD: "Approval should follow whenever premiums have been paid.",
        correctAnswer: "B",
      },
      {
        question: `A customer believes the most expensive health insurance policy must automatically provide the best protection. What should the advisor do?`,
        optionA: "He should recommend the highest-priced option for maximum protection for the customer.",
        optionB: "Explain that higher premiums usually mean better protection.",
        optionC: "Understand the customer's needs before recommending suitable coverage.",
        optionD: "Allow the customer to choose without offering a recommendation.",
        correctAnswer: "C",
      },
    ],
  },
];

async function seedNivaBupa() {
  console.log('🚀 Seeding Niva Bupa Health Insurance Assessment...');

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
    where: { slug: 'niva-bupa-aum-assessment' },
    update: {
      name: 'Niva Bupa Health Insurance - Agency Unit Manager Assessment',
      description: 'Graduate & Post-Graduate Assessment for Niva Bupa Agency Unit Manager role covering Communication, Advanced English, Reasoning, Applied Math, Sales Orientation, and Insurance Awareness.',
      durationMins: 20,
      passingPercentage: 50.0,
      maxProctorWarnings: 3,
      status: 'ACTIVE',
    },
    create: {
      tenantId: tenant.id,
      name: 'Niva Bupa Health Insurance - Agency Unit Manager Assessment',
      slug: 'niva-bupa-aum-assessment',
      description: 'Graduate & Post-Graduate Assessment for Niva Bupa Agency Unit Manager role covering Communication, Advanced English, Reasoning, Applied Math, Sales Orientation, and Insurance Awareness.',
      durationMins: 20,
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

  for (const group of nivaBupaQuestions) {
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

    console.log(`  ➕ Subject added: "${group.subjectName}" with ${group.questions.length} questions.`);
  }

  console.log(`🎉 Complete! Total ${totalQuestionsInserted} questions added successfully into 6 sections!`);
}

seedNivaBupa()
  .catch((e) => {
    console.error('❌ Error seeding Niva Bupa questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
