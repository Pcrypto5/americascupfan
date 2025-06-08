import os
import json
import re
import requests
import feedparser
from datetime import datetime
from slugify import slugify
from dotenv import load_dotenv
import openai

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

openai.api_key = OPENAI_API_KEY

RSS_FEEDS = [
    "https://news.google.com/rss/search?q=america's+cup+sailing&hl=en-US&gl=US&ceid=US:en",
    "https://www.sailingscuttlebutt.com/feed/",
    "https://www.yachtingworld.com/feed"
]

def clean_title(title):
    return re.split(r"\s*[-|–]\s*", title)[0].strip()

def fetch_image_url(query):
    try:
        url = f"https://api.unsplash.com/photos/random?query={query}&orientation=landscape&client_id={UNSPLASH_ACCESS_KEY}"
        response = requests.get(url)
        return response.json()["urls"]["regular"]
    except:
        return "/images/placeholder.jpg"

def generate_bilingual_article(title, excerpt):
    prompt = f"""
Scrivi un articolo breve in stile giornalistico e ottimizzato per SEO. Fornisci due versioni: prima in ITALIANO, poi in INGLESE, separate da ###.

Titolo: {title}

Introduzione: {excerpt}
"""
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.8
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("Errore OpenAI:", e)
        return excerpt

def fetch_articles():
    articles = []
    seen = set()
    article_id = 1

    for feed_url in RSS_FEEDS:
        feed = feedparser.parse(feed_url)
        for entry in feed.entries:
            if entry.link in seen:
                continue
            seen.add(entry.link)

            raw_title = entry.title
            title = clean_title(raw_title)
            excerpt = entry.get("summary", "")[:240]
            date = entry.get("published", datetime.utcnow().isoformat())
            image = fetch_image_url("america's cup sailing")
            content = generate_bilingual_article(title, excerpt)
            slug = slugify(title)

            articles.append({
                "id": article_id,
                "title": title,
                "excerpt": excerpt,
                "date": date,
                "author": "AmericasCupFan",
                "articleUrl": f"/articles/{slug}",
                "image": image,
                "content": content,
            })

            article_id += 1
            if len(articles) >= 3:
                return articles
    return articles

def save_articles():
    articles = fetch_articles()
    base_dir = os.path.dirname(__file__)
    data_dir = os.path.join(base_dir, "..", "public", "data")
    archive_dir = os.path.join(base_dir, "..", "public", "archive")

    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(archive_dir, exist_ok=True)

    latest_path = os.path.join(data_dir, "latest_articles.json")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    month_id = datetime.utcnow().strftime("%Y-%m")
    archive_path = os.path.join(archive_dir, f"{month_id}.json")
    if os.path.exists(archive_path):
        with open(archive_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    else:
        existing = []

    new_urls = {a["articleUrl"] for a in articles}
    filtered = [a for a in existing if a["articleUrl"] not in new_urls]
    all_articles = articles + filtered

    with open(archive_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)

    print(f"[✅] latest_articles.json aggiornato con {len(articles)} articoli")
    print(f"[📦] Archivio aggiornato in archive/{month_id}.json")

if __name__ == "__main__":
    save_articles()
