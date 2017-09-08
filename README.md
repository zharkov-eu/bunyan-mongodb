# bunyan-mongodb
Mongodb stream for bunyan logger / other uses

Usages:

    bunyanMongo = require "bunyan-mongodb";

    const logger = bunyan.createLogger({
      name: "Logger Name",
      streams: [
        { level: bunyan.INFO, stream: bunyanMongo() },
      ],
    });