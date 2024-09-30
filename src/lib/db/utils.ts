import { SQLiteColumn, SQLiteSelect } from "drizzle-orm/sqlite-core";
import db from ".";
import { SQL } from "drizzle-orm";

export type PaginatedResult = {
    pageSize: number,
    pageNumber: number,
    items: any[],
    length: number,
}

export async function paginate<T extends SQLiteSelect>(
    query: T, pageNumber: number,
    pageSize: number,
    orderByColumn: SQL | SQLiteColumn
): Promise<PaginatedResult> {

    try {
        const effectiveOffset = (pageNumber - 1) * pageSize;
        const effectiveLimit = pageSize
        const effectiveQuery = query.orderBy(orderByColumn).limit(effectiveLimit).offset(effectiveOffset)
        const result = await effectiveQuery
        return {
            pageNumber,
            pageSize,
            items: result,
            length: result.length,
        }
    } catch (err: any) {
        throw err
    }

}

export function withPagination<T extends SQLiteSelect>(
    query: T, pageNumber: number,
    pageSize: number,
    orderByColumn: SQL | SQLiteColumn
) {

        const effectiveOffset = (pageNumber - 1) * pageSize;
        const effectiveLimit = pageSize
        const effectiveQuery = query.orderBy(orderByColumn).limit(effectiveLimit).offset(effectiveOffset)
        return effectiveQuery
}