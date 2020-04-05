const { Pool } = require("pg");
const pool = new Pool({
  user:     "vagrant",
  password: "123",
  host:     "localhost",
  database: "lightbnb"
});

module.exports = {

  query: (sql, params, callback) => {
    const start = Date.now();
    if (typeof callback === "function") {
      return pool.query(sql, params, (err, res) => {
        const duration = Date.now() - start;
        console.log(`Executed query\n  ${sql}\n  ${duration}\n  rows: ${res.rowCount}`);
        callback(err, res);
      });
    } else {
      return pool.query(sql, params)
        .then((res) => {
          const duration = Date.now() - start;
          console.log(`Executed query\n  ${sql}\n  ${duration}\n  rows: ${res.rowCount}`);
          return res;
        }).catch((err) => {
          const duration = Date.now() - start;
          console.log(`Query failed\n  ${sql}\n  ${duration}\n  ERROR: ${err}`);
          return err;
        });
    }
  }

};
