# src/americascup_news/fetch_articles.py
import os
import requests
import feedparser
from datetime import datetime
from dotenv import load_dotenv
from slugify import slugify
from openai import OpenAI

# Carica variabili da .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
BASE_URL = os.getenv("BASE_URL")

# Inizializza client OpenAI (>=1.0.0)
client = OpenAI(api_key=OPENAI_API_KEY)

# RSS feed da cui prendere le notizie
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=america's+cup+sailing&hl=en-US&gl=US&ceid=US:en",
    "https://www.sailingscuttlebutt.com/feed/",
    "https://www.yachtingworld.com/feed"
]

def fetch_image_url(query: str) -> str:
    url = f"https://api.unsplash.com/photos/random?query={query}&orientation=landscape&client_id={UNSPLASH_ACCESS_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        return data.get("urls", {}).get("regular", "/images/placeholder.jpg")
    except Exception as e:
        print(f"Errore immagine Unsplash: {e}")
        return "/images/placeholder.jpg"


def generate_article(title: str, excerpt: str) -> str:
    prompt = f"""Scrivi un articolo breve, in italiano, ottimizzato per la SEO e in stile giornalistico, basato sul titolo e l'introduzione forniti. ###
Titolo: {title}

Introduzione: {excerpt}

Articolo:"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Errore OpenAI: {e}")
        return excerpt


def fetch_articles() -> list[dict]:
    articles = []
    seen_urls = set()
    article_id = 1

    for feed_url in RSS_FEEDS:
        feed = feedparser.parse(feed_url)
        for entry in feed.entries:
            if entry.link in seen_urls:
                continue
            seen_urls.add(entry.link)

            title = entry.title
            excerpt = entry.get("summary", "").strip()
            date = entry.get("published", datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT"))
            author = entry.get("author", "AmericasCupFan")
            article_url = entry.link

            # Contenuto generato da OpenAI
            content = generate_article(title, excerpt)
            # Immagine
            image_url = fetch_image_url("america's cup sailing")
            slug = slugify(title)

            articles.append({
                "id": article_id,
                "title": title,
                "date": date,
                "author": author,
                "articleUrl": f"/articles/{slug}",
                "image": image_url,
                "content": content,
                "keywords": ["America's Cup", "vela", "regata"]
            })
            article_id += 1
            if len(articles) >= 3:
                break
        if len(articles) >= 3:
            break

    return articles
