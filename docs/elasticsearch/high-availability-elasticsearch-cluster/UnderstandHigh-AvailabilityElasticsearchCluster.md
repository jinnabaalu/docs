---
sidebar_position: 1
title: "🐳 How to Define a Highly Available Elasticsearch Cluster"
description: "Learn the basics of setting up a highly available Elasticsearch cluster, including quorum, roles, and key configuration properties."
slug: "/ElasticStack/UnderstandHACluster"
---

## Introduction: Why High Availability in Elasticsearch?

Before setting up a highly available (HA) Elasticsearch cluster, let's cover some key concepts.

### What is a Single-Node Elasticsearch Setup?

A **single-node Elasticsearch** setup handles everything—data, searches, and cluster management—on one node. While simple, it’s risky: if the node fails, the entire system crashes, and you might lose data.

### What are Failures in Elasticsearch?

Failures can come from:
- **Node Failures**: If your only node crashes, the whole cluster stops.
- **Network Issues**: Network problems can cause the cluster to split.
- **Hardware Failures**: Hardware issues can make the node unavailable.

### Why Choose High Availability (HA)?

A **High Availability (HA)** setup spreads your data across multiple nodes. If one node fails, the others continue serving requests, keeping the system operational and reducing downtime.

---

## 1. Understanding Quorum in Elasticsearch

**Quorum** is the minimum number of nodes that must agree on decisions (e.g., electing a master or modifying data). It helps prevent **split-brain scenarios**, where the cluster splits into two independent clusters.

### Quorum Formula

The quorum formula in Elasticsearch is based on the number of **master-eligible nodes**: `Quorum = (Number of master-eligible nodes / 2) + 1`

For a 3-node cluster:
- Quorum = `(3 / 2) + 1 = 2`
- So, at least **2 nodes** must agree for the cluster to function.

If only 1 node is available, the cluster is considered unavailable.

### Why is Quorum Important?

Quorum ensures **cluster stability** and prevents **split-brain** scenarios, where multiple master nodes could conflict.

---

## 2. Elasticsearch Node Roles: What Are They and When to Use Them?

Elasticsearch nodes can serve different roles. Here’s a quick look:

### 2.1. Node Roles

- **Master Node**: Manages cluster state and node changes.
- **Data Node**: Stores data and handles search/indexing.
- **Ingest Node**: Pre-processes documents before indexing.
- **ML Node**: Handles machine learning tasks (remove if unused).
- **Coordinating Node**: Routes requests to appropriate nodes.
- **Remote Cluster Client**: Connects to external clusters.
- **Transform Node**: Performs data transformations.

### 2.2. When to Use Specific Roles?

- **Small Cluster (3 nodes)**: Typically, assign **all roles** to each node for simplicity and redundancy.
- **Larger Clusters**:  
  - Assign **Data Nodes** to storage-heavy nodes.
  - Use **dedicated Master Nodes** for stability.
  - Remove unused roles (like **ML**) to optimize performance.

We’ll dive deeper into specific roles in future blogs.

---

## Essential Configuration for a 3-Node Elasticsearch Cluster

For a basic 3-node cluster, these two properties are sufficient:

1. **`cluster.initial_master_nodes`**  
   Defines the initial master-eligible nodes to form the cluster. Used only during the first start-up.  
   ```yaml
   cluster.initial_master_nodes: elasticsearch-1, elasticsearch-2, elasticsearch-3
   ```

2. **`discovery.seed_hosts`**
    Lists nodes to help discover and join the cluster. Used by new nodes when they start.
    ```bash
    discovery.seed_hosts: elasticsearch-2, elasticsearch-3
    ```
---
## Conclusion

Setting up a highly available Elasticsearch cluster ensures reliability during node failures. In this blog, we’ve covered:

- The risks of a **single-node setup**.
- The importance of **quorum** for stability.
- **Node roles** and when to assign them.
- Key **configuration properties** for high availability.

Next, we’ll explore specific roles and cluster scaling. Stay tuned!

[Learn how to run a high-availability 3-node cluster](./RunThreeNodeCluster.md).