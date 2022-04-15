
import {useState, useEffect} from 'react';
import { View, Image, Button } from '@tarojs/components'
import Taro, {usePullDownRefresh} from '@tarojs/taro';
import { AtList, AtListItem, AtSearchBar} from "taro-ui"
import { useSelector, useDispatch } from "react-redux";
import styles from './index.module.less'

export default () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(Taro.getStorageSync('userInfo') || {});

  useEffect(()=>{
    (async ()=>{
      const res = await Taro.cloud.callFunction({name: "category",data: {action: 'get' } });
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      dispatch({type: 'categroy.save', payload: {list: res.result.data}})
    })()
  },[])

  usePullDownRefresh(() => {
    setUserInfo(Taro.getStorageSync('userInfo'));
    Taro.stopPullDownRefresh();
  })

  const getInfo = async () => {
    if(!userInfo.avatarUrl){
      const res = await Taro.getUserProfile({desc: '登陆' });
      const data = {...userInfo, ...res.userInfo} ;
      await Taro.cloud.callFunction({name: "user",data: {action: 'set', data } });
      Taro.setStorageSync('userInfo', data);
      setUserInfo(data);
    }
  }
  
  const toPaperList = () => {
    Taro.navigateTo({url: '/pages/mine/paperlist/index'});
  }

  const toCategoryList = () => {
    Taro.navigateTo({url: '/pages/mine/categorylist/index'});
  }

  const toAnswerList = () => {
    Taro.navigateTo({url: '/pages/mine/answerlist/index'});
  }

  return (
    <View className={styles.mine}>
      {userInfo.avatarUrl ? 
        <View className={styles.mine_avatar_container}>
          <View>
            <Image mode='aspectFill' className={styles.mine_avatar} src={userInfo.avatarUrl} />
            <View>{userInfo.nickName}</View>
          </View>
        </View>:
        <View className={styles.mine_no_avatar}>
          <Button type='primary' size='mini' onClick={getInfo}>获取头像</Button>
        </View>}
      <AtList>
        <AtListItem title='科目管理' arrow='right' onClick={toCategoryList} />
        <AtListItem title='试卷管理' arrow='right' onClick={toPaperList} />
        <AtListItem title='我的考试' arrow='right' onClick={toAnswerList} />
      </AtList>

    </View>
  )
}
