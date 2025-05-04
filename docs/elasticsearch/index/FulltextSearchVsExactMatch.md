---
sidebar_position: 4
title: "Full-Text Search vs Exact Match in Elasticsearch"
---

# 🔍 Full-Text Search vs Exact Match in Elasticsearch — What You Actually Need to Know

In Elasticsearch, not all searches are built the same. Some fields are meant to be *searched* (`text`), others to be *matched* (`keyword`).

If you want both? Cool — just combine them.

This post breaks down full-text vs exact match search, how to use both in your mappings, and why mixing them smartly makes your data 🔥.

---

## 🤹 Two Types of Search — Two Different Purposes

| 🔧 Feature          | `text` (Full-text Search)            | `keyword` (Exact Match)          |
| ------------------- | ------------------------------------ | -------------------------------- |
| Analyzed            | ✅ Yes (tokenized, normalized)        | ❌ No (stored as-is)              |
| Use Case            | Search input like “ram” or “ayodhya” | Exact value like “Ram Ayodhya”   |
| Common Queries      | `match`, `multi_match`               | `term`, `terms`, `filter`, `agg` |
| Sorting/Aggregation | ❌ Not reliable                       | ✅ Perfect for both               |
| Field Type          | `text`                               | `keyword`                        |

---

## 🛠️ Mapping That Supports Both

```json
PUT user_fulltext_search_vs_exact_match
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",  // ✅ Full-text search
        "fields": {
          "keyword": {
            "type": "keyword",        // ✅ For exact match, sorting, aggregations
            "ignore_above": 256       // ⛘ Avoid storing massive strings
          }
        }
      },
      "email": {
        "type": "keyword"  // 🔐 Always keyword — we never full-text search emails
      },
      "description": {
        "type": "text",     // 📝 For long-form search content
        "analyzer": "standard"
      },
      "status": {
        "type": "keyword"  // 🟢 For filters: active/inactive/etc
      }
    }
  }
}
```

---

## 📅 Inserting Sample Records

Before you search, you need data. Here's how to index a few sample docs into this setup:

```json
POST user_fulltext_search_vs_exact_match/_bulk
{ "index": {} }
{ "name": "Ram Ayodhya", "email": "ram@ayodhya.in", "description": "Ram is the king of Ayodhya and hero of Ramayana.", "status": "active" }
{ "index": {} }
{ "name": "Shri Ram of Ayodhya", "email": "shri@ayodhya.in", "description": "Shri Ram ruled Ayodhya with Dharma.", "status": "active" }
{ "index": {} }
{ "name": "Rama", "email": "rama@ayodhya.in", "description": "Rama is another name of Ram.", "status": "inactive" }
```

---

## ⚡ Real-World Queries

### 🎯 Full-text match (tokenized)

```json
GET user_fulltext_search_vs_exact_match/_search
{
  "query": {
    "match": {
      "name": "ram"
    }
  }
}
```

🧠 **Why it works**: `text` is analyzed → "Ram Ayodhya" becomes \["ram", "ayodhya"] → hits!

---

### 🧲 Exact match (non-tokenized)

```json
GET user_fulltext_search_vs_exact_match/_search
{
  "query": {
    "term": {
      "name.keyword": "Ram Ayodhya"
    }
  }
}
```

---

### 📊 Aggregation on keyword field

```json
GET user_fulltext_search_vs_exact_match/_search
{
  "size": 0,
  "aggs": {
    "top_names": {
      "terms": {
        "field": "name.keyword"
      }
    }
  }
}
```

---

## 💖 When to Use What?

| Task                   | Field to Use      |
| ---------------------- | ----------------- |
| Search a sentence/name | `name`            |
| Filter exact values    | `name.keyword`    |
| Aggregate top values   | `name.keyword`    |
| Sort alphabetically    | `name.keyword`    |
| Match by email         | `email` (keyword) |

---

## 🤠 Pro Tips

* Use multi-fields (`text + keyword`) when a field needs to be both searchable and aggregatable.
* Don’t overuse keyword fields on long text — leads to memory bloat.
* Skip `.keyword` if you’ll never need to sort/filter that field.

---

## 🚀 Wrap-up

If you want fast filtering **and** fuzzy searching, combine `text` and `keyword` in your mapping.

This way, your app gets:

* 🧠 Smart search with `match`
* ⚡ Precise filters with `term`
* 📊 Clean aggregations with `keyword`

No trade-offs. Just better UX.

---
