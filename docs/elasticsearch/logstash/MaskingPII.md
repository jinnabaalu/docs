

Masking Emails, Phone Numbers, and IPs in Logstash

PostgreSQL → Logstash (PII masking via mutate) → Elasticsearch.

```
id | name     | email              | ip_address     | action       | timestamp
---+----------+--------------------+----------------+--------------+-------------------
1  | Alice    | alice@gmail.com    | 192.168.1.101  | login        | 2025-05-08 10:00
2  | Bob      | bob@example.com    | 10.0.0.45      | update_email | 2025-05-08 10:10
```

## ⚙️ Logstash Pipeline

```conf
input {
  jdbc {
    jdbc_driver_class => "org.postgresql.Driver"
    jdbc_connection_string => "jdbc:postgresql://db:5432/myapp"
    jdbc_user => "user"
    jdbc_password => "password"
    schedule => "* * * * *"
    statement => "SELECT * FROM user_activity"
  }
}

filter {
  # Mask email
  mutate {
    gsub => [
      "email", ".*", "[REDACTED]",
      "name", ".*", "[REDACTED]",
      "ip_address", "\d+\.\d+\.\d+\.\d+", "[REDACTED]"
    ]
  }

  # Optional: create custom tags or normalize fields
  mutate {
    lowercase => [ "action" ]
  }
}

output {
  elasticsearch {
    hosts => ["https://elasticsearch:9200"]
    index => "user_activity"
    user => "elastic"
    password => "your_password"

    ssl => true
    cacert => "/usr/share/logstash/certs/ca.crt"
  }
}
```