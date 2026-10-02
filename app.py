"""
SETO AI Compiler - Production Flask Server
Serves the compiled Vite React frontend (dist/) with SPA fallback routing
and provides backend /api endpoints.
"""

import os
import mimetypes
from flask import Flask, send_from_directory, jsonify, request

# Resolve absolute path to Vite's production build directory
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

app = Flask(
    __name__,
    static_folder=DIST_DIR,
    static_url_path=""
)

# Optional CORS support for development
try:
    from flask_cors import CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
except ImportError:
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

# Ensure correct mime types for JavaScript modules and CSS
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")


# ====================================================================
# Backend API Endpoints
# ====================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health status and diagnostic info."""
    has_dist = os.path.exists(DIST_DIR)
    has_index = os.path.exists(os.path.join(DIST_DIR, "index.html"))
    return jsonify({
        "status": "healthy",
        "service": "SETO AI Compiler Unified Server",
        "environment": os.environ.get("FLASK_ENV", "production"),
        "frontend": {
            "dist_dir": DIST_DIR,
            "dist_exists": has_dist,
            "index_html_present": has_index
        }
    }), 200


@app.route("/api/info", methods=["GET"])
def server_info():
    """Returns application metadata."""
    return jsonify({
        "name": "SETO AI Compiler",
        "version": "1.0.0",
        "description": "Adaptive AI-powered code learning & compilation platform",
        "supported_languages": [
            "python", "javascript", "typescript", "c", "cpp", "java", "rust", "go"
        ]
    }), 200


# ====================================================================
# Frontend Root Route
# ====================================================================

@app.route("/")
def serve_index():
    """Serves the main SPA index.html."""
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return send_from_directory(DIST_DIR, "index.html")
    return (
        "<!DOCTYPE html><html><head><title>Build Required</title></head>"
        "<body style='font-family:sans-serif;text-align:center;padding:50px;background:#0f172a;color:#f8fafc;'>"
        "<h1>Frontend Build Not Found</h1>"
        "<p>Please build the Vite React app first:</p>"
        "<pre style='background:#1e293b;padding:12px;display:inline-block;border-radius:6px;color:#38bdf8;'>npm run build</pre>"
        "<p>Then restart or refresh this server.</p>"
        "</body></html>",
        404
    )


# ====================================================================
# SPA Client-Side Routing Fallback & 404 Handler
# ====================================================================

@app.errorhandler(404)
def handle_spa_fallback(error):
    """
    If an unknown route is requested:
    - If it's an /api/ route, return a proper JSON 404.
    - Otherwise, serve index.html so React Router handles client-side pages.
    """
    if request.path.startswith("/api/"):
        return jsonify({
            "error": "Not Found",
            "message": f"API endpoint '{request.path}' does not exist."
        }), 404

    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return send_from_directory(DIST_DIR, "index.html"), 200

    return (
        "<!DOCTYPE html><html><head><title>Build Required</title></head>"
        "<body style='font-family:sans-serif;text-align:center;padding:50px;background:#0f172a;color:#f8fafc;'>"
        "<h1>Frontend Build Not Found</h1>"
        "<p>Please build the Vite React app first: <code>npm run build</code></p>"
        "</body></html>",
        404
    )


# ====================================================================
# Application Entrypoint
# ====================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1", "yes")

    print(f" * SETO AI Compiler Server running at http://localhost:{port}")
    print(f" * Static files served from: {DIST_DIR}")

    app.run(host="0.0.0.0", port=port, debug=debug)
