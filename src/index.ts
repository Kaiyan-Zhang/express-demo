import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express()

app.use(express.json()) //http://expressjs.com/en/api.html#req.body

const STORE = path.join(__dirname, '../store/store.json');

type IAny = Record<string, any>;

const stringify = (obj: IAny) => {
  return JSON.stringify(obj, null, 2)
}

const send = (res: IAny, obj: IAny) => {
  res.send(stringify(obj))
}

const getStore = (): IAny => {
  return JSON.parse(fs.readFileSync(STORE).toString())
}

app.get('/get', (_, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  send(res, getStore())
})

app.options('/set', (_, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Request-Method', 'POST')  //预检必须
  //首先，响应预检必须有这一条
  //其次，虽然Content-Type是简单header，但是我POST的方法的内容是JSON，所以它变成了不简单的header
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.send()
})

app.post('/set', ({ body }, res) => {
  res.set('Access-Control-Allow-Origin', '*') //哪怕预检通过，也要有这一条
  fs.writeFileSync(STORE, JSON.stringify(body, null, 2))
  res.send()
})

app.listen(3000);
