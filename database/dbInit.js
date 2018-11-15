import { DATABASE } from '../config'
import Crud from './crud'

let BlogDB

let dbInit = async () => {
  [BlogDB] = await Promise.all([
    Crud.get({
      host: '',
      db: DATABASE
    })
  ])
}

export {
  dbInit,
  BlogDB
}
