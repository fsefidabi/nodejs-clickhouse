# Node.js & ClickHouse

Simple Node.js module that connects to clickhouse database, using '@apla/clickhouse' package. You can insert bulk random rows directly to the table, or insert them using RabbitMQ message broker.

## Quick Start

 ```
git clone https://github.com/fsefidabi/nodejs-clickhouse.git

npm i
  ```

## Use

### Connect to clickhouse database

- Create new table `npm run table`
  
- Insert new random rows directly `npm run direct-insert`

- Insert new random rows using RabbitMQ `npm run rmq-insert`

- Drop / delete a table `npm run drop`

---

> Configuration options:
> 
> Table name: -t _my_table_ (default value: _devices_)
> 
> Batch size: --bs _1000_ (default value: _10000_)
