import json
import os
import sys
import numpy as np
from langchain_community.embeddings import HuggingFaceEmbeddings
from sklearn.metrics.pairwise import cosine_similarity

# טען את הקובץ מהתיקייה הנוכחית של הסקריפט
base_dir = os.path.dirname(__file__)
embeddings_path = os.path.join(base_dir, "label_embeddings.json")

with open(embeddings_path, "r", encoding="utf-8") as f:
    category_embeddings = json.load(f)

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_embedding(text):
    return np.array(embedding_model.embed_query(text))

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
        category = data["category"]
    except Exception as e:
        print(json.dumps({"error": f"קלט לא תקין: {e}"}))
        sys.exit(1)

    try:
        category_vector = np.array(category_embeddings[category])
    except KeyError:
        print(json.dumps({"error": f"קטגוריה '{category}' לא קיימת"}))
        sys.exit(1)

    result = {}

    for image_name, labels in images.items():
        image_vector = average_embedding(labels)
        if image_vector is None:
            result[image_name] = 1
            continue

        score = compute_similarity(image_vector, category_vector)
        result[image_name] = max(1, min(int(round(score * 100)), 100))

    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
