import json
from xml.etree.ElementTree import Element, SubElement, tostring

# 1) Carica gli articoli
with open(r"C:\Users\paolo\Downloads\Estrazione\americascupfan\public\data\latest_articles.json", encoding="utf-8") as f:
    articles = json.load(f)

# 2) Costruisci la sitemap
urlset = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
for a in articles:
    slug = a['articleUrl'].split('/')[-1]
    url = SubElement(urlset, 'url')
    SubElement(url, 'loc').text = f"https://americascupfan-production.up.railway.app/{slug}"
    SubElement(url, 'lastmod').text = a['date']

xml = tostring(urlset, encoding='utf-8', xml_declaration=True).decode()
# 3) Salva la sitemap nella cartella public del progetto
output = r"C:\Users\paolo\Downloads\Estrazione\americascupfan\public\news-sitemap.xml"
with open(output, 'w', encoding='utf-8') as f:
    f.write(xml)

print(f"Sitemap rigenerata con {len(articles)} URL.")