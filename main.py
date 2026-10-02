"""
SETO AI Compiler - Production FastAPI Server
Serves the compiled Vite React frontend (dist/) with SPA fallback routing,
provides backend /api endpoints, and includes auto-generated Swagger documentation at /docs.
"""

import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Resolve absolute path to Vite's production build directory
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

app = FastAPI(
    title="SETO AI Compiler API",
    description="Adaptive AI-powered code learning & compilation platform backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local development (allowing Vite dev server at :5173 to reach FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Vite static assets directory (/assets/...)
if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")


# ====================================================================
# Backend API Endpoints
# ====================================================================

@app.get("/api/health", summary="Health Check")
async def health_check():
    """Returns server and frontend build health status."""
    has_dist = os.path.exists(DIST_DIR)
    has_index = os.path.exists(os.path.join(DIST_DIR, "index.html"))
    return {
        "status": "healthy",
        "framework": "FastAPI",
        "service": "SETO AI Compiler Unified Server",
        "frontend": {
            "dist_dir": DIST_DIR,
            "dist_exists": has_dist,
            "index_html_present": has_index
        }
    }


@app.get("/api/info", summary="Platform Info")
async def server_info():
    """Returns application metadata and supported languages."""
    return {
        "name": "SETO AI Compiler",
        "version": "1.0.0",
        "framework": "FastAPI",
        "description": "Adaptive AI-powered code learning & compilation platform",
        "supported_languages": [
            "python", "javascript", "typescript", "c", "cpp", "java", "rust", "go"
        ],
        "docs_url": "/docs"
    }


# ====================================================================
# Frontend Static Files & SPA Fallback Routing
# ====================================================================

@app.get("/{full_path:path}", summary="SPA Fallback & Static Files")
async def serve_spa(full_path: str):
    """
    1. If the path matches a physical static file in dist/, serve it directly.
    2. If the path starts with api/, return JSON 404.
    3. Otherwise, return dist/index.html so React Router handles the page on the client.
    """
    # Reject unknown /api routes with a clean JSON 404
    if full_path.startswith("api/"):
        raise HTTPException(
            status_code=404,
            detail=f"API endpoint '/{full_path}' does not exist. Visit /docs for available endpoints."
        )

    # Check for direct physical files in dist/ (e.g. favicon.ico, site.webmanifest, etc.)
    file_path = os.path.join(DIST_DIR, full_path)
    if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    # Return index.html for React SPA client-side routes (e.g. /compiler, /library)
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)

    # Friendly warning if frontend has not been compiled yet
    return HTMLResponse(
        content=(
            "<!DOCTYPE html><html><head><title>Build Required</title></head>"
            "<body style='font-family:sans-serif;text-align:center;padding:50px;background:#0f172a;color:#f8fafc;'>"
            "<h1>Frontend Build Not Found</h1>"
            "<p>Please build the Vite React app first:</p>"
            "<pre style='background:#1e293b;padding:12px;display:inline-block;border-radius:6px;color:#38bdf8;'>npm run build</pre>"
            "<p>Then restart or refresh this server.</p>"
            "<p><a href='/docs' style='color:#38bdf8;'>View FastAPI Interactive API Docs (/docs)</a></p>"
            "</body></html>"
        ),
        status_code=404
    )


# ====================================================================
# Application Entrypoint
# ====================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("DEBUG", "False").lower() in ("true", "1", "yes")

    print(f" * SETO AI Compiler FastAPI server running at http://localhost:{port}")
    print(f" * Interactive Swagger Documentation available at http://localhost:{port}/docs")
    print(f" * Serving frontend from: {DIST_DIR}")

    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=debug)
