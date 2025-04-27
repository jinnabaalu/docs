---
sidebar_position: 7
title: "🐳 Enable XPack in Kibana Container"
description: "Secure Kibana connection with Elasticsearch over SSL — production-ready container setup"
slug: "/ElasticStack/EnableXPackInKibanaContainer"
---

# 🐳 Enable XPack in Kibana Container

Secure it. Connect it. Run it. 🚀  
Let’s hook up **Kibana** to your SSL-secured **Elasticsearch** node — the *right* way.

---

## ✅ Preflight Checklist

- Use the **same certificates** you generated when securing Elasticsearch.
- Place the `certs/` folder in the **current working directory**.
- **Elasticsearch** must already be **up, healthy, and SSL-enabled**.
- **Networking tip**:  
  - If Kibana and Elasticsearch are **on the same machine**, use Docker container names as hosts and **share the same Docker network** (`elknet`).
  - If **remote**, use the **private IP** or **resolvable hostname**.
  
**No network = No connection.**
- Since Elasticsearch is now SSL-secured, **Kibana must trust the Elasticsearch SSL certificate** — that's why we mount the ca.crt file into the container.
---
## 📜 What's the Deal with ca.crt?
The `ca.crt` (Certificate Authority certificate) is 🔥 critical because:
- It's the root of trust for SSL/TLS connections between Kibana and Elasticsearch.
- Kibana needs the ca.crt to validate that the Elasticsearch server it's talking to is real and not some random imposter.
- Without this, SSL handshake will fail hard — you’ll get errors like unable to verify certificate, bad handshake, or Kibana will just refuse to connect.

That’s why we mount the certs and tell Kibana:

```bash
- ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES=config/certs/ca/ca.crt
```
Bottom Line:
If Kibana can't trust the CA, it won't trust Elasticsearch, and your setup will break. 🔥

## 🐳 Download the Docker Compose

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/kibana/xpack-docker-compose.yml
```
---
## 🛠️ Create the `.env` File
Create a `.env` file alongside your `docker-compose.yml`, with the following vars:

```bash
STACK_VERSION=8.12.0
KIBANA_PORT=5601
ELASTICSEARCH_HOSTS=https://elasticsearch:9200
KIBANA_PASSWORD=your_kibana_system_password
MEM_LIMIT=1g
```
> Match STACK_VERSION to your Elasticsearch version.
---
## 🚀 Spin Up the Kibana Container
```bash
docker-compose up -d
```
Check container status: `docker ps -a`
Look for **kibana** — it will stay starting until you set the `kibana_system` user password.
---
## 🔐 Set kibana_system Password 

```bash
curl -s -X POST --cacert ./certs/ca/ca.crt \
-u "elastic:${ELASTIC_PASSWORD}" \
-H "Content-Type: application/json" \
https://localhost:9200/_security/user/kibana_system/_password \
-d "{\"password\":\"${KIBANA_PASSWORD}\"}"
```
---

## 🎯 Access the Kibana UI
Open your browser: [https://localhost:5601](https://localhost:5601)

✅ Log in with your elastic user or any other user you've configured.

> Now Kibana is talking to Elasticsearch securely over SSL.
> Not a hacky dev setup — this is **production-grade**.
---

### 🚨 Common Errors and Pitfalls

- If you don’t set `kibana_system` password properly = Kibana will **crash-loop** or **stay unhealthy forever**.
- Wrong certs path? You’ll get **SSL errors** (`unable to verify the first certificate`, `bad handshake`, etc.).
- Kibana **must** trust Elasticsearch CA. Always point it to `ca.crt`.
