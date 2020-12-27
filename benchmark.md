### Comparison between postgreSQL and ClickHouse performance
Various amounts of records have been inserted into [postgres](https://github.com/fsefidabi/nodejs-postgres.git) and clickhouse table, under the same conditions (total number of fields, data types, etc.).
Two different queries were tested at specific intervals to determine database efficiency. The following tables represent their execution time under different conditions.


**Query Conditions:**
- "launchCount" < 50
- "launchTime" between '2019-05-05' and '2019-05-07'
- "deviceModel" like 'Note%'
- "tags" contains 'male'

| Number of Rows | postgres (simple table) | postgres (indexed table) | clickhouse |
| :-------------: |:-------------:| :-----:|:-----:|
| 3 M | 0.680 s | 0.678 s | 0.138 s|
| 5 M | 1.131 s | 1.250 s | 0.194 s|
| 10 M | 83 s | 97 s | 0.314 s|
| 15 M | - | - | 0.602 s|
| 20 M | - | - | 0.719 s|

---

**Query Conditions:**
- "launchCount" = 137

| Number of Rows | postgres (simple table) | postgres (indexed table) | clickhouse |
| :-------------: |:-------------:| :-----:|:-----:|
| 10 M | 84 s | 62 s | 0.058 s|
| 15 M | - | - | 0.059 s|
| 20 M | - | - | 0.072 s|
