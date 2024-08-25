import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.NEON_CONNECTION_STRING!}`);

export default sql;
