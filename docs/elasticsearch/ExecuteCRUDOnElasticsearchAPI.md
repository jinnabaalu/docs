---
title:  "✍️ CRUD Operations in Action"
description: Learn how to perform Create, Read, Update, and Delete operations with Elasticsearch using REST APIs in your local Docker setup.
sidebar_position: 3
"slug": "/ElasticStack/ExecuteCRUDOnElasticsearchAPI"
---
# ✍️ CRUD Operations in Action

#### Create Index

> **Without mappings:** Elasticsearch auto-generates field types when you index the first document (dynamic mapping).  
> **With mappings:** You define field types up front for better control (e.g., setting text vs keyword).

To create an index with mappings:

```bash
curl -X PUT http://localhost:9200/ramayana_characters -H "Content-Type: application/json" -d '
{
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "description": { "type": "text" }
    }
  }
}'
```
**OUTPUT**
```bash
{"acknowledged":true,"shards_acknowledged":true,"index":"ramayana_characters"}
```

##### Insert Document

```bash
curl -X POST http://localhost:9200/ramayana_characters/_doc -H "Content-Type: application/json" -d '
{
  "name": "Rama",
  "description": "Hero of the Ramayana, seventh avatar of Vishnu."
}'
```

**OUTPUT**
```bash
{"_index":"ramayana_characters","_id":"_g1qMpYBhtVSA9-yauE0","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"_seq_no":0,"_primary_term":1}
```

> 🔑 COPY ID FROM ABOVE OUTPUT "_id": "_g1qMpYBhtVSA9-yauE0" FOR NEXT QUERIES

##### 🔍 Query the Cluster - Select All

```bash
curl -X GET 'http://localhost:9200/ramayana_characters/_search?pretty'
```

**OUTPUT**
```bash
{
  "took" : 154,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "ramayana_characters",
        "_id" : "_g1qMpYBhtVSA9-yauE0",
        "_score" : 1.0,
        "_source" : {
          "name" : "Rama",
          "description" : "Hero of the Ramayana, seventh avatar of Vishnu."
        }
      }
    ]
  }
}
```

##### Select by ID
> Replace the ID from the previous OUTPUTS


```bash
export DOC_ID=_g1qMpYBhtVSA9-yauE0;
curl -X GET "http://localhost:9200/ramayana_characters/_doc/${DOC_ID}?pretty"
```

**OUTPUT**
```bash
{
  "_index" : "ramayana_characters",
  "_id" : "_g1qMpYBhtVSA9-yauE0",
  "_version" : 2,
  "_seq_no" : 1,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "name" : "Raama",
    "description" : "Hero of the Ramayana, seventh avatar of Vishnu."
  }
}
```

##### Update Document
```bash
curl -X POST "http://localhost:9200/ramayana_characters/_update/${DOC_ID}?pretty" -H "Content-Type: application/json" -d '
{
  "doc": {
    "name": "Raama"
  }
}'
```

**OUTPUT**
```bash
{
  "_index" : "ramayana_characters",
  "_id" : "_g1qMpYBhtVSA9-yauE0",
  "_version" : 2,
  "result" : "noop",
  "_shards" : {
    "total" : 0,
    "successful" : 0,
    "failed" : 0
  },
  "_seq_no" : 1,
  "_primary_term" : 1
}
```

Try the GET call again to see the updated value.

##### Delete Document

```bash
curl -X DELETE "http://localhost:9200/ramayana_characters/_doc/${DOC_ID}?pretty"
```

**OUTPUT**
```bash
{
  "_index" : "ramayana_characters",
  "_id" : "_g1qMpYBhtVSA9-yauE0",
  "_version" : 3,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 2,
  "_primary_term" : 1
}
```

## 🧠 Homework 

📥 **Create & Query**: Index documents, fetch them, and analyze the JSON response  
🧬 **Understand Mappings**: Play with auto-mapping vs custom mappings  
🟡 **Why Yellow?**: Dig into replica shards and discover why the cluster health may show as yellow

---

## ✅ Conclusion

With this container-based setup, you're empowered to launch a full Elasticsearch instance in seconds.  
Perfect for development, learning, or testing. REST APIs give you direct control and deep insights into how everything works under the hood.  
Welcome to your new search playground 🔍🚀