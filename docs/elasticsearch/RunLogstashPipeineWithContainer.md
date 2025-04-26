---
sidebar_position: 5
"slug": "/ElasticStack/BasicLogstashPipeline"
---
# 🐳 Basic Logstash Pipeline

We'll use Logstash as an ETL engine to move data from **PostgreSQL into Elasticsearch**. Fast, clean, and production-ready.

### 🛠️ Prerequisites

Run Elasticsearch, in this case for testing you can folowing [Single Node Cluster Setup](./RunSingleNodeElasticsearchContainer.md)

### 📁 Folder Structure
We'll create or download the necessary files and organize them following the structure below.
```bash
cd logstash

.
├── jdbc-drivers
│   └── postgresql-42.7.5.jar
├── pipeline
│   ├── pg-table-es.conf
├── postgres
│   ├── docker-compose.yml
│   ├── init.sql
└── docker-compose.yml
```
Create folder structure 

```bash
cd logstash/
mkdir -p jdbc-drivers pipeline postgres
```
Download PostgreSQL JDBC Driver, for latest version check [here](https://jdbc.postgresql.org/download/)
```bash
wget -P jdbc-drivers/ https://jdbc.postgresql.org/download/postgresql-42.7.5.jar
```
Download Logstash Docker Compose and Pipeline Config
```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/docker-compose.yml
wget -P pipeline/ https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/pipeline/pg-table-es.conf
```

Download PostgreSQL Container Setup
```bash
wget -P postgres/ https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/postgres/docker-compose.yml
wget -P postgres/ https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/postgres/init.sql
```
---

##   🐳 Run postgres container with init.sql using docker-compose
```bash
cd logstash/postgres/
docker-compose up -d
```
> Based on the given `init.sql` data, it will create the databse and tables. You can check what you have inserted into the postgres.

---
##   🐳 Run logstash container 

Check your pipleine from input block postgres which table is getting called, and tranformed to elasticsearch in the output block. 
```bash
cd logstash/
docker-compose up -d
```
