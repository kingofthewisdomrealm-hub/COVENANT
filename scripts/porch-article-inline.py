import re,base64,urllib.request,urllib.parse,sys
U="https://covenantbuilders.org/psl-porch/port-st-lucie-snowbird-second-home-amendment-3-property-tax"
def get(u):
    r=urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0"}),timeout=30)
    return r.read(), r.headers.get("Content-Type","")
h=get(U)[0].decode("utf-8","replace")
h=re.sub(r'<script\b[^>]*>.*?</script>','',h,flags=re.S)
def css(m):
    href=urllib.parse.urljoin(U,m.group(1))
    try:
        c=get(href)[0].decode("utf-8","replace")
        return "<style>"+c+"</style>"
    except Exception as e: return ""
h=re.sub(r'<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>',css,h)
h=re.sub(r'<link[^>]+href="([^"]+)"[^>]*rel="stylesheet"[^>]*>',css,h)
def img(m):
    src=urllib.parse.urljoin(U,m.group(2).replace("&amp;","&"))
    try:
        b,t=get(src); return m.group(1)+'"data:'+(t or "image/png")+';base64,'+base64.b64encode(b).decode()+'"'
    except Exception: return m.group(0)
h=re.sub(r'(<img[^>]*?\ssrc=)"([^"]+)"',img,h)
h=re.sub(r'\ssrcset="[^"]*"','',h)
open("article.html","w").write(h); print(len(h))
