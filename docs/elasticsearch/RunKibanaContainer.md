---
sidebar_position: 4
"slug": "/ElasticStack/KibanaDockerContainer"
---
# 🐳 Run Kibana Docker Container
### 🛠️ Prerequisites

- Install [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) 
- Run Elasticsearch, in this case for testing you can folowing [Single Node Cluster Setup](./RunSingleNodeElasticsearchContainer.md)
---
##   🐳 Run kibana container with docker compose

📄 **Download the `docker-compose.yml` file**
```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/kibana/docker-compose.yml
```
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
#### 🌍 Access Kibana UI

[http://localhost:5601](http://localhost:5601)

#### 🧪 Verify connectivity in Kibana UI

In **Kibana** > **Stack Management** > **Dev Tools**, try a simple query: `GET _cat/indices?v=true`

You can execute all the [CRUD operections](./ExecuteCRUDOperationOnElasticsearch.md) on the Dev Tools. 