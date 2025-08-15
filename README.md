# 🖼️ Golden Frame

**Golden Frame** is a collaborative mobile app (React Native + Expo) for uploading photos, selecting a purpose (e.g., LinkedIn, Instagram), and receiving a smart, personalized score based on visual and semantic analysis.  
Perfect for creative feedback, profile optimization, and content enhancement.

---

## ✨ Features

- Upload photos directly from your device
- Select intended use (Instagram, LinkedIn, etc.)
- Receive smart scores based on deep visual and semantic analysis
- Uses Google Vision + RAG (retrieval-augmented label matching)
- Modular, extensible architecture for new categories
- Node.js backend with Python-based semantic scoring
- **AI-generated post content:** For photos you like, receive ready-to-use, AI-generated captions or post content that you can share directly

---

## ⚙️ Tech Stack

| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | React Native (Expo)                   |
| Backend   | Node.js + Express                     |
| Vision AI | Google Cloud Vision API               |
| NLP / RAG | Python + HuggingFace + LangChain      |
| Embedding | all-MiniLM-L6-v2 + cosine similarity  |

---

## 🧠 Smart Scoring System

1. **Visual Processing (Node.js):**  
   Resolution, brightness, sharpness, face detection, Google Vision label extraction.
2. **Label Enrichment:**  
   The `inferLabels()` function expands partial labels into richer, inferred concepts.
3. **RAG-Based Label Matching (Python):**  
   Each category (Instagram, LinkedIn, etc.) and each user have a predefined semantic vector.  
   - Image labels are embedded into vectors  
   - Average label vector is computed  
   - Cosine similarity is calculated with both the category vector and the user vector, yielding semantic scores (1–100) for each
4. **Final Score Composition:**  
   - 60%: Visual feature score (weighted factors like sharpness, brightness, etc.)
   - 40%: Semantic similarity (can be a combination of category and user vector scores)
   - Bonus: Extra points for specific patterns (e.g., only one face in the photo)

---

## 🧪 Example Flow

1. User uploads photos
2. Selects category/purpose (e.g., "LinkedIn")
3. Server enriches photo metadata (vision + local processing)
4. Python script compares labels to the semantic vector of that category and the user
5. Scores are returned and sorted
6. **For liked photos, the user receives AI-generated post content, ready to share**

---

## 🚧 Limitations & Future Improvements

> ⚠️ This is a **first iteration** focused on proof-of-concept and basic feature parity.

**Planned Enhancements:**
- Neural network-based scoring (MLP or CNN) to replace or complement the rule-based system
- Collect user interactions or use labeled public datasets for supervised fine-tuning
- More granular category customization & feedback UI in the mobile app

---
