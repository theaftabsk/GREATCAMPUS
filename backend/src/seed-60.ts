import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const aumQuestions30 = [
  // SECTION 1: Communication & Comprehension (5 Qs)
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

  // SECTION 2: Advanced English (5 Qs)
  {
    question: `Choose the grammatically correct sentence.`,
    optionA: "Neither the manager nor the advisors were aware of the change.",
    optionB: "Neither the manager nor the advisors were aware of the change.",
    optionC: "Neither the manager nor the advisors were aware of the change.",
    optionD: "Neither the manager nor the advisors was aware of the change.",
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

  // SECTION 3: Mental Ability & Reasoning (5 Qs)
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
    question: `Five candidates P, Q, R, S and T are ranked from highest to lowest. P ranks above R. Q ranks above S. R ranks above S. S ranks above T. Who must rank above S?`,
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

  // SECTION 4: Applied Mathematical Reasoning (5 Qs)
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
    question: `A branch has a target of 500 policies. At the end of the month: Advisor A achieves 120% of target 100, Advisor B achieves 90% of target 150, Advisor C achieves 80% of target 150, remaining advisors achieve 95 policies. How many policies achieved?`,
    optionA: "435",
    optionB: "445",
    optionC: "455",
    optionD: "465",
    correctAnswer: "B",
  },

  // SECTION 5: Sales Orientation & Job Readiness (5 Qs)
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
    optionA: "Healthcare costs are increasing every year.",
    optionB: "Most young people eventually need health insurance.",
    optionC: "What financial impact would an unexpected hospitalization create?",
    optionD: "You should buy insurance while you are still healthy.",
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

  // SECTION 6: Applied Insurance Awareness (5 Qs)
  {
    question: `A policy contains a waiting period for a particular condition. Which interpretation is most appropriate?`,
    optionA: "The condition can never be covered under the policy.",
    optionB: "The customer cannot renew the policy during that period.",
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
    optionA: "Recommend the highest-priced option for maximum protection.",
    optionB: "Explain that higher premiums usually mean better protection.",
    optionC: "Understand the customer's needs before recommending suitable coverage.",
    optionD: "Allow the customer to choose without offering a recommendation.",
    correctAnswer: "C",
  },
];

const armBancaQuestions30 = [
  // SECTION 1: Communication & Customer Handling (5 Qs)
  {
    question: `A bank customer says: "I came to discuss my fixed deposit. I don't want another sales pitch." What is the most effective response?`,
    optionA: "Insurance is important, so please hear me out.",
    optionB: "Understood. Let's first complete your FD discussion.",
    optionC: "Most customers eventually need additional protection.",
    optionD: "I can explain the policy in just two minutes.",
    correctAnswer: "B",
  },
  {
    question: `A customer says: "My employer already provides health insurance, so buying another policy seems unnecessary." Which response demonstrates the strongest need-discovery approach?`,
    optionA: "Employer insurance usually has insufficient coverage.",
    optionB: "Additional insurance provides greater financial security.",
    optionC: "May I understand the cover, dependants and continuity of your existing plan?",
    optionD: "Our policy can supplement your employer's insurance.",
    correctAnswer: "C",
  },
  {
    question: `A customer is visibly irritated because an insurance document has not arrived. You discover that delivery has been delayed. What should you do?`,
    optionA: "Explain the delay and provide the next expected step.",
    optionB: "Tell the customer that delivery is handled elsewhere.",
    optionC: "Ask the customer to contact the insurer directly.",
    optionD: "Apologise and promise delivery by tomorrow.",
    correctAnswer: "A",
  },
  {
    question: `A customer asks: "Will this policy definitely pay for my father's treatment?" You have not examined policy terms. What is most appropriate?`,
    optionA: "It should be covered if the policy is active.",
    optionB: "Most treatments are covered under health insurance.",
    optionC: "Yes, provided the premium has been paid.",
    optionD: "Let's check the applicable terms before I answer.",
    correctAnswer: "D",
  },
  {
    question: `During a conversation, a customer gives short answers and appears uncomfortable discussing personal financial matters. What should the RM do?`,
    optionA: "Continue asking detailed financial questions.",
    optionB: "Explain why the information is necessary and proceed sensitively.",
    optionC: "Recommend a standard product without further questions.",
    optionD: "End the conversation and approach the customer later.",
    correctAnswer: "B",
  },

  // SECTION 2: Advanced English (5 Qs)
  {
    question: `Choose the sentence that is grammatically correct.`,
    optionA: "Neither the RM nor the branch manager were aware of the change.",
    optionB: "Neither the RM or the branch manager was aware of the change.",
    optionC: "Neither the RM nor the branch manager was aware of the change.",
    optionD: "Neither RM nor branch manager were aware about the change.",
    correctAnswer: "C",
  },
  {
    question: `Read statement: "The customer's reluctance was not attributable to the premium alone; rather, it appeared to stem from uncertainty about extent of coverage." What does it imply?`,
    optionA: "The premium was the customer's only concern.",
    optionB: "The customer had rejected the product because it was expensive.",
    optionC: "The customer was mainly concerned about payment frequency.",
    optionD: "The customer's hesitation involved uncertainty about coverage.",
    correctAnswer: "D",
  },
  {
    question: `Choose the word that best completes: "The RM should ______ the customer's existing financial commitments before recommending additional protection."`,
    optionA: "assess",
    optionB: "assessment",
    optionC: "assessed",
    optionD: "assessing",
    correctAnswer: "A",
  },
  {
    question: `A customer may have substantial savings and still face a significant financial vulnerability if an unexpected medical expense requires immediate payment. Which conclusion is best supported?`,
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

  // SECTION 3: Mental Ability & Reasoning (5 Qs)
  {
    question: `Find the next number: 7, 15, 31, 63, 127, ?`,
    optionA: "253",
    optionB: "254",
    optionC: "255",
    optionD: "257",
    correctAnswer: "C",
  },
  {
    question: `Find the missing number: 2, 6, 12, 20, 30, 42, ?`,
    optionA: "54",
    optionB: "56",
    optionC: "58",
    optionD: "60",
    correctAnswer: "B",
  },
  {
    question: `Six candidates P, Q, R, S, T and U ranked from 1st to 6th. P above R. R above S. Q above T. T above U. S above U. Which candidate cannot be ranked first?`,
    optionA: "P",
    optionB: "Q",
    optionC: "R",
    optionD: "S",
    correctAnswer: "D",
  },
  {
    question: `A person walks 10 km east, turns left and walks 6 km, then turns left and walks 10 km. Where is the person relative to the starting point?`,
    optionA: "6 km north",
    optionB: "6 km south",
    optionC: "10 km east",
    optionD: "10 km west",
    correctAnswer: "A",
  },
  {
    question: `All RMs are employees. Some employees are graduates. No graduate employee is below 21. Which statement must be true?`,
    optionA: "Every graduate is an RM.",
    optionB: "Some RMs are graduates.",
    optionC: "Every RM is an employee.",
    optionD: "Every employee is above 21.",
    correctAnswer: "C",
  },

  // SECTION 4: Advanced Numerical & Mathematical Reasoning (5 Qs)
  {
    question: `An RM contacts 240 customers. 75% reached. 60% agree to meeting. 40% result in proposals. 75% proposals convert. How many policies expected?`,
    optionA: "28",
    optionB: "30",
    optionC: "32",
    optionD: "36",
    correctAnswer: "B",
  },
  {
    question: `A branch's business increases from ₹48 lakh to ₹60 lakh. Next quarter it declines by 20%. Compared with original ₹48 lakh, final figure is:`,
    optionA: "5% higher",
    optionB: "10% higher",
    optionC: "20% higher",
    optionD: "The same",
    correctAnswer: "D",
  },
  {
    question: `An RM's conversion rate rises from 16% to 20%. What is the relative percentage increase?`,
    optionA: "20%",
    optionB: "22.5%",
    optionC: "25%",
    optionD: "30%",
    correctAnswer: "C",
  },
  {
    question: `Three RMs generate business in ratio 3 : 5 : 7. Combined business is ₹12 lakh. How much does highest-producing RM generate?`,
    optionA: "₹4.8 lakh",
    optionB: "₹5.2 lakh",
    optionC: "₹5.6 lakh",
    optionD: "₹6.0 lakh",
    correctAnswer: "C",
  },
  {
    question: `A branch has target 600 policies. Team A 120% of 150, Team B 90% of 200, Team C 80% of 150, Team D 95 policies. Total achieved?`,
    optionA: "515",
    optionB: "525",
    optionC: "535",
    optionD: "545",
    correctAnswer: "B",
  },

  // SECTION 5: Banking & Financial Awareness (5 Qs)
  {
    question: `A customer keeps ₹5 lakh in savings and asks why bank recommends fixed deposit for part of it. What is most appropriate explanation?`,
    optionA: "Fixed deposits eliminate all financial risk.",
    optionB: "Fixed deposits may provide a different return structure for defined period funds.",
    optionC: "Savings accounts cannot be used for long-term savings.",
    optionD: "Fixed deposits provide guaranteed higher returns in every situation.",
    correctAnswer: "B",
  },
  {
    question: `A customer pays minimum amount due on credit card rather than full balance. Which statement is most accurate?`,
    optionA: "The remaining balance may continue to attract interest or charges.",
    optionB: "Paying minimum amount automatically clears outstanding balance.",
    optionC: "The customer's credit limit will necessarily increase.",
    optionD: "No additional cost arises if minimum paid on time.",
    correctAnswer: "A",
  },
  {
    question: `A customer's credit score declined after repeated missed loan repayments. What does this most directly indicate?`,
    optionA: "The customer's income has necessarily declined.",
    optionB: "The customer's investment portfolio lost value.",
    optionC: "The customer's creditworthiness may have been negatively affected.",
    optionD: "The customer's bank account became inactive.",
    correctAnswer: "C",
  },
  {
    question: `A customer asks why bank assesses income, liabilities and repayment history before loan approval. Primary reason?`,
    optionA: "To determine qualification for insurance.",
    optionB: "To estimate investment returns.",
    optionC: "To establish tax liability.",
    optionD: "To assess repayment capacity and credit risk.",
    correctAnswer: "D",
  },
  {
    question: `Which statement best distinguishes saving from investing?`,
    optionA: "Saving emphasizes preserving accessible funds; investing seeks growth with varying risk.",
    optionB: "Saving always produces lower returns than investing.",
    optionC: "Investing guarantees higher returns over longer periods.",
    optionD: "Saving and investing represent identical financial decisions.",
    correctAnswer: "A",
  },

  // SECTION 6: Sales Orientation & Situational Judgement (5 Qs)
  {
    question: `You are given 40 eligible customers. After contacting 30, only three show interest. What should you examine first?`,
    optionA: "Whether customer list is fundamentally unsuitable.",
    optionB: "Whether your opening, targeting and need-discovery approach is effective.",
    optionC: "Whether sales target should be reduced.",
    optionD: "Whether customers should be contacted only by senior RMs.",
    correctAnswer: "B",
  },
  {
    question: `A customer says: "I don't need health insurance because I have enough money in my savings account." Strongest response?`,
    optionA: "Savings may not be enough because healthcare costs are increasing.",
    optionB: "You should buy insurance because everyone needs it.",
    optionC: "May I understand how you have planned for a large unexpected medical expense?",
    optionD: "Insurance provides benefits that savings cannot provide.",
    correctAnswer: "C",
  },
  {
    question: `Your monthly sales target is ₹15 lakh. After 15 working days, you generated ₹5 lakh. What should concern you most?`,
    optionA: "The absolute business achieved.",
    optionB: "The gap between current run rate and required run rate.",
    optionC: "The number of customers contacted.",
    optionD: "The number of days already completed.",
    correctAnswer: "B",
  },
  {
    question: `A customer appears interested but repeatedly postpones decision. Which action demonstrates strongest sales judgment?`,
    optionA: "Increase pressure to create urgency.",
    optionB: "Offer discount without understanding hesitation.",
    optionC: "Ask what unresolved concern is preventing a decision.",
    optionD: "Stop following up to avoid irritating customer.",
    correctAnswer: "C",
  },
  {
    question: `A high-value customer asks you to recommend a policy. You know competitor product suits better. What should you do?`,
    optionA: "Recommend your product because bank expects business.",
    optionB: "Recommend the more appropriate solution based on customer needs.",
    optionC: "Avoid recommendation and let customer decide.",
    optionD: "Present only your product advantages.",
    correctAnswer: "B",
  },
];

async function seed60Questions() {
  console.log("🌱 Resetting Question Bank to 60 official Niva Bupa assessment questions (30 AUM + 30 ARM Banca)...");

  // Step 1: Remove existing questions
  await prisma.submission.deleteMany({});
  await prisma.attemptQuestion.deleteMany({});
  await prisma.question.deleteMany({});

  // Step 2: Insert 30 AUM questions
  for (const q of aumQuestions30) {
    await prisma.question.create({
      data: {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: 1.0,
        status: "ACTIVE",
      },
    });
  }

  // Step 3: Insert 30 ARM Banca questions
  for (const q of armBancaQuestions30) {
    await prisma.question.create({
      data: {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: 1.0,
        status: "ACTIVE",
      },
    });
  }

  const count = await prisma.question.count();
  console.log(`🎉 Successfully seeded EXACTLY ${count} active questions into the Question Bank!`);
}

seed60Questions()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
