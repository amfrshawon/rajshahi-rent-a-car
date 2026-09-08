-- Run once in phpMyAdmin against the database created in cPanel.
CREATE TABLE IF NOT EXISTS bookings (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name          VARCHAR(120)    NOT NULL,
  phone         VARCHAR(40)     NOT NULL,
  vehicle       VARCHAR(80)         NULL,
  trip_date     DATE                NULL,
  destination   VARCHAR(200)        NULL,
  notes         TEXT                NULL,
  locale        CHAR(2)         NOT NULL DEFAULT 'bn',
  -- Kept for abuse investigation only; see docs/DEPLOY.md on retention.
  ip            VARBINARY(16)       NULL,
  user_agent    VARCHAR(255)        NULL,
  PRIMARY KEY (id),
  KEY idx_created_at (created_at),
  KEY idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
