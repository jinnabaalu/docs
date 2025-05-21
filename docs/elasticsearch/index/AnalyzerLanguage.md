---
sidebar_position: 11
---

# 🌍 Language-Specific Analyzers in Elasticsearch

When you're building search into an app that supports multiple languages, **Elasticsearch has your back**. It comes with built-in **language-specific analyzers** that know how to deal with the grammar, stop words, and word forms of different languages.

Let’s break down what they are, when to use them, and how to plug them into your index mappings.

---

## 🧠 What Are Language Analyzers?

Language analyzers are **prebuilt analyzers** tailored to specific languages. They handle:

- **Tokenization** (splitting text into words)
- **Lowercasing**
- **Stopword removal** (`the`, `is`, `a`, etc.)
- **Stemming** (`running` → `run`)
- Sometimes even **accent removal** or **compound word splitting**

---

## ✅ Supported Languages (Out of the Box)

| Language      | Analyzer Name   |
|---------------|------------------|
| English       | `english`        |
| French        | `french`         |
| German        | `german`         |
| Spanish       | `spanish`        |
| Hindi         | `hindi`          |
| Russian       | `russian`        |
| Italian       | `italian`        |
| Dutch         | `dutch`          |
| Portuguese    | `portuguese`     |
| Turkish       | `turkish`        |

[Full list in the Elasticsearch docs](https://www.elastic.co/docs/reference/text-analysis/analysis-lang-analyzer)

---

## 🔧 Example: Using the English Analyzer

```json
PUT blog_posts
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}
```

Now, if you index `"running is fun"` and search for `"run"`, Elasticsearch will **match it** — because the English analyzer reduces `"running"` to `"run"` using **stemming**.

---

## 🔍 Search Example

```json
POST blog_posts/_search
{
  "query": {
    "match": {
      "title": "run"
    }
  }
}
```

Returns results that include:
- `run`
- `running`
- `runs`
- `ran`

---

## 🧠 When to Use Language Analyzers

Use these when:

- You're indexing natural human language (blogs, articles, product descriptions)
- Your users search in a specific language
- You want smarter matching across word forms

---

## ❌ When NOT to Use

Avoid them when:

- You need **exact search** (e.g., tags, SKUs, emails) → use `keyword`
- You’re building **autocomplete** or **prefix-based** search → use `edge_ngram`
- You're working with code, logs, or other structured data

---

## 🎯 Summary

If you're indexing text meant for humans in a specific language, use Elasticsearch's language-specific analyzers to get smarter, more natural search behavior.
