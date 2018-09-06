import request from 'request'

const timeout = 3000

const httpGet = async (options = {}) => {
  options.timeout = options.timeout || timeout
  return new Promise((resolve, reject) => {
    request.get(options, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

const httpPost = async (options = {}) => {
  options.timeout = options.timeout || timeout
  return new Promise((resolve, reject) => {
    request.post(options, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export {
  httpGet,
  httpPost
}
