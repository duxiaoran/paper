
import {useEffect, useState} from 'react';
import { View, Text, Button } from '@tarojs/components'
import Taro, {useDidShow} from '@tarojs/taro';
import { AtList, AtListItem, AtFab } from 'taro-ui'
import styles from './index.module.less'

export default () => {
  const [list, setList] = useState([]);


  useDidShow(async () => {
    Taro.showLoading();      
    const res = await Taro.cloud.callFunction({name: "category",data: {action: 'get' } });
    setList(res.result.data);
    Taro.hideLoading()
  })



  const toDetail = (id) => {
    let url = '/pages/mine/category/index';
    if(id){
      url = url + `?id=${id}`;
    }
    Taro.navigateTo({url});
  }

  return (
    <View className={styles.categorylist}>
      <AtList>
        {list.map(n => <AtListItem onClick={()=> toDetail(n._id)} key={n._id} note={n.desc} title={n.name} arrow='right' />)}
      </AtList>
      <AtFab onClick={() => toDetail()} className={styles.categorylist_add}>
        <Text className='at-fab__icon at-icon at-icon-add'></Text>
      </AtFab>
      {/* <View onClick={() => toDetail()} className={styles.categorylist_add}>添 加</View> */}
    </View>
  )
}
