import { useState, useRef, useCallback } from 'react'

export function useLensZoom(zoomFactor = 3, lensSize = 220) {
  const [isHovering, setIsHovering] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })        // lens center position
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 })             // background-position %
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = imgRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left   // px from left of image
    const y = e.clientY - rect.top    // px from top of image

    // Lens position (clamped so lens stays inside image)
    const clampedX = Math.min(Math.max(x, lensSize / 2), rect.width  - lensSize / 2)
    const clampedY = Math.min(Math.max(y, lensSize / 2), rect.height - lensSize / 2)
    setLensPos({ x: clampedX, y: clampedY })

    // Background position for zoom (percentage)
    const bgX = (x / rect.width)  * 100
    const bgY = (y / rect.height) * 100
    setBgPos({ x: bgX, y: bgY })
  }, [lensSize])

  return {
    imgRef,
    isHovering,
    setIsHovering,
    lensPos,
    bgPos,
    zoomFactor,
    lensSize,
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
    onMouseMove:  handleMouseMove,
  }
}
