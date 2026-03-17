"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.addToast;
}

/* ── Toast Container ── */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ── Single Toast ── */
const TOAST_STYLES = {
  success: {
    bg: "#FFFFFF",
    border: "#A7F3D0",
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    bar: "#059669",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bg: "#FFFFFF",
    border: "#FECDD3",
    iconBg: "#FFF1F2",
    iconColor: "#E11D48",
    bar: "#E11D48",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  warning: {
    bg: "#FFFFFF",
    border: "#FDE68A",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    bar: "#D97706",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bg: "#FFFFFF",
    border: "#BFDBFE",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    bar: "#2563EB",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

function Toast({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        pointerEvents: "all",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "14px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        minWidth: "260px",
        maxWidth: "340px",
        position: "relative",
        overflow: "hidden",
        animation: "toastSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: "100%",
          background: s.bar,
          opacity: 0.3,
          animation: `toastProgress ${toast.duration}ms linear forwards`,
          transformOrigin: "left",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: s.iconBg,
          color: s.iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {s.icon}
      </div>

      {/* Message */}
      <p style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A", lineHeight: "1.4", flex: 1 }}>
        {toast.message}
      </p>

      {/* Close */}
      <div style={{ color: "#CBD5E1", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes toastProgress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}