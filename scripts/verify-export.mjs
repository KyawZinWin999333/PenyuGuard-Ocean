import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
import {readFile} from 'node:fs/promises';
import {verifyReceipt} from '../js/accountability.js';
if(!process.argv[2]){console.error('Usage: node scripts/verify-export.mjs path-to-public-safe.json');process.exit(2);}
try{const receipt=JSON.parse(await readFile(process.argv[2],'utf8'));if(!await verifyReceipt(receipt))throw Error('Checksum mismatch or missing checksum');console.log('Checksum matches. Case '+receipt.id+'. This verifies file consistency only, not identity, authenticity or a real rescue.');}catch(e){console.error('Verification failed: '+e.message);process.exit(1);}
