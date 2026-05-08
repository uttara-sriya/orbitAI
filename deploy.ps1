# orbitAI Cloud Run Deployment Script
# Project: orbit-ai-495706
# Region: us-central1

$PROJECT_ID = "orbit-ai-495706"
$REGION = "us-central1"
$SERVICE_NAME = "orbit-ai"
$REPO_NAME = "orbit-ai-repo"

Write-Host "`n🚀 Starting Deployment for OrbitAI..." -ForegroundColor Cyan

# Check for gcloud
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: gcloud CLI not found. Please install it: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit
}

# 1. Set Project
Write-Host "📍 Project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# 2. Enable Services
Write-Host "🔧 Enabling Google Cloud APIs (Cloud Build, Cloud Run, Artifact Registry)..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# 3. Create Artifact Registry (if not exists)
Write-Host "📦 Checking Artifact Registry..."
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="OrbitAI Docker repository" `
    --quiet 2>$null

# 4. Build and Submit
Write-Host "🏗️  Building and submitting Docker image via Cloud Build..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest" .

# 5. Deploy to Cloud Run
Write-Host "🚢 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME `
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated

Write-Host "`n✅ OrbitAI is live!" -ForegroundColor Green
Write-Host "Check your service URL above."
