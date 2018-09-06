import { MongoClient, ReadPreference } from 'mongodb'

// ReadPreference eg:
// PRIMARY: 'primary',
// PRIMARY_PREFERRED: 'primaryPreferred',
// SECONDARY: 'secondary',
// SECONDARY_PREFERRED: 'secondaryPreferred',
// NEAREST: 'nearest'

// w eg:
// w == -1 ignore network errors
// w == 0 no write acknowledgement
// w == 1 perform a write acknowledgement
// w == 2 perform a write acknowledgement across primary and one secondary
// w == 'majority' perform a write acknowledgement across the majority of servers in the replicaset
// w == 'tag name' perform a write acknowledgement against the replicaset tag name

let connections = {}
class Mongo {
  static async get (config) {
    let host = config.host || '127.0.0.1:27017'
    let dbName = config.db || 'test'
    let w = config.w || 1 // 默认主库写入确认
    let readPreference = config.readPreference || ReadPreference.SECONDARY // 默认读操作全部走从库
    let key = `${host}/${dbName}`
    if (!connections[key]) {
      try {
        const client = await MongoClient.connect(`mongodb://${key}`, {
          useNewUrlParser: true,
          w,
          readPreference,
          poolSize: 100
        })
        connections[key] = client.db(dbName)
        console.log(`create new mongo connection for key ${key}`)
      } catch (err) {
        throw err
      }
    }
    return connections[key]
  }
}
export default Mongo
