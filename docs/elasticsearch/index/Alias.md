---
sidebar_position: 2
title: "Alias"
---

## 🔄 Elasticsearch Alias Explained with Hands-On Examples

When you're running real-world Elasticsearch setups, hardcoding index names can be a pain — especially when you want to rotate, version, or switch data stores without breaking clients. That’s where **aliases** come in.

Aliases act as **abstracted, logical names** pointing to one or more real indices.

---

### 🎯 What Is an Alias?

An alias is a virtual index name that you can use in place of the actual index name in search, aggregation, or even write operations. Aliases help:

* Hide actual index names from clients
* Switch between versions of indexes seamlessly
* Perform zero-downtime reindexing
* Load balance queries across multiple indexes

---

### ✅ Step-by-Step Demo

#### 🔹 Create a Base Index and Add Sample Doc

```http
PUT /index_components_default/_doc/1
{
  "name": "Baalu",
  "age": 32,
  "active": true,
  "created_at": "2024-05-04T12:00:00Z",
  "status": "enabled",
  "ip": "192.168.0.1",
  "location": {
    "lat": 12.97,
    "lon": 77.59
  },
  "tags": ["infra", "devops"],
  "address": {
    "city": "Chennai",
    "pin": 600001
  },
  "projects": [
    { "name": "X", "status": "done" },
    { "name": "Y", "status": "in-progress" }
  ]
}
```

#### 🔹 Add Alias to the Index

```http
POST /_aliases
{
  "actions": [
    { "add": { "index": "index_components_default", "alias": "components_alias" }}
  ]
}
```

#### 🔎 Query Using Alias

```http
GET /components_alias/_search
```

---

### 🆕 Add Another Index and Use Same Alias

#### 🔹 Create Another Index with a Doc

```http
PUT /index_components_default_v2/_doc/1
{
  "name": "Test User",
  "age": 32,
  "active": true,
  "created_at": "2024-05-04T12:00:00Z",
  "status": "enabled",
  "ip": "192.168.0.1",
  "location": {
    "lat": 12.97,
    "lon": 77.59
  },
  "tags": ["infra", "devops"],
  "address": {
    "city": "Chennai",
    "pin": 600001
  },
  "projects": [
    { "name": "X", "status": "done" },
    { "name": "Y", "status": "in-progress" }
  ]
}
```

#### 🔹 Assign Same Alias to This Index Too

```http
POST /_aliases
{
  "actions": [
    { "add": { "index": "index_components_default_v2", "alias": "components_alias" }}
  ]
}
```

#### 🔍 Query Using the Alias — Now Fetches from Both

```http
GET /components_alias/_search
```

---

### ❌ Try Writing Through Alias — Expect Failure

```http
POST /components_alias/_doc
{
  "name": "New Baalu"
}
```

> 🔥 Error: Write alias must point to exactly one index (using `is_write_index: true`).

---

### ✍️ Set the Write Index Explicitly

```http
POST /_aliases
{
  "actions": [
    { "add": { "index": "index_components_default", "alias": "components_alias", "is_write_index": true }},
    { "add": { "index": "index_components_default_v2", "alias": "components_alias", "is_write_index": false }}
  ]
}
```

#### 🔁 Now Try Posting Again

```http
POST /components_alias/_doc
{
  "name": "New Baalu"
}
```

#### 🔎 Search Again — You’ll See the New Doc

```http
GET /components_alias/_search
```

---

### 📌 View Alias Mappings

```http
GET /_alias/components_alias
```

---

### 🧠 TL;DR

| Use Case            | Benefit                                          |
| ------------------- | ------------------------------------------------ |
| Abstract index name | Decouples client from physical index             |
| Multi-index read    | Combine multiple sources                         |
| Seamless versioning | Point alias to new index version                 |
| Controlled write    | Only one index gets writes with `is_write_index` |

---

Want to automate this using curl, Dev Tools, or scripts? Ping me next. This is just the groundwork for production-grade alias management 🔥
