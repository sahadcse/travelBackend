const { app } = require("../../server");

let testServer;

const startServer = () => {
  return new Promise((resolve) => {
    testServer = app.listen(0, () => {
      resolve(testServer);
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    if (testServer) {
      testServer.close(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = { startServer, stopServer, app };
