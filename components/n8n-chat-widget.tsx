"use client"

import { useEffect, useRef } from "react"

const N8N_CHAT_CSS_URL = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
const N8N_CHAT_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
const N8N_WEBHOOK_URL = "https://wwendidi.app.n8n.cloud/webhook/e0a11ea2-9dd7-496a-8078-1a96f05fc04b/chat"

export default function N8nChatWidget() {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent script from loading multiple times
    if (scriptLoadedRef.current) {
      return
    }

    // 1. Load the CSS
    const linkElement = document.createElement("link")
    linkElement.rel = "stylesheet"
    linkElement.href = N8N_CHAT_CSS_URL
    document.head.appendChild(linkElement)

    // 2. Load and initialize the chat script
    const scriptElement = document.createElement("script")
    scriptElement.type = "module"
    scriptElement.innerHTML = `
      try {
        const { createChat } = await import('${N8N_CHAT_SCRIPT_URL}');
        if (typeof createChat === 'function') {
          createChat({
            webhookUrl: '${N8N_WEBHOOK_URL}'
          });
          console.log('n8n chat initialized.');
        } else {
          console.error('createChat function not found in n8n chat bundle.');
        }
      } catch (error) {
        console.error('Error loading or initializing n8n chat:', error);
      }
    `
    document.body.appendChild(scriptElement)
    scriptLoadedRef.current = true

    // Cleanup function to remove the elements if the component unmounts
    // This might not fully remove the chat widget if it modifies the DOM extensively
    return () => {
      document.head.removeChild(linkElement)
      document.body.removeChild(scriptElement)
      // Note: The n8n chat widget might have its own cleanup or might leave elements in the DOM.
      // You might need to find a way to call a destroy method if the n8n library provides one.
      const n8nChatElements = document.querySelectorAll('[id^="n8nchat-"]') // Example selector
      n8nChatElements.forEach((el) => el.remove())
      scriptLoadedRef.current = false
      console.log("n8n chat elements cleaned up (attempted).")
    }
  }, []) // Empty dependency array ensures this runs only once on mount and unmount

  // This component doesn't render anything itself,
  // as the n8n script will likely append its UI to the body.
  return null
}
