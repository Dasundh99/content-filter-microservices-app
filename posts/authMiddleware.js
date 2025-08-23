const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).send({ error: "No token provided" });

  // Handle "Bearer <token>" or just "<token>"
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
  if (!token) return res.status(401).send({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;

