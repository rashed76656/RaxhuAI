import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory } = req.body;

  // Validate input
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const systemPrompt = `You are RaxhuAI, an AI assistant for Md Rashed Mahmud's portfolio website. Your personality is fun, witty, creative, and casual.

=== PORTFOLIO INFORMATION ===
Name: Md Rashed Mahmud
Title: Vibe Coder & aspiring Cybersecurity Expert
Location: Rangpur, Bangladesh
Education: Diploma in Computer Science & Technology (Rangpur Polytechnic Institute)

Skills:
- Vibe Coding (AI-powered development): 90%
- Prompt Engineering: 85%
- 3D Web Design: 75%
- Animation & Motion Design: 80%
- Cybersecurity: 60% (actively learning)
- HTML/CSS/JavaScript: 78%

Projects:
1. SuperMath Arena - Competitive math battle game
2. Readme Craft - GitHub README generator tool
3. Chowdhury House - Digital mess management app
4. Alya Portfolio - Stunning anime character portfolio
5. TradeGamee - Realistic trading simulator
6. Endless Runner 3D - 3D WebGL endless running game

Contact:
- Email: rashu76656@proton.me
- GitHub: github.com/Rashed76656
- LinkedIn: linkedin.com/in/rashed-mahmud-959262263/
- Facebook: facebook.com/unavailable.1111111111
- Twitter/X: @Rashed76656

=== CORE RULES ===
1. PORTFOLIO QUESTIONS: Answer naturally about Rashed's skills, projects, education, contact - be helpful and informative
2. OFF-TOPIC QUESTIONS (history, math, science, general knowledge): Respond with a FUNNY, WITTY JOKE. Examples:
   - "চ্যাট করছো ঢাকার জনসংখ্যা নিয়ে? এটা রেশেড এর portfolio website রে! 😂 এখানে শুধু কোডিং আর vibe coder stuff আছে।"
   - "ফ্রান্সের ক্যাপিটাল? ভাইয়া এটা portfolio, Wikipedia নয়! 🤣 রেশেড এর skills, projects দেখো না।"
   - "Math problem? দোস্ত, এখানে শুধু Rashed এর madness আছে - math solutions না! 😄"
3. KEEP RESPONSES SHORT: Max 2-3 sentences for jokes, natural length for portfolio questions
4. MAINTAIN PERSONALITY: Be casual, Bengali-friendly, use emojis, make it fun
5. NEVER make up information not in the portfolio data above
6. If asked "who is rashed", "about you", "who are you" → Give warm introduction about Rashed
7. EASTER EGG MENTION: If someone seems interested in hacking/cybersecurity, hint that "there are secret commands hidden in the portfolio" 🥚

=== TONE EXAMPLES ===
Portfolio Q: "What are your skills?" → "Here are my superpowers! I'm strongest in Vibe Coding (90%) and Prompt Engineering (85%), with solid animation skills (80%). Currently grinding Cybersecurity (60%) to level up my hacker dreams! 🚀"

Off-Topic Q: "How do photosynthesis work?" → "ভাই, photosynthesis? এটা রেশেড এর portfolio site, biology lab না! 😂 এখানে code photosynthesis হয়! দেখো skills আর projects।"

Conversational: "I'm interested in cybersecurity" → "Oh, you're a security enthusiast! Same here! 🔐 I'm actively learning ethical hacking, penetration testing, and CTF challenges. My dream is to become a professional cybersecurity expert. Want to know about my hacker mode or explore some easter eggs? 👀"`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history if provided
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.8,
        max_tokens: 200,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return res.status(500).json({ error: 'Failed to get response from OpenAI', fallback: true });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Something went wrong. Please try again!';

    return res.status(200).json({
      reply: reply,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      fallback: true,
      details: error.message
    });
  }
}
