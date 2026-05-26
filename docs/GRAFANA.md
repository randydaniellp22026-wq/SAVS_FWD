# Grafana Cloud — Dashboard SAVS

## 1. Crear cuenta

1. Regístrate en [https://grafana.com/products/cloud/](https://grafana.com/products/cloud/) (plan free).
2. Crea un stack y anota la URL de Prometheus remoto (Remote Write / Prometheus data source).

## 2. Conectar Prometheus

En el servidor donde corre la API:

1. Instala [Prometheus](https://prometheus.io/download/) o usa el agente Grafana Alloy.
2. Configura scrape del endpoint local:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: savs-api
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: /metrics
```

3. Si usas Grafana Cloud Prometheus, configura `remote_write` hacia tu endpoint con usuario/token del stack.

## 3. Paneles del dashboard

Crea un dashboard **SAVS Production** con tres paneles:

### Latencia p95

```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### Error rate (%)

```promql
100 * sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m]))
```

### RPS

```promql
sum(rate(http_requests_total[1m]))
```

## 4. Alerta (error rate > 1%)

1. En Grafana → Alerting → New alert rule.
2. Condición: `error rate` query > `1` durante `5m`.
3. Contact point: email o Slack.
4. Mensaje ejemplo: `SAVS: error rate superó 1% en producción`.

## Validación

- Genera tráfico: `curl https://api.tudominio.com/api/vehicles`
- Fuerza un 404/500 y verifica que `http_errors_total` sube.
- Confirma que Sentry recibe el mismo error si `SENTRY_DSN` está configurado.
