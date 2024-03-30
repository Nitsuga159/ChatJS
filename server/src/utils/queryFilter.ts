import { Query, Types } from "mongoose";
import { DefaultHttpException } from "src/exceptions/DefaultHttpException";

export interface QueryFilterProps {
    lastId: Types.ObjectId,
    time: 'before' | 'after',
    to: 'down' | 'up',
    fields: {},
}

export interface QueryFilterFunction {
    query: Query<any, any>,
    lastId: Types.ObjectId,
    time: 'before' | 'after',
    to: 'down' | 'up',
    limit: number,
}

export default
    async ({ query, lastId = null, limit, time = 'after', to = "up" }: QueryFilterFunction) => {
        query = query.limit(limit)

        if (!lastId) {
            const result = (await query.sort({ _id: 'desc' }))

            return to === "up" ? result.reverse() : result
        }

        if ((time === 'after' && to === "up") || (time === "before" && to === "down")) {
            query = query.sort({ _id: 'asc' })
            query = query.where('_id').gt(lastId as any)
        } else {
            query = query.sort({ _id: 'desc' })
            query = query.where('_id').lt(lastId as any)
        }


        const result = await query.exec()

        return time === "before" ? result.reverse() : result
    }