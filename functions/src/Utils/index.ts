import * as functions from 'firebase-functions';

export const getReqParams = <T>(req: functions.Request): T => {
    return req.params as T;
}