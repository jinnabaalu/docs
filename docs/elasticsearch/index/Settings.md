---
sidebar_position: 5
title: "Settings"
description: "No fluff. Just the must-know index settings you actually need when working with Elasticsearch."
tags: [Elasticsearch, Index Settings, Shards, Replicas, Data Tier, Infra, Observability]
-----------------------------------------------------------------------------------------

# Deep Dive into Core `settings.index.*` Components in Elasticsearch

When you create an index in Elasticsearch, behind the scenes a ton of default and user-defined settings get baked into the `settings` block. In this blog, we’re going **straight to the metal** — no fluff — just the key components you *actually* need to understand when managing or tuning an index.

Let’s break down the **essential `settings.index` fields** you’ll see in real-world indices (excluding the noise):

---

## 📦 Example Settings Snapshot (Theory View)

This is how a typical index's settings look when you inspect it:

```json
"settings": {
  "index": {
    "routing": {
      "allocation": {
        "include": {
          "_tier_preference": ""
        }
      }
    },
    "number_of_shards": "",
    "provided_name": "",
    "creation_date": "",
    "number_of_replicas": "",
    "uuid": "",
    "version": {
      "created": ""
    }
  }
}
```

---

## 🚀 `index.number_of_shards`

Controls how many primary shards the index has. Not changeable after creation.

```json
"number_of_shards": "1"
```

---

## 🧬 `index.number_of_replicas`

Defines how many replica shards will be created for high availability.

```json
"number_of_replicas": "1"
```

---

## 🎯 `index.routing.allocation.include._tier_preference`

Tells Elasticsearch where to store shards based on node roles.

```json
"routing": {
  "allocation": {
    "include": {
      "_tier_preference": "data_content"
    }
  }
}
```

---

## 🆔 `index.provided_name`

The original index name at creation time.

```json
"provided_name": "index_components_default"
```

---

## 🕓 `index.creation_date`

Epoch timestamp showing when the index was created.

```json
"creation_date": "1746393073030"
```

---

## 🧬 `index.version.created`

Integer representing the ES version used to create the index.

```json
"version": {
  "created": "9009000"   // means 9.9.0
}
```

---

## 🧾 `index.uuid`

Random unique ID used internally to track the index.

```json
"uuid": "2XZZbw1eQ3KIloHLl5WJnw"
```

---

## 💡 Summary Table

| Setting                                       | Purpose                      | Changeable? |
| --------------------------------------------- | ---------------------------- | ----------- |
| `number_of_shards`                            | Shard partitioning           | ❌ No        |
| `number_of_replicas`                          | Redundancy for HA            | ✅ Yes       |
| `routing.allocation.include._tier_preference` | Node placement strategy      | ✅ Yes       |
| `provided_name`                               | Human-readable index name    | ❌ No        |
| `creation_date`                               | When index was created       | ❌ No        |
| `version.created`                             | ES version used at creation  | ❌ No        |
| `uuid`                                        | Unique internal ID for index | ❌ No        |

---

## ✍️ Wrap-up

These are the **core `settings.index` fields** you should care about. The rest? Mostly noise unless you're doing low-level tuning or running ILM, custom analyzers, or special plugins.

Next blog? Let's decode **custom index templates** or go deep into **analysis chains**.

---

### 📌 Bonus Tip:

To see the settings of any index:

```bash
GET /your-index-name/_settings
```

---
