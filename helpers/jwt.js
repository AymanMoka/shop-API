const { expressjwt: jwt } = require("express-jwt");
function authJwt() {
  return jwt({
    secret: "secretJwtKeyMoka",
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: "//api/v1/products(.*)/gm", method: ["GET", "OPTIONS"] },
      { url: "//api/v1/categories(.*)/gm", method: ["GET", "OPTIONS"] },
      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

module.exports = authJwt;
