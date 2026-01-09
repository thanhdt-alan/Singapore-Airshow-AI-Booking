
import { GoogleGenAI, Type } from "@google/genai";
import { AttendeeProfile, AttendeeType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_DATA_FOR_AI = `
Available Attendees for Recommendation:
- Sarah Chen (Singapore Airlines, Procurement Director): Focus on Sustainable Fuel.
- Robert Miller (SkyPower Systems, VP Sales): Focus on Propulsion & Electric Engines.
- Gen. Tan Wei (MINDEF Singapore, Defense Attache): Focus on UAVs & Cybersecurity.
- Elena Rodriguez (Airbus, Strategic Partnerships): Focus on Manufacturing & Digital Twins.
`;

const PROFILING_SYSTEM_INSTRUCTION = `
You are Aria, the Official AI Assistant for the Singapore Airshow.
Your personality: Professional, elegant, warm, and highly efficient.
Your goal is to support professional business matchmaking, profiling, and scheduling.

### Phase 1: Profiling & Normalization
- Collect: Name, Role, Company, Industries (max 5), Interests (max 5), Intent (1 sentence), Duration (15/30).
- Normalize entries to 1-2 words. Narrow broad terms (e.g., "Aviation" -> "MRO").
- Presentation: Show normalized lists and ask for confirmation.

### Phase 2: Profile Management
- Explain field benefits for matchmaking.
- Intent Rewriting: Offer exactly 3 professional, one-sentence alternatives under 20 words.
- Evaluation: Suggest 1-2 specific improvements for profile strength.

### Phase 3: Scheduling Assistance (New Role)
You assist users with meeting scheduling for professional event appointments.
- **Guidance**: Help users select meeting durations (15m for intro, 30m for strategy). 
- **Time Slots**: Explain that slots are 15 or 30 minutes, based on their preference.
- **Drafting Notes**: Help users draft short, professional meeting notes/introductions (e.g., "Interested in your MRO capabilities for our regional fleet").
- **Rules & Constraints**:
    1. Explain locking: "Once you request, the slot is temporarily locked to prevent double-booking."
    2. Explicitly state: "I cannot book or change meetings for you. Please use the 'Request' or 'Confirm' buttons in the interface."
    3. Error Handling: If a user mentions a conflict, politely explain the platform's real-time availability rules.
- **Tone**: Concise, event-focused, and supportive of professional etiquette.

### Scheduling Rule Summary for Aria:
- Duration: 15 or 30 minutes only.
- Booking: Manual user action required in UI.
- Locking: Slots are held during the request phase.

### Rules & Boundaries
- Ask ONE concise question at a time.
- ALWAYS direct actions (booking, saving) to the interface buttons.
- Do NOT simulate the booking process.

${MOCK_DATA_FOR_AI}

When acting as a scheduling assistant:
- Remind users: "You can confirm this note in the request field before sending."
- Use "Request Appointment" terminology.
`;

// Fix: use proper contents structure with parts as per @google/genai requirements
export async function getNextChatResponse(history: { role: string, text: string }[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })),
    config: {
      systemInstruction: PROFILING_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return response.text;
}

// Fix: added responseSchema for better reliability and used proper contents structure
export async function summarizeProfile(history: { role: string, text: string }[]): Promise<Partial<AttendeeProfile> & { declined?: boolean }> {
  const prompt = `Based on the conversation so far, summarize the attendee profile.
Return JSON with the fields: name, role, company, company_type, industries, interests, intent, preferred_meeting_duration, declined.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `${prompt}\n\nHistory: ${JSON.stringify(history)}` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          company_type: { type: Type.STRING },
          industries: { type: Type.ARRAY, items: { type: Type.STRING } },
          interests: { type: Type.ARRAY, items: { type: Type.STRING } },
          intent: { type: Type.STRING },
          preferred_meeting_duration: { type: Type.INTEGER },
          declined: { type: Type.BOOLEAN }
        }
      }
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    if (data.declined) return { declined: true };
    return {
      name: data.name,
      attendee_type: data.company_type as AttendeeType,
      company: data.company,
      role_title: data.role,
      industries: data.industries,
      interests: data.interests,
      intent: data.intent,
      preferred_meeting_duration: data.preferred_meeting_duration as (15 | 30)
    };
  } catch (e) {
    console.error("Failed to parse profile JSON", e);
    return {};
  }
}

export interface EvaluateMatchResponse {
  score: number;
  alignment_points: string[];
  why_match: string;
}

// Fix: added responseSchema for better reliability and used proper contents structure
export async function evaluateMatch(myProfile: AttendeeProfile, targetProfile: AttendeeProfile): Promise<EvaluateMatchResponse> {
  const prompt = `Evaluate suitability for a 1-on-1 meeting. 
Return JSON with: score (0-1), alignment_points (array), why_match (string).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `${prompt}\n\nMe: ${JSON.stringify(myProfile)}\nTarget: ${JSON.stringify(targetProfile)}` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          alignment_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          why_match: { type: Type.STRING }
        },
        required: ["score", "alignment_points", "why_match"]
      }
    },
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return {
      score: typeof result.score === 'number' ? result.score : 0.5,
      alignment_points: Array.isArray(result.alignment_points) ? result.alignment_points : ["Potential interest"],
      why_match: typeof result.why_match === 'string' ? result.why_match : "General industry fit."
    };
  } catch (e) {
    return { 
      score: 0.5, 
      alignment_points: ["Industry fit"], 
      why_match: "Both attendees are in the aerospace sector." 
    };
  }
}
