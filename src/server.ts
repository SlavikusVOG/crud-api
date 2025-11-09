import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import dotenv from 'dotenv';
import usersRoute from './routes/users.js';
import utils from './utils/utils.js';
import { constants } from './constants.js';

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

const server = createServer(async(req: IncomingMessage, res: ServerResponse) => {
  const url = utils.getURL(req);
  const pathname = url?.pathname;
  if (pathname.startsWith('/api/users')) {
    usersRoute.handleRequest(req, res);
  }
  res.end(constants.NOT_FOUND_MESSAGE);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
