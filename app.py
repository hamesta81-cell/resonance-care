import os
import http.server
import socketserver

PORT = int(os.environ.get("PORT", 10000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"[RESONANCE CARE] Python Server listening on port {PORT}")
    httpd.serve_forever()
