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
---
### Pipeline Structure

Pipelines should be well-configured, organized, and prioritized for smooth data flow. Treat your pipelines like first-class citizens. A Logstash pipeline has 3 blocks

**1. Input**: Where the data comes from (e.g., JDBC, Beats, HTTP, etc.).

**2. Filter**: (Optional) Used to parse, transform, and clean data.

**3. Output**: Where the data is sent (e.g., Elasticsearch, S3, Kafka).
---
### Create folders and files

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

Download PostgreSQL Dcoker Container Setup Files

```bash
wget -P postgres/ https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/postgres/docker-compose.yml
wget -P postgres/ https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/logstash/postgres-to-elasticsearch/postgres/init.sql

# View the content of init.sql to know the data getting inserted
cd postgres/
docker-compose up -d
```

> Based on the given `init.sql` data, it will create the databse and tables. You can check what you have inserted into the postgres. I have `vbvdb` database, and `employe`
---
##   🐳 Run logstash container 

Understand the pipeline:
```bash
cat pipeline/pg-table-es.conf 

input {
  jdbc {
    jdbc_connection_string => "jdbc:postgresql://postgres:5432/vbvdb" # Postgres connection string
    jdbc_user => "vbv" # postgres user
    jdbc_password => "vbv" # postgres user password
    jdbc_driver_class => "org.postgresql.Driver" # JDBC driver class to connect to the postgres
    jdbc_driver_library => "/usr/share/logstash/jdbc-drivers/postgresql-42.7.5.jar" # jar used for supporting the Class defined
    statement => "SELECT * from employees" # select the data from table 
    schedule => "* * * * *" # Runs every 1min. 
  }
}
output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"] # Elasticsearch connection
    index => "employees" # Creates the index
    document_id => "%{id}" # Like column in postgres, every record is called document in elasticsearch, which is the id of the docuemnt. 
  }
}
```
Run the logstash container now 

```bash
docker-compose up -d
```

- Check if Logstash container is up and healthy, `docker ps -a`, Look for the container named logstash — Status should be healthy or Up.
- Tail the container logs and check if the SELECT query runs, `docker logs logstash | grep "SELECT"` If you see your SELECT * FROM employees query firing, the pipeline is alive and pulling data 🔥.
- Check if Elasticsearch actually got the data, `curl -s http://localhost:9200/_cat/indices?v`, Look for an index called employees.
- Count the documents inside employees index, `curl -s http://localhost:9200/employees/_count?pretty`
- Question for you 🫵.  What is pretty in the above query, try with  pretty and try without pretty? 
- Try another query, to search data in index `curl -s http://localhost:9200/employees/_search?pretty`