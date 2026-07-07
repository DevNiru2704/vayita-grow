-- ==========================================================================
-- Vayita Grow — 0003 INDEXES
-- Every index declared in DBML v1.2.0 plus the search/status/FK indexes the
-- DB-design doc calls out for dashboard performance and N+1 avoidance.
-- Primary keys are already indexed by PostgreSQL; UNIQUE columns too.
-- ==========================================================================

-- Users & access
CREATE INDEX idx_users_role_id            ON users(role_id);
CREATE INDEX idx_login_history_user_id    ON login_history(user_id);
CREATE INDEX idx_login_history_login_time ON login_history(login_time);
CREATE INDEX idx_blacklist_user_id        ON user_token_blacklist(user_id);
CREATE INDEX idx_blacklist_token_jti      ON user_token_blacklist(token_jti);
CREATE INDEX idx_blacklist_expires_at     ON user_token_blacklist(expires_at);

-- Customers
CREATE INDEX idx_customer_notes_customer_id ON customer_notes(customer_id);

-- Products & categories
CREATE INDEX idx_products_category_id     ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Inventory & suppliers
CREATE INDEX idx_inventory_product_id     ON inventory(product_id);
CREATE INDEX idx_inventory_supplier_id    ON inventory(supplier_id);
CREATE INDEX idx_inventory_logs_inventory_id ON inventory_logs(inventory_id);
CREATE INDEX idx_inventory_logs_user_id   ON inventory_logs(user_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at);

-- Orders & payments
CREATE INDEX idx_orders_customer_id       ON orders(customer_id);
CREATE INDEX idx_orders_status            ON orders(status);
CREATE INDEX idx_orders_created_by        ON orders(created_by);
CREATE INDEX idx_order_items_order_id     ON order_items(order_id);
CREATE INDEX idx_order_items_product_id   ON order_items(product_id);
CREATE INDEX idx_payments_order_id        ON payments(order_id);
CREATE INDEX idx_payments_status          ON payments(payment_status);

-- Deliveries
CREATE INDEX idx_deliveries_order_id      ON deliveries(order_id);
CREATE INDEX idx_deliveries_status        ON deliveries(status);
CREATE INDEX idx_deliveries_tracking_num  ON deliveries(tracking_num);
CREATE INDEX idx_delivery_updates_delivery_id ON delivery_updates(delivery_id);

-- Feedback & auditing
CREATE INDEX idx_feedback_user_id         ON feedback(user_id);
CREATE INDEX idx_feedback_status          ON feedback(status);
CREATE INDEX idx_activity_logs_user_id    ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
