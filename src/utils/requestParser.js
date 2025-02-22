// Parses incoming request data
const parseRequestData = (req) => {
  try {
    if (req.body) {
      return req.body;
    }

    return new Promise((resolve, reject) => {
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        // If no data, resolve with an empty object
        if (!data.trim()) {
          return resolve({});
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Invalid JSON data"));
        }
      });

      req.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error("Failed to parse request data");
  }
};

module.exports = parseRequestData;
