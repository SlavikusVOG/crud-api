import type { IncomingMessage, ServerResponse } from "node:http";

import { db } from '../db/db.js';
import type { User } from '../types/user.types.js';
import utils from "../utils/utils.js";

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const method = req.method;
  const url = utils.getURL(req);
  const pathname = url.pathname;
  const pathnameParts = pathname.split('/');
  if (pathnameParts.length > 3) {
    res.writeHead(404);
    res.end('Not found')
  }
  switch(method) {
    case 'GET': {
      const users = db.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      break;
    }
    case 'POST': {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString();
      const data = JSON.parse(body);
      if ('username' in data && 'age' in data && 'hobbies' in data) {
        const user = db.create(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    }
    case 'DELETE': {
    }
  }
}

export default {
  handleRequest
}
