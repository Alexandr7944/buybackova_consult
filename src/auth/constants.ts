import * as fs from "node:fs";
import path from "node:path";

const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf8'));

export const jwtConstants = {
    secret: credentials.secret,
};
