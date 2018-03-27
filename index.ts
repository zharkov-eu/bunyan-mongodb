/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as mongodb from "mongodb";
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

interface IConnection {
  client?: mongodb.MongoClient;
  collection?: mongodb.Collection;
}

let batchSize: number = 1;
const batch: object[] = [];
const connection: IConnection = {};

async function initConnection(parameters: IParameters): Promise<void> {
  const databaseAuth = parameters.authDatabase || parameters.database;
  const connectAuth = parameters.username ? parameters.username + ":" + parameters.password + "@" : "";
  let connectString = "mongodb://" + connectAuth + parameters.host;
  if (parameters.port) {
    connectString += ":" + parameters.port;
  }
  connectString += "/" + databaseAuth;
  if (parameters.replicaSet) {
    connectString = connectString + "?replicaSet=" + parameters.replicaSet;
  }
  connection.client = await mongodb.MongoClient.connect(connectString);
  connection.collection = connection.client.db(parameters.database).collection(parameters.collection);
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
      if (!connection.collection) { await initConnection(parameters); }
      await add(record);
      next();
    },
  });

  writable.on("finish", async () => {
    if (batch.length) {
      await connection.collection.insertMany(batch);
      batch.length = 0;
    }
    await connection.client.close();
    writable.emit("close");
  });

  writable.on("error", () => {
    console.error("MongoDB logger error");
  });

  return writable;
}
