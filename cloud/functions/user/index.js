const cloud = require('wx-server-sdk')

cloud.init({
  env: 'duxiaoran-9gsxayj41a7fd66c'
})

const db = cloud.database();
const collection = 'user';

exports.main = (event, context) => {
  switch (event.action) {
    case 'add': {
      return add(event.data)
    }
    case 'set': {
      return set(event.data)
    }
    case 'get': {
      return get(event.data)
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
