/// <reference types="node" />
import * as stream from "stream";
export interface IParameters {
    host: string;
    database: string;
    collection: string;
    username?: string;
    password?: string;
    authDatabase?: string;
    batchSize?: number;
}
export default function mongoWritableStream(parameters: IParameters): stream.Writable;
