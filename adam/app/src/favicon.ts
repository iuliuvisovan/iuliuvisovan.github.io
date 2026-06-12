export function applyMobileFavicon() {
  if (!window.matchMedia('(pointer: coarse)').matches) {
    return
  }

  const href = `${import.meta.env.BASE_URL}favicon-mobile.png`

  document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
    link.href = href
  })
}
