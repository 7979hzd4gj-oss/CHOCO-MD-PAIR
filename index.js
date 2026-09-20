const express=require('express');
const {default:makeWASocket,useMultiFileAuthState,delay}=require('@whiskeysockets/baileys');
const pino=require('pino');
const fs=require('fs');
const app=express();
const PORT=process.env.PORT||3000;

app.get('/',(req,res)=>{
res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHOCO-MD V2</title><style>body{background:#07070f;color:#fff;font-family:sans-serif;text-align:center;padding:20px}.card{background:#151528;border:2px solid #7c3aed;border-radius:20px;padding:25px;max-width:380px;margin:20px auto;box-shadow:0 0 25px #7c3aed88}input{width:90%;padding:14px;border-radius:10px;border:1px solid #7c3aed;background:#0e0e1e;color:#fff;margin:15px 0}button{background:linear-gradient(90deg,#7c3aed,#3b82f6);color:#fff;padding:14px;border:none;border-radius:10px;width:95%;font-weight:bold}h1{color:#a78bfa}#code{font-size:28px;color:#22c55e;margin-top:15px;letter-spacing:2px;font-weight:bold}</style></head><body><h1>CHOCO-MD V2</h1><p>Pair Code Generator</p><div class="card"><input id="num" placeholder="224612345678 sans +"><button onclick="getCode()">Get Pair Code</button><div id="code"></div><p id="msg"></p></div><p style="opacity:.5;font-size:12px">Powered by CHOCO-MD V2 - 7979hzd4gj-oss</p><script>async function getCode(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');if(!n){alert('Entre ton numero');return}document.getElementById('msg').innerText='Patiente 10 secondes...';let r=await fetch('/pair?number='+n);let d=await r.json();if(d.code){document.getElementById('code').innerText=d.code;document.getElementById('msg').innerText='WhatsApp > Appareils lies > Lier avec code';}else document.getElementById('msg').innerText=d.error}</script></body></html>`);
});

app.get('/pair',async(req,res)=>{
let num=req.query.number;
if(!num) return res.json({error:'numero manquant'});
let dir='./session/'+num;
if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
let {state,saveCreds}=await useMultiFileAuthState(dir);
let sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["CHOCO-MD V2","Chrome","1.0"]});
sock.ev.on('creds.update',saveCreds);
if(!sock.authState.creds.registered){
await delay(3000);
try{let code=await sock.requestPairingCode(num);res.json({code});}catch(e){res.json({error:e.message});}
}else res.json({error:'Deja lie'});
});
app.listen(PORT,()=>console.log('CHOCO ON '+PORT));