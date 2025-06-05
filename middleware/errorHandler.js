export default function errorHandler(err, req, res, next) {
  const status = err.status || 500; // Sätt 500 om ingen status finns
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}
