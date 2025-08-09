# generate_news.py

import json
import os
import subprocess
from datetime import datetime
from fetch_articles import fetch_articles

# === Percorsi ===
base_dir = os.path.dirname(__file__)
data_dir = os.path.join(base_dir, "..", "public", "data")
archive_dir = os.path.join(base_dir, "..", "public", "archive")

os.makedirs(data_dir, exist_ok=True)
os.makedirs(archive_dir, exist_ok=True)

# === 1. Salva il file principale ===
latest_path = os.path.join(data_dir, "latest_articles.json")
articles = fetch_articles()

if not articles:
    print("[⚠️] Nessun articolo recente trovato. Nessun file aggiornato.")
    exit(0)

with open(latest_path, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

# === 2. Archivio mensile ===
now = datetime.utcnow()
month_id = now.strftime("%Y-%m")
archive_path = os.path.join(archive_dir, f"{month_id}.json")

if os.path.exists(archive_path):
    with open(archive_path, "r", encoding="utf-8") as f:
        existing = json.load(f)
else:
    existing = []

# Elimina duplicati usando il titolo
new_titles = {a["title"] for a in articles}
existing = [a for a in existing if a["title"] not in new_titles]

all_articles = articles + existing

with open(archive_path, "w", encoding="utf-8") as f:
    json.dump(all_articles, f, indent=2, ensure_ascii=False)

print(f"[✅] ✅ latest_articles.json aggiornato con {len(articles)} articoli.")
print(f"[📦] Archivio aggiornato in archive/{month_id}.json")

# === 3. Rigenera la sitemap XML ===
try:
    sitemap_script = os.path.join(base_dir, "genera_sitemap.py")
    subprocess.run(["python", sitemap_script], check=True)
except Exception as e:
    print(f"[⚠️] Errore durante la generazione della sitemap: {e}")
