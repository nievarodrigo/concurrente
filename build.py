"""Bundle local artwork, CSS and JS into one offline deliverable. No dependencies."""
from pathlib import Path
import base64
root = Path(__file__).resolve().parent
html = (root / 'src/template.html').read_text()
for token, path in [('/*__CSS__*/', 'src/style.css'), ('/*__JS__*/', 'src/game.js')]:
    html = html.replace(token, (root / path).read_text())
for token, path in [('/*__CITY__*/', 'assets/city.png'), ('/*__SPRITES__*/', 'assets/characters.png'), ('/*__POSES__*/', 'assets/poses.png')]:
    html = html.replace(token, 'data:image/png;base64,' + base64.b64encode((root / path).read_bytes()).decode())
(root / 'landing.html').write_text(html)
print(f'landing.html: {len(html.encode()):,} bytes; all assets embedded')
