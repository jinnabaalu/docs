---
sidebar_position: 8
title: "Analyzers with DevTools"
date: 2025-05-04
description: "Hands-on with Elasticsearch analyzers using DevTools. Minimum theory, maximum commands."
tags: [elasticsearch, analyzer, devtools, tokenizer, observability]
---

## 🔍 What is an Analyzer?

In simple terms:
**Analyzer = Char Filter → Tokenizer → Token Filters**

It processes text during:

* **Indexing** (while storing data)
* **Searching** (while parsing query text)

Let’s get straight to the DevTools examples.

---

## 🧪 Test Default Analyzer

```json
GET _analyze
{
  "text": "The Quick Brown-Foxes' Jumped over the LAZY dog!"
}
```

---

## 🛠 Create Custom Analyzer

```json
PUT custom-analyzer-demo
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding"]
        }
      }
    }
  }
}
```

---

## 🔎 Test Custom Analyzer

```json
GET custom-analyzer-demo/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "<p>Déjà Vu & THE-MATRIX is Real!</p>"
}
```

---

## ⚙️ Analyzer Components

### ✅ Char Filter

```json
GET _analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "keyword",
  "text": "<h1>Hello & Welcome</h1>"
}
```

### ✅ Tokenizer

```json
GET _analyze
{
  "tokenizer": "whitespace",
  "text": "Quick-Brown Fox"
}
```

### ✅ Token Filters

```json
GET _analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase", "stop"],
  "text": "This is a test of the emergency broadcast system"
}
```

---

## 📘 Real Use Case: Logs Index

```json
PUT logs-demo
{
  "settings": {
    "analysis": {
      "analyzer": {
        "log_analyzer": {
          "type": "custom",
          "tokenizer": "pattern",
          "filter": ["lowercase"],
          "char_filter": []
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "message": {
        "type": "text",
        "analyzer": "log_analyzer"
      }
    }
  }
}
```

```json
POST logs-demo/_doc
{
  "message": "INFO - 2025-05-04 10:00:00 - Service STARTED by ADMIN"
}
```

```json
GET logs-demo/_search
{
  "query": {
    "match": {
      "message": "started"
    }
  }
}
```

---

## 📦 Built-in Analyzers

```json
GET _analyze
{
  "analyzer": "standard",
  "text": "The Matrix has you."
}
```

```json
GET _analyze
{
  "analyzer": "simple",
  "text": "The Matrix has you."
}
```

```json
GET _analyze
{
  "analyzer": "whitespace",
  "text": "The Matrix has you."
}
```

---

## 🧠 Wrap-up

* Use `GET _analyze` in DevTools to debug text processing
* Build custom analyzers when the defaults don’t cut it
* Understand how analyzers clean, split, and normalize your data

---

## 🔗 Up Next

We’ll explore:

* Synonyms
* Edge N-grams for autocomplete
* Language-specific analyzers

Stay tuned 👇
