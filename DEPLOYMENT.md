# GitHub Actions Deployment Guide

## 🚀 Automatic Deployment to GitHub Pages

This repository is configured for automatic deployment of documentation to GitHub Pages using GitHub Actions.

### 📋 What you need to do:

#### 1. **Enable GitHub Pages**
1. Go to repository settings: `Settings` → `Pages`
2. In the `Source` section, select `GitHub Actions`
3. Save settings

#### 2. **Configure Access Permissions**
1. Go to `Settings` → `Actions` → `General`
2. In the `Workflow permissions` section, select `Read and write permissions`
3. Check the box `Allow GitHub Actions to create and approve pull requests`
4. Save settings

#### 3. **Check settings in docusaurus.config.ts**
```typescript
const config: Config = {
  url: 'https://jt-lab-com.github.io',     // GitHub Pages URL
  baseUrl: '/',                            // Repository path
  organizationName: 'jt-lab-com',          // Organization name
  projectName: 'docs',                     // Repository name
  // ... other settings
};
```

#### 4. **Start Deployment**
1. Make a commit and push to the `main` branch
2. GitHub Actions will automatically start
3. Check status in the `Actions` section

### 🔧 Workflow Structure

The `.github/workflows/deploy.yml` file contains:
- **Checkout** - getting the code
- **Setup Node.js** - setting up Node.js 18
- **Install dependencies** - installing dependencies
- **Build website** - building the site
- **Deploy to GitHub Pages** - deploying to GitHub Pages

### 📝 Commands for Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build

# Local preview of built site
npm run serve
```

### 🌐 Result

After successful deployment, your documentation will be available at:
`https://jt-lab-com.github.io/`

### 🐛 Troubleshooting

#### Problem: "Page build failed"
- Check logs in the `Actions` section
- Make sure all dependencies are installed
- Check syntax in documentation files

#### Problem: "404 Not Found"
- Make sure `baseUrl` in `docusaurus.config.ts` is correct
- Check that GitHub Pages is enabled
- Make sure the workflow completed successfully

#### Problem: "Permission denied"
- Check access permission settings in `Settings` → `Actions` → `General`
- Make sure `Read and write permissions` is selected

### 📚 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)