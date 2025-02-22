exports.error = (res, message, statusCode = 400) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      status: "error",
      message,
    })
  );
};

exports.success = (res, data, statusCode = 200) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      status: "success",
      data,
    })
  );
};
