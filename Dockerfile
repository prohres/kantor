# Static site on nginx as a non-root user (listens on 8080). Base image pinned by digest;
# Dependabot or a manual bump moves tag and digest together.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03

# Commit SHA from CI; the smoke test reads it back from /version.json
ARG VERSION=dev

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY script/ /usr/share/nginx/html/script/
COPY style/ /usr/share/nginx/html/style/

USER 0
# OS security fixes released after the base image was built (trivy gate fails on fixable HIGH/CRITICAL)
RUN apk upgrade --no-cache \
    && printf '{"version":"%s"}\n' "$VERSION" > /usr/share/nginx/html/version.json
USER 101

EXPOSE 8080
