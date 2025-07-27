import json
import os
import sys
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity

base_dir = os.path.dirname(__file__)
embeddings_path = os.path.join(base_dir, "label_embeddings.json")

with open(embeddings_path, "r", encoding="utf-8") as f:
    raw_embeddings = json.load(f)
    category_embeddings = {k.lower(): v for k, v in raw_embeddings.items()}  # ✅ קריטי

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

embedding_cache = {}

def get_embedding(text):
    if text in embedding_cache:
        return embedding_cache[text]

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1).cpu().numpy().flatten()

    embedding_cache[text] = embedding
    return embedding

def average_embedding(labels):
    if not labels:
        return None
    vectors = [get_embedding(label) for label in labels]
    return np.mean(vectors, axis=0)

def compute_similarity(vec1, vec2):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]

def main():
    try:
        raw_input = sys.stdin.read()
        data = json.loads(raw_input)

        images = data["images"]
        category = data["category"].lower()  # ✅ הפוך ל-lowercase
        user_data = data.get("userLabels", {})
        user_labels = user_data.get("labels", [])

    except Exception as e:
        print(f"[❌ ERROR] Failed to parse input: {e}", file=sys.stderr)
        print(json.dumps({"error": f"קלט לא תקין: {e}"}))
        sys.exit(1)

    try:
        category_vector = np.array(category_embeddings[category])
    except KeyError:
        err_msg = f"קטגוריה '{category}' לא קיימת. קטגוריות זמינות: {list(category_embeddings.keys())}"
        print(f"[❌ ERROR] {err_msg}", file=sys.stderr)
        print(json.dumps({"error": err_msg}))
        sys.exit(1)

    print(f"✅ Calculating for category: {category}", file=sys.stderr)

    if user_labels:
        print(f"👤 User labels found: {len(user_labels)}", file=sys.stderr)
    else:
        print(f"⚠️ No user labels found", file=sys.stderr)

    user_vector = average_embedding(user_labels) if user_labels else None

    result = {}

    for image_name, labels in images.items():
        try:
            print(f"📷 Processing image: {image_name} with {len(labels)} labels", file=sys.stderr)

            image_vector = average_embedding(labels)
            if image_vector is None:
                print(f"⚠️ No vector for image: {image_name}", file=sys.stderr)
                result[image_name] = 1
                continue

            sim_user = compute_similarity(image_vector, user_vector) if user_vector is not None else 0
            sim_cat = compute_similarity(image_vector, category_vector)

            score = (0.7 * sim_user) + (0.3 * sim_cat)

            print(f"🧠 Score for {image_name}: user_sim={sim_user:.2f}, cat_sim={sim_cat:.2f}, final={score:.2f}", file=sys.stderr)

            result[image_name] = max(1, min(int(round(score * 100)), 100))
        except Exception as e:
            print(f"[❌ ERROR] Failed processing {image_name}: {e}", file=sys.stderr)
            result[image_name] = 1

    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[❌ CRITICAL ERROR] Uncaught exception: {e}", file=sys.stderr)
        print(json.dumps({"error": f"Uncaught exception: {e}"}))
        sys.exit(1)
