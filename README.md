# Golden Frame

**Golden Frame** is a collaborative mobile app built with React Native (Expo) that allows users to upload images, select a processing purpose, and receive a personalized result.  
It is designed for creative and interactive photo handling — ideal for applications like design feedback, virtual try-ons, or artistic framing.

## Features
- 📤 Upload photos from device
- 🎯 Select a processing "purpose" or context
- 🧠 Get dynamic results based on user input
- 🧩 Modular UI with reusable components
- ☁️ Server integration for backend processing

## Tech Stack
- **Frontend:** React Native (Expo)
- **Backend:** Node.js (server folder)
- **State Management:** TBD (based on implementation)


## 📁 Categories & Scoring Logic

### 📸 Instagram
**Goal:**  
Highlight visually engaging, colorful, expressive, and well-styled photos that thrive in Instagram’s aesthetic ecosystem.

| Feature         | Weight | Notes |
|------------------|--------|-------|
| Brightness       | 0.15   | Bright photos are eye-catching in feed scrolling. |
| Sharpness        | 0.10   | Clear details reflect quality and retain attention. |
| Face             | 0.20   | Faces foster emotional engagement. |
| Expression       | 0.10   | Smiles and expressive looks perform better. |
| Alignment        | 0.05   | Good framing adds to visual balance. |
| Filters          | 0.05   | Stylish filters enhance visual storytelling. |
| Resolution       | 0.10   | High-res = high quality perception. |
| Labels           | 0.20   | Tags like `smile`, `fashion`, or `selfie` matter. |
| Colors (Blue)    | 0.05   | Blue tones correlate with more likes. |

**Positive Labels:**  
`smile`, `person`, `selfie`, `fashion`, `colorful`, `happiness`, `scenery`

**Negative Labels:**  
`crowd`, `dark`, `blur`

**Smart Label Inference:**  
Using `inferLabels`, we infer high-level labels like `person` from partial data like `smile`, `beard`, or `t-shirt`.

---

### 👔 LinkedIn
**Goal:**  
Professional, approachable, well-lit portraits suitable for business networking.

| Feature         | Weight | Notes |
|------------------|--------|-------|
| Face             | 0.25   | Essential for identification and trust. |
| Resolution       | 0.20   | Reflects quality and professionalism. |
| Brightness       | 0.15   | Proper lighting projects clarity. |
| Sharpness        | 0.15   | Clean edges improve perception. |
| Alignment        | 0.10   | Balanced framing = visual professionalism. |
| Expression       | 0.10   | Warm, neutral smile preferred. |
| Labels           | 0.05   | Tags like `suit`, `professional`, `shirt`.

**Positive Labels:**  
`suit`, `shirt`, `professional`, `smile`, `tie`

**Negative Labels:**  
`selfie`, `crowd`, `dark`, `blur`

---

### ❤️ Dating Apps
**Goal:**  
Show personality, authenticity, friendliness, and emotional accessibility.

| Feature         | Weight |
|------------------|--------|
| Expression       | 0.20 |
| Face             | 0.20 |
| Brightness       | 0.15 |
| Labels           | 0.15 |
| Sharpness        | 0.10 |
| Resolution       | 0.10 |
| Alignment        | 0.05 |
| Filters          | 0.05 |

**Positive Labels:**  
`smile`, `selfie`, `person`, `fun`, `flattering`, `colorful`

**Negative Labels:**  
`dark`, `blur`, `angry`, `crowd`

---

### 📄 Resume
**Goal:**  
Formal, neutral, clear headshots that reflect professionalism.

| Feature         | Weight |
|------------------|--------|
| Face             | 0.30 |
| Resolution       | 0.25 |
| Brightness       | 0.15 |
| Sharpness        | 0.15 |
| Alignment        | 0.10 |
| Expression       | 0.05 |

**Positive Labels:**  
`suit`, `professional`, `shirt`, `person`, `portrait`

**Negative Labels:**  
`selfie`, `smile` (excessive), `fashion`, `blur`, `colorful`

---

### 👥 Facebook
**Goal:**  
Casual, friendly, social photos that reflect personality and real-life moments.

| Feature         | Weight |
|------------------|--------|
| Face             | 0.20 |
| Expression       | 0.20 |
| Labels           | 0.20 |
| Brightness       | 0.15 |
| Sharpness        | 0.10 |
| Resolution       | 0.10 |
| Filters          | 0.05 |

**Positive Labels:**  
`friends`, `smile`, `group`, `outdoor`, `casual`

---

### 🐦 Twitter / X
**Goal:**  
Expressive, sharp, profile-focused images with unique personality or edge.

| Feature         | Weight |
|------------------|--------|
| Expression       | 0.25 |
| Face             | 0.20 |
| Sharpness        | 0.15 |
| Resolution       | 0.15 |
| Labels           | 0.15 |
| Filters          | 0.10 |

**Positive Labels:**  
`face`, `smile`, `fun`, `bold`, `colorful`, `personality`

---

### 🏢 Professional (General)
**Goal:**  
Neutral, high-quality portraits suitable for any business, press, or corporate need.

| Feature         | Weight |
|------------------|--------|
| Face             | 0.25 |
| Resolution       | 0.20 |
| Sharpness        | 0.15 |
| Brightness       | 0.15 |
| Alignment        | 0.10 |
| Expression       | 0.10 |
| Labels           | 0.05 |

**Positive Labels:**  
`person`, `professional`, `clean`, `suit`, `neutral`

---

## 🧠 Label Inference System

The analyzer uses a smart `inferLabels()` method to add missing labels when the system detects partial information (e.g., `beard`, `smile`, `eyebrow`) but doesn't explicitly tag the image with `person`.

This helps maintain accurate, fair scoring across all categories — even when Google Vision misses key context.

---

## 🧪 How It Works

- Each photo is passed through Google Vision and other processors.
- Data is enriched with resolution, brightness, sharpness, and label inference.
- A weighted scoring algorithm per category evaluates and ranks the photos.
- Output: Ranked photo list per target category.

---