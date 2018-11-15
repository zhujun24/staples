import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { generate } from 'generate-password'
import jsonwebtoken from 'jsonwebtoken'

let SECRET
const privateKeyPath = path.join(__dirname, '../private.key')
if (fs.existsSync(privateKeyPath)) {
  SECRET = fs.readFileSync(privateKeyPath, 'utf8')
} else {
  SECRET = generate({
    length: 32,
    numbers: true
  })
  fs.writeFileSync(privateKeyPath, SECRET)
}

const sleep = (timeout = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout)
  })
}

const encode = (str = '') => str.replace(/[^\u4e00-\u9fa5\w\-_]/g, s => encodeURIComponent(s))

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex')

const sha1 = (str, key) => crypto.createHmac('sha1', key).update(str).digest('hex')

const encodeToken = str => jsonwebtoken.sign(`${str}-${Date.now()}`, SECRET)
const decodeToken = token => {
  try {
    return jsonwebtoken.verify(token, SECRET)
  } catch (e) {
    return false
  }
}

export {
  encodeToken,
  decodeToken,
  sleep,
  md5,
  encode,
  sha1
}
