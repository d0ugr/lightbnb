


DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
  id                  SERIAL       NOT NULL PRIMARY KEY,
  email               VARCHAR(255) NOT NULL,
  password            VARCHAR(255) NOT NULL,
  name                VARCHAR(255) NOT NULL
);

CREATE TABLE properties(
  id                  SERIAL       NOT NULL PRIMARY KEY,
  owner_id            INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title               VARCHAR(255) NOT NULL,
  description         TEXT         NOT NULL,
  thumbnail_photo_url TEXT,
  cover_photo_url     TEXT,
  cost_per_night      INTEGER      NOT NULL DEFAULT 0.00,
  parking_spaces      INTEGER      NOT NULL DEFAULT 1,
  number_of_bathrooms INTEGER      NOT NULL DEFAULT 1,
  number_of_bedrooms  INTEGER      NOT NULL DEFAULT 1,
  street              VARCHAR(255) NOT NULL,
  city                VARCHAR(255) NOT NULL,
  province            VARCHAR(255) NOT NULL,
  country             VARCHAR(255) NOT NULL,
  post_code           VARCHAR(255) NOT NULL,
  active              BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE reservations(
  id                  SERIAL       NOT NULL PRIMARY KEY,
  start_date          DATE         NOT NULL,
  end_date            DATE         NOT NULL,
  property_id         INTEGER      NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_id            INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE property_reviews(
  id                  SERIAL       NOT NULL PRIMARY KEY,
  guest_id            INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id         INTEGER      NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id      INTEGER      NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  rating              SMALLINT     NOT NULL DEFAULT 0,
  message             TEXT         NOT NULL
);



