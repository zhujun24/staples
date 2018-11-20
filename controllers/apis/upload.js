import fs from 'fs'
import formidable from 'formidable'
import md5File from 'md5-file'

const getTempFileInfo = (req) => {
  const p = new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.parse(req)
    form.on('end', function () {
      resolve({
        path: this.openedFiles[0].path,
        filename: this.openedFiles[0].name
      })
    })
  })
  return p
}

const getMd5FromFile = (dir) => {
  const p = new Promise((resolve) => {
    md5File(dir, (err, hash) => {
      resolve(err || hash)
    })
  })
  return p
}

const uploadHandler = async (ctx) => {
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Headers', 'X-Foo, X-Rnd, X-Requested-With, Content-Range, Content-Disposition')
    ctx.set('Access-Control-Allow-Methods', 'POST')
    ctx.body = ''
  } else {
    let fileInfo
    let msg
    let hash
    try {
      fileInfo = await getTempFileInfo(ctx.req)
      hash = await getMd5FromFile(fileInfo.path)
      let extension = fileInfo.filename.match(/\..+?$/)
      extension = extension ? extension[0] : ''
      fileInfo.filename = `${hash}${extension}`
      let newPath = `${fileInfo.path.replace(/\/upload_.+?$/, '/')}${fileInfo.filename}`
      fs.renameSync(fileInfo.path, newPath)
      fileInfo.path = newPath
    } catch (e) {
      msg = JSON.stringify(e)
    }

    let result
    if (msg) {
      result = { msg }
    } else {
      result = {
        hash,
        url: `/upload/${fileInfo.filename}`
      }
    }
    ctx.body = result
  }
}

export default uploadHandler
