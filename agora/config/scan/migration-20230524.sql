alter table validator_balances_p
    add withdrawal bigint default 0 not null;

alter table validator_balances_p
    add total_balance bigint default 0 not null;

update validator_balances_p
set total_balance = balance + withdrawal;

alter table validator_balances_recent
    add withdrawal bigint default 0 not null;

alter table validator_balances_recent
    add total_balance bigint default 0 not null;

create index idx_validator_balances_recent_withdrawal
    on validator_balances_recent (withdrawal);

create index idx_validator_balances_recent_total_balance
    on validator_balances_recent (total_balance);

update validator_balances_recent
set total_balance = balance + withdrawal;

alter table validators
    add withdrawal bigint default 0 not null;

alter table validators
    add withdrawal1d bigint default 0 not null;

alter table validators
    add withdrawal7d bigint default 0 not null;

alter table validators
    add withdrawal31d bigint default 0 not null;

CREATE TABLE IF NOT EXISTS
    blocks_withdrawals
(
    block_slot      INT    NOT NULL,
    block_root      bytea  NOT NULL,
    withdrawalindex INT    NOT NULL,
    validatorindex  INT    NOT NULL,
    address         bytea  NOT NULL,
    amount          BIGINT NOT NULL,
    -- in GWei
    PRIMARY KEY (block_slot, block_root, withdrawalindex)
);

CREATE INDEX IF NOT EXISTS idx_blocks_withdrawals_recipient ON blocks_withdrawals (address);

CREATE INDEX IF NOT EXISTS idx_blocks_withdrawals_validatorindex ON blocks_withdrawals (validatorindex);

CREATE TABLE IF NOT EXISTS
    blocks_bls_change
(
    block_slot     INT   NOT NULL,
    block_root     bytea NOT NULL,
    validatorindex INT   NOT NULL,
    signature      bytea NOT NULL,
    pubkey         bytea NOT NULL,
    address        bytea NOT NULL,
    PRIMARY KEY (block_slot, block_root, validatorindex)
);

CREATE INDEX IF NOT EXISTS idx_blocks_bls_change_pubkey ON blocks_bls_change (pubkey);

CREATE INDEX IF NOT EXISTS idx_blocks_bls_change_address ON blocks_bls_change (address);
