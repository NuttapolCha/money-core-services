CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE gem_accounts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_gem_accounts_user_id on gem_accounts (user_id);

CREATE TABLE gem_transactions (
    id CHAR(36) PRIMARY KEY,
    type varchar(31) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE gem_ledger_entries (
    id CHAR(36) PRIMARY KEY,
    gem_transaction_id CHAR(36),
    gem_account_id CHAR(36),
    amount BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (gem_transaction_id) REFERENCES gem_transactions(id),
    FOREIGN KEY (gem_account_id) REFERENCES gem_accounts(id)
)

