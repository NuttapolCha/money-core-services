export const CREATE_USER_QUERY = `
    INSERT INTO users
        (id, name, gems, created_at, updated_at)
    VALUES
        ($1, $2, $3, $4, $5)
`;
