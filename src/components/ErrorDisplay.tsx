import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2>Something went wrong</h2>
        <p className="text-gray-600">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
