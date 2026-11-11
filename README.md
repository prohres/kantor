# kantor

Currency exchange site (static HTML / JS), shipped as a container: nginx as a non-root user,
`/health` for the load balancer, `/version.json` with the commit SHA.

Published on GitHub Pages from `develop`: https://prohres.github.io/kantor/

Rates come from keyless open sources: [Frankfurter](https://frankfurter.dev) (ECB reference rates) and
the [NBU](https://bank.gov.ua/ua/open-data/api-dev) official rates. Kantor buy / sell prices are derived from the NBU rate with a per-day spread (buy ×0.90–0.99,
sell ×1.01–1.10) that is pseudo-random but seeded by date and currency, so a day always shows the same prices.
The FOREX and NBU tables show the change over the last 30 days instead of a date.

## Pipeline

`.github/workflows/app.yml` uses reusable workflows from [ci-templates](https://github.com/prohres/ci-templates);
infrastructure lives in [kantor-infra](https://github.com/prohres/kantor-infra).

| Event | What runs |
|---|---|
| pull request to `develop` | hadolint · gitleaks · docker build · trivy scan (no AWS access) |
| push to `develop` | build once → push `kantor:<sha>` to ECR → deploy the digest to dev (ECS) → smoke test `/version.json` on the service's load balancer |

Rollback: Actions → app → Run workflow on `develop` with `image-ref` = an earlier digest (deploys it to dev,
no build). A deploy that never gets healthy is rolled back by ECS (circuit breaker) and the job fails.
Run workflow with an empty `image-ref` repeats the whole pipeline for the current commit (the image is reused).

## Run locally

```bash
docker build --build-arg VERSION=local -t kantor .
docker run --rm -p 8080:8080 kantor     # http://localhost:8080
```