-- Synapse — MySQL bootstrap (run as root / admin)
-- Usage:
--   mysql -u root -p < server/database/scripts/bootstrap.sql
-- Then set matching DB_USER / DB_PASSWORD in synapse/.env
--
-- Legacy installs used the database name pm_synapse. Keep DB_NAME=pm_synapse
-- in .env, or recreate/migrate data into `synapse`.

CREATE DATABASE IF NOT EXISTS synapse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Dedicated app user (change the password before production)
CREATE USER IF NOT EXISTS 'synapse'@'localhost' IDENTIFIED BY 'change-me-synapse-db-password';
CREATE USER IF NOT EXISTS 'synapse'@'%' IDENTIFIED BY 'change-me-synapse-db-password';

GRANT ALL PRIVILEGES ON synapse.* TO 'synapse'@'localhost';
GRANT ALL PRIVILEGES ON synapse.* TO 'synapse'@'%';

FLUSH PRIVILEGES;

-- Optional check:
-- SHOW GRANTS FOR 'synapse'@'localhost';
