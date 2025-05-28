@echo off
echo [INFO] Avvio aggiornamento notizie America's Cup...
cd /d "%~dp0"
python americascup_news\americascup_news_fetcher.py

if %ERRORLEVEL% NEQ 0 (
    echo [ERRORE] Qualcosa è andato storto durante l'esecuzione dello script Python.
) else (
    echo [SUCCESSO] File latest_articles.json aggiornato correttamente.
)

pause
