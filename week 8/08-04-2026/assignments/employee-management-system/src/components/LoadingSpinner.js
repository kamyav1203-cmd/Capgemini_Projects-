/**
 * COMPONENT: LoadingSpinner
 * --------------------------
 * PURPOSE: Full-screen overlay with spinning animation.
 * Shown when employees.loading = true in Redux store.
 *
 * WHEN IS IT SHOWN?
 * dispatch(setLoading(true))  → spinner appears
 * dispatch(setLoading(false)) → spinner disappears
 *
 * POSITION: fixed — covers entire screen on top of everything.
 * z-index: 9999 — always on top of all other elements.
 */

function LoadingSpinner() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: "14px",
        padding: "36px 48px", textAlign: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        {/* Spinning circle using CSS animation */}
        <div style={{
          width: "44px", height: "44px",
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px"
        }} />
        <p style={{ color: "#1e293b", fontWeight: "600", fontSize: "1rem" }}>
          Loading...
        </p>
        {/* Keyframe animation defined inline */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default LoadingSpinner;