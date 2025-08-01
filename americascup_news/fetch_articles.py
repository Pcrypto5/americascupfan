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

# Inizializza client OpenAI
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
        print(f"❌ Errore immagine Unsplash: {e}")
        return "/images/placeholder.jpg"

def generate_article(title: str, excerpt: str, date: str) -> str:
    """
    Genera due versioni dell'articolo: prima in italiano, poi in inglese,
    separate da ###. Ogni sezione è un paragrafo completo ottimizzato SEO.
    """
    prompt = (
        f"Scrivi un articolo originale basato sul titolo, sull'introduzione e sulla data.\n\n"
        f"Titolo: {title}\n"
        f"Data della notizia: {date}\n"
        f"Introduzione: {excerpt}\n\n"
        "Scrivi prima un paragrafo in italiano, poi uno in inglese, separati da ###. "
        "Se la notizia è vecchia o storica, specificalo chiaramente."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ Errore OpenAI: {e}")
        return f"{excerpt} ###{excerpt}"

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

            parts = entry.title.rsplit(' - ', 1)
            title = parts[0]
            excerpt = entry.get("summary", "").strip()
            author = "AmericasCupFan"

            # Gestione della data pubblicazione
            raw_date = entry.get("published", "")
            try:
                pub_date = datetime.strptime(raw_date, "%a, %d %b %Y %H:%M:%S %Z")
            except Exception:
                pub_date = datetime.utcnow()

            delta = datetime.utcnow() - pub_date
            if delta.days > 15:
                print(f"⏩ Saltato '{title}' (vecchio di {delta.days} giorni)")
                continue

            date_str = pub_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

            # Genera contenuto
            content = generate_article(title, excerpt, date_str)
            image_url = fetch_image_url("america's cup sailing")
            slug = slugify(title)

            articles.append({
                "id": article_id,
                "title": title,
                "date": date_str,
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
