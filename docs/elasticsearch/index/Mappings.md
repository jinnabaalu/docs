---
sidebar_position: 3
title: "Mappings"
---
# 🔍 Understanding Elasticsearch Mappings – From Defaults to Precision

### 🧠 What Are Mappings in Elasticsearch?

* Mappings in Elasticsearch are like schemas in traditional databases
* Without proper mappings, Elasticsearch has to guess the structure of your data

---

## 📂 Types of Mappings:

### ✅ **Dynamic Mapping**

Elasticsearch auto-creates fields as it sees them in data.

* **`dynamic: true`** → Add new fields to the mapping automatically (default behavior)
* **`dynamic: false`** → Ignore new fields silently — don’t add to mapping, don’t index them
* **`dynamic: strict`** → Throw an error if an unknown field appears (validates schema strictly)

### 🧱 **Explicit Mapping**

You manually define the field structure (types, rules, etc.).

---

## 🚦 TL;DR Mapping Modes

* `explicit mapping` = You planned your schema.
* `dynamic: true` = Schema is flexible.
* `dynamic: false` = Schema is fixed; ignore surprises.
* `dynamic: strict` = Schema is law; reject surprises.

---

## 🤖 Dynamic Mapping Without Explicit Definitions

If you just insert a document without creating an index or mapping:

```json
POST /users_dynamic_true/_doc/1
{
  "name": "Baalu",
  "email": "baalu@infra.io",
  "phone": "1234567890",
  "date_of_birth": "1992-05-04"
}
```

Elasticsearch will:

* Create the index on the fly
* Infer types: `name` → text, `email` → text+keyword, `phone` → text, `date_of_birth` → date

✅ **Totally dynamic**, no restrictions.

---

## ✍️ Explicit Mapping + `dynamic: true`

```json
PUT /users_dynamic_true_add_mappings_dynamic
{
  "mappings": {
    "dynamic": true,
    "properties": {
      "name": { "type": "text" },
      "email": { "type": "keyword" }
    }
  }
}
```

```json
POST /users_dynamic_true_add_mappings_dynamic/_doc/1
{
  "name": "Baalu",
  "email": "baalu@infra.io",
  "phone": "1234567890",
  "date_of_birth": "1992-05-04"
}
```

➡️ `phone` and `date_of_birth` will be auto-added to the mapping.
✅ **Explicit + Dynamic** = controlled schema with room to grow.

---

## 🟡 Explicit Mapping + `dynamic: false`

```json
PUT /users_dynamic_false_ignores_new_fields
{
  "mappings": {
    "dynamic": false,
    "properties": {
      "name": { "type": "text" },
      "email": { "type": "keyword" }
    }
  }
}
```

```json
POST /users_dynamic_false_ignores_new_fields/_doc/1
{
  "name": "Baalu",
  "email": "baalu@infra.io",
  "phone": "1234567890",
  "date_of_birth": "1992-05-04"
}
```

➡️ `phone` and `date_of_birth` are silently ignored (not indexed, not stored).
✅ **Good for strict ingestion without throwing errors.**

---

## ❌ Explicit Mapping + `dynamic: strict`

```json
PUT /users_dynamic_strics_error
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "name": { "type": "text" },
      "email": { "type": "keyword" }
    }
  }
}
```

```json
POST /users_dynamic_strics_error/_doc/1
{
  "name": "Baalu",
  "email": "baalu@infra.io",
  "phone": "1234567890",
  "date_of_birth": "1992-05-04"
}
```

❌ Error:

```json
"reason": "mapping set to strict, dynamic introduction of [phone] is not allowed"
```

✅ Use this if you want to **enforce a locked schema** like a SQL table.

---

## 🧾 Quick Reference Matrix

| Setup                | Auto-create fields? | Accept unknown fields? | Error on unknowns? | Indexed fields |
| -------------------- | ------------------- | ---------------------- | ------------------ | -------------- |
| No mapping (dynamic) | ✅ Yes               | ✅ Yes                  | ❌ No               | All            |
| Mapping + `true`     | ✅ Yes               | ✅ Yes                  | ❌ No               | All            |
| Mapping + `false`    | ❌ No                | ✅ Yes (ignored)        | ❌ No               | Only defined   |
| Mapping + `strict`   | ❌ No                | ❌ No                   | ✅ Yes              | Only defined   |

---

## 💡 Final Thought

If you care about schema validation or downstream search consistency, **don’t rely on default dynamic mapping**.

* Use `dynamic: strict` when data integrity matters
* Use `false` when flexibility isn’t needed
* Use `true` when bootstrapping or exploring

And yeah — never insert into `dynamic: strict` unless you’ve fully defined the fields. 😅

---