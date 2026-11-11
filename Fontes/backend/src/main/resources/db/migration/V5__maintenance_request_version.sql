ALTER TABLE maintenance_request
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
