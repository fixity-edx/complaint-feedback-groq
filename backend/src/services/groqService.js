/**
 * Groq API service:
 * - Summarize complaint
 * - Classify into category: urgent / feedback / suggestion
 */
export async function summarizeAndClassify({ title, description }){
  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error("GROQ_API_KEY missing in .env");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const prompt = `You are an AI assistant for a complaint system.
Task:
1) Summarize the complaint in 1-2 lines.
2) Classify it into EXACTLY ONE category: urgent, feedback, suggestion.

Return JSON only in this format:
{
  "summary": "...",
  "category": "urgent|feedback|suggestion"
}

Complaint Title: ${title}
Complaint Description: ${description}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a strict JSON generator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 180,
    })
  });

  const data = await response.json();

  if(!response.ok){
    const msg = data?.error?.message || "Groq API error";
    throw new Error(msg);
  }

  const text = data?.choices?.[0]?.message?.content?.trim() || "{}";

  // Safely parse JSON from model
  let obj = { summary: "", category: "feedback" };
  try{
    // remove possible ```json fences
    const cleaned = text.replace(/```json|```/g, "").trim();
    obj = JSON.parse(cleaned);
  }catch{
    obj.summary = text.slice(0, 180);
    obj.category = "feedback";
  }

  // normalize category
  const c = String(obj.category || "feedback").toLowerCase();
  if(!["urgent","feedback","suggestion"].includes(c)) obj.category = "feedback";
  else obj.category = c;

  obj.summary = String(obj.summary || "").trim().slice(0, 300);

  return obj;
}
