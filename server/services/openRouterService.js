// services/openRouterService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("Missing OpenRouter API Key. Please set OPENROUTER_API_KEY in your .env file.");
}

/* ========= Utils ========= */
const norm = (s = "") => String(s).toLowerCase().trim().replace(/\s+/g, " ");
const CATEGORY_MAP = {
  instagram: "instagram", ig: "instagram",
  linkedin: "linkedin", li: "linkedin",
  dating: "dating", "dating apps": "dating", tinder: "dating", bumble: "dating", hinge: "dating",
  resume: "resume", cv: "resume",
  facebook: "facebook", fb: "facebook",
  twitter: "twitter", x: "twitter", "twitter/x": "twitter",
  professional: "professional",
  default: "default",
};
const normalizeCategoryId = (x) => CATEGORY_MAP[norm(x || "default")] || "default";

/* ========= Styles by category ========= */
const STYLES = {
  instagram:   { tone: "engaging, vibrant, personable",       length: "1–3 short sentences (≤ ~35 words)." },
  linkedin:    { tone: "professional, concise, impact-focused",length: "1–2 sentences (≤ ~30 words)." },
  dating:      { tone: "authentic, confident, warm",           length: "1–2 sentences (≤ ~28 words)." },
  resume:      { tone: "formal, composed, results-oriented",   length: "1 sentence (≤ ~22 words)." },
  facebook:    { tone: "friendly, casual, community-oriented", length: "1–2 sentences (≤ ~32 words)." },
  twitter:     { tone: "punchy, expressive, hook-first",       length: "≤ ~25 words." },
  professional:{ tone: "corporate, serious, high-clarity",     length: "1–2 sentences (≤ ~28 words)." },
  default:     { tone: "clear, engaging, concise",             length: "1–3 sentences." },
};

/* ========= Filtering ========= */
const APPEARANCE_DROP = new Set([
  // EN
  "beard","facial hair","moustache","mustache","hair","black hair","forehead","jaw","chin","cheek",
  "eyebrow","eyewear","glasses","t-shirt","shirt","hoodie","jacket","suit","tie","dress","person","portrait",
  "face","selfie","skin","eye","eyes","nose","mouth","lips","teeth",
  // HE
  "זקן","שפם","שיער","בלונד","ברונטית","מצח","לסת","סנטר","לחי","גבות",
  "משקפיים","חולצה","קפוצון","מעיל","חליפה","עניבה","שמלה","דיוקן","פנים","סלפי","עור","עיניים","פה","שפתיים","שיניים"
]);

const PHOTO_TECH_DROP = new Set([
  "camera","lens","dslr","hdr","bokeh","aperture","iso","exposure","lighting","resolution","pixels",
  "מצלמה","עדשה","חשיפה","תאורה","רזולוציה","פיקסלים"
]);

const MIN_SCORE = 0.5;
const MAX_LABELS = 10;

function entriesFromLabels(labelsInput) {
  if (Array.isArray(labelsInput)) return labelsInput.map(l => [l, 1]);
  if (labelsInput && typeof labelsInput === "object") return Object.entries(labelsInput).map(([k, v]) => [k, Number(v)]);
  return [];
}

function filterLabels(labelsInput) {
  let entries = entriesFromLabels(labelsInput)
    .filter(([, v]) => !Number.isNaN(v) && v >= MIN_SCORE)
    .sort((a, b) => b[1] - a[1]);

  const kept = [];
  for (const [raw] of entries) {
    const l = norm(raw);
    if (APPEARANCE_DROP.has(l) || PHOTO_TECH_DROP.has(l)) continue;
    kept.push(String(raw).trim());
    if (kept.length >= MAX_LABELS) break;
  }
  return kept;
}

function rescueLabels(labelsInput) {
  const entries = entriesFromLabels(labelsInput);
  const rescued = [];
  for (const [raw] of entries) {
    const l = norm(raw);
    if (!l) continue;
    if (APPEARANCE_DROP.has(l) || PHOTO_TECH_DROP.has(l)) continue;
    rescued.push(String(raw).trim());
    if (rescued.length >= MAX_LABELS) break;
  }
  return rescued;
}

/* ========= Purpose ========= */
function resolveWritingPurpose(prompt, category) {
  const p = norm(prompt || "");
  if (category === "dating" || /tinder|bumble|hinge|dating\s*profile|bio/.test(p)) return "dating profile";
  if (category === "linkedin" && /headline|summary|about|bio/.test(p)) return "linkedin bio";
  if (/caption|post/.test(p)) return "caption";
  return "post";
}

/* ========= Prompt builder (Minimal) ========= */
function buildMessages({ category, prompt, labelsInput }) {
  const platform = normalizeCategoryId(category);
  const style = STYLES[platform] || STYLES.default;

  let kept = filterLabels(labelsInput);
  if (kept.length === 0) kept = rescueLabels(labelsInput);
  const keywords = kept.slice(0, 6);

  const writingPurpose = resolveWritingPurpose(prompt, platform);

  const system = [
    `Write a short ${writingPurpose} for ${platform}.`,
    `${style.length}`,
    `Tone: ${style.tone}.`,
    keywords.length ? `Use 2–3 of these keywords verbatim: ${keywords.join(", ")}.` : `No keywords provided.`,
    `Avoid appearance/camera terms.`,
    `Make it feel human, authentic and warm, and add 1–2 relevant emojis.`,
    `Output: the final copy only.`
  ].join(" ");

  const user = (prompt && prompt.trim())
    ? prompt.trim()
    : `Create ${platform} text that highlights the person's interests.`;

  console.log("[GEN] platform:", platform);
  console.log("[GEN] keywords:", keywords);

  return [
    { role: "system", content: system },
    { role: "user", content: user }
  ];
}

/* ========= Main ========= */
export const generateWithOpenRouter = async (purpose, prompt, labels) => {
  const category = normalizeCategoryId(purpose);
  const messages = buildMessages({ category, prompt, labelsInput: labels });

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-4-maverick:free",  // 🔥 הדגם החינמי המומלץ
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 120,
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices?.[0]?.message?.content?.trim();
};
