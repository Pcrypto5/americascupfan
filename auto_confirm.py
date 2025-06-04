#!/usr/bin/env python3
# auto_confirm.py

import requests
from datetime import datetime

# ======== CONFIGURAZIONE ========
# Inserisci qui la URL base della tua API Railway (senza slash finale)
BASE_URL = "https://americascupfan-production.up.railway.app"
# ==================================

def fetch_subscribers():
    """
    Recupera l'elenco di sottoscrittori da /api/subscribers
    Si assume che l'API restituisca un JSON come:
      {
        "count": N,
        "subscribers": [
          {
            "email": "...",
            "firstName": "...",
            "lastName": "...",
            "interests": [...],
            "confirmed": false,
            "timestamp": "...",
            "token": "..."
          }, ...
        ]
      }
    Restituisce solo la lista di dizionari (senza il "count").
    """
    url = f"{BASE_URL}/api/subscribers"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
    except Exception as e:
        print(f"❌ Errore nel fetch di /api/subscribers: {e}")
        return []
    data = r.json()
    return data.get("subscribers", [])


def confirm_token(token: str):
    """
    Chiama l'endpoint GET /confirm/<token> per confermare un utente.
    Ritorna True se riceve status_code 200, False altrimenti.
    """
    url = f"{BASE_URL}/confirm/{token}"
    try:
        r = requests.get(url, timeout=10)
        return r.status_code == 200
    except Exception:
        return False


def export_to_txt(subscribers, filename="subscribers_list.txt"):
    """
    Genera (o sovrascrive) il file filename contenente, per ogni sottoscrittore,
    una riga del tipo:
       email  –  confirmed (True/False)  –  interests: [ ... ]
    """
    try:
        with open(filename, "w", encoding="utf-8") as f:
            for s in subscribers:
                email = s.get("email", "<nessuna email>")
                confirmed = s.get("confirmed", False)
                # Se l'API restituisce le "interests", le uniamo in una stringa.
                interests_list = s.get("interests", [])
                # Formattiamo: ["a","b"] → a, b
                if isinstance(interests_list, list):
                    joined_interests = ", ".join(interests_list)
                else:
                    joined_interests = str(interests_list)

                line = (
                    f"{email}  –  "
                    f"{'CONFIRMED' if confirmed else 'NOT CONFIRMED'}  –  "
                    f"interests: [{joined_interests}]\n"
                )
                f.write(line)
        print(f"✅ File '{filename}' aggiornato con {len(subscribers)} righe.")
    except Exception as e:
        print(f"❌ Errore durante la scrittura di '{filename}': {e}")


def main():
    # 1) Prima scarichiamo tutti i subscribers
    subs = fetch_subscribers()
    if not subs:
        print("⚠️ Nessun sottoscrittore trovato o errore di rete.")
        return

    # 2) Filtriamo quelli NON confermati (confirmed == False)
    non_confermati = [s for s in subs if not s.get("confirmed", False)]
    if not non_confermati:
        print("✅ Nessun iscritto da confermare (tutti sono già confermati).")
    else:
        print(f"🔍 Trovati {len(non_confermati)} sottoscrittori NON confermati:")
        for idx, s in enumerate(non_confermati, start=1):
            token_value = s.get("token", "<nessun token>")
            email = s.get("email", "<nessuna email>")
            interests = s.get("interests", [])
            print(f"  {idx}) {email}  (token: {token_value})  –  interests: {interests}")

        print("\n▶️ Invio richiesta di conferma automatica a tutti i non confermati...\n")
        confermati = []
        falliti = []
        for s in non_confermati:
            token = s.get("token")
            email = s.get("email", "<nessuna email>")
            if not token:
                print(f"   ⚠️ Salto {email}: mancante campo 'token'")
                falliti.append(email)
                continue

            ok = confirm_token(token)
            if ok:
                confermati.append(email)
                print(f"   ✅ {email} confermato (token: {token})")
                # Se la chiamata è andata a buon fine, aggiorniamo lo stato nell'elenco in memoria:
                s["confirmed"] = True
                s["confirmedAt"] = datetime.utcnow().isoformat() + "Z"
            else:
                falliti.append(email)
                print(f"   ❌ Errore conferma per {email} (token: {token})")

        print("\n--- RIEPILOGO CONFERME ---")
        if confermati:
            print(f"✅ Confermati con successo ({len(confermati)}):")
            for e in confermati:
                print(f"   • {e}")
        else:
            print("⚠️ Nessuna conferma riuscita.")

        if falliti:
            print(f"\n❌ Falliti ({len(falliti)}):")
            for e in falliti:
                print(f"   • {e}")
        else:
            print("\n🎉 Tutti i sottoscrittori non confermati sono ora confermati!")

    # 3) Alla fine, riscriviamo un file di testo plain con TUTTI i sottoscrittori
    #    (lo facciamo su 'subs', che ora contiene lo stato updated di 'confirmed').
    print("\n▶️ Esporto tutti i sottoscrittori su file di testo...\n")
    export_to_txt(subs)


if __name__ == "__main__":
    main()
