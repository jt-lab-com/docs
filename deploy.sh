#!/bin/bash

# Quick deployment script for JT-Lab documentation

echo "🚀 Starting JT-Lab documentation deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if git is configured
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a git repository."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. Build folder not created."
    exit 1
fi

# Add all changes to git
echo "📝 Adding changes to git..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Deploy: Update documentation $(date '+%Y-%m-%d %H:%M:%S')"

# Push to main branch
echo "🚀 Pushing changes to GitHub..."
git push origin main

echo "✅ Deployment completed! GitHub Actions will automatically deploy the site."
echo "🌐 Site will be available at: https://docs.jt-lab.com/"
echo ""
echo "📊 Check deployment status in the Actions section on GitHub."