import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
