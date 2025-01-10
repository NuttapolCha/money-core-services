export const CREATE_USER_QUERY = `
    INSERT INTO users
        (id, username, created_at, updated_at)
    VALUES
        ($1, $2, $3, $4)
`;

export const GET_USER_QUERY = `
    SELECT
        id,
        username,
        created_at,
        updated_at
    FROM users
    WHERE id = $1
`;

export type GetUserQueryResult = {
  id: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};
