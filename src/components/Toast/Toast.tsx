interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      className={`toast toast-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        className="toast-close"
        aria-label="Close notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}