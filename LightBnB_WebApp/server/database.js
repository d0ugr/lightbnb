const properties = require('./json/properties.json');
const { Pool } = require('pg');

const pool = new Pool({
  user:     'vagrant',
  password: '123',
  host:     'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query("SELECT * FROM users WHERE email = $1", [ email ])
    .then(res => res.rows[0])
    .catch(_err => null);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query("SELECT * FROM users WHERE id = $1", [ id ])
    .then(res => res.rows[0])
    .catch(_err => null);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query("INSERT INTO users (email, password, name) VALUES ($1, $2, $3)",
    [ user.email, '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u', user.name ])
    .then(res => res.rows)
    .catch(_err => null);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  return pool.query("SELECT * FROM properties " +
                    "JOIN reservations ON reservations.property_id = properties.id " +
                    "WHERE reservations.guest_id = $1 LIMIT $2", [ guestId, limit ])
    .then(res => res.rows)
    .catch(_err => null);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = "SELECT properties.*, AVG(property_reviews.rating) AS average_rating " +
                    "FROM properties " +
                    "JOIN property_reviews ON properties.id = property_id ";
  let whereString = "WHERE ";
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${whereString}properties.city LIKE $${queryParams.length} `;
    whereString = "AND ";
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${whereString}properties.owner_id = $${queryParams.length} `;
    whereString = "AND ";
  }
  if (options.minimum_price_per_night) {
    queryParams.push(Math.round(options.minimum_price_per_night * 100));
    queryString += `${whereString}properties.cost_per_night >= $${queryParams.length} `;
    whereString = "AND ";
  }
  if (options.maximum_price_per_night) {
    queryParams.push(Math.round(options.maximum_price_per_night * 100));
    queryString += `${whereString}properties.cost_per_night <= $${queryParams.length} `;
    whereString = "";
  }
  queryString += "GROUP BY properties.id ";
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += "ORDER BY cost_per_night, average_rating DESC " +
                 `LIMIT $${queryParams.length};`;
  return pool.query(queryString, queryParams)
    .then(res => {
      // console.log(res.rows);
      return res.rows;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
