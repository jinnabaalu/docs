---
sidebar_position: 1
"slug": "/ElasticStack/EnableXPackSecurityCertsGenerator"
---
# 🛡️ Generate X-Pack-Compatible SSL Certs with with Bash

We use [elasticsearch-certutil](https://www.elastic.co/docs/reference/elasticsearch/command-line-tools/certutil) for creating the certificates. This script auto-generates X-Pack-compatible SSL certificates for Elasticsearch nodes using Docker or Podman.

## 📦 Prerequisites
- Docker or Podman
- `unzip`
- `tree`(optional) for output view

## 🤖 What generate-xpack-certs.sh Does
| Step | Action |
|---|---|
|✅ | Prompts for Elasticsearch version and container runtime |
| 🔍 | Detects existing instances.yml or instances.yaml |
| 📄 | Lets you reuse or regenerate node config interactively |
| 🧠 | Supports dynamic cluster sizing (1, 3, or custom) |
| ✍️ | Creates valid instances.yml for cert generation |
| 🔐 | Uses elasticsearch-certutil to generate: `ca.crt`, `ca.key`, and `*.crt`, `*.key` for each node |
| 🧽 | Cleans up old certs and sets secure file permissions |

## 🚀 Download & Execute

```bash
wget https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/xpack-certs/generate-xpack-certs.sh
chmod +x generate-xpack-certs.sh
./generate-xpack-certs.sh
```

> You can generate the `instances.yml` before execution to skips all the following prompts to generate the file. 

## 🧩 Skip Prompts with Predefined Config
You can generate the instances.yml file beforehand to skip the interactive prompts and go straight to cert generation.

Here's a sample:

```
cat <<EOF > instances.yml
instances:
  - name: es01
    ip:
      - 127.0.0.1
    dns:
      - es01
      - localhost
      - test123.jinna.com
  - name: es02
    ip:
      - 127.0.0.1
    dns:
      - es02
      - localhost
  - name: es03
    ip:
      - 127.0.0.1
    dns:
      - es03
      - localhost
  - name: es04
    ip:
      - 12.23.12.1
      - 127.0.0.1
    dns:
      - es04
      - localhost
      - test.jinna.com
  - name: es05
    ip:
      - 127.0.0.1
    dns:
      - es05
      - localhost
      - test1.jinna.com
EOF
```

## ✅ Output Location
All generated certs will be in: /config/certs/
```bash
cd $(pwd)/config/certs/
ls
```
You can then use the certs in the elasticsearch container, you can read more about 
- [Enable XPack in Elasticsearch Container](../EnableXpackInElasticsearchContainer.md) 
- [Enable XPack in Kibana Container](../EnableXpackInKibanaContainer.md)
- [Enable XPack in Logstash Container](../EnableXpackInKibanaContainer.md)
- so on.....
