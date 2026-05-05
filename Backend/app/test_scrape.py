import urllib.request
import re

try:
    req = urllib.request.Request('https://www.imdb.com/title/tt0149773/', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    print(m.group(1) if m else 'No image')
except Exception as e:
    print(e)
