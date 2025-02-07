# Subdivision Painter v1.0.1

An interactive web application for creating recursive subdivision patterns with advanced export capabilities and theme support.

## Live Demo
Deploy your own instance using one of the methods below.

## Deployment Options

### 1. Deploy with Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Follow the prompts and your app will be live in seconds!

### 2. Deploy with GitHub Pages
1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```
3. In repository settings, enable GitHub Pages
4. Set the build directory as the deployment source

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Features
- Recursive subdivision up to 4 levels
- 20 color schemes + custom color support
- Multiple mirror modes (vertical, horizontal, quad)
- High-resolution canvas rendering
- SVG and PNG export with customizable sizes (up to 4K)
- Light/Dark theme support
- Real-time performance monitoring
- Responsive design

## Technical Details
- Built with React + Vite
- Canvas size: 12×12 grid
- Pixel size: 100px
- Device pixel ratio support
- Crisp edge rendering

## License
MIT License - Feel free to use and modify

## Version History
- v1.0.1 - Added export size options, custom colors, and theme support
- v1.0.0 - Initial release with core functionality

Date: February 7, 2024
