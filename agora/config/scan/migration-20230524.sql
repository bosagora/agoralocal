
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

drop table if exists validator_withdrawal;
create table validator_withdrawal
(
    withdrawalindex     int    not null,
    epoch               int    not null,
    slot                int    not null,
    validatorindex      int    not null,
    address             bytea  not null,
    amount              bigint not null,
    primary key (withdrawalindex)
);
create index idx_validator_withdrawal_withdrawalindex on validator_withdrawal (withdrawalindex);
create index idx_validator_withdrawal_epoch on validator_withdrawal (epoch);
create index idx_validator_withdrawal_slot on validator_withdrawal (slot);
create index idx_validator_withdrawal_validatorindex on validator_withdrawal (validatorindex);
create index idx_validator_withdrawal_address on validator_withdrawal (address);
create index idx_validator_withdrawal_amount on validator_withdrawal (amount);
