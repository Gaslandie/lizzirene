CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(64) NOT NULL PRIMARY KEY,
  checksum CHAR(64) NOT NULL,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id CHAR(36) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  name VARCHAR(120) NOT NULL,
  phone_e164 VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(190) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  auth_version INT UNSIGNED NOT NULL DEFAULT 1,
  commune VARCHAR(80) NULL,
  quartier VARCHAR(120) NULL,
  address_landmark VARCHAR(255) NULL,
  privacy_accepted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL,
  INDEX idx_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  price_gnf BIGINT UNSIGNED NULL,
  price_mode VARCHAR(20) NOT NULL DEFAULT 'fixed',
  price_label VARCHAR(80) NULL,
  price_prefix VARCHAR(80) NULL,
  tag VARCHAR(80) NOT NULL,
  image_url VARCHAR(500) NULL,
  image_srcset TEXT NULL,
  image_sizes VARCHAR(500) NULL,
  image_alt VARCHAR(255) NULL,
  image_width INT UNSIGNED NULL,
  image_height INT UNSIGNED NULL,
  image_position VARCHAR(80) NULL,
  visual_variant VARCHAR(40) NULL,
  care_json JSON NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  availability VARCHAR(30) NOT NULL DEFAULT 'available',
  featured_home TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_public (status, category, availability, sort_order),
  INDEX idx_products_featured (featured_home, status, sort_order),
  CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(190) NULL,
  recipient_name VARCHAR(120) NULL,
  recipient_phone VARCHAR(20) NULL,
  delivery_mode VARCHAR(20) NOT NULL DEFAULT 'delivery',
  commune VARCHAR(80) NULL,
  quartier VARCHAR(120) NULL,
  address_landmark VARCHAR(255) NULL,
  desired_date DATE NULL,
  card_message VARCHAR(500) NULL,
  customer_note VARCHAR(1000) NULL,
  subtotal_gnf BIGINT UNSIGNED NOT NULL,
  price_adjustment_gnf BIGINT NOT NULL DEFAULT 0,
  adjustment_reason VARCHAR(500) NULL,
  delivery_fee_gnf BIGINT UNSIGNED NULL,
  total_gnf BIGINT UNSIGNED NOT NULL,
  total_is_minimum TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'awaiting_whatsapp',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
  public_token_hash CHAR(64) NOT NULL,
  claim_token_hash CHAR(64) NULL UNIQUE,
  claim_token_expires_at DATETIME NULL,
  idempotency_key_hash CHAR(64) NOT NULL UNIQUE,
  request_fingerprint CHAR(64) NOT NULL,
  whatsapp_opened_at DATETIME NULL,
  confirmed_at DATETIME NULL,
  delivered_at DATETIME NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_customer (user_id, created_at),
  INDEX idx_orders_phone (customer_phone, created_at),
  INDEX idx_orders_status (status, created_at),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_slug VARCHAR(160) NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  product_description VARCHAR(500) NULL,
  price_mode VARCHAR(20) NOT NULL,
  unit_price_gnf BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  line_total_gnf BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  event_type VARCHAR(50) NOT NULL,
  previous_status VARCHAR(30) NULL,
  new_status VARCHAR(30) NULL,
  message VARCHAR(1000) NULL,
  visible_to_customer TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_events_order (order_id, created_at),
  CONSTRAINT fk_order_events_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_events_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limits (
  action_name VARCHAR(64) NOT NULL,
  subject_hash CHAR(64) NOT NULL,
  window_started_at DATETIME NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (action_name, subject_hash),
  INDEX idx_rate_limits_window (window_started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_password_reset_user (user_id, expires_at),
  CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  action_name VARCHAR(80) NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id VARCHAR(80) NULL,
  ip_hash CHAR(64) NULL,
  metadata_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_user_id, created_at),
  INDEX idx_audit_entity (entity_type, entity_id, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
