
alter table validator_balances_p
    add withdrawal bigint default 0 not null;

alter table validator_balances_p
    add total_balance bigint default 0 not null;

update validator_balances_p set total_balance = balance + withdrawal;

alter table validator_balances_recent
    add withdrawal bigint default 0 not null;

alter table validator_balances_recent
    add total_balance bigint default 0 not null;

create index idx_validator_balances_recent_withdrawal
    on validator_balances_recent (withdrawal);

create index idx_validator_balances_recent_total_balance
    on validator_balances_recent (total_balance);

update validator_balances_recent set total_balance = balance + withdrawal;

drop table if exists blocks_withdrawals;
create table blocks_withdrawals
(
    block_slot          int    not null,
    block_root          bytea  not null default '',
    withdrawalindex     int    not null,
    validatorindex      int    not null,
    address             bytea  not null,
    amount              bigint not null,
    primary key (block_slot, block_root, withdrawalindex)
);
create index idx_blocks_withdrawals_slot on blocks_withdrawals (block_slot);
create index idx_blocks_withdrawals_block_root on blocks_withdrawals (block_root);
create index idx_blocks_withdrawals_withdrawalindex on blocks_withdrawals (withdrawalindex);
create index idx_blocks_withdrawals_validatorindex on blocks_withdrawals (validatorindex);
create index idx_blocks_withdrawals_address on blocks_withdrawals (address);
create index idx_blocks_withdrawals_amount on blocks_withdrawals (amount);
