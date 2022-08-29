import * as fs from 'fs';
let getDevGitVersion = () => {
  let rev = fs.readFileSync(".git/HEAD").toString().trim();
  if (rev.indexOf(':') === -1) {
    return rev;
  } else {
    return fs.readFileSync(".git/" + rev.substring(5)).toString().trim();
  }
}


export default function handler(req, res) {
  res.status(200).json({ version: process.env.VERCEL ? process.env.VERCEL_GIT_COMMIT_SHA : getDevGitVersion() })
}
