# bunyan-mongodb
Mongodb stream for bunyan logger / other uses

Usage example:

```javascript
    const bunyan = require("bunyan");
    const bunyanMongo = require("bunyan-mongodb");
    
    const logger = bunyan.createLogger({
      name: "Logger Name",
      streams: [
        { 
            level: bunyan.INFO,
            stream: bunyanMongo({
                host: "localhost",
                database: "example",
                collection: "log",
                username: "user", // Optional
                password: "pwd", // Optional
                authDatabase: "admin", // Optional
                batchSize: 100,
            }) 
        },
      ],
    });
```