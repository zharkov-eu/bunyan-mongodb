/// <reference types="node" />
import * as stream from "stream";
export interface IParameters {
    host: string;
    database: string;
    collection: string;
    replicaSet?: string;
    password?: string;
    port?: number;
    username?: string;
    authDatabase?: string;
    batchSize?: number;
}
export default function mongoWritableStream(parameters: IParameters): stream.Writable;
