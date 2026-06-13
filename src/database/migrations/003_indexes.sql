-- =========================================
-- TENANT INDEXES
-- =========================================

CREATE INDEX idx_users_tenant_id
ON users(tenant_id);

CREATE INDEX idx_accounts_tenant_id
ON accounts(tenant_id);

CREATE INDEX idx_transactions_tenant_id
ON transactions(tenant_id);

CREATE INDEX idx_audit_logs_tenant_id
ON audit_logs(tenant_id);

-- =========================================
-- TRANSACTION INDEXES
-- =========================================

CREATE INDEX idx_transactions_date
ON transactions(date);

CREATE INDEX idx_transactions_from_account
ON transactions(from_account_id);

CREATE INDEX idx_transactions_to_account
ON transactions(to_account_id);

-- =========================================
-- AUDIT LOG INDEXES
-- =========================================

CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at);

CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity);

CREATE INDEX idx_audit_logs_action
ON audit_logs(action);

-- =========================================
-- USER INDEXES
-- =========================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_role
ON users(role);