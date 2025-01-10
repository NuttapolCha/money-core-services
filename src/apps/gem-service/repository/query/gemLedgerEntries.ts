export const CREATE_GEM_LEDGER_ENTIRES_QUERY = `
    INSERT INTO gem_ledger_entries
        (id, gem_transaction_id, gem_account_id, amount, created_at)
    VALUES
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10)
`;

export const GET_ENTRIES_BY_USER_ID_QUERY = `
    SELECT 
        COUNT(e.gem_transaction_id) OVER() as total,
        e.gem_transaction_id,
        e.amount,
        e.created_at 
    FROM gem_ledger_entries e
    JOIN gem_accounts a on e.gem_account_id = a.id
    WHERE a.user_id = $1
    ORDER BY e.created_at DESC
    LIMIT $2 OFFSET $3
`;

export type GetEntriesByUserIdQueryResult = {
  total: number;
  gem_transaction_id: string;
  amount: number;
  created_at: Date;
};
