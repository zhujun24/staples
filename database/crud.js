import _ from 'lodash'
import Mongo from './mongo'
import logger from '../utils/logger'

const initDoc = (doc) => {
  let now = Date.now()
  doc._create_time = now
  doc._modify_time = now
}

export default class Crud {
  constructor (config) {
    this.db = config.db
    this.mongo = config.mongo
  }

  static async get (config) {
    config.mongo = await Mongo.get(config)
    return new this(config)
  }

  async findOne (opt) {
    opt = opt || {}
    let query = opt.query || {}
    let options = opt.options || {}
    let collection = this.mongo.collection(opt.collection)
    logger.info(`findOne in collection ${opt.collection} by query ${JSON.stringify(query).slice(0, 200)}`)
    let result = await collection.findOne(query, options)
    return result
  }

  async find (opt) {
    opt = opt || {}
    let query = opt.query || {}
    let options = opt.options || {}
    let sort = opt.sort
    let collection = this.mongo.collection(opt.collection)
    let results
    if (sort) {
      results = await collection.find(query, options).sort(sort).toArray()
    } else {
      results = await collection.find(query, options).toArray()
    }
    logger.info(`find in collection ${opt.collection} by query ${JSON.stringify(query).slice(0, 200)} sort ${sort ? JSON.stringify(sort) : '{}'} skip ${options.skip || 0} limit ${options.limit}`)
    return results
  }

  // insert options有一个ordered参数，默认为true
  // 为true时表示插入多个记录时按顺序插入，任意doc出错时，后续数据都不再插入
  // 为false时表示互不影响
  async insert (opt) {
    let docs = opt.docs
    let options = opt.options || {}
    if (docs.length === 1) {
      docs = docs[0]
    }
    if (Array.isArray(docs)) {
      docs.forEach((doc) => {
        initDoc(doc)
      })
    } else {
      initDoc(docs)
    }
    let collection = this.mongo.collection(opt.collection)
    // insert插入多个文档时只要一个失败时就抛出error, 其他插入的处理结果会丢失
    // 但如果传了callback就可以既拿到exception又拿到处理结果
    let result = await new Promise((resolve, reject) => {
      collection.insert(docs, options, (err, r) => resolve({ r, err }))
    })
    if (result.err) {
      let error = result.err
      error.data = result.r
      throw error
    }
    result = result.r

    if (Array.isArray(docs)) {
      result = result.ops
    } else {
      result = result.ops[0]
    }
    logger.info(`insert in collection ${opt.collection}`)
    return result
  }

  async update (opt) {
    let query = opt.query || {}
    let docs = opt.docs || {}
    let options = opt.options || {}
    let collection = this.mongo.collection(opt.collection)
    if (_.some(_.keys(docs), v => v.match(/^\$/))) {
      // 如果是$set, $pushAll, $unset等类型的
      docs.$set = docs.$set || {}
      docs.$set._modify_time = Date.now()
    } else {
      // 否则传的是整个文档
      docs._modify_time = Date.now()
    }
    let result = await collection.findAndModify(query, [
      ['_id', 1]
    ], docs, options)
    logger.info(`update in collection ${opt.collection} by query ${JSON.stringify(query).slice(0, 200)}, $set ${JSON.stringify(docs.$set)}`)
    // 返回修改前的对象
    // 若为upsert模式，返回空对象{}
    // 否则update模式下，有记录则返回旧记录，无记录返回null
    return result.value
  }

  async updates (opt) {
    let query = opt.query || {}
    let docs = opt.docs || {}
    let options = opt.options || {}
    let collection = this.mongo.collection(opt.collection)
    // 批量更新
    options.multi = true
    docs.$set = docs.$set || {}
    docs.$set._modify_time = Date.now()
    logger.info(`updates in collection ${opt.collection} by query ${JSON.stringify(query).slice(0, 200)}`)
    let result = await collection.update(query, docs, options)
    return result
  }

  async remove (opt) {
    let query = opt.query || {}
    let collection = this.mongo.collection(opt.collection)
    let result = await collection.remove(query)
    // TODO 检查result.result是否正确
    return result.result
  }

  async count (opt) {
    let query = opt.query || {}
    let collection = this.mongo.collection(opt.collection)
    let result = await collection.count(query)
    return result
  }

  async changeDB (opt) {
    this.mongo = this.mongo.db(opt)
  }
}
