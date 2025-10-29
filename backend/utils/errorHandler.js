export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFound(req, res, next) {
  res.status(404).json({ status: "error", message: "Route not found" });
}

export function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
}