from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime
from pathlib import Path
import os
import json
import requests
from pathlib import Path
import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# === Percorsi assoluti ===
BASE_DIR = Path(__file__).resolve().parent.parent
data_folder = BASE_DIR / "public" / "data"
images_folder = BASE_DIR / "public" / "images"
# Carica variabili d'ambiente (.env con OPENAI_API_KEY)
load_dotenv()
print("Chiave letta:", os.getenv("OPENAI_API_KEY"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === 1. Genera notizia ===
def genera_articolo():
    prompt = (
        "Scrivi un breve articolo giornalistico in italiano sul mondo dell'America's Cup. "
        "Stile elegante e conciso. 4-6 righe. Deve sembrare una notizia vera, aggiornata."
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Sei un giornalista esperto di vela e America's Cup."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content

# === 2. Genera immagine rilassante ===
def genera_immagine(percorso_output):
    prompt = (
        "Una barca a vela moderna che naviga in mare calmo sotto il sole, cielo azzurro, "
        "fotorealistico, luce calda, atmosfera rilassante, senza testo"
    )

    os.makedirs(os.path.dirname(percorso_output), exist_ok=True)

    print("📡 Chiamata DALL·E...")
    response = client.images.generate(
        prompt=prompt,
        n=1,
        size="1024x1024"
    )

    image_url = response.data[0].url
    print(f"🌅 Immagine generata: {image_url}")

    try:
        img_response = requests.get(image_url)

        if img_response.status_code == 200 and len(img_response.content) > 1000:
            with open(percorso_output, 'wb') as handler:
                handler.write(img_response.content)
            print("✅ Immagine salvata correttamente!")
        else:
            print(f"❌ Download fallito o immagine vuota (size={len(img_response.content)} bytes)")
            print(f"🔗 URL temporanea (puoi testarla in browser): {image_url}")
    except Exception as e:
        print("❌ Errore nel download o salvataggio immagine:", e)

    return os.path.basename(percorso_output)




# === 3. Salva JSON compatibile con React ===
def salva_json(testo, image_name):
    os.makedirs(data_folder, exist_ok=True)

    oggi = datetime.now().strftime("%Y-%m-%d")

    articolo = {
        "id": 1,
        "title": "Ultime dalla America's Cup",
        "excerpt": testo.strip(),
        "image": f"/images/{image_name}",
        "date": oggi,
        "author": "Sailing AI News",
        "articleUrl": "#"
    }

    try:
        with open(data_folder / "articles.json", "w", encoding="utf-8") as f:
            json.dump([articolo], f, indent=2, ensure_ascii=False)
        print("✅ JSON salvato correttamente!")
    except Exception as e:
        print("❌ Errore nel salvataggio JSON:", e)


# === MAIN ===
if __name__ == "__main__":
    print("📰 Generazione notizia...")
    testo = genera_articolo()

    print("🖼️ Generazione immagine...")
    nome_immagine = "news_1.jpg"
    genera_immagine(f"../public/images/{nome_immagine}")

    print("💾 Salvataggio JSON...")
    salva_json(testo, nome_immagine)

    print("✅ Fatto! La notizia è pronta e visibile nel sito.")

    print("✅ Verifica percorsi:")
    print("JSON:", data_folder / "articles.json")
    print("IMG :", images_folder / "news_1.jpg")
    print("Esiste JSON:", (data_folder / "articles.json").exists())
    print("Esiste IMG :", (images_folder / "news_1.jpg").exists())

