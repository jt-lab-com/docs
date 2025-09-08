# JT-Lib & JT-Trader Documentation

Documentation for JavaScript Trading Libraries, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

**🌐 Online Documentation:** [https://jt-lab-docs.github.io/](https://jt-lab-docs.github.io/)

## 📦 Deployment

This documentation is automatically deployed to GitHub Pages using GitHub Actions.

### 🚀 Automatic Deployment
- Push to `second` branch triggers automatic deployment
- GitHub Actions builds and deploys the site
- Site is available at: `https://jt-lab-docs.github.io/`

### 🔧 Manual Deployment
```bash
# Quick deploy script (Linux/Mac)
./deploy.sh

# Quick deploy script (Windows)
deploy.bat

# Or manually:
npm ci
npm run build
git add .
git commit -m "Deploy: Update documentation"
git push origin second
```

### 📋 Setup Instructions
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Installing Dependencies
```bash
yarn install
```

### Development
```bash
yarn start
```
The site will be available at: http://localhost:3000

### Production Build
```bash
yarn build
```

### Testing Build
```bash
yarn serve
```

## 📚 Documentation Structure

- **JT-Lib** - Core library for algorithmic trading
- **JT-Trader** - High-level trading framework
- **Triggers** - Automation system for triggers
- **Interfaces** - TypeScript interfaces and types

## 🌐 Deploy to GitHub Pages

The site automatically deploys to GitHub Pages when pushing to the `main` branch.

### GitHub Pages Setup

1. Go to repository settings on GitHub
2. In the "Pages" section, select source "GitHub Actions"
3. With each push to `main`, the site will automatically update

## 🔧 Configuration

- `docusaurus.config.ts` - main Docusaurus configuration
- `sidebars.ts` - navigation structure
- `src/css/custom.css` - custom styles

## 📝 Adding New Documentation

1. Create a `.md` file in the appropriate folder
2. Add frontmatter with `id`, `title`, `sidebar_label`
3. Update `sidebars.ts` to add to navigation
4. Run `yarn start` to check

## 🐛 Troubleshooting

### Build Errors
- Check all links in documentation
- Make sure all files exist
- Check Markdown syntax

### Image Issues
- Use relative paths: `./images/example.png`
- Add `width` and `height` attributes for size control
- Images automatically enlarge on click

## 🖼️ Image Preview System

The documentation includes a **custom image preview system** that automatically intercepts clicks on image links and shows them in a full-screen modal window.

### How It Works

1. **Automatic Detection**: The script automatically finds all links with `target="_blank"` that lead to images
2. **Supported Formats**: jpg, jpeg, png, gif, webp, svg, bmp
3. **Modal Window**: When clicking on an image, a full-screen modal window opens
4. **Controls**: Close by clicking on overlay, close button, or Escape key

### Technical Implementation

#### React Component (`src/components/ImagePreview.tsx`)
```typescript
interface ImagePreviewProps {
  enableLogs?: boolean; // Enable debug logs
}

<ImagePreview enableLogs={false} />
```

#### Standalone JavaScript (`src/js/image-preview.js`)
Pure JavaScript file that can be used independently of React.

#### Layout Integration (`src/theme/Layout/index.tsx`)
```typescript
import ImagePreview from '../../components/ImagePreview';

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <Layout {...props} />
      <ImagePreview enableLogs={false} />
    </>
  );
}
```

### Functionality

✅ **Full-screen View** - images display in modal window  
✅ **Responsive Design** - works correctly on mobile devices  
✅ **Animations** - smooth transitions when opening/closing  
✅ **Captions** - display image alt text  
✅ **Scroll Lock** - prevent page scrolling when modal is open  
✅ **Multiple Close Methods** - click on overlay, × button, or Escape key  

### Configuration

To enable debug logs, set `enableLogs={true}`:

```typescript
<ImagePreview enableLogs={true} />
```

This will output detailed information about the script's operation to the console, which is useful for debugging.

## 📦 Dependencies

- **@docusaurus/core** - Docusaurus core
- **@docusaurus/preset-classic** - Classic preset
- **@mdx-js/react** - MDX support
- **remark-gfm** - GitHub Flavored Markdown
- **remark-images** - Image processing

## 🔗 Useful Links

### Documentation
- **📖 [Online Documentation](https://dev-zone-xs.github.io/jt-lab-docs-en/)** - Complete JT-Lib and JT-Trader documentation
- **📚 [JT-Lib Documentation](https://dev-zone-xs.github.io/jt-lab-docs-en/docs/jt-lib/)** - Core library documentation
- **⚙️ [JT-Trader Documentation](https://dev-zone-xs.github.io/jt-lab-docs-en/docs/jt-trader/)** - Trading platform documentation

### JT-Lab Resources
- **🌐 [Official JT-Lab Website](https://jt-lab.com)** - Platform homepage
- **📦 [JT-Trader on GitHub](https://github.com/jt-lab-com/jt-trader)** - Trading platform source code
- **📚 [JT-Lib on GitHub](https://github.com/jt-lab-com/jt-lib)** - Development library source code

### Documentation
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [GitHub Pages](https://pages.github.com/)