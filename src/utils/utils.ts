import { IncomingMessage } from "node:http";
import { URL } from "node:url";

function getURL (req: IncomingMessage): URL {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'example.com';
  return new URL(req.url || '/', `${proto}://${host}`);
}

export default {
  getURL
}
