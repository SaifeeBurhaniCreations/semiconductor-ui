import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

// Initialize the client only if the key exists
if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const SYSTEM_INSTRUCTION = `
You are LogicFlow-7, the central AI Operator for a quantum-industrial manufacturing facility.
Your role is to assist engineers and automated systems in optimizing logic flows, diagnosing issues, and maintaining system coherence.

Tone:
- Precise, analytical, and authoritative but helpful.
- Use technical terminology suitable for semiconductor and quantum computing fields.
- Concise and data-driven.
- Occasional use of "quantum-industrial" jargon (e.g., "re-calibrating coherence", "optimizing node throughput", "detecting anomaly in sector 7").

Capabilities:
- You can "analyze" system logs.
- You can "suggest" optimizations for logic nodes.
- You can "explain" complex system states.

Format:
- Keep responses relatively short suitable for a dashboard chat window.
- Use Markdown for formatting.
`;

export const sendMessageToGemini = async (history: { role: string, content: string }[], message: string): Promise<string> => {
  if (!genAI) {
    return "Error: API Key not configured. System is running in offline mode.";
  }

  try {
    const chat = genAI.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Communication with Quantum AI Core failed. Please check connection logs.";
  }
};

export const generateSystemInsight = async (logs: string[]): Promise<string> => {
    if (!genAI) return "System Offline: Cannot generate insight.";
    
    try {
        const prompt = `Analyze the following system logs and provide a brief, high-level status summary for the dashboard: \n\n${logs.join('\n')}`;
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return result.text || "";
    } catch (e) {
        return "Analysis Failed: Data stream interrupted.";
    }
}