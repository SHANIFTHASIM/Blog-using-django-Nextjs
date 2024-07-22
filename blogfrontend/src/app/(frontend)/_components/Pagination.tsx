"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    previous: string | null;
    next: string | null;
}

const Pagination: React.FC<PaginationProps> = ({ next, previous }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createPageUrl = (url: string) => {
        const params = new URLSearchParams(url.split('?')[1]);
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mt-12 flex justify-between w-full">
            <button
                className="rounded-md bg-red-500 text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
                onClick={() => createPageUrl(previous || '')}
                disabled={!previous}
            >
                Previous
            </button>
            <button
                className="rounded-md bg-red-500 text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
                onClick={() => createPageUrl(next || '')}
                disabled={!next}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
