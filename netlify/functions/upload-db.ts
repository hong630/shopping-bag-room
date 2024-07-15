import { Handler } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

export const handler: Handler = async (event, context) => {
  const srcPath = path.join('/tmp', 'dev.db');
  const destPath = path.resolve(__dirname, '../../prisma/dev.db');

  fs.copyFileSync(srcPath, destPath);

  return {
    statusCode: 200,
    body: 'Database copied back successfully'
  };
};
