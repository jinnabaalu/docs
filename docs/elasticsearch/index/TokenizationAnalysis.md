---
sidebar_position: 7
title: "Tokenization & Text Analysis"
---

# Tokenization and Text Analysis in Elasticsearch

Before Elasticsearch builds an inverted index, it needs to break down the input text into meaningful chunks called **tokens**. This process is called **analysis**, and it includes tokenization, lowercasing, filtering, and more.

This blog shows how raw text becomes searchable through analysis.

---

## Step 1: Tokenization

Elasticsearch splits your text into tokens—usually words. This helps it treat individual terms as searchable units.

### Example:

Input:  
`"Elasticsearch is blazing fast and scalable."`

Output Tokens:  
`["Elasticsearch", "is", "blazing", "fast", "and", "scalable"]`

---

## Step 2: Lowercasing and Stop Words

Elasticsearch **lowercases** tokens so that `Fast` and `fast` are the same.  
It also removes **stop words** like `is`, `and`, `the`, depending on the analyzer.

### After Cleanup:

Tokens:  
`["elasticsearch", "blazing", "fast", "scalable"]`

---

## Token Filters: Power Moves

| 🔧 Feature        | Example Word                        | Result                                  |
| ----------------- | ----------------------------------- | --------------------------------------- |
| **Lowercasing**   | `Elasticsearch`                     | → `elasticsearch`                       |
| **Punctuation**   | `full-text`                         | → `full`, `text`                        |
| **Stopword**      | `is`, `and`, `the`                  | Removed (if configured)                 |
| **Stemming**      | `indexing` → `index`                | Needs stemmer filter in custom analyzer |
| **Synonyms**      | `fast = quick`                      | Needs synonym filter to expand terms    |
| **Edge N-Gram**   | `search` → `s`, `se`, `sea`...      | For autocomplete                        |
| **Token Filters** | `scalable` → remove if in blacklist | Use stop filter                         |

---

## Choosing the Right Tokenizer

| Use Case                         | Best Tokenizer          |
| -------------------------------- | ----------------------- |
| Free text (articles, blog posts) | `standard`              |
| Tags, exact keywords, IPs        | `keyword`               |
| Custom structured logs           | `pattern`, `whitespace` |
| Paths, file trees                | `path_hierarchy`        |
| URLs/emails                      | `uax_url_email`         |
| Autocomplete                     | `edge_ngram`, `ngram`   |
| Source code, identifiers         | `whitespace`, `keyword` |

---

## Anatomy of an Analyzer

An **analyzer** = `tokenizer` + `zero or more filters`.

You can use built-in ones (`standard`, `whitespace`, etc.) or create your own custom analyzer.

---

## Recap

- **Tokenization** breaks text into searchable parts.
- **Filters** clean and modify tokens (like lowercasing or stemming).
- **Analyzers** control how Elasticsearch processes your data for indexing.

Before your data ever hits the inverted index, analysis makes sure it's clean, consistent, and optimized for search.

---

🚀 Next, we’ll explore how to use custom analyzers in your Elasticsearch mappings!
