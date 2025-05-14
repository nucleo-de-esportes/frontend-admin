import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
    maxPageNumbersToShow?: number;
}

const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    maxPageNumbersToShow = 7,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null; // Não renderiza paginação se houver apenas 1 página ou nenhuma
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = (): (number | string)[] => {
        const pageNumbers: (number | string)[] = [];
        const halfPagesToShow = Math.floor(maxPageNumbersToShow / 2);

        if (totalPages <= maxPageNumbersToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1); // Sempre mostrar a primeira página

            let startPage = Math.max(2, currentPage - halfPagesToShow + (maxPageNumbersToShow % 2 === 0 ? 1 : 0));
            let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow - 1);

            if (currentPage - 1 <= halfPagesToShow) {
                startPage = 2;
                endPage = maxPageNumbersToShow - 2;
            } else if (totalPages - currentPage <= halfPagesToShow) {
                startPage = totalPages - maxPageNumbersToShow + 3;
                endPage = totalPages - 1;
            }

            if (startPage > 2) {
                pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }

            pageNumbers.push(totalPages); // Sempre mostrar a última página
        }
        return pageNumbers;
    };

    const pageNumbersToDisplay = getPageNumbers();

    return (
        <nav aria-label="Paginação de turmas" className="flex justify-center items-center space-x-1 sm:space-x-2 my-8">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`cursor-pointer px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
                <ChevronLeft size={18} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Anterior</span>
            </button>

            {pageNumbersToDisplay.map((numberOrEllipsis, index) =>
                typeof numberOrEllipsis === 'number' ? (
                    <button
                        key={`page-${numberOrEllipsis}`}
                        onClick={() => onPageChange(numberOrEllipsis)}
                        className={`px-3 py-2 sm:px-4 text-sm font-medium border border-gray-300 rounded-md cursor-pointer
                            ${currentPage === numberOrEllipsis
                                ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700 z-10'
                                : 'text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                    >
                        {numberOrEllipsis}
                    </button>
                ) : (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 sm:px-4 text-sm font-medium text-gray-500"
                    >
                        {numberOrEllipsis}
                    </span>
                )
            )}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`cursor-pointer px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight size={18} className="ml-1 sm:ml-2" />
            </button>
        </nav>
    );
};

export default Pagination;