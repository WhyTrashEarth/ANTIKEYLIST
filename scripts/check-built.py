"""Check built local links, assets, metadata and the supplied artwork's integrity."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import hashlib
import struct

root = Path('dist')

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.nodes = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

pages = {file: Page(file.read_text()) for file in root.rglob('*.html')}
count = 0
for path, page in pages.items():
    ids = [a['id'] for _, a in page.nodes if 'id' in a]
    assert len(ids) == len(set(ids)), f'Duplicate IDs: {path}'
    assert any(t == 'title' for t, _ in page.nodes), path
    assert any(t == 'link' and a.get('rel') == 'canonical' for t, a in page.nodes), path
    assert any(t == 'meta' and a.get('property') == 'og:image' and a.get('content') == 'https://antikeylist.com/og-annie-key.png' for t, a in page.nodes), path
    for tag, attrs in page.nodes:
        ref = attrs.get('href') if tag in ['a', 'link'] else attrs.get('src') if tag in ['img', 'script'] else None
        if not ref:
            continue
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            assert tag not in ['img', 'script'], f'Unexpected third-party request: {ref}'
            continue
        if url.path:
            target = root / unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)
            if target.is_dir():
                target /= 'index.html'
            assert target.is_file(), f'Broken local reference in {path}: {ref}'
        else:
            target = path
        if url.fragment:
            target_page = pages.get(target)
            assert target_page and any(a.get('id') == url.fragment for _, a in target_page.nodes), f'Missing anchor {ref}'
        count += 1

png = (root / 'og-annie-key.png').read_bytes()
assert struct.unpack('>II', png[16:24]) == (1200, 630)
assert hashlib.sha256((root / 'art/annie-key-original.png').read_bytes()).hexdigest() == 'b380d1dd3382361565ee4d83cb375284e6bab2991085b25d756f0f2eba45846c'
print(f'Passed: {len(pages)} pages, {count} local references, sharing image dimensions, and original artwork checksum.')
