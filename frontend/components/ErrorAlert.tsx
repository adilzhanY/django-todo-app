import { AlertCircle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="fixed top-4 right-4 z-200 max-w-md animate-slideIn">
      <div className="bg-red-500/90 backdrop-blur-md border border-red-600 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-white shrink-0 mt-0.5" size={20} />
          <div className="flex-1 text-white">
            <p className="font-medium text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Close error message"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
