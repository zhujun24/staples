import Crud from './crud'

let TestDB

let dbInit = async () => {
  [TestDB] = await Promise.all([
    Crud.get({
      host: '',
      db: 'test'
    })
  ])
}

export {
  dbInit,
  TestDB
}
