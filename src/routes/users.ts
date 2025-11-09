import type { IncomingMessage, ServerResponse } from "node:http";

import { db } from '../db/db.js';
import type { User } from '../types/user.types.js';
import utils from "../utils/utils.js";

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const method = req.method;
  const url = utils.getURL(req);
  const pathname = url.pathname;
  switch(method) {
    case 'GET': {
      break;
    }
  }
}

export default {
  handleRequest
}
