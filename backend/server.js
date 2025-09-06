const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const rateLimit = require("express-rate-limit"); // <--- Import rate limiter

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Rate Limiter: 3 requests per 30 seconds per IP
const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    error: "Too many requests, please wait 30 seconds before retrying.",
  },
});

// Apply rate limiter to all requests
app.use(limiter);

// Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt builder
function buildCheckPrompt(level, original, fixed) {
  return `You are a strict code reviewer.
Compare ORIGINAL vs FIXED.

Return ONLY JSON:
{
  "bugFixed": true/false,
  "explanation": "...",
  "suggestions": ["..."],
  "insult": "If the code is incorrect, include a funny One Piece-style or you are only good at entering wrong age at hentai websites. Example: 'Zoro already found his path and you are still lost, Oh that wasnt white beard tremor tremor fruit that was your code burst , Why you suck this much, Luffy has more brain than you, bro though he is shikamaru, This carrer path is not for you'"
}

ORIGINAL:
\`\`\`js
${original}
\`\`\`

FIXED:
\`\`\`js
${fixed}
\`\`\`

Focus level: ${level}

IMPORTANT: 
- If the fixed code is correct, leave "insult" empty or null.
- If incorrect, provide a short, anime-style insult referencing One Piece (Zoro, Whitebeard, Luffy, etc.) in "insult" field.`;
}


// API: get buggy code from Gemini
app.get("/api/buggy", async (req, res) => {
  const { level } = req.query;
  try {
    let lines;
    if (level === "easy") lines = "10-20";
    else if (level === "medium") lines = "20-40";
    else lines = "60-100";

const prompt = `Write a single-file React component (only the code, no explanation). Requirements:
- File must start with an 'import' statement (no BOM or any characters before the first 'import').
- Use a functional component and React hooks ('useState', 'useEffect') where appropriate.
- Produce a small, self-contained snippet that will run in a standard Create React App / Next.js page **only after the bugs are fixed**. As delivered, the snippet must contain multiple deliberate bugs (logical, state, rendering, or event-handling) of difficulty '<LEVEL>' and must NOT run correctly until those bugs are fixed.
- Keep it concise — roughly '<LINES>' lines (±20% is fine).
- Do NOT fix the bugs. Include them naturally so a developer must find and fix them.
- Do not include any external text, comments explaining the bugs, or extra files — only the component code.
- Ensure the snippet does not include any stray characters before the first 'import' (this avoids the codicon / "x" glyph issue).

Example replacements:
- '<LEVEL>' → 'medium'
- '<LINES>' → '18'
`;


    const result = await model.generateContent(prompt);
    const code = result.response
      .text()
      .replace(/```(js|javascript)?/g, "")
      .trim();
    res.json({ code });
  } catch (err) {
    console.error("🔥 Buggy Code Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// API: check user fix
// API: check user fix


app.post("/api/check", async (req, res) => {
  const { level, originalCode, fixedCode } = req.body;
  if (!level || !originalCode || !fixedCode)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const prompt = buildCheckPrompt(level, originalCode, fixedCode);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    if (!parsed.bugFixed) {
      const insultLines = [
        "You're slower than Zoro finding the Grand Line!",
        "Even Usopp wouldn't lie this badly!",
        "Sanji would refuse to cook code like this!",
        "This code is sinking faster than Going Merry!",
        "Whitebeard is shaking his head at you!",
        "Luffy is facepalming in 3D!"
      ];
      parsed.insult = insultLines[Math.floor(Math.random() * insultLines.length)];
    }

    res.json({ modelRaw: text, parsed });
  } catch (err) {
    console.error("🔥 Check Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
