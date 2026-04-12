export const registerServiceWorker = () => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
        .register("/service-worker.js")
        .then(reg => {
            console.info("SW registered successfully:", reg)
        })
        .catch(err => {
            console.error("SW registration failed:", err)
        })
}