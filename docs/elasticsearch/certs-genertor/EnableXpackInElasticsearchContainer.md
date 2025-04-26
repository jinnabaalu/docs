---
sidebar_position: 4
title: "🐳 Enable XPack in Elasticsearch Container"
description: " 🐳 Run a secure single-node Elasticsearch container"
"slug": "/ElasticStack/EnableXpackInElasticsearchContainer"
---

# 🐳 Enable XPack in Elasticsearch Container

### 📘 Preface

This guide assumes you already have some basic knowledge of **Docker**, **Podman**, and the Docker ecosystem components.  
If you're new or need a quick refresher, check these out:

👉 [Prepare Your Container Environment with Docker](https://docs.docker.com/get-started/#prepare-your-docker-environment)  
👉 [Podman Installation Guide](https://podman.io/docs/installation)

### 🛠️ Prerequisites

1️⃣ Install [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) **or** [Podman](https://podman.io/docs/installation)  
2️⃣ Install [Docker Compose](https://docs.docker.com/compose/install/)


##  🐳 Run a single-node Elasticsearch container

📄 **Step 1: Create the `docker-compose.yml` file**
📄 **Step 1: Download the `docker-compose.yml` file**

Run this command to download it directly from GitHub 👇

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/main/elasticsearch/single-node/docker-compose.yml
```

🛠️ **Step 2: Run it**

```bash
docker-compose up -d
```

#### Container Status

```bash
docker ps -a
```

#### 📡 Cluster & Node Status
Query Elasticsearch APIs to check cluster health and nodes:

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

#### 📦 Index & Plugin Info

Inspect your index status and installed plugins:

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

## 🧠 Homework – Practice Makes 🫵 Perfect

🎯 **Deploy & Explore**: Bring up your stack, run commands, and build muscle memory

---

## ✅ Conclusion

With this containerized setup, you can launch a fully functional Elasticsearch instance in seconds. It’s a perfect solution for quick testing, development, or learning. The provided REST APIs give you direct control and deep insights into how Elasticsearch operates behind the scenes.