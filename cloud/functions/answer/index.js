const cloud = require('wx-server-sdk')

cloud.init({
  env: 'duxiaoran-9gsxayj41a7fd66c'
})

const db = cloud.database();

const collection = 'answer';

exports.main = (event, context) => {
  switch (event.action) {
    case 'get': {
      return get(event.data)
    }
    case 'add': {
      return add(event.data)
    }
    case 'set': {
      return set(event.data)
    }
    case 'getAnswerList': {
      return getAnswerList(event.data)
    }
    default: {
      return
    }
  }
}
const get = (data) => {
  if(data){
    return db.collection(collection).where(data).get();
  }
  return db.collection(collection).get()
}

const add = (data) => {
  return db.collection(collection).add({data})
}

const set = (data) => {
  const newData = {...data};
  delete newData._id
  return db.collection(collection).doc(data._id).set({
    data: newData
  })
}

const getAnswerList = ({match = {}, sort = {examTime: -1}, skip = 0, limit = 100 } = {} ) => {
  return db.collection(collection).aggregate().match(match).sort(sort).skip(skip).limit(limit)
  .lookup({
    from: 'paper',
    localField: 'paper_id',
    foreignField: '_id',
    as: 'paperList',
  }).lookup({
    from: 'user',
    localField: 'openid',
    foreignField: 'openid',
    as: 'userList',
  }).end()
}