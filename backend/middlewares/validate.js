const { ZodError } = require('zod');
const { HttpError } = require('../utils/httpError');

const formatIssues = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));

const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new HttpError(400, 'Error de validación', formatIssues(error.issues)));
    }
    return next(error);
  }
};

module.exports = { validate };
