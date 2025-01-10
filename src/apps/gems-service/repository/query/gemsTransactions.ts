export const CREATE_GEM_TRANSACTION_QUERY = `
    INSERT INTO gem_transactions
        (id, type, description, created_at)
    VALUES
        ($1, $2, $3, $4)
`;
