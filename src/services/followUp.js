// AI Follow-up Questions Service
export const generateFollowUpPrompt = (originalQuestion, userAnswer, role) => {
  const basePrompt = `
You are an expert ${role} interviewer conducting a technical interview.

Original Question: ${originalQuestion}
Candidate's Answer: ${userAnswer}

Based on the candidate's answer above, generate 2-3 follow-up questions to dive deeper into their understanding and approach. The follow-up questions should:
1. Probe for deeper understanding of concepts they mentioned
2. Ask about edge cases or alternative approaches they didn't consider
3. Challenge their solution with more complex scenarios

Format your response as a JSON object:
{
  "followUpQuestions": [
    {
      "question": "Follow-up question 1",
      "type": "conceptual|practical|edge-case"
    },
    {
      "question": "Follow-up question 2",
      "type": "conceptual|practical|edge-case"
    }
  ],
  "analysisPoints": ["Point 1", "Point 2", "Point 3"]
}

Generate thoughtful follow-up questions that would challenge the candidate and help you assess their depth of knowledge.
  `;

  return basePrompt;
};

export const analyzeUserResponse = (response, expectedAnalysis) => {
  // Simple heuristics to analyze quality of response
  const analysis = {
    clearnessScore: calculateClearness(response),
    completenessScore: calculateCompleteness(response),
    technicalDepth: calculateDepth(response),
    communicationQuality: calculateCommunication(response),
    strengths: extractStrengths(response),
    improvements: extractImprovements(response)
  };

  return analysis;
};

const calculateClearness = (response) => {
  // Check for clarity markers
  const hasExplanations = /(explain|because|reason|since)/i.test(response);
  const hasStructure = response.split('.').length > 2;
  const hasExamples = /(for example|instance|such as)/i.test(response);
  
  let score = 50;
  if (hasExplanations) score += 20;
  if (hasStructure) score += 15;
  if (hasExamples) score += 15;
  
  return Math.min(100, score);
};

const calculateCompleteness = (response) => {
  const minLength = 100; // Minimum response length
  const hasApproach = /(approach|method|algorithm|solution)/i.test(response);
  const hasImplementation = /(implement|code|write|function)/i.test(response);
  const hasComplexity = /(complexity|efficiency|time|space)/i.test(response);
  
  let score = 50;
  if (response.length > minLength) score += 20;
  if (hasApproach) score += 10;
  if (hasImplementation) score += 10;
  if (hasComplexity) score += 10;
  
  return Math.min(100, score);
};

const calculateDepth = (response) => {
  const hasTechnicalTerms = /(algorithm|data structure|complexity|optimization|pattern)/i.test(response);
  const hasEdgeCases = /(edge case|corner case|exception|special case)/i.test(response);
  const hasTradeoffs = /(trade-off|tradeoff|vs|rather|instead)/i.test(response);
  
  let score = 50;
  if (hasTechnicalTerms) score += 15;
  if (hasEdgeCases) score += 15;
  if (hasTradeoffs) score += 20;
  
  return Math.min(100, score);
};

const calculateCommunication = (response) => {
  const hasGrammar = !hasGrammarErrors(response);
  const isProfessional = !hasSlang(response);
  const isWellFormatted = response.length > 50 && response.split(' ').length > 15;
  
  let score = 50;
  if (hasGrammar) score += 25;
  if (isProfessional) score += 15;
  if (isWellFormatted) score += 10;
  
  return Math.min(100, score);
};

const hasGrammarErrors = (text) => {
  // Simple grammar check - very basic
  const commonErrors = /\b(u|ur|ur|2|b4|thru)\b/gi;
  return commonErrors.test(text);
};

const hasSlang = (text) => {
  const slangTerms = /\b(yeah|yup|nah|gonna|wanna|kinda|sorta|lol|omg)\b/gi;
  return slangTerms.test(text);
};

const extractStrengths = (response) => {
  const strengths = [];
  
  if (/(clear|well-explained|logical)/i.test(response)) {
    strengths.push('Clear explanation of thought process');
  }
  if (/(efficient|optimal|best)/i.test(response)) {
    strengths.push('Consideration of efficiency');
  }
  if (/(edge case|error|exception)/i.test(response)) {
    strengths.push('Awareness of edge cases');
  }
  if (/(trade-off|consideration|discussion)/i.test(response)) {
    strengths.push('Discussion of trade-offs');
  }
  if (response.length > 300) {
    strengths.push('Thorough and detailed response');
  }
  
  return strengths.length > 0 ? strengths : ['Provided a response'];
};

const extractImprovements = (response) => {
  const improvements = [];
  
  if (response.length < 100) {
    improvements.push('Provide more detailed explanations');
  }
  if (!/(example|test|case)/i.test(response)) {
    improvements.push('Include specific examples or test cases');
  }
  if (!/(complexity|time|space)/i.test(response)) {
    improvements.push('Discuss time and space complexity');
  }
  if (!/(alternative|other|different)/i.test(response)) {
    improvements.push('Consider alternative approaches');
  }
  if (response.split('.').length < 3) {
    improvements.push('Structure response with more complete sentences');
  }
  
  return improvements;
};

export const generateAdvancedFollowUp = async (originalQuestion, userAnswer, groqService) => {
  try {
    const prompt = generateFollowUpPrompt(originalQuestion, userAnswer, 'Software Engineer');
    // This would call the Groq API to generate follow-up questions
    // const response = await groqService.generateResponse(prompt);
    // return JSON.parse(response);
    return null;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return null;
  }
};
