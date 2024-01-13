import { Query, Types } from "mongoose";
import { DefaultHttpException } from "src/exceptions/DefaultHttpException";

export interface QueryFilterProps {
    lastId: Types.ObjectId, 
    time: 'before' | 'after', 
    start: 'last-one' | 'first-one',
    fields: {},
}

export interface QueryFilterFunction { 
    query: Query<any, any>, 
    lastId: Types.ObjectId, 
    time: 'before' | 'after',
    start: 'last-one' | 'first-one', 
    limit: number,
}

export default 
    async ({ query, lastId = null, limit, time = 'after', start = "last-one" }: QueryFilterFunction) => {

    if(lastId) {
        if(time === 'after') {
            query = query.sort({ _id: 'asc' }).where('_id').gt(lastId as any)
        } else {
            query = query.sort({ _id: 'desc' }).where('_id').lt(lastId as any)
        }
    } else if(start === 'last-one') {
        query = query.sort({ _id: 'desc' })
    }

    const result = await query.limit(limit).exec()

    return (start === 'last-one' && !lastId) || (time === 'before' && lastId) ? result.reverse() : result 
}