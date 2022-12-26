const Jwt = require('@hapi/jwt');

function createAccessToken(payload) {
  return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
}

function decodeToken(token) {
  const artifacts = Jwt.token.decode(token);
  return artifacts.decoded.payload;
}

module.exports = { createAccessToken, decodeToken };
