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
    case 'updatePass': {
      return updatePass(event.data)
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

const updatePass = async (data) => {
  const info = await db.collection('paper').where({_id: data.paper_id}).get();

  if(info.data.length !== 1){
    return {errMsg: '无此试卷'};
  }

  const data1 = {...info.data[0]};
  if(data1.pass){
    data1.pass.push(data.openid);
  }else{
    data1.pass= [data.openid];
  }
  delete data1._id;

  return db.collection('paper').doc(info.data[0]._id).set({
    data: data1
  })
}

const set = (data) => {
  const newData = {...data};
  delete newData._id
  return db.collection('paper').doc(data._id).set({
    data: newData
  })
}
