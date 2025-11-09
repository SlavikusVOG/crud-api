import type { IncomingMessage, ServerResponse } from "node:http";

import { db } from '../db/db.js';
import utils from '../utils/utils.js';
import { constants } from '../constants.js';
import { validate } from 'uuid'

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const method = req.method;
  const url = utils.getURL(req);
  const pathname = url.pathname;
  const pathnameParts = pathname.split('/');
  if (pathnameParts.length > 4) {
    res.writeHead(404);
    res.end(constants.NOT_FOUND_MESSAGE);
  }
  try {
    switch(method) {
      case 'GET': {
        if (pathnameParts.length === 4) {
          const id = pathnameParts[3];
          const user = db.getUserById(id);
          if (!validate(id)) {
            res.writeHead(400);
            res.end(constants.INVALID_ID_MESSAGE);
          }
          if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
          }
          else {
            res.writeHead(404);
            res.end(constants.USER_NOT_FOUND_MESSAGE);
          }
        } else {
          const users = db.getAll();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(users));
        }
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
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(user));
        }
        else {
          res.writeHead(400);
          res.end(constants.NO_REQUIRED_FIELDS_MESSAGE);
        }
        break;
      }
      case 'DELETE': {
        if (pathnameParts.length === 4) {
          const id = pathnameParts[3];
          if (!validate(id)) {
            res.writeHead(400);
            res.end(constants.INVALID_ID_MESSAGE);
            break;
          }
          const deleteFlag = db.delete(id);
          if (deleteFlag) {
            res.writeHead(204);
            res.end();
          }
          else {
            res.writeHead(404);
            res.end(constants.USER_NOT_FOUND_MESSAGE);
          }
        }
        else {
          res.writeHead(404);
          res.end(constants.NOT_FOUND_MESSAGE);
        }
        break;
      }
      case 'PUT': {
        if (pathnameParts.length === 4) {
          const id = pathnameParts[3];
          if (!validate(id)) {
            res.writeHead(400);
            res.end(constants.INVALID_ID_MESSAGE);
            break;
          }
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const body = Buffer.concat(chunks).toString();
          const data = JSON.parse(body);
          const user = db.updateUser(id, data)
          if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
          }
          else {
            res.writeHead(404);
            res.end(constants.USER_NOT_FOUND_MESSAGE);
          }
        }
        else {
          res.writeHead(404);
          res.end(constants.NOT_FOUND_MESSAGE);
        }
        break;
      }
    }
  } catch(error) {
    console.error(error);
    if (res.headersSent) {
      console.log('headers already sent');
    }
    else {
      res.writeHead(500);
      res.end(constants.SERVER_ERROR_MESSAGE);
    }
  }
}

export default {
  handleRequest
}
