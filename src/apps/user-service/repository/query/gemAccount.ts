export const CREATE_GEM_ACCOUNT_QUERY = `
    INSERT INTO gem_accounts
        (id, user_id, balance, created_at, updated_at)
    VALUES
        ($1, $2, $3, $4, $5)
`;
