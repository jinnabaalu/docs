---
sidebar_position: 2
"slug": "/ElasticStack/EnableXPackSecurityCertsGeneratorWithDockerCompose"
---
# 🛡️ Generate X-Pack-Compatible SSL Certs with Docker Compose

## 📦 Prerequisites
- Docker installed
- `unzip` installed on the host
- Optional: tree installed (to view cert folder structure)

## 🛠️ Setup

### 📁 Folder Structure
```bash
.
├── certs/                # certs will be generated here
├── instances.yml         # input file for certutil
└── docker-compose.yml    # Compose that does all the work
```

### 🧾 instances.yml
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
### 🐳 docker-compose.yml

```bash
mkdir -p xpack && cd xpack
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/xpack/docker-compose.yml
docker-compose up -d
```

### 📂 Output

Your `./certs` folder will now contain:
- `ca/ca.crt`, `ca.key`
- Signed node `certs` and `keys`, based on the instances

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