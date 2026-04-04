/**
 * Motivational Messages Generator
 */

export const motivationService = {
  // Get motivational message based on time of day and streak
  getMotivationMessage: (streak = 0, interviews = 0) => {
    const hour = new Date().getHours();
    const baseMessages = [];

    // Time-based messages
    if (hour < 12) {
      baseMessages.push(
        "☀️ Good morning! Time to crush some interviews!",
        "🌅 Rise and shine! Let's build that streak!",
        "💪 Morning boost: Your best interview awaits!",
        "🎯 Start your day with perfect practice!"
      );
    } else if (hour < 18) {
      baseMessages.push(
        "🌤️ Afternoon grind! Keep that momentum!",
        "⚡ Midday focus: You've got this!",
        "🔥 Let's turn this day into a streak day!",
        "💼 Afternoon is perfect for a mock interview!"
      );
    } else {
      baseMessages.push(
        "🌙 Evening practice = success!",
        "✨ Night owl mode: Let's practice smart!",
        "🌟 Final push of the day - make it count!",
        "🚀 Even late, you're still progressing!"
      );
    }

    // Streak-based messages
    if (streak >= 30) {
      baseMessages.push(
        "🔥 LEGEND! 30+ day streak - absolutely unstoppable!",
        "👑 You are an ABSOLUTE LEGEND! Keep it going!"
      );
    } else if (streak >= 14) {
      baseMessages.push(
        "🌟 IMPRESSIVE! 2 week streak - you're on fire!",
        "⚡ Two weeks strong! You're unstoppable!"
      );
    } else if (streak >= 7) {
      baseMessages.push(
        "🔥 One week strong! Keep this momentum!",
        "💪 Week 1 completed - let's go for more!"
      );
    } else if (streak > 0) {
      baseMessages.push(
        `🔥 ${streak} day streak! Build it higher!`,
        `💪 Great start with ${streak} days! Continue!`
      );
    } else {
      baseMessages.push(
        "🎯 Start your first interview today!",
        "💪 Let's build your first streak!",
        "🚀 Ready to begin your journey?",
        "✨ Today is day 1 of greatness!"
      );
    }

    // Interview count based
    if (interviews >= 100) {
      baseMessages.push("You've done 100+ interviews! You're a professional now!");
    } else if (interviews >= 50) {
      baseMessages.push("50+ interviews completed! Mastery level: high!");
    }

    // Pick random message
    return baseMessages[Math.floor(Math.random() * baseMessages.length)];
  },
};
