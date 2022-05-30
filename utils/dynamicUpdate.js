const dynamicUpdate = (table, args, where) => {
  let query = `UPDATE ${table} SET `;
  const argss = [...args][0];
  const values = Object.values(argss);
  Object.keys(argss).forEach((key, index) => {
    if (key !== "id") {
      query += `${key} = $${index + 1} `;
    }

    if (index != 0 && index !== Object.keys(argss).length - 1) {
      query += `, `;
    }
  });
  query += where;
  return { query, values };
};

module.exports = dynamicUpdate;
