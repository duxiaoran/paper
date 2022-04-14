
import {useState, useMemo} from 'react';
import { View, Button, RadioGroup, Label, Radio, CheckboxGroup, Checkbox, Text} from '@tarojs/components'
import Taro, { useRouter, useDidShow, useShareAppMessage} from '@tarojs/taro';
import styles from './index.module.less'


export default () => {

  useDidShow(async ()=>{
    try {
      Taro.showLoading({mask: true});
     

      Taro.hideLoading()
    } catch (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      Taro.hideLoading()
    }
  })

  return (
    <View className={styles.paper_question}>
      123
    </View>
  )
}
