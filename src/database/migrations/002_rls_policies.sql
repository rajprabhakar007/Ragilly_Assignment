ALTER TABLE users
ENABLE ROW LEVEL SECURITY;

ALTER TABLE accounts
ENABLE ROW LEVEL SECURITY;

ALTER TABLE transactions
ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_tenant_isolation
ON users
USING (
  tenant_id = current_setting('app.tenant_id')::uuid
);

CREATE POLICY accounts_tenant_isolation
ON accounts
USING (
  tenant_id = current_setting('app.tenant_id')::uuid
);

CREATE POLICY transactions_tenant_isolation
ON transactions
USING (
  tenant_id = current_setting('app.tenant_id')::uuid
);