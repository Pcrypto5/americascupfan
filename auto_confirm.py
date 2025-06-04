#!/usr/bin/env python3
# auto_confirm.py

import requests

# ========== CONFIGURAZIONE ==========
# Inserisci qui la URL base della tua API Railway (senza slash finale)
BASE_URL = "https://americascupfan-production.up.railway.app"

# =====================================

def fetch_subscribers():
    """
    Recupera l’elenco di tutti i sottoscrittori da /api/subscribers.
    Restituisce una lista di dizionari con chiavi: email, confirmed, timestamp, token.
    """
    url = f"{BASE_URL}/api/subscribers"
    r = requests.get(url)
    r.raise_for_status()
    data = r.json()
    # data è del formato {"count": N, "subscribers": [ {…}, {…}, … ]}
    return data.get("subscribers", [])


def confirm_token(token: str):
    """
    Chiama l’endpoint /confirm/:token per confermare un utente.
    Restituisce True se lo status code è 200, False altrimenti.
    """
    url = f"{BASE_URL}/confirm/{token}"
    r = requests.get(url)
    return r.status_code == 200


def main():
    subs = fetch_subscribers()
    if not subs:
        print("⚠️ Nessun sottoscrittore trovato.")
        return

    # Filtra i non confermati
    non_confermati = [s for s in subs if not s.get("confirmed", False)]
    if not non_confermati:
        print("✅ Non ci sono iscritti da confermare (tutti sono già confermati).")
        return

    print(f"🔍 Trovati {len(non_confermati)} sottoscrittori NON confermati. Eccoli:")
    for idx, s in enumerate(non_confermati, start=1):
        print(f"  {idx}) {s['email']}  (token: {s['token']})")

    print("\n▶️ Eseguo la conferma automatica per tutti i non confermati…\n")

    confermati = []
    falliti = []
    for s in non_confermati:
        token = s["token"]
        email = s["email"]
        try:
            ok = confirm_token(token)
        except Exception as e:
            ok = False

        if ok:
            confermati.append(email)
            print(f"   ✅ {email} confermato (token: {token})")
        else:
            falliti.append(email)
            print(f"   ❌ Errore conferma per {email} (token: {token})")

    print("\n--- RIEPILOGO ---")
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
        print("\n🎉 Tutti gli iscritti non confermati sono ora confermati!")

if __name__ == "__main__":
    main()
