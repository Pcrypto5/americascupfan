import os
import openai
import requests
import feedparser
from datetime import datetime
from dotenv import load_dotenv
from slugify import slugify

# Carica variabili da .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
openai.api_key = OPENAI_API_KEY

# RSS feed da cui prendere le notizie
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=america's+cup+sailing&hl=en-US&gl=US&ceid=US:en",
    "https://www.sailingscuttlebutt.com/feed/",
    "https://www.yachtingworld.com/feed"
]

def fetch_image_url(query):
    url = f"https://api.unsplash.com/photos/random?query={query}&orientation=landscape&client_id={UNSPLASH_ACCESS_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        return data["urls"]["regular"]
    except Exception as e:
        print(f"Errore immagine Unsplash: {e}")
        return "/images/placeholder.jpg"

def generate_article(title, excerpt):
    prompt = f"""Scrivi un articolo breve, in italiano, ottimizzato per la SEO e in stile giornalistico, basato sul titolo e l'introduzione forniti.
    
Titolo: {title}

Introduzione: {excerpt}

Articolo:"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            temperature=0.8,
        )
        return response["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Errore OpenAI: {e}")
        return excerpt

def fetch_articles():
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
            excerpt = entry.get("summary", "")[:240]
            date = entry.get("published", datetime.utcnow().isoformat())
            author = entry.get("author", "Unknown")
            article_url = entry.link

            # Genera contenuto
            content = generate_article(title, excerpt)
            image = fetch_image_url("america's cup sailing")
            slug = slugify(title)

            article = {
                "id": article_id,
                "title": title,
                "excerpt": excerpt,
                "date": date,
                "author": author,
                "articleUrl": f"/articles/{slug}",
                "image": image,
                "keywords": ["America's Cup", "vela", "regata", "yacht", "sailing"]
            }

            articles.append(article)
            article_id += 1

            if len(articles) >= 3:
                break
        if len(articles) >= 3:
            break

    return articles
