-- ==========================================================================
-- Vayita Grow — 0004 TRIGGERS (data retention)
-- Automated 30-day rolling purge for the high-frequency activity_logs table,
-- exactly as specified in docs/project_details/vayita-grow-dbdesign.md
-- ("Data Retention Policy — SQL Trigger Cleanup").
-- ==========================================================================

-- 1. Rolling cleanup function: purges activity entries older than 30 days.
CREATE OR REPLACE FUNCTION purge_old_activity_logs()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '30 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Fire once per INSERT statement (not per row) to keep overhead minimal.
CREATE TRIGGER trg_purge_activity_logs
AFTER INSERT ON activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION purge_old_activity_logs();

-- Keep the token blacklist from growing unbounded: prune expired ids whenever
-- a new one is inserted (a revoked token past its natural expiry is harmless).
CREATE OR REPLACE FUNCTION purge_expired_blacklist()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_token_blacklist WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_purge_blacklist
AFTER INSERT ON user_token_blacklist
FOR EACH STATEMENT
EXECUTE FUNCTION purge_expired_blacklist();
