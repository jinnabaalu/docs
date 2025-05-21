---
sidebar_position: 1
title: "Design Index"
---

# How to design your index ? 

- Store
- Process
- Search
- Maintain

Lets create one index and a record dynamically and see what are the default design is defined in the elasticsearch. 
```bash
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

## Core Index Components

| Component      | What it does                                                                    |
| -------------- | ------------------------------------------------------------------------------- |
| **`settings`** | Controls shard count, replicas, refresh rate, analyzers, ILM, compression, etc. |
| **`mappings`** | Defines fields, types, analyzers, indexing rules, nested objects, etc.          |
| **`aliases`**  | Abstract pointers to indices — for read/write/rollover access                   |

## Extension of Components

| Component                            | What it is                                                 |
| ------------------------------------ | ---------------------------------------------------------- |
| **Ingest Pipeline**                  | Pre-processing before indexing (transform, parse, enrich)  |
| **ILM (Index Lifecycle Management)** | Automates rollover, shrink, delete, etc.                   |
| **Templates**                        | Reusable blueprints for auto-creating future indexes       |
| **Analyzers / Tokenizers**           | Define how full-text fields get indexed/searchable         |
| **Rollover Alias**                   | Used in ILM to switch to a new index (e.g., `logs-000002`) |
| **Default Pipeline**                 | Attaches ingest pipeline to all writes by default          |


## Mappings

| Type                                   | Use For                     |
| -------------------------------------- | --------------------------- |
| `text`                                 | Full-text search (analyzed) |
| `keyword`                              | Exact match (not analyzed)  |
| `date`                                 | ISO8601 or timestamp fields |
| `long`, `double`, `boolean`, `integer` | You know these              |
| `object`, `nested`                     | Structured JSON             |


