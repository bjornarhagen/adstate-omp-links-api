export const db = (connectionPool) => {
  return {
    select: (query) => {
      return new Promise((resolve, reject) => {
        try {
          connectionPool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query(query, function (err, result) {
              connection.release();
              if (err) throw err;

              resolve(result);
            });
          });
        } catch (error) {
          console.error("Error: " + error);
          connection.release();
          reject();
        }
      });
    },
  };
};
