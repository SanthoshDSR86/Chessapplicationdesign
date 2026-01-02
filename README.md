# Backend Project

AI generation failed. Context:
Here's a complete implementation of a professional, production-ready FastAPI backend following the Clean Architecture pattern.

**Project Structure:**
```markdown
app/
__init__.py
main.py
api/
__init__.py
endpoints/
__init__.py
auth.py
data.py
core/
__init__.py
config.py
security.py
constants.py
models/
__init__.py
user.py
data.py
services/
__init__.py
auth.py
data.py
db/
__init__.py
session.py
base.py
requirements.txt
.env.example
README.md
```

**Code Implementation:**
```json
{
  "app/main.py": "
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, data
from app.core.security import get_token_header

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    openapi_url=f\"/{settings.API_V1_STR}/openapi.json\"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=\"*\",
        allow_headers=\"*\",
    )

app.include_router(auth.router, prefix=\"/api/v1/auth\")
app.include_router(data.router, prefix=\"/api/v1/data\")

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request, exc):
    error_detail = []
    for error in exc.errors():
        error_detail.append(
            {
                \"loc\": error['loc'],
                \"msg\": error['msg'],
                \"type\": error['type']
            }
        )
    return JSONResponse(status_code=422, content={\"errors\": error_detail})

@app.get(\"/api/v1/healthcheck\")
def read_root():
    return {\"message\": \"Welcome to " + settings.PROJECT_NAME + "\"}
",
  "app/api/endpoints/auth.py": "
from fastapi import APIR