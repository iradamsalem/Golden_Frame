# 🖼️ Golden Frame

**Golden Frame** is a collaborative mobile app built with React Native (Expo) that allows users to upload images, select a processing **purpose**, and receive a smart, personalized score based on visual and semantic factors.  
Ideal for creative photo feedback, profile optimization, and content enhancement.

---

## ✨ Features

- 📤 Upload photos directly from the device
- 🎯 Choose the **intended use** (e.g., Instagram, LinkedIn)
- 🧠 Receive **smart scores** based on deep visual and semantic analysis
- 🔍 Uses **Google Vision** + RAG (retrieval-augmented label matching)
- 💡 Modular & extensible architecture for new categories
- ☁️ Node.js backend with Python-based semantic scoring

---

## ⚙️ Tech Stack

| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | React Native (Expo)                   |
| Backend   | Node.js + Express                     |
| Vision AI | Google Cloud Vision API               |
| NLP / RAG | Python + HuggingFace + LangChain      |
| Embeddings| all-MiniLM-L6-v2 + cosine similarity  |

---

## 🧠 Smart Scoring System

Each image is analyzed across multiple dimensions:

### 1. Visual Processing (Node.js)
- Resolution, brightness, sharpness
- Face detection, expression, filters
- Label annotations from Google Vision API

### 2. Label Enrichment
- `inferLabels()` enhances partial labels into richer, inferred concepts (e.g., `smile` → `person`)

### 3. RAG-Based Label Matching (Python)
- Each category (Instagram, LinkedIn, etc.) has a predefined **semantic vector**
- For each image:
  - Image labels are embedded into vectors
  - Average label vector is computed
  - Cosine similarity with category vector yields a semantic score (1–100)

### 4. Final Score Composition
- **60%** → Visual feature score (based on weighted factors like sharpness, brightness, etc.)
- **40%** → Semantic similarity from RAG
- Bonus: extra points for specific patterns (e.g., only one face in the photo)

---

## 🧪 Example Flow

1. User uploads photos
2. Selects category/purpose (e.g., "LinkedIn")
3. Server enriches photo metadata (vision + local processing)
4. Python script compares labels to semantic vector of that category
5. Scores returned and sorted

---

## 🚧 Limitations & Future Improvements

> ⚠️ This is a **first iteration** focused on proof-of-concept and basic feature parity.

### Planned Enhancements:
- 🧠 **Neural Network-Based Scoring**  
  Replace or complement the rule-based system with a trainable model (MLP or CNN) that learns feature importance.
- 🗂️ **Training Dataset**  
  Collect user interactions or use labeled public datasets for supervised fine-tuning.
- 🎨 **UX Optimizations**  
  More granular category customization & feedback UI in mobile app.

---
