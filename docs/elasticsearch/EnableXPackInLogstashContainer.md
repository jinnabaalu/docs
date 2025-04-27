---
sidebar_position: 8
title: "🐳 Enable XPack in Logstash Container"
description: "Secure Logstash to Elasticsearch communication over SSL — production-ready container setup"
slug: "/ElasticStack/EnableXpackInLogstashContainer"
---

# 🐳 Enable XPack in Logstash Container

Secure it. Connect it. Run it. 🚀  
Let’s hook up **Logstash** to your SSL-secured **Elasticsearch** node — no excuses.

---

## ✅ Preflight Checklist

- **Elasticsearch** must be **running, healthy, and SSL-enabled**.
- **Certs?** Use the **same `certs/` folder** generated when securing Elasticsearch.
- Place `certs/` folder **next to your docker-compose file**.
- **Network matters**:  
  - Same host? Use container names and **elknet** network.
  - Remote? Use **private IP** or **resolvable DNS name**.

**No certs = No SSL trust = Logstash won't even start.**

---
## 📜 Why ca.crt Again?
The `ca.crt` is the root certificate —  
- Logstash needs it to **validate Elasticsearch SSL**.
- No valid CA? SSL handshake fails, Logstash **crash loops**.

Mounted via:

```bash
- ./certs:/usr/share/logstash/config/certs
```

Referenced in env:
```bash
monitoring.elasticsearch.ssl.certificate_authority: "/usr/share/logstash/config/certs/ca/ca.crt"
```
---
## 🐳 Download the Docker Compose
```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/xpack-docker-compose.yml
```

### 🛠️ Create the .env File
Create a `.env` next to your docker-compose:
```bash
STACK_VERSION=9.0.0
ELASTIC_PASSWORD=your_elastic_password
```
> Match STACK_VERSION to what Elasticsearch is running.

### 🚀 Spin Up the Logstash Container
```bash
docker-compose up -d
```
Check container status: `docker ps -a`

Look for logstash — it should start healthy once certs and credentials are correct.

---

## 🎯 Final Touch — Logstash Pipeline
Logstash will do nothing unless you configure pipelines.

Make sure you have a pipeline file under: `./pipeline/`

Example simple input/output if you just wanna test it:
```bash
input { stdin { } }
output {
  elasticsearch {
    hosts => ["https://elasticsearch:9200"]
    user => "elastic"
    password => "${ELASTIC_PASSWORD}"
    cacert => "/usr/share/logstash/config/certs/ca/ca.crt"
    index => "test-index"
  }
}
```
---
## 🚨 Common Errors and Pitfalls
Wrong CA cert? => Logstash won't even pass bin/logstash -t.

Bad elastic password? => Authentication failures in logs.

No pipeline? => Logstash runs but looks dead (because no data flowing).

Treat your pipelines and certs like first-class citizens. 