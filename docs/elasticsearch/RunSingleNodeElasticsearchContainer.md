---
sidebar_position: 2
title: "🐳 Run Elasticsearch Single Node Docker Container"
description: " 🐳 Run a single-node Elasticsearch container"
"slug": "/ElasticStack/ElasticsearchSingleNodeDockerContainer"
---

# 🐳 Run Elasticsearch Single Node Docker Container
---
### 🛠️ Prerequisites

- Install [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) 

---
##  🐳 Run a single-node Elasticsearch container

📄 **Download the `docker-compose.yml` file**

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/main/elasticsearch/single-node/docker-compose.yml
```
> The compose file is configured to conenct with the elasticsearch container, which runs on the same server. 

🛠️ **Run it**
```bash
docker compose up -d
```
🛠️ **Check Container Status**
```bash
docker ps -a
```
> Container status need to be healthy

> If it is not health you need to **check the logs** with `docker logs <kibana-container-name>`

---
## 🔍 Query Elasticsearch APIs

Cluster & Node Status

```bash
# Nodes in the cluster
curl -X GET 'localhost:9200/_cat/nodes?pretty'

# Overall health
curl -X GET 'localhost:9200/_cat/health?pretty'

# Cluster stats
curl -X GET 'localhost:9200/_cluster/stats?human&pretty'

# Node-level stats
curl -X GET 'localhost:9200/_nodes/stats?pretty'

# Specific node stats (replace "es-node" with actual node name)
curl -X GET 'localhost:9200/_nodes/es-node/stats?pretty'
```

Index & Plugin Info

```bash
# List indices (initially empty)
curl -X GET 'localhost:9200/_cat/indices?pretty'

# All indices, including hidden/closed
curl -X GET 'localhost:9200/_cat/indices?expand_wildcards=all&pretty'

# Index-level stats
curl -X GET 'localhost:9200/_nodes/stats/indices?pretty'

# Plugin details
curl -X GET 'localhost:9200/_nodes/plugins'

```
---
## 🧠 Homework – Practice Makes 🫵 Perfect

🎯 **Deploy & Explore**: Bring up your stack, run commands, and build muscle memory

---

## ✅ Conclusion

With this containerized setup, you can launch a fully functional Elasticsearch instance in seconds. It’s a perfect solution for quick testing, development, or learning. The provided REST APIs give you direct control and deep insights into how Elasticsearch operates behind the scenes.