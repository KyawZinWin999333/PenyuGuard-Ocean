import './scripts/restore-video.mjs';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.json':'application/json','.mp4':'video/mp4'};
const args=process.argv.slice(2);
const option=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:null;};
const port=Number(option('--port')||process.env.PORT||5186);
const host=option('--host')||'127.0.0.1';
if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('Invalid server port');
createServer(async(req,res)=>{
 try {let url=new URL(req.url,'http://localhost');let path=decodeURIComponent(url.pathname);if(path==='/')path='/index.html';let file=resolve(root,'.'+path);if(file!==root&&!file.startsWith(root+sep))throw Object.assign(Error('Forbidden'),{status:403});const info=await stat(file);if(info.isDirectory())throw Object.assign(Error('Forbidden'),{status:403});if(extname(file)==='.mp4'){
 const base={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'};
 const range=req.headers.range;
 if(range){const match=/^bytes=(\d*)-(\d*)$/.exec(range);let start=match&&match[1]?Number(match[1]):0;let end=match&&match[2]?Number(match[2]):info.size-1;
 if(match&&!match[1]&&match[2]){start=Math.max(0,info.size-Number(match[2]));end=info.size-1;}
 if(!match||(!match[1]&&!match[2])||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=info.size){res.writeHead(416,{...base,'Content-Range':`bytes */${info.size}`});res.end();return;}
 end=Math.min(end,info.size-1);res.writeHead(206,{...base,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1});createReadStream(file,{start,end}).pipe(res);return;
 }
 res.writeHead(200,{...base,'Content-Length':info.size});createReadStream(file).pipe(res);return;
 }
 const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);
 }catch(err){res.writeHead(err.status||404,{'Content-Type':'text/plain; charset=utf-8'});res.end(err.status===403?'Forbidden':'Not found');}
}).listen(port,host,()=>console.log(`PenyuGuard is running at http://${host}:${port}/`));
