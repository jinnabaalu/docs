---
title:  "Structured and Unstructured Data"
description: Learn how to perform Create, Read, Update, and Delete operations with Elasticsearch using REST APIs in your local Docker setup.
sidebar_position: 9
"slug": "/ElasticStack/ExecuteCRUDOnElasticsearchAPI"
---
# 

## 🔍 Inverted Indexes: The Backbone of Search

### 🧠 What is an Inverted Index?

Forget the traditional row-column format. Inverted indexes flip the data structure:
Instead of **"document → list of words"**, you get **"word → list of documents"**.

💡 Real-World Analogy google search or wikipedia search.

### 🛠️ How Lucene Builds the Inverted Index
**Tokenization**: Break text into tokens using analyzers (like StandardAnalyzer).

**Normalization**: Lowercasing, stemming (e.g., "running" → "run").

**Term Dictionary**: A sorted list of unique terms.

**Posting List**: For each term, store:

Doc IDs

Term frequencies

Positions (for phrase queries)

Offsets (for highlighting)

🔄 Updates and Deletes
Lucene is immutable. Docs are marked deleted, and new segments are written. Later, segments merge.

- Inverted Indexes
  Lucene Index (How Indexing Works)
    - How inverted index works, detailsed explainaation 
- Types of Indexes 
- Types of data 
    - structured and unstructure
- Mappings 
  - mappings and without mappings indexes
  - template based index creation
  - enablle and diable analysis? 
  - cstomising for search performance
- Settings
  - explain about multiple settings of indexes. 


https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-indices