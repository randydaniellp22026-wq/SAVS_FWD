const crypto = require('crypto');
const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

const requestContext = pinoHttp({
  logger,
  genReqId(req) {
    const headerId = req.headers['x-request-id'];
    return typeof headerId === 'string' && headerId.trim() ? headerId : crypto.randomUUID();
  },
  customProps(req) {
    return { requestId: req.id };
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});

module.exports = requestContext;
