# JT-Lib & JT-Trader Documentation

Documentation for JavaScript Trading Libraries, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

**🌐 Online Documentation:** [https://jt-lab-com.github.io/docs/](https://jt-lab-com.github.io/docs/)

### Installing Dependencies
```bash
yarn install
```

### Development
```bash
yarn start
```
The Site Will be available at: http://localhost:3000

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
- Check Markdown Syntax

### Image Issues
- Use relative paths: `./images/example.png`
- Add `width` and `height` attributes for size control
- Images automatically enlarge on click

## 📦 Dependencies

- **@docusaurus/core** - Docusaurus core
- **@docusaurus/preset-classic** - Classic preset
- **@mdx-js/react** - MDX support
- **remark-gfm** - GitHub Flavored Markdown
- **remark-images** - Image processing

## 🔗 Useful Links

### Documentation
- **📖 [Online Documentation](https://jt-lab-com.github.io/docs/)** - Complete JT-Lib and JT-Trader documentation
- **📚 [JT-Lib Documentation](https://jt-lab-com.github.io/docs/docs/jt-lib/)** - Core library documentation
- **⚙️ [JT-Trader Documentation](https://jt-lab-com.github.io/docs/docs/jt-trader/)** - Trading platform documentation

### JT-Lab Resources
- **🌐 [Official JT-Lab Website](https://jt-lab.com)** - Platform homepage
- **📦 [JT-Trader on GitHub](https://github.com/jt-lab-com/jt-trader)** - Trading platform source code
- **📚 [JT-Lib on GitHub](https://github.com/jt-lab-com/jt-lib)** - Development library source code

### Documentation
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [GitHub Pages](https://pages.github.com/)
