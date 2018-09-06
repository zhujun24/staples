const crypto = require('crypto')

const sleep = (timeout = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout)
  })
}

let md5 = (str) => crypto.createHash('md5').update(str).digest('hex')

let sha1 = (str, key) => crypto.createHmac('sha1', key).update(str).digest('hex')

export {
  sleep,
  md5,
  sha1
}
