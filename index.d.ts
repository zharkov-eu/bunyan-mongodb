/// <reference types="node" />
import * as stream from "stream";
export interface IParameters {
    dbUrl: string;
    collection: string;
    batchSize?: number;
}
export default function mongoWritableStream(parameters: IParameters): stream.Writable;
