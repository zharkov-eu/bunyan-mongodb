/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as mongo from "mongodb";
import * as stream from "stream";

export interface IParameters {
  dbUrl: string;
  collection: string;
  batchSize?: number;
}

interface IConnection {
  db?: mongo.Db;
  collection?: mongo.Collection;
}

let batchSize: number = 1;
const batch: object[] = [];
const connection: IConnection = {};

async function initConnection(parameters): Promise<void> {
  connection.db = await mongo.MongoClient.connect(parameters.dbUrl);
  connection.collection = connection.db.collection(parameters.collection);
}

async function add(record: string | Buffer): Promise<void> {
  const inserted = JSON.parse(record.toString());
  batch.push(inserted);
  if (batch.length === 1) {
    await connection.collection.insertMany(batch);
    batch.length = 0;
  }
}

export default function mongoWritableStream(parameters: IParameters): stream.Writable {
  if (parameters.batchSize > 1) { batchSize = parameters.batchSize; }
  const writable = new stream.Writable({
    write: async (record, encoding, next) => {
      if (!connection.collection) { await initConnection(connection); }
      await add(record);
      next();
    },
  });

  writable.on("finish", async () => {
    if (batch.length) {
      await connection.collection.insertMany(batch);
      batch.length = 0;
    }
    await connection.db.close();
    writable.emit("close");
  });

  return writable;
}
