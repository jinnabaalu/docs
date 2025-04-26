---
sidebar_position: 2
"slug": "/ElasticStack/EnableXPackSecurityCertsGeneratorWithDockerRun"
---
# 🛡️ Generate X-Pack-Compatible SSL Certs with Docker Run

This guide walks you through generating your own X-Pack-compatible SSL certificates **manually** using Docker and `elasticsearch-certutil`, without relying on automation scripts.

> Use this when you want **tight control** over your certs — perfect for debugging, air-gapped infra, or CI/CD integration.

## 📦 Prerequisites
- Docker installed
- A sample `instances.yml` file (see below)
- `unzip` installed on host
- Optional: `tree` to inspect cert directories

## 🧪 Sample instances.yml

```yaml
instances:
  - name: elasticsearch
    ip:
      - 127.0.0.1
      # - PUBLIC_IP
      # - PRIVATE_IP
    dns:
      - elasticsearch
      - localhost
      # - FQDN
      # - HOSTNAME
```
> Keep this file in your current working directory before you run the container.

## 🛠️ Manual Steps

#### 🐳 1. Start Elasticsearch Container with Mounted instances.yml

```bash
docker run -d \
  --name elastic-certutil \
  -v "$(pwd)/instances.yml:/usr/share/elasticsearch/instances.yml" \
  docker.elastic.co/elasticsearch/elasticsearch:9.0.0
```
> Replace the image version if needed. This container is just used for generating certs.

#### 🧭 2. Enter the Container Shell
```bash
docker exec -it elastic-certutil bash
```

#### 🔐 3. Generate the CA (Certificate Authority)
```bash
mkdir -p certs
bin/elasticsearch-certutil ca --silent --pem -out ./certs/ca.zip
unzip ./certs/ca.zip -d ./certs
```
> This creates your `ca.crt` and `ca.key`.

#### 🖇️ 4. Generate Node Certs Using instances.yml

```bash
bin/elasticsearch-certutil cert --silent --pem \
  --in /usr/share/elasticsearch/instances.yml \
  --out ./certs/certs.zip \
  --ca-cert ./certs/ca/ca.crt \
  --ca-key ./certs/ca/ca.key

unzip -q ./certs/certs.zip -d ./certs
```

#### Copy the certs to the local

Come out of the container to 

```bash
docker cp elastic-certutil:/usr/share/elasticsearch/certs ./certs
```


### Usage in the elasticsearch environment

```bash
xpack.security.enabled=true
xpack.security.http.ssl.enabled=true
xpack.security.http.ssl.key=certs/elasticsearch/elasticsearch.key 
xpack.security.http.ssl.certificate=certs/es01/elasticsearch.crt
xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
xpack.security.transport.ssl.enabled=true
xpack.security.transport.ssl.key=certs/elasticsearch/elasticsearch.key
xpack.security.transport.ssl.certificate=certs/elasticsearch/elasticsearch.crt
xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
xpack.security.transport.ssl.verification_mode=certificate
```




