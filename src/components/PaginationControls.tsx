import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-gray-600" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}
