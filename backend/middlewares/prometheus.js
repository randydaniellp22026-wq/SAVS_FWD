const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status_code'],
});

const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total de errores HTTP (4xx y 5xx)',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpErrorsTotal);

function normalizeRoute(req) {
  if (req.route?.path) return req.baseUrl + req.route.path;
  return req.path || 'unknown';
}

function prometheusMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSec = durationNs / 1e9;
    const route = normalizeRoute(req);
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestDuration.observe(labels, durationSec);
    httpRequestsTotal.inc(labels);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });

  next();
}

async function metricsHandler(req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

module.exports = {
  prometheusMiddleware,
  metricsHandler,
  register,
};
