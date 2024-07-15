const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const srcPath = path.join(__dirname, '../../prisma/dev.db');
  const destPath = path.join('/tmp', 'dev.db');

  fs.copyFileSync(srcPath, destPath);

  return {
    statusCode: 200,
    body: 'Database copied successfully'
  };
};
