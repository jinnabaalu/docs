---
sidebar_position: 9
---

# Edge N-grams for Autocomplete

## 🧠 What Are Edge N-grams?

> They split a word into pieces — starting **from the beginning** — so Elasticsearch can match partial inputs like autocomplete.

## 🎯 Simple Example

You type: `blu`  
Indexed word: `blueberry`  
Edge N-gram turns `blueberry` into:

```
b
bl
blu
blue
blueb
bluebe
...
blueberry
```

So when you type `blu`, Elasticsearch **matches** that.

## 🛠️ Minimal Working Config

Let’s do it step by step.

### 🔧 1. Create Index with Edge N-gram Analyzer

```json
PUT test_autocomplete
{
  "settings": {
    "analysis": {
      "filter": {
        "edge_ngram_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 10
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "edge_ngram_filter"
          ]
        },
        "autocomplete_search": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "autocomplete",
        "search_analyzer": "autocomplete_search"
      }
    }
  }
}
```

### 📥 2. Index a Few Docs

```json
POST test_autocomplete/_doc
{ "name": "blueberry" }

POST test_autocomplete/_doc
{ "name": "blackberry" }

POST test_autocomplete/_doc
{ "name": "blender" }
```

### 🔍 3. Search by Partial Term

```json
POST test_autocomplete/_search
{
  "query": {
    "match": {
      "name": "blu"
    }
  }
}
```

### ✅ Result:

It will return:
- `blueberry`
- `blender` (because it also has `blu` prefix)

## 💥 Summary

| You type | Matched |
|----------|---------|
| `b`      | all     |
| `bl`     | all     |
| `blu`    | `blueberry`, `blender` |
| `black`  | `blackberry` only |

## 🚀 Want to level it up?

Let me know if you want:
- Substring matching (not just start — like `erry` matching `blueberry`)
- Completion suggester alternative
- Typeahead with prefix filtering only
