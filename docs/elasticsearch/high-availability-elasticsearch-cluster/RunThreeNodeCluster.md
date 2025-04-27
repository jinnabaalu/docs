---
sidebar_position: 2
title: "🐳 Elasticsearch 3-Node Cluster Setup"
description: "Spin up a high-availability, secure Elasticsearch cluster with Docker."
slug: "/ElasticStack/elasticsearch-3-node"
---

# 🐳 Elasticsearch 3-Node Cluster Setup

**TL;DR:** Spin up a 3-node Elasticsearch cluster with SSL/TLS using Docker. It's secure, fast, and easy to deploy. Let's roll!

## 📂 Folder Structure

First, set up the directory like this:

```bash
three-node/
├── certs-generator
│   ├── docker-compose.yml
│   └── instances.yml
├── elasticsearch-1
│   ├── .env
│   └── docker-compose.yml
├── elasticsearch-2
│   ├── .env
│   └── docker-compose.yml
└── elasticsearch-3
    ├── .env
    └── docker-compose.yml
```
---
## 🚀 Steps to Get It Running
### Create Directories
Run this to make the folder structure:
```bash
mkdir -p three-node/certs-generator
mkdir -p three-node/elasticsearch-1
mkdir -p three-node/elasticsearch-2
mkdir -p three-node/elasticsearch-3
cd three-node
```
### Download the Files
Fetch the required files with `wget`
```bash
# For cert generator and instances file
THREE_NODE_CONF_PATH=https://raw.githubusercontent.com/jinnabaalu/ELKOperations/refs/heads/main/elasticsearch/three-node/
wget -O certs-generator/instances.yml {} ${THREE_NODE_CONF_PATH}/certs-generator/instances.yml
wget -O certs-generator/docker-compose.yml ${THREE_NODE_CONF_PATH}/certs-generator/docker-compose.yml

# For each Elasticsearch node
wget -O elasticsearch-1/docker-compose.yml ${THREE_NODE_CONF_PATH}/elasticsearch-1/docker-compose.yml
wget -O elasticsearch-2/docker-compose.yml ${THREE_NODE_CONF_PATH}/elasticsearch-2/docker-compose.yml
wget -O elasticsearch-3/docker-compose.yml ${THREE_NODE_CONF_PATH}/elasticsearch-3/docker-compose.yml
wget -O docker-compose.yml ${THREE_NODE_CONF_PATH}/elasticsearch-3/docker-compose.yml
```
Create the `.env` in each folder with the following content

```bash
STACK_VERSION=9.0.0
ES_PORT=9200 # if you are running remote this port usage will not effect the other container
CLUSTER_NAME=YOUR_CLUSTER_NAME
ELASTIC_PASSWORD=CHANGE_ME
MEM_LIMIT=4g
```

### Generate SSL Certs
Now, head to the certs-generator folder and fire up Docker
```bash
cd certs-generator
docker compose up -d    
```

This will generate the SSL certs in the certs/ directory. 

#### OUTPUT
```bash
balu@BaaluMac certs-generator % docker compose up -d
[+] Running 2/2
 ✔ Network certs-generator_default  Created                                                           0.2s
 ✔ Container elastic-certgen        Started                                                           0.5s
balu@BaaluMac certs-generator % docker logs -f elastic-certgen
✅ Done generating certs in ./certs
^C%
balu@BaaluMac certs-generator % tree
.
├── certs
│   ├── ca
│   │   ├── ca.crt
│   │   └── ca.key
│   ├── ca.zip
│   ├── certs.zip
│   ├── elasticsearch-1
│   │   ├── elasticsearch-1.crt
│   │   └── elasticsearch-1.key
│   ├── elasticsearch-2
│   │   ├── elasticsearch-2.crt
│   │   └── elasticsearch-2.key
│   └── elasticsearch-3
│       ├── elasticsearch-3.crt
│       └── elasticsearch-3.key
├── docker-compose.yml
└── instances.yml

6 directories, 12 files
```

Once done, clean up

```bash
docker compose down
```
### Copy Certs
Move the generated certs to each node’s certs/ folder:
```bash
mkdir elasticsearch-1/certs/
cp -r certs-generator/certs/elasticsearch-1 elasticsearch-1/certs/
cp -r certs-generator/certs/ca elasticsearch-1/certs

mkdir elasticsearch-2/certs/
cp -r certs-generator/certs/elasticsearch-2 elasticsearch-2/certs/
cp -r certs-generator/certs/ca elasticsearch-2/certs/

mkdir elasticsearch-3/certs/
cp -r certs-generator/certs/elasticsearch-3 elasticsearch-3/certs/
cp -r certs-generator/certs/ca elasticsearch-3/certs/
``` 

Final folder structure should look like this. 

```bash
.
├── certs-generator
│   ├── certs
│   │   ├── ca
│   │   │   ├── ca.crt
│   │   │   └── ca.key
│   │   ├── ca.zip
│   │   ├── certs.zip
│   │   ├── elasticsearch-1
│   │   │   ├── elasticsearch-1.crt
│   │   │   └── elasticsearch-1.key
│   │   ├── elasticsearch-2
│   │   │   ├── elasticsearch-2.crt
│   │   │   └── elasticsearch-2.key
│   │   └── elasticsearch-3
│   │       ├── elasticsearch-3.crt
│   │       └── elasticsearch-3.key
│   ├── docker-compose.yml
│   └── instances.yml
├── elasticsearch-1
│   ├── .env
│   ├── certs
│   │   ├── ca
│   │   │   ├── ca.crt
│   │   │   └── ca.key
│   │   └── elasticsearch-1
│   │       ├── elasticsearch-1.crt
│   │       └── elasticsearch-1.key
│   └── docker-compose.yml
├── elasticsearch-2
│   ├── .env
│   ├── certs
│   │   ├── ca
│   │   │   ├── ca.crt
│   │   │   └── ca.key
│   │   └── elasticsearch-2
│   │       ├── elasticsearch-2.crt
│   │       └── elasticsearch-2.key
│   └── docker-compose.yml
└── elasticsearch-3
    ├── .env
    ├── certs
    │   ├── ca
    │   │   ├── ca.crt
    │   │   └── ca.key
    │   └── elasticsearch-3
    │       ├── elasticsearch-3.crt
    │       └── elasticsearch-3.key
    └── docker-compose.yml

19 directories, 30 files
```

### Spin Up the Containers
Now, start your Elasticsearch nodes
#### Elasticsearch-1
```bash
cd elasticsearch-1
docker compose up -d
```
Check for logs `docker logs -f elasticsearch-1`

After healthy it is waiting for cluster formation and shows failed to connect to other nodes.
```bash
docker logs -f elasticsearch-1 | grep "failed to resolve host"`
```

#### Elasticsearch-2
```bash
cd elasticsearch-2
docker compose up -d
```

#### For Elasticsearch-3
```
cd elasticsearch-3
docker compose up -d
```

## 🔒 Secure by Default
This setup enables SSL/TLS for both HTTP and transport layers, making sure your Elasticsearch cluster is locked down and ready for production.

## 🚨 What’s Next?
You now have a secure, high-availability Elasticsearch cluster running on Docker.

Play around with the configs and add more nodes or scale your setup.

Don’t forget to monitor your cluster!

That’s it! Your Elasticsearch cluster is up and running with SSL. 🔥