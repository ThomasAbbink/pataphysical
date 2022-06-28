import { useRef, useEffect } from 'react'
import p5 from 'p5'
import useIntersectionObserver from '../utility/useIntersectionObserver'

export const useP5 = (sketch) => {
  const ref = useRef()
  const p5ref = useRef()
  const entry = useIntersectionObserver(ref, {
    threshold: 0.01,
  })

  const isVisible = !!entry?.isIntersecting
  useEffect(() => {
    if (isVisible) {
      p5ref.current = new p5(sketch, ref.current)
      p5ref.current.disableFriendlyErrors = true
    }
    return () => {
      p5ref.current?.remove()
    }
  }, [sketch, entry])

  return { ref, p5: p5ref, isVisible }
}
