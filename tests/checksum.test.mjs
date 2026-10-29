import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../js/checksum.js';
test('fallback checksum matches Node SHA-256 for empty, Unicode, block boundaries and evidence-sized payloads',()=>{
 for(const value of ['', 'abc','Penyu 🐢 · pemerhatian',...'x'.repeat(5).split('').map((_,i)=>'a'.repeat([55,56,63,64,65][i])),'x'.repeat(550000)]){
  const bytes=new TextEncoder().encode(value);assert.equal(sha256Hex(bytes),createHash('sha256').update(bytes).digest('hex'));
 }
});
