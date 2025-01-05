export const GET_USER = `
    SELECT 
        id,
        name,
        gems,
        created_at,
        updated_at
    FROM user
    WHERE id = $1
`;

export type GetUserQueryResult = {
  id: string;
  name: string;
  gems: number;
  created_at: Date;
  updated_at: Date;
};
