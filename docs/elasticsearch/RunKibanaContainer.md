---
sidebar_position: 4
"slug": "/ElasticStack/KibanaDockerContainer"
---
# 🐳 Run Kibana Container Docker

### 📘 Preface

This guide assumes you already have some basic knowledge of **Docker**, **Podman**, and the Docker ecosystem components.  
If you're new or need a quick refresher, check these out:

👉 [Prepare Your Container Environment with Docker](https://docs.docker.com/get-started/#prepare-your-docker-environment)  
👉 [Podman Installation Guide](https://podman.io/docs/installation)

### 🛠️ Prerequisites

1️⃣ Install [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) **or** [Podman](https://podman.io/docs/installation)  
2️⃣ Install [Docker Compose](https://docs.docker.com/compose/install/)


##  🐳 Run kibana container with docker-compose

📄 **Step 1: Download the `docker-compose.yml` file**

Run this command to download it directly from GitHub 👇

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/kibana/docker-compose.yml
```

🛠️ **Step 2: Run it**

```bash
docker-compose up -d
```

#### Container Status

```bash
docker ps -a
```

####  Check if Kibana is connected to Elasticsearch
```bash
docker logs <kibana-container-name>
```

#### 🌍 Access Kibana UI

[http://localhost:5601](http://localhost:5601)

#### 🧪 Verify connectivity in Kibana UI

In **Kibana** > **Stack Management** > **Dev Tools**, try a simple query: `GET _cat/indices?v=true`

You can execute all the [CRUD operections](/UPDATE_VALUE) on the Dev Tools. 
