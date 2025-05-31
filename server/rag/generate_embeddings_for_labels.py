import json
import os
import shutil
import numpy as np
from collections import defaultdict
from langchain.embeddings import HuggingFaceEmbeddings


embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

base_dir = os.path.dirname(__file__)
labels_path = os.path.join(base_dir, "labels.json")
output_path = os.path.join(base_dir, "label_embeddings.json")
backup_path = os.path.join(base_dir, "label_embeddings.bak.json")


with open(labels_path, "r", encoding="utf-8") as f:
    labels_by_category = json.load(f)

all_labels = []
label_to_category = {}

for category, labels in labels_by_category.items():
    for label in labels:
        all_labels.append(label)
        label_to_category[label] = category

print(f"🔄 Encoding total of {len(all_labels)} labels in batch...")

embeddings = embedding_model.embed_documents(all_labels)

category_vectors = defaultdict(list)

for label, vector in zip(all_labels, embeddings):
    category = label_to_category[label]
    category_vectors[category].append(np.array(vector))

category_means = {
    category: np.mean(vectors, axis=0).tolist()
    for category, vectors in category_vectors.items()
}

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(category_means, f, ensure_ascii=False, indent=2)

print(f"✅ Embeddings saved to: {output_path}")
