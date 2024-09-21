import { MutableRefObject, useEffect, useState } from 'react'

function useIntersectionObserver(
  elementRef: MutableRefObject<HTMLElement | null>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false },
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry
}

export default useIntersectionObserver
