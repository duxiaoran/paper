const cloud = require('wx-server-sdk')

cloud.init({
  env: 'duxiaoran-9gsxayj41a7fd66c'
})

 const db = cloud.database();

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
    default: {
      return
    }
  }
}
const get = (data) => {
  if(data){
    return db.collection('paper').where(data).get();
  }
  return db.collection('paper').get()
}

const add = (data) => {
  return db.collection('paper').add({data})
}

const set = (data) => {
  const newData = {...data};
  delete newData._id
  return db.collection('paper').doc(data._id).set({
    data: newData
  })
}
