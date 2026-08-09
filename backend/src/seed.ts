import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nivaBupaAumQuestions = [
  // SECTION 1 – COMMUNICATION & COMPREHENSION (Q1-Q10) -> Pick 5 Random
  {
    subjectName: "Section 1: Communication & Comprehension",
    sectionName: "Communication & Comprehension",
    questionsToAsk: 5,
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
  // SECTION 2 – ADVANCED ENGLISH (Q11-Q20) -> Pick 5 Random
  {
    subjectName: "Section 2: Advanced English",
    sectionName: "Advanced English",
    questionsToAsk: 5,
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
  // SECTION 3 – MENTAL ABILITY & REASONING (Q21-Q30) -> Pick 5 Random
  {
    subjectName: "Section 3: Mental Ability & Reasoning",
    sectionName: "Mental Ability & Reasoning",
    questionsToAsk: 5,
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
  // SECTION 4 – APPLIED MATHEMATICAL REASONING (Q31-Q40) -> Pick 5 Random
  {
    subjectName: "Section 4: Applied Mathematical Reasoning",
    sectionName: "Applied Mathematical Reasoning",
    questionsToAsk: 5,
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
  // SECTION 5 – SALES ORIENTATION & JOB READINESS (Q41-Q50) -> Pick 5 Random
  {
    subjectName: "Section 5: Sales Orientation & Job Readiness",
    sectionName: "Sales Orientation & Job Readiness",
    questionsToAsk: 5,
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
  // SECTION 6 – APPLIED INSURANCE AWARENESS (Q51-Q55) -> Pick 5 Random
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

async function main() {
  console.log('🌱 Starting database main seed...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'greatcampus' },
    update: {},
    create: {
      name: 'NIVA BUPA Assessment Platform',
      slug: 'greatcampus',
    },
  });

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

  // 1. Seed Assessment AUM
  const assessmentAum = await prisma.assessment.upsert({
    where: { slug: 'niva-bupa-aum-assessment' },
    update: {
      name: 'Niva Bupa Health Insurance - Agency Unit Manager Assessment',
      description: '30 Random Questions per attempt from a pool of 55 questions covering Communication, Advanced English, Reasoning, Applied Math, Sales Orientation, and Insurance Awareness.',
      durationMins: 30,
      passingPercentage: 50.0,
      maxProctorWarnings: 3,
      status: 'ACTIVE',
    },
    create: {
      tenantId: tenant.id,
      name: 'Niva Bupa Health Insurance - Agency Unit Manager Assessment',
      slug: 'niva-bupa-aum-assessment',
      description: '30 Random Questions per attempt from a pool of 55 questions covering Communication, Advanced English, Reasoning, Applied Math, Sales Orientation, and Insurance Awareness.',
      durationMins: 30,
      passingPercentage: 50.0,
      maxProctorWarnings: 3,
      status: 'ACTIVE',
    },
  });

  await prisma.assessmentSubject.deleteMany({
    where: { assessmentId: assessmentAum.id },
  });

  let order1 = 1;
  for (const group of nivaBupaAumQuestions) {
    const subject = await prisma.assessmentSubject.create({
      data: {
        assessmentId: assessmentAum.id,
        name: group.subjectName,
        displayOrder: order1++,
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
    }
  }
  console.log('✅ Assessment 1 (AUM) seeded successfully!');

  // 2. Seed Assessment ARM
  const assessmentArm = await prisma.assessment.upsert({
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

  await prisma.assessmentSubject.deleteMany({
    where: { assessmentId: assessmentArm.id },
  });

  let order2 = 1;
  for (const group of nivaBupaArmQuestions) {
    const subject = await prisma.assessmentSubject.create({
      data: {
        assessmentId: assessmentArm.id,
        name: group.subjectName,
        displayOrder: order2++,
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
    }
  }
  console.log('✅ Assessment 2 (ARM) seeded successfully!');

  console.log('🎉 Main database seed finished cleanly!');
}

main()
  .catch((e) => {
    console.error('❌ Error during main seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
