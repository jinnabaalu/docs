---
sidebar_position: 3
title: "🐳 Elasticsearch 3-Node Cluster Failure Simulation"
description: "Simulate and manage three-node Elasticsearch cluster failures, observe failover behavior, and recover using Docker containers."
slug: "/ElasticStack/Elasticsearch-3-NodeClusterFailureSimulation"
keywords:
  - "Elasticsearch"
  - "3-Node Cluster"
  - "Cluster Failure Simulation"
  - "Docker"
  - "High Availability"
  - "Failover"
  - "Elasticsearch Recovery"
  - "Node Failure"
author: "Jinna Baalu"
---

# Simulate and Manage Elasticsearch 3-Node Cluster Failures

In this guide, we will simulate various failure scenarios in a 3-node Elasticsearch cluster running in Docker containers. By simulating node failures and observing Elasticsearch's behavior, we will also cover how the cluster recovers automatically.

## 1. Current Setup

We have a **3-node Elasticsearch cluster** running inside Docker containers. The cluster is configured with **replicas** to ensure high availability and data redundancy. Each node is responsible for a portion of the data, and replicas are automatically managed to ensure that data is available even if a node fails.

---

## 2. Simulate Node Failures (Taking Down Nodes)

### Scenario 1: Take Down One Node

Simulate a single-node failure to observe how Elasticsearch handles it.

#### Step 1: Check Cluster Health

Before taking down a node, check the health of the cluster:

```bash
curl -X GET "localhost:9200/_cluster/health?pretty=true"
```

#### Step 2: Stop One Node
Stop one of the Elasticsearch Docker containers to simulate the failure of a single node

```bash
docker stop <container_name>
```

#### Step 3: Check Cluster Health After Failure
After stopping the node, check the cluster health again. You should see a yellow status as the replicas are promoted to primary shards
```bash
curl -X GET "localhost:9200/_cluster/health?pretty=true"
```

### Scenario 2: Take Down Two Nodes
Simulate the failure of two nodes and see how the cluster handles more significant failures.

#### Step 1: Stop Two Nodes

Stop two Elasticsearch Docker containers to simulate the failure of two nodes
```bash
docker stop <container_name_1> <container_name_2>
```

#### Step 2: Check Cluster Health After Two Nodes Fail
After stopping the two nodes, check the cluster health. It will likely show a red status, indicating that some data may be lost or unavailable. This is because with two nodes down, the cluster no longer has enough replicas or primary shards to maintain full availability:

```bash
curl -X GET "localhost:9200/_cluster/health?pretty=true"
```

### Scenario 3: Take Down All Three Nodes

Simulate a total failure by taking down all three nodes.

#### Step 1: Stop All Three Nodes
Stop all three Elasticsearch Docker containers to simulate the failure of all nodes
```bash
docker stop <container_name_1> <container_name_2> <container_name_3>
```

#### Step 2: Check the Cluster Health (Should Be Unavailable)
At this point, the cluster is completely down. You can confirm this by checking the health again, which should show a red status since no nodes are available to handle the requests:
```bash
curl -X GET "localhost:9200/_cluster/health?pretty=true"
```

## 3. Bringing the Nodes Back Up

### Step 1: Start the Nodes Again
To recover the cluster, start the stopped containers one by one
```bash
docker start <container_name_1>
docker start <container_name_2>
docker start <container_name_3>
```

### Step 2: Check Cluster Health After Recovery
After restarting all the nodes, check the cluster health again. It should eventually return to a green status once Elasticsearch has fully recovered and rebalanced the data
```bash
curl -X GET "localhost:9200/_cluster/health?pretty=true"
```

## 4. Key Takeaways
**Replica and Failover**: Elasticsearch ensures high availability by promoting replicas when primary nodes fail. However, failure of multiple nodes can cause data unavailability or loss if replicas are insufficient.

**Health Monitoring**: Use curl commands to monitor the cluster health during different failure scenarios.

**Automatic Recovery**: When nodes come back online, Elasticsearch will automatically recover and rebalance the cluster to restore full health.

