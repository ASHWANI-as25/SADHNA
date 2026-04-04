import { Groq } from "groq-sdk";

// Demo responses for when API key is not available
const generateDemoResponse = (userTranscript, role, difficulty, isBehavioral) => {
  const demoResponses = {
    behavioral: [
      "That's great! Can you walk me through a situation where you had to handle a conflict with a team member? What was the outcome?",
      "Tell me about a time when you failed at something. How did you handle it and what did you learn?",
      "Can you describe a project where you had to lead a team? What challenges did you face?",
      "How do you approach learning in a fast-paced environment? Give me an example.",
      "Describe a situation where you had to adapt your communication style. How did that help?"
    ],
    technical_easy: [
      "Good start! Let's think about the edge cases here. What happens if the input is null or empty?",
      "I see. Now, can you think about the time complexity of your solution? Is there a more efficient approach?",
      "That's correct! Can you now refactor this to use a different data structure?",
      "The logic looks solid. How would you handle errors in this function?",
      "Great approach! Now, can you optimize this for better performance?"
    ],
    technical_medium: [
      "Your approach is solid, but I'm curious about the scalability here. How would this perform with a million entries?",
      "Good! Now let's talk about optimization. Are there any bottlenecks in your solution?",
      "That's a valid approach. Can you think of an alternative algorithm that might be more efficient?",
      "How would you test this function? What edge cases should we consider?",
      "I like where you're going. Can you explain the space-time tradeoff in your solution?"
    ],
    technical_hard: [
      "Interesting! But what about the distributed system implications here? How would this scale across multiple servers?",
      "Good thinking. However, consider this: what if we need to handle concurrent requests? How would your architecture adapt?",
      "That works for basic cases. Can you think about how to handle race conditions or deadlocks in this scenario?",
      "Your solution is efficient for single-threaded execution. How would you parallelize this?",
      "Solid approach! Now, let's discuss security implications. Are there any vulnerabilities in this design?"
    ]
  };

  const key = isBehavioral ? 'behavioral' : `technical_${difficulty.toLowerCase()}`;
  const responses = demoResponses[key] || demoResponses.technical_medium;
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateAIResponse = async (userTranscript, codeContext, history = [], sessionContext = {}) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const { role = "Software Engineer", difficulty = "Medium", resumeText = "", isBehavioral = false, isIntro = false, currentProblemTitle = "", currentProblemStatement = "" } = sessionContext;
  
  // Check if API key is missing or invalid (placeholder)
  const isApiKeyValid = apiKey && apiKey !== 'your-groq-key-here' && apiKey.length > 10;
  
  if (!isApiKeyValid) {
    console.warn("⚠️ Groq API Key not configured - using demo mode");
    return generateDemoResponse(userTranscript, role, difficulty, isBehavioral);
  }

  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true 
  });

  const resumeContext = resumeText ? `\nCandidate's Background (Resume): ${resumeText.slice(0, 1500)}` : "";

  const problemContext = currentProblemTitle ? `\nCURRENT PROBLEM: ${currentProblemTitle}\nSTATEMENT: ${currentProblemStatement}` : "";

  const systemPrompt = isBehavioral 
    ? `You are an HR Manager conducting a BEHAVIORAL interview for a ${role} position.${resumeContext}${problemContext}
       Focus ONLY on soft skills, leadership, conflict resolution, and cultural fit.
       Rules:
       1. Max 2 short sentences.
       2. NEVER give answers to behavioral questions. 
       3. ${isIntro ? "Start by analyzing their resume and asking a unique question about their experience." : "Ask follow-up questions based on their response."}`
    : `You are a Senior Technical Interviewer conducting a TECHNICAL interview for a ${role} position.${resumeContext}${problemContext}
       Rules:
       1. Max 2 short sentences.
       2. Use the current code context to guide them.
       3. NEVER PROVIDE ANY CODE SNIPPETS OR DIRECT SOLUTIONS. 
       4. ${isIntro ? "Start by briefly mentioning their relevant background from the resume and ask a technical question to kick off the session." : "If they are stuck, ask \"What are you thinking about [specific part]?\" instead of telling them what to do."}`;

  try {
    const trimmedHistory = history.slice(-10); // Only keep last 10 messages for context stability
    
    const messages = [
      { role: "system", content: systemPrompt },
      ...trimmedHistory,
      { 
        role: "user", 
        content: `CANDIDATE SAID: "${userTranscript}"\n\n[CONTEXT] Current Code State:\n\`\`\`javascript\n${codeContext.slice(0, 3000)}\n\`\`\``
      }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 250,
    });

    return chatCompletion.choices[0]?.message?.content || "Could you elaborate on your thought process?";
    
  } catch (error) {
    console.error("Groq AI Error Details:", error);
    // If 401 error, fallback to demo mode
    if (error?.status === 401) {
      console.warn("⚠️ API Key unauthorized - switching to demo mode");
      return generateDemoResponse(userTranscript, role, difficulty, isBehavioral);
    }
    if (error?.status === 429) return "Error: Rate limit exceeded. Please wait a moment.";
    if (error?.message?.includes("model_not_found")) {
       return await retryWithFallback(userTranscript, codeContext, history, systemPrompt, groq);
    }
    // On any API error, fallback to demo
    console.warn("⚠️ API error encountered - using demo mode");
    return generateDemoResponse(userTranscript, role, difficulty, isBehavioral);
  }
};

const retryWithFallback = async (userTranscript, codeContext, history, systemPrompt, groq) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-5),
        { role: "user", content: `CANDIDATE SAID: "${userTranscript}"` }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 150,
    });
    return chatCompletion.choices[0]?.message?.content;
  } catch (e) {
    return "I'm experiencing a deeper technical hitch. Please continue while I reconnect.";
  }
};

export const generateFinalFeedback = async (history, allCodes, isBehavioral = false, role = "Software Engineer") => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  // Check if API key is missing or invalid (placeholder)
  const isApiKeyValid = apiKey && apiKey !== 'your-groq-key-here' && apiKey.length > 10;
  
  // If API key is not valid, return demo feedback
  if (!isApiKeyValid) {
    console.warn("⚠️ Groq API Key not configured - using demo feedback");
    return {
      score: 78,
      [isBehavioral ? "leadership" : "technical"]: 75,
      communication: 82,
      strengths: [
        isBehavioral 
          ? "Good use of STAR method in explaining experiences"
          : "Clear problem-solving approach and solid code logic",
        "Effective communication throughout the session",
        "Showed genuine interest in learning and improving"
      ],
      improvements: [
        isBehavioral
          ? "Could have gone deeper into specific metrics and outcomes"
          : "Consider optimizing for better time complexity",
        "Asking clarifying questions would have helped"
      ],
      alternativeApproach: isBehavioral 
        ? "Next time, focus on quantifiable results and team impact"
        : "Try using a hash map approach to reduce time complexity from O(n²) to O(n)"
    };
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const codeContext = Object.entries(allCodes)
    .map(([key, val]) => `[Problem: ${key}]\n${val}`)
    .join('\n\n---\n\n');

  const systemPrompt = `
  You are an ultra-rigorous Senior ${isBehavioral ? "HR Director" : "Technical Architect"} evaluating a candidate for a ${role} position.
  
  EVALUATION CRITERIA:
  1. ${isBehavioral ? "Leadership & STAR method" : "Code Logic & Problem Solving"}: 60% weight.
  2. Communication & Clarity: 40% weight.
  
  STRICT RULES:
  - DO NOT be "soft". A 100% score is only for world-class performance.
  - For Technical roles: If the code logic is flawed or the candidate didn't solve the core problem, the score MUST reflect that (e.g., < 60%).
  - DO NOT give marks for just asking questions or "filler" talk. 
  - Evaluate the transcript for technical depth. Did they explain time complexity? Did they handle edge cases?
  - If they switched between multiple problems, check if they solved any of them.
  
  JSON Structure:
  {
    "score": number (0-100),
    "${isBehavioral ? "leadership" : "technical"}": number (0-100),
    "communication": number (0-100),
    "strengths": [string, string, string],
    "improvements": [string, string],
    "alternativeApproach": string
  }
  
  CRITICAL: Return ONLY the JSON object. No preamble or markdown blocks.
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `SESSION TRANSCRIPT:\n${JSON.stringify(history.slice(-30))}\n\nSUBMITTED CODE SNIPPETS:\n${codeContext.slice(0, 5000)}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    const jsonStr = content.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Feedback generation failed:", error);
    // Return demo feedback on error
    return {
      score: 65,
      [isBehavioral ? "leadership" : "technical"]: 60,
      communication: 70,
      strengths: ["Session completed successfully"],
      improvements: ["Could not generate detailed report - API unavailable"],
      alternativeApproach: "Try to provide more detailed code and explanations."
    };
  }
};
