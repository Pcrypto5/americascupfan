import os
import openai
import feedparser
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from slugify import slugify

# Carica API Key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Fonti RSS
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=america's+cup+sailing&hl=en-US&gl=US&ceid=US:en",
    "https://www.sailingscuttlebutt.com/feed/",
    "https://www.yachtingworld.com/feed"
]

# Funzione per generare testo
def generate_article(title, excerpt):
    prompt = f"""
Sei un giornalista esperto di vela. Riscrivi in italiano questo articolo in modo originale, chiaro e informativo. Evita ogni riferimento diretto alla fonte. L'articolo deve essere leggibile da un pubblico generale e focalizzato sull'America's Cup.

Titolo: {title}
Testo: {excerpt}

Testo riformulato:"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Errore OpenAI: {e}")
        return excerpt

# Funzione principale
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

            # Pulisci excerpt da HTML
            excerpt_raw = entry.get("summary", "")
            excerpt = BeautifulSoup(excerpt_raw, "html.parser").get_text()[:500]

            content = generate_article(title, excerpt)
            date = entry.get("published", datetime.utcnow().isoformat())

            article = {
                "id": article_id,
                "title": title,
                "date": date,
                "author": "AmericasCupFan",
                "content": content,
                "keywords": ["America's Cup", "vela", "regata"]
            }

            articles.append(article)
            article_id += 1

            if len(articles) >= 3:
                break
        if len(articles) >= 3:
            break

    return articles
