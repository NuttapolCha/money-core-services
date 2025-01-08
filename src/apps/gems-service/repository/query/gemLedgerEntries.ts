export const CREATE_GEM_LEDGER_ENTIRES = `
    INSERT INTO gem_ledger_entries
        (id, gem_transaction_id, gem_account_id, amount, created_at)
    VALUES
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10)
`;
