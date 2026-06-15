export default (err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      errors: err.issues,
      // errors: err.issues.map((err) => err.message),
    });
  }
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Server Error !!",
  });
};
