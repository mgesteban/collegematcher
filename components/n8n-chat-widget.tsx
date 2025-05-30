"use client"

import { useEffect, useRef } from "react"

const N8nChatWidget = () => {
  const scriptLoadedRef = useRef(false)
  const linkRef = useRef<HTMLLinkElement | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (scriptLoadedRef.current || typeof window === "undefined") {
      return
    }

    // Add CSS
    const link = document.createElement("link")
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    linkRef.current = link

    // Add and execute script
    const script = document.createElement("script")
    script.type = "module"
    script.innerHTML = `
      try {
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
        createChat({
          webhookUrl: 'https://wwendidi.app.n8n.cloud/webhook/e0a11ea2-9dd7-496a-8078-1a96f05fc04b/chat'
        });
      } catch (error) {
        console.error("Failed to load n8n chat widget:", error);
      }
    `
    document.body.appendChild(script)
    scriptRef.current = script

    scriptLoadedRef.current = true

    return () => {
      // Cleanup: Remove the added elements when the component unmounts
      if (linkRef.current) {
        document.head.removeChild(linkRef.current)
      }
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current)
      }
      // Note: The n8n script might inject its own DOM elements that are harder to clean up
      // without specific knowledge of its internals (e.g., if it creates a div with a specific ID).
      // For now, we remove the script tag itself.
      scriptLoadedRef.current = false
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  return null // This component doesn't render any visible JSX itself
}

export default N8nChatWidget
