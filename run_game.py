from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[web]", fmt % args)

server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
host, port = server.server_address
url = f"http://{host}:{port}/index.html"

print("=" * 58)
print(" APEX Ultra Highway Racing")
print(f" Serving this folder at: {url}")
print(" Keep this window open while you play.")
print(" Press Ctrl+C here to stop the server.")
print("=" * 58)
webbrowser.open(url, new=2)
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nStopping APEX local server...")
finally:
    server.server_close()