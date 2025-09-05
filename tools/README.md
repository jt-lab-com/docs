# 🛠️ JT-Lab Docs Development Tools

This folder contains helper scripts and tools for developing and maintaining JT-Lab documentation.

## 📁 Contents

- **`generate-thumbnails.js`** - Automatic thumbnail generation for images
- **`logs/`** - Script execution logs folder
- **`README.md`** - This documentation

---

# 🖼️ Thumbnail Generator

Automatic script for creating thumbnails from `static/images` folder and saving them to `static/images/thumbnails`.

**Uses Sharp** - fast image processing library for Node.js.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** version 18 or higher
2. **Sharp** - image processing library (installed automatically)

#### Installing Sharp

Sharp is installed automatically when installing project dependencies:

```bash
npm install
```

**Sharp is already included in project dependencies!** No additional installations required.

### Running the Script

```bash
# From project root
node tools/generate-thumbnails.js

# Or via npm script
npm run thumbnails
```

## 📋 Command Line Options

```bash
node tools/generate-thumbnails.js [options]

Options:
  --debug              Enable detailed logging
  --width <number>     Thumbnail width (default: 300)
  --height <number>    Thumbnail height (default: 200)
  --quality <number>   JPEG quality (1-100, default: 85)
  --help               Show help
```

### Usage Examples

```bash
# Basic run
node tools/generate-thumbnails.js

# With detailed logging
node tools/generate-thumbnails.js --debug

# Custom sizes and quality
node tools/generate-thumbnails.js --width 400 --height 300 --quality 90

# Show help
node tools/generate-thumbnails.js --help
```

## 📊 What the Script Does

### 1. Image Scanning
- Searches for all images in `static/images/` folder
- Supports formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.tiff`, `.bmp`
- Excludes existing thumbnails and SVG files

### 2. Thumbnail Creation
- Creates thumbnails sized 300x200 pixels (default)
- **New naming:** `image.jpg` → `image-thumb.jpg` (with dash)
- Uses 85% quality for JPEG files
- Automatically crops from center while maintaining aspect ratio

### 3. Logging
- Writes detailed logs to `tools/logs/` folder
- Shows progress in console
- Saves execution statistics
- Displays compression and size information

## 📁 File Structure

```
tools/
├── generate-thumbnails.js    # Main script
├── logs/                     # Logs folder
│   ├── thumbnails-2025-01-09T10-30-45.log
│   └── last-run-stats.json
└── README.md                 # This documentation

static/images/
├── image1.jpg               # Original image
├── image2.png               # Original image
└── thumbnails/              # Created thumbnails
    ├── image1-thumb.jpg     # Thumbnail (new naming)
    └── image2-thumb.png     # Thumbnail (new naming)
```

## 📝 Logs and Statistics

### Execution Logs
- **Location:** `tools/logs/thumbnails-YYYY-MM-DDTHH-MM-SS.log`
- **Format:** `[timestamp] [level] message | data`
- **Levels:** DEBUG, INFO, WARN, ERROR

### Log Example
```
[2025-01-09T10:30:45.123Z] [INFO] 🚀 Starting thumbnail generation with Sharp | {"config":{"sourceDir":"..."}}
[2025-01-09T10:30:45.456Z] [INFO] ✅ Sharp is working correctly
[2025-01-09T10:30:45.789Z] [INFO] Found 5 images to process | {"files":["image1.jpg","image2.png"]}
[2025-01-09T10:30:46.012Z] [INFO] 🔄 Processing image 1/5 | {"source":"image1.jpg"}
[2025-01-09T10:30:46.345Z] [INFO] Thumbnail created successfully | {"source":"image1.jpg","thumbnail":"image1-thumb.jpg","originalSize":872498,"thumbnailSize":11886,"compressionRatio":"98.6%","originalDimensions":"1920x1080","thumbnailDimensions":"300x200"}
```

### Execution Statistics
- **File:** `tools/logs/last-run-stats.json`
- **Contains:** processed files count, execution time, configuration, compression information

### Statistics Example
```json
{
  "processed": 5,
  "created": 3,
  "skipped": 2,
  "errors": 0,
  "startTime": 1704792645123,
  "endTime": 1704792646789,
  "config": {
    "THUMBNAIL_WIDTH": 300,
    "THUMBNAIL_HEIGHT": 200,
    "THUMBNAIL_QUALITY": 85
  },
  "logFile": "tools/logs/thumbnails-2025-01-09T10-30-45.log",
  "engine": "Sharp"
}
```

## ⚙️ Configuration

Main settings are at the beginning of `generate-thumbnails.js` file:

```javascript
const CONFIG = {
  // Paths
  SOURCE_DIR: 'static/images',
  THUMBNAILS_DIR: 'static/images/thumbnails',
  
  // Thumbnail settings
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 200,
  THUMBNAIL_QUALITY: 85,
  
  // Supported formats
  SUPPORTED_FORMATS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.bmp'],
  
  // Exclusions
  EXCLUDE_PATTERNS: ['-thumb.', 'thumbnails', '.svg']
};
```

## 🔧 Project Integration

### Adding to package.json

```json
{
  "scripts": {
    "thumbnails": "node tools/generate-thumbnails.js",
    "thumbnails:debug": "node tools/generate-thumbnails.js --debug",
    "thumbnails:custom": "node tools/generate-thumbnails.js --width 400 --height 300"
  },
  "dependencies": {
    "sharp": "^0.33.0"
  }
}
```

### Automatic Launch

Can be configured to run automatically when:
- Adding new images
- Before project build
- In CI/CD pipeline

## 🐛 Troubleshooting

### Error "Sharp is not working correctly"
```bash
# Reinstall Sharp
npm uninstall sharp
npm install sharp

# Or clear npm cache
npm cache clean --force
npm install
```

### Error "Images folder not found"
```bash
# Make sure you're running the script from project root
cd /path/to/jt-lab-docs
node tools/generate-thumbnails.js
```

### Thumbnails not being created
1. Check folder permissions
2. Ensure Sharp is installed correctly
3. Run with `--debug` flag for detailed logs
4. Check that source images are not corrupted

### Image Quality Issues
- Increase `--quality` parameter (1-100)
- Change `--width` and `--height` sizes
- Check source images

## 📈 Performance

### Sharp Advantages
- ⚡ **Very fast processing** - 3-5x faster than ImageMagick
- 🎯 **High quality** - advanced processing algorithms
- 📦 **Small size** - compact library
- 🔧 **Simple API** - easy to use
- 🖼️ **Multiple formats** - support for all popular formats

### Optimization
- Script skips existing thumbnails
- Uses efficient Sharp algorithms
- Automatic optimal settings detection
- Progressive JPEG for better loading

### Recommendations
- Run script only when adding new images
- Use appropriate thumbnail sizes for your needs
- Regularly clean old logs

## 🔄 Updates and Development

### Version 2.0.0 - Sharp
- ✅ Migration from ImageMagick to Sharp
- ✅ New thumbnail naming: `image-thumb.jpg`
- ✅ Improved logging with compression information
- ✅ Support for additional formats (TIFF, BMP)
- ✅ Automatic center cropping
- ✅ Progressive JPEG

### Planned Improvements
- [ ] Parallel processing support
- [ ] Automatic optimal size detection
- [ ] Git hooks integration
- [ ] Web interface for management
- [ ] Watermark support
- [ ] Automatic WebP optimization

### Contributing
If you have suggestions for improving the script:
1. Create an Issue in the repository
2. Propose a Pull Request with changes
3. Describe the problem in logs

---

## 📞 Support

If you encounter problems:
1. Check logs in `tools/logs/` folder
2. Run script with `--debug` flag
3. Create an Issue with problem description and logs

**Author:** JT-Lab Docs Team  
**Version:** 2.0.0 (Sharp)  
**Date:** 2025-01-09