# GMI Cloud Deployment Guide

## Prerequisites

- GMI Cloud account with API access
- Docker installed
- `GMI_API_KEY` from your GMI Cloud dashboard

---

## Step 1: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
GMI_API_KEY=your_actual_api_key
GMI_BASE_URL=https://api.gmi-serving.com/v1
GMI_MODEL=meta-llama/Llama-3.3-70B-Instruct
```

---

## Step 2: Local Test

```bash
docker compose up --build
```

Verify:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Health: http://localhost:8000/health
- API Docs: http://localhost:8000/docs

---

## Step 3: Deploy to GMI Cloud

### Option A: Docker Compose (Recommended)

```bash
# Build images
docker compose build

# Tag for GMI registry
docker tag launchpilot-backend registry.gmi-cloud.app/YOUR_ORG/launchpilot-backend:latest
docker tag launchpilot-frontend registry.gmi-cloud.app/YOUR_ORG/launchpilot-frontend:latest

# Push
docker push registry.gmi-cloud.app/YOUR_ORG/launchpilot-backend:latest
docker push registry.gmi-cloud.app/YOUR_ORG/launchpilot-frontend:latest
```

### Option B: GMI Cloud CLI

```bash
# Install CLI
pip install gmi-cloud-cli

# Login
gmi login

# Deploy
gmi deploy --name launchpilot-ai --compose docker-compose.yml
```

---

## Step 4: Set Environment Variables

In the GMI Cloud dashboard, set:

| Variable | Value |
|----------|-------|
| `GMI_API_KEY` | Your API key |
| `GMI_BASE_URL` | `https://api.gmi-serving.com/v1` |
| `GMI_MODEL` | `meta-llama/Llama-3.3-70B-Instruct` |
| `APP_ENV` | `production` |
| `CORS_ORIGINS` | `https://your-frontend-url.gmi-cloud.app` |

---

## Step 5: Get Public URL

After deployment, GMI Cloud provides:
- Frontend: `https://launchpilot-frontend.gmi-cloud.app`
- Backend: `https://launchpilot-backend.gmi-cloud.app`

Update `VITE_API_URL` in your frontend build:
```
VITE_API_URL=https://launchpilot-backend.gmi-cloud.app
```

---

## Health Check Endpoints

```bash
# Backend health
curl https://launchpilot-backend.gmi-cloud.app/health

# Available models
curl https://launchpilot-backend.gmi-cloud.app/api/v1/models

# Test analysis
curl -X POST https://launchpilot-backend.gmi-cloud.app/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI recruiting platform"}' \
  --no-buffer
```

---

## Switching Models

No code changes required. Update the environment variable:

```bash
# Use DeepSeek R1 for reasoning tasks
GMI_MODEL=deepseek-ai/DeepSeek-R1

# Use Qwen for multilingual support
GMI_MODEL=Qwen/Qwen2.5-72B-Instruct
```

Or select the model in the UI via the model selector dropdown.

---

## Scaling

The backend uses `--workers 2` by default. Scale via GMI Cloud dashboard or:

```yaml
# docker-compose.yml
backend:
  deploy:
    replicas: 3
```
