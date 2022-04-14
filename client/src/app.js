import { Component } from 'react'
import Taro from '@tarojs/taro';
import { Provider,  } from 'react-redux'
import 'taro-ui/dist/style/index.scss';

import configStore from './store'

import './app.less'


const store = configStore();

class App extends Component {
  state = {}

  async componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }

    try {
      const res = await Taro.cloud.callFunction({name: "login",data: {}})
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      
      const userInfo = await Taro.cloud.database().collection('user').where({openid: res.result.openid}).get();
      if(userInfo.errMsg !== 'collection.get:ok'){
        throw new Error(userInfo.errMsg);
      }
      
      let data = {};
      if(userInfo.data.length === 0){
        data = {openid: res.result.openid, appid: res.result.appid, unionid: res.result.unionid};
        const resu = await Taro.cloud.callFunction({name: "user",data: {action: 'add', data } });
        if(resu.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(resu.errMsg);
        }
      }else{
        data = userInfo.data[0];
      }
      Taro.setStorageSync('userInfo', data)
    } catch (error) {
      Taro.showToast({title: error.message, icon: 'error'})
    }
  }


  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  render () {
    return(
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
     
  }
}

export default App
