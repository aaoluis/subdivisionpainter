import { useEffect, useRef, useState } from 'react'
import './App.css'

// Color schemes (5 colors each: background, level1, level2, level3, level4)
const COLOR_SCHEMES = {
  default: ['#000000', '#1a4a6e', '#2e8b57', '#8b4513', '#c17817'],
  ocean: ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6'],
  sunset: ['#590d22', '#800f2f', '#a4133c', '#ff4d6d', '#ffccd5'],
  forest: ['#081c15', '#1b4332', '#2d6a4f', '#40916c', '#74c69d'],
  candy: ['#240046', '#5a189a', '#7b2cbf', '#9d4edd', '#c77dff'],
  autumn: ['#2f1107', '#773f1a', '#be6a15', '#c9a227', '#e9c46a'],
  arctic: ['#1b262c', '#0f4c75', '#3282b8', '#bbe1fa', '#e0fbfc'],
  desert: ['#3e1f1f', '#854442', '#be6a15', '#d4b483', '#e9c39b'],
  neon: ['#10002b', '#3c096c', '#5a189a', '#7b2cbf', '#9b5de5'],
  pastel: ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'],
  vintage: ['#2b2b2b', '#614e4e', '#907a7a', '#c2a5a5', '#dbc7c7'],
  cyber: ['#0d0221', '#0f4c75', '#3282b8', '#00ff9f', '#72efdd'],
  earth: ['#2f1107', '#5e2c04', '#8b4513', '#b87b24', '#dda15e'],
  berry: ['#1d1a31', '#4f3466', '#8b5e83', '#c7956d', '#e8a598'],
  metal: ['#0a0908', '#22333b', '#5e503f', '#a47e1b', '#c9b44b'],
  jungle: ['#101419', '#1a4032', '#2d6a4f', '#55a630', '#80b918'],
  coral: ['#1d1a31', '#fb5607', '#ff006e', '#ffbe0b', '#ff9b85'],
  midnight: ['#03071e', '#370617', '#6a040f', '#9d0208', '#dc2f02'],
  crystal: ['#10002b', '#240046', '#3c096c', '#5a189a', '#7b2cbf'],
  aurora: ['#001219', '#005f73', '#0a9396', '#94d2bd', '#adf5ff']
}

// Add after the color schemes and before AnimatedTitle
const EXPORT_SIZES = {
  'sm': { width: 800, height: 800, label: 'Small (800×800)' },
  'md': { width: 1200, height: 1200, label: 'Medium (1200×1200)' },
  'lg': { width: 1600, height: 1600, label: 'Large (1600×1600)' },
  'xl': { width: 2400, height: 2400, label: 'Extra Large (2400×2400)' },
  '4k': { width: 3840, height: 3840, label: '4K (3840×3840)' }
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button 
      className="theme-toggle" 
      onClick={onToggle}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      )}
    </button>
  )
}

function AnimatedTitle({ text }) {
  return (
    <div className="app-title">
      <div>SUBDIVISION</div>
      <div>PAINTER</div>
      <span className="version-number">v1.0</span>
    </div>
  )
}

function PerformanceMonitor() {
  const [stats, setStats] = useState({
    fps: 0,
    memory: 0,
    cpu: 0,
    frameTime: 0
  })
  
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let lastFpsUpdate = lastTime
    
    const updateStats = () => {
      const now = performance.now()
      frameCount++
      
      // Update FPS every second
      if (now - lastFpsUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate))
        frameCount = 0
        lastFpsUpdate = now
        
        // Get memory usage if available
        const memory = window.performance?.memory?.usedJSHeapSize
          ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024))
          : null
        
        // Calculate frame time
        const frameTime = Math.round(now - lastTime)
        
        setStats(prev => ({
          ...prev,
          fps,
          frameTime,
          memory: memory || prev.memory
        }))
      }
      
      lastTime = now
      requestAnimationFrame(updateStats)
    }
    
    const handle = requestAnimationFrame(updateStats)
    return () => cancelAnimationFrame(handle)
  }, [])
  
  return (
    <div className="control-section">
      <label>Performance Monitor</label>
      <div className="performance-monitor">
        <table className="performance-table">
          <tbody>
            <tr>
              <th>FPS</th>
              <td><span className="performance-value">{stats.fps}</span></td>
            </tr>
            {stats.memory > 0 && (
              <tr>
                <th>Memory</th>
                <td><span className="performance-value">{stats.memory}</span> MB</td>
              </tr>
            )}
            <tr>
              <th>Frame Time</th>
              <td><span className="performance-value">{stats.frameTime}</span> ms</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Add AnimatedPattern component
function AnimatedPattern() {
  const canvasRef = useRef(null)
  const [frame, setFrame] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 32, y: 32 })
  const size = 64
  const numPoints = 24 // Adjusted for better symmetry

  // Create points for mirrored pattern
  const points = useRef(Array.from({ length: numPoints }, () => ({
    x: Math.random() * (size/2), // Only generate in left half
    y: Math.random() * size,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    flowOffset: Math.random() * Math.PI * 2,
    amplitude: 2 + Math.random() * 4
  })))

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: size / 2, y: size / 2 })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = false

    const drawPattern = (frameNum) => {
      // Faster fade for sharper trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, size, size)
      
      // Update points with flowing motion
      points.current.forEach(p => {
        const time = frameNum * 0.02
        const flowSpeed = 0.04
        
        // Calculate mouse influence
        const dx = mousePos.x - p.x
        const dy = mousePos.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.min(1, 25 / dist)
        
        // Create flowing motion
        const flowX = Math.sin(time + p.flowOffset) * p.amplitude
        const flowY = Math.cos(time * 0.7 + p.flowOffset) * p.amplitude
        
        p.x += (flowX * flowSpeed + dx * 0.01 * influence)
        p.y += (flowY * flowSpeed + dy * 0.01 * influence)
        
        // Keep points in bounds (left half only)
        if (p.x < 0) p.x = 0
        if (p.x > size/2) p.x = size/2
        if (p.y < 0) p.y = 0
        if (p.y > size) p.y = size
      })

      // Draw flowing pattern
      ctx.lineWidth = 0.5

      // Draw connections
      for (let i = 0; i < points.current.length; i++) {
        const p1 = points.current[i]
        
        // Find nearest points for connections
        const connections = points.current
          .map((p2, index) => ({
            point: p2,
            distance: Math.sqrt(
              Math.pow(p1.x - p2.x, 2) + 
              Math.pow(p1.y - p2.y, 2)
            ),
            index
          }))
          .filter(c => c.index !== i)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2) // Connect to 2 nearest points

        connections.forEach(({ point: p2, distance }) => {
          const maxDist = size * 0.3
          if (distance < maxDist) {
            const centerX = (p1.x + p2.x) / 2
            const centerY = (p1.y + p2.y) / 2
            const mouseInfluence = Math.min(1, 20 / Math.sqrt(
              Math.pow(mousePos.x - centerX, 2) +
              Math.pow(mousePos.y - centerY, 2)
            ))
            
            const alpha = (0.6 + mouseInfluence * 0.4) * (1 - (distance / maxDist))
            
            // Draw mirrored connections with spikes
            const positions = [
              // Original points (left side)
              [p1.x, p1.y, p2.x, p2.y],
              // Mirrored points (right side)
              [size - p1.x, p1.y, size - p2.x, p2.y],
              // Vertical mirror
              [p1.x, size - p1.y, p2.x, size - p2.y],
              [size - p1.x, size - p1.y, size - p2.x, size - p2.y]
            ]
            
            positions.forEach(([x1, y1, x2, y2]) => {
              const angle = Math.atan2(y2 - y1, x2 - x1)
              const perpAngle = angle + Math.PI/2
              const spikeHeight = Math.min(10, distance * 0.4)
              
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              
              // Add spikes along the path
              const numSpikes = Math.floor(distance / 5)
              for (let s = 1; s <= numSpikes; s++) {
                const t = s / numSpikes
                const baseX = x1 + (x2 - x1) * t
                const baseY = y1 + (y2 - y1) * t
                
                // Create symmetric spikes
                const spikeAngle = perpAngle + (s % 2 ? 1 : -1) * Math.PI/3
                const spikeMagnitude = spikeHeight * Math.sin(t * Math.PI) * 
                                     Math.sin(frameNum * 0.03 + t * Math.PI * 2)
                
                const spikeX = baseX + Math.cos(spikeAngle) * spikeMagnitude
                const spikeY = baseY + Math.sin(spikeAngle) * spikeMagnitude
                
                ctx.lineTo(spikeX, spikeY)
              }
              
              ctx.lineTo(x2, y2)
              ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`
              ctx.stroke()
            })
          }
        })
      }

      // Draw points
      points.current.forEach(p => {
        const positions = [
          [p.x, p.y],
          [size - p.x, p.y],
          [p.x, size - p.y],
          [size - p.x, size - p.y]
        ]
        
        positions.forEach(([x, y]) => {
          // Draw X markers
          const markerSize = 2
          ctx.strokeStyle = '#00ff00'
          ctx.beginPath()
          ctx.moveTo(x - markerSize, y - markerSize)
          ctx.lineTo(x + markerSize, y + markerSize)
          ctx.moveTo(x + markerSize, y - markerSize)
          ctx.lineTo(x - markerSize, y + markerSize)
          ctx.stroke()
        })
      })
      
      // Draw border
      ctx.strokeStyle = '#222222'
      ctx.lineWidth = 1
      ctx.strokeRect(0, 0, size, size)
    }

    let animationFrame
    const animate = () => {
      drawPattern(frame)
      setFrame(f => (f + 1) % 7200)
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [frame, mousePos])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: '10px' 
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          background: '#000000',
          border: '1px solid #222222',
          cursor: 'crosshair'
        }}
        className="pattern-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}

function App() {
  const canvasRef = useRef(null)
  const [pixels, setPixels] = useState(new Map()) // Track split pixels
  const [mirrorMode, setMirrorMode] = useState('none') // none, vertical, horizontal, quad
  const [selectedScheme, setSelectedScheme] = useState('default')
  const [showOutlines, setShowOutlines] = useState(true)
  const [outlineWidth, setOutlineWidth] = useState(0.5)
  const [maxSubdivisions, setMaxSubdivisions] = useState(3)
  const [colors, setColors] = useState({
    background: COLOR_SCHEMES.default[0],
    splitLevel1: COLOR_SCHEMES.default[1],
    splitLevel2: COLOR_SCHEMES.default[2],
    splitLevel3: COLOR_SCHEMES.default[3],
    splitLevel4: COLOR_SCHEMES.default[4],
    gridLines: '#222222'
  })
  const [theme, setTheme] = useState('dark')
  const [exportSize, setExportSize] = useState('md')

  const pixelSize = 100 // Increased for higher resolution
  const gridSize = 12

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Use device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1
    const displayWidth = gridSize * pixelSize
    const displayHeight = gridSize * pixelSize
    
    // Set actual canvas size (scaled for retina)
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    
    // Set display size
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    
    // Scale all drawing operations
    ctx.scale(dpr, dpr)
    
    // Enable crisp rendering
    ctx.imageSmoothingEnabled = false

    const getMirroredCoordinates = (x, y, relativeX, relativeY) => {
      // Calculate relative positions as percentages within the pixel
      const relXPercent = relativeX / pixelSize
      const relYPercent = relativeY / pixelSize

      const coords = [{
        gridX: x,
        gridY: y,
        relX: relativeX,
        relY: relativeY
      }]

      switch (mirrorMode) {
        case 'vertical':
          coords.push({
            gridX: gridSize - 1 - x,
            gridY: y,
            relX: pixelSize - relativeX, // Mirror the X position within pixel
            relY: relativeY
          })
          break
        case 'horizontal':
          coords.push({
            gridX: x,
            gridY: gridSize - 1 - y,
            relX: relativeX,
            relY: pixelSize - relativeY // Mirror the Y position within pixel
          })
          break
        case 'quad':
          // Vertical mirror
          coords.push({
            gridX: gridSize - 1 - x,
            gridY: y,
            relX: pixelSize - relativeX,
            relY: relativeY
          })
          // Horizontal mirror
          coords.push({
            gridX: x,
            gridY: gridSize - 1 - y,
            relX: relativeX,
            relY: pixelSize - relativeY
          })
          // Diagonal mirror
          coords.push({
            gridX: gridSize - 1 - x,
            gridY: gridSize - 1 - y,
            relX: pixelSize - relativeX,
            relY: pixelSize - relativeY
          })
          break
      }

      return coords.filter(coord => 
        coord.gridX >= 0 && coord.gridX < gridSize && 
        coord.gridY >= 0 && coord.gridY < gridSize
      )
    }
    
    const drawSubPixels = (ctx, x, y, size, level, subPixels) => {
      const subSize = size / 2

      // Fill with level-specific color
      ctx.fillStyle = colors[`splitLevel${level}`]
      ctx.fillRect(x, y, size, size)

      // Draw sub-grid lines if outlines are enabled
      if (showOutlines) {
        ctx.strokeStyle = colors.gridLines
        ctx.lineWidth = outlineWidth
        
        // Draw outer border
        ctx.strokeRect(x, y, size, size)

        // Draw inner subdivision lines
        ctx.beginPath()
        ctx.moveTo(x + subSize, y)
        ctx.lineTo(x + subSize, y + size)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y + subSize)
        ctx.lineTo(x + size, y + subSize)
        ctx.stroke()
      }

      // Recursively draw next level if it exists
      if (subPixels && subPixels.length > 0) {
        const positions = [
          [x, y],
          [x + subSize, y],
          [x, y + subSize],
          [x + subSize, y + subSize]
        ]
        subPixels.forEach((subPixel, index) => {
          if (subPixel.split) {
            drawSubPixels(
              ctx,
              positions[index][0],
              positions[index][1],
              subSize,
              level + 1,
              subPixel.subPixels
            )
          }
        })
      }
    }
    
    const drawGrid = () => {
      // Fill canvas with background
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid lines if outlines are enabled
      if (showOutlines) {
        ctx.strokeStyle = colors.gridLines
        ctx.lineWidth = outlineWidth

        // Draw base grid
        for (let x = 0; x <= gridSize; x++) {
          ctx.beginPath()
          ctx.moveTo(x * pixelSize, 0)
          ctx.lineTo(x * pixelSize, canvas.height)
          ctx.stroke()
        }
        
        for (let y = 0; y <= gridSize; y++) {
          ctx.beginPath()
          ctx.moveTo(0, y * pixelSize)
          ctx.lineTo(canvas.width, y * pixelSize)
          ctx.stroke()
        }
      }

      // Draw split pixels
      pixels.forEach((pixelData, key) => {
        const [gridX, gridY] = key.split(',').map(Number)
        const x = gridX * pixelSize
        const y = gridY * pixelSize
        drawSubPixels(ctx, x, y, pixelSize, 1, pixelData.subPixels)
      })

      // Draw center lines for mirror mode
      if (mirrorMode !== 'none') {
        ctx.strokeStyle = '#444444'
        ctx.lineWidth = Math.max(1, outlineWidth)
        
        if (mirrorMode === 'vertical' || mirrorMode === 'quad') {
          ctx.beginPath()
          ctx.moveTo(canvas.width / 2, 0)
          ctx.lineTo(canvas.width / 2, canvas.height)
          ctx.stroke()
        }
        
        if (mirrorMode === 'horizontal' || mirrorMode === 'quad') {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2)
          ctx.lineTo(canvas.width, canvas.height / 2)
          ctx.stroke()
        }
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      
      // Calculate mouse position relative to the canvas display size
      const x = (e.clientX - rect.left) * (displayWidth / rect.width)
      const y = (e.clientY - rect.top) * (displayHeight / rect.height)
      
      // Get base grid coordinates
      const gridX = Math.floor(x / pixelSize)
      const gridY = Math.floor(y / pixelSize)
      
      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        const relativeX = x - (gridX * pixelSize)
        const relativeY = y - (gridY * pixelSize)
        
        // Get all coordinates to update based on mirror mode
        const coordsToUpdate = getMirroredCoordinates(gridX, gridY, relativeX, relativeY)
        let hasUpdates = false

        coordsToUpdate.forEach((coord) => {
          const key = `${coord.gridX},${coord.gridY}`
          
          // Find which level we're at and split accordingly
          let currentPixel = pixels.get(key)
          
          if (!currentPixel) {
            // First split
            pixels.set(key, {
              level: 1,
              subPixels: Array(4).fill({ split: false })
            })
            hasUpdates = true
            return
          }

          // Find which subpixel we're in
          const getSubPixelIndex = (x, y, size) => {
            const halfSize = size / 2
            const col = x >= halfSize ? 1 : 0
            const row = y >= halfSize ? 1 : 0
            return row * 2 + col
          }

          const findAndSplitSubPixel = (pixelData, x, y, size, level) => {
            if (level >= maxSubdivisions) return pixelData // Max level reached based on user setting

            const index = getSubPixelIndex(x, y, size)
            const subPixel = pixelData.subPixels[index]

            if (!subPixel.split) {
              pixelData.subPixels[index] = {
                split: true,
                subPixels: Array(4).fill({ split: false })
              }
              return true
            } else if (level < maxSubdivisions - 1) {
              // Continue to next level if not at max
              const subSize = size / 2
              const subX = x % subSize
              const subY = y % subSize
              return findAndSplitSubPixel(
                subPixel,
                subX,
                subY,
                subSize,
                level + 1
              )
            }
            return false
          }

          if (findAndSplitSubPixel(currentPixel, coord.relX, coord.relY, pixelSize, 1)) {
            hasUpdates = true
          }
        })

        if (hasUpdates) {
          setPixels(new Map(pixels))
          drawGrid()
        }
      }
    }

    // Initial draw
    drawGrid()

    // Add event listener
    canvas.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [pixels, colors, mirrorMode, showOutlines, outlineWidth, maxSubdivisions])

  const handleColorChange = (colorKey, value) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const handleSchemeChange = (schemeName) => {
    setSelectedScheme(schemeName)
    
    if (schemeName === 'custom') {
      // Keep current colors when switching to custom
      return
    }
    
    const scheme = COLOR_SCHEMES[schemeName]
    setColors(prev => ({
      ...prev,
      background: scheme[0],
      splitLevel1: scheme[1],
      splitLevel2: scheme[2],
      splitLevel3: scheme[3],
      splitLevel4: scheme[4]
    }))
  }

  const resetCanvas = () => {
    setPixels(new Map())
  }

  const exportToSVG = () => {
    const { width, height } = EXPORT_SIZES[exportSize]
    const pixelSize = width / gridSize
    
    // Create SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${colors.background}"/>`

    // Function to recursively add subdivided pixels to SVG
    const addSubdividedPixels = (x, y, size, level, subPixels) => {
      if (!subPixels) return ''
      
      let content = ''
      const subSize = size / 2

      // Add the base rectangle for this level
      content += `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${colors[`splitLevel${level}`]}"/>`

      // Add grid lines
      if (showOutlines) {
        // Add outer border
        content += `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${colors.gridLines}" stroke-width="${outlineWidth}"/>`
        // Add inner subdivision lines
        content += `
  <line x1="${x + subSize}" y1="${y}" x2="${x + subSize}" y2="${y + size}" stroke="${colors.gridLines}" stroke-width="${outlineWidth}"/>
  <line x1="${x}" y1="${y + subSize}" x2="${x + size}" y2="${y + subSize}" stroke="${colors.gridLines}" stroke-width="${outlineWidth}"/>`
      }

      // Recursively add sub-pixels
      if (subPixels.length > 0) {
        const positions = [
          [x, y],
          [x + subSize, y],
          [x, y + subSize],
          [x + subSize, y + subSize]
        ]
        subPixels.forEach((subPixel, index) => {
          if (subPixel.split) {
            content += addSubdividedPixels(
              positions[index][0],
              positions[index][1],
              subSize,
              level + 1,
              subPixel.subPixels
            )
          }
        })
      }

      return content
    }

    // Add base grid lines
    if (showOutlines) {
      for (let x = 0; x <= gridSize; x++) {
        svgContent += `
  <line x1="${x * pixelSize}" y1="0" x2="${x * pixelSize}" y2="${height}" stroke="${colors.gridLines}" stroke-width="${outlineWidth}"/>`
      }
      
      for (let y = 0; y <= gridSize; y++) {
        svgContent += `
  <line x1="0" y1="${y * pixelSize}" x2="${width}" y2="${y * pixelSize}" stroke="${colors.gridLines}" stroke-width="${outlineWidth}"/>`
      }
    }

    // Add all pixels and their subdivisions
    pixels.forEach((pixelData, key) => {
      const [gridX, gridY] = key.split(',').map(Number)
      const x = gridX * pixelSize
      const y = gridY * pixelSize
      svgContent += addSubdividedPixels(x, y, pixelSize, 1, pixelData.subPixels)
    })

    // Add mirror mode lines if active
    if (mirrorMode !== 'none') {
      if (mirrorMode === 'vertical' || mirrorMode === 'quad') {
        svgContent += `
  <line x1="${width/2}" y1="0" x2="${width/2}" y2="${height}" stroke="#444444" stroke-width="2"/>`
      }
      if (mirrorMode === 'horizontal' || mirrorMode === 'quad') {
        svgContent += `
  <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#444444" stroke-width="2"/>`
      }
    }

    // Close SVG tag
    svgContent += '\n</svg>'

    // Create and trigger download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pixel_grid.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToPNG = () => {
    try {
      const { width, height } = EXPORT_SIZES[exportSize]
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      const currentCanvas = canvasRef.current
      
      // Set the canvas size to the export size
      tempCanvas.width = width
      tempCanvas.height = height
      
      // Clear the temp canvas with the background color
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, width, height)
      
      // Calculate the scale to fit the entire grid
      const scale = Math.min(width / currentCanvas.width, height / currentCanvas.height)
      
      // Center the grid in the export canvas
      const offsetX = (width - (currentCanvas.width * scale)) / 2
      const offsetY = (height - (currentCanvas.height * scale)) / 2
      
      // Draw the current canvas content scaled and centered
      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)
      ctx.drawImage(currentCanvas, 0, 0)
      ctx.restore()
      
      // Create download link
      const dataUrl = tempCanvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.download = `subdivision-art-${timestamp}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting PNG:', error)
      alert('Failed to export PNG. Please try again.')
    }
  }

  // Add theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="app">
      <div className="control-panel">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <AnimatedTitle text="Subdivision Painter" />
        
        <div className="control-section">
          <div className="scheme-control">
            <label>Color Scheme</label>
            <select 
              value={selectedScheme}
              onChange={(e) => handleSchemeChange(e.target.value)}
            >
              <option value="custom">Custom Colors</option>
              {Object.keys(COLOR_SCHEMES).map(scheme => (
                <option key={scheme} value={scheme}>
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {selectedScheme === 'custom' ? (
            <div className="custom-colors">
              <div className="color-control">
                <label>Background</label>
                <input 
                  type="color" 
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                />
              </div>
              <div className="color-control">
                <label>Level 1</label>
                <input 
                  type="color" 
                  value={colors.splitLevel1}
                  onChange={(e) => handleColorChange('splitLevel1', e.target.value)}
                />
              </div>
              <div className="color-control">
                <label>Level 2</label>
                <input 
                  type="color" 
                  value={colors.splitLevel2}
                  onChange={(e) => handleColorChange('splitLevel2', e.target.value)}
                />
              </div>
              <div className="color-control">
                <label>Level 3</label>
                <input 
                  type="color" 
                  value={colors.splitLevel3}
                  onChange={(e) => handleColorChange('splitLevel3', e.target.value)}
                />
              </div>
              <div className="color-control">
                <label>Level 4</label>
                <input 
                  type="color" 
                  value={colors.splitLevel4}
                  onChange={(e) => handleColorChange('splitLevel4', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="color-preview">
              {['background', 'splitLevel1', 'splitLevel2', 'splitLevel3', 'splitLevel4'].map(level => (
                <div 
                  key={level} 
                  className="color-box"
                  style={{ backgroundColor: colors[level] }}
                  title={level}
                />
              ))}
            </div>
          )}
        </div>

        <div className="control-section">
          <div className="subdivision-control">
            <label>Max Subdivisions</label>
            <select
              value={maxSubdivisions}
              onChange={(e) => setMaxSubdivisions(Number(e.target.value))}
            >
              <option value="1">1 Level</option>
              <option value="2">2 Levels</option>
              <option value="3">3 Levels</option>
              <option value="4">4 Levels</option>
            </select>
          </div>
        </div>

        <div className="control-section">
          <div className="outline-controls">
            <div className="outline-toggle">
              <input
                type="checkbox"
                checked={showOutlines}
                onChange={(e) => setShowOutlines(e.target.checked)}
                id="show-outlines"
              />
              <label htmlFor="show-outlines">Show Outlines</label>
            </div>
            {showOutlines && (
              <div className="outline-width">
                <label>Width: {outlineWidth}px</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={outlineWidth}
                  onChange={(e) => setOutlineWidth(parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>

        <div className="control-section">
          <div className="color-control">
            <label>Grid Lines</label>
            <input 
              type="color" 
              value={colors.gridLines}
              onChange={(e) => handleColorChange('gridLines', e.target.value)}
            />
          </div>
        </div>

        <div className="control-section">
          <div className="mirror-controls">
            <label>Mirror Mode</label>
            <select 
              value={mirrorMode} 
              onChange={(e) => setMirrorMode(e.target.value)}
            >
              <option value="none">None</option>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="quad">Quad</option>
            </select>
          </div>
        </div>

        <div className="control-section">
          <label>Export Options</label>
          <div className="export-controls">
            <select 
              value={exportSize}
              onChange={(e) => setExportSize(e.target.value)}
              className="export-size-select"
            >
              {Object.entries(EXPORT_SIZES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div className="button-group">
              <button onClick={resetCanvas} className="reset-button">
                Reset
              </button>
              <button onClick={exportToSVG} className="export-button">
                SVG
              </button>
              <button onClick={exportToPNG} className="export-button">
                PNG
              </button>
            </div>
          </div>
        </div>

        <PerformanceMonitor />

        <div style={{ marginTop: 'auto', padding: '10px 0' }}>
          <AnimatedPattern />
        </div>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default App
