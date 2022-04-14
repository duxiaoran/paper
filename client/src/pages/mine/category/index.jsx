
import {useState, useEffect} from 'react';
import { View, Text, Button } from '@tarojs/components'
import Taro,{useRouter} from '@tarojs/taro';
import { AtForm, AtInput, AtButton, AtTextarea } from 'taro-ui';
import MyTextArea from '../../../component/myTextArea';
// import { useSelector, useDispatch } from "react-redux";

import styles from './index.module.less'

export default () => {
  const router = useRouter()
  const [value, setValue] = useState({});

  useEffect(()=>{
    const getValue = async ()=>{
      Taro.showLoading();
      const res = await Taro.cloud.callFunction({name: "category",data: {action: 'get', data: {_id: router.params.id} } });
      console.log(res, {id: router.params.id} ,9999988);
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      setValue(res.result.data[0]);
      Taro.hideLoading()
    };
    if(router.params.id){
      getValue();
    }
  },[router])

  const onSubmit = async () => {
    if(!value.name){
      Taro.showToast({title: '科目名称不能为空', icon: 'none'})
      return;
    }
    try {
      Taro.showLoading();
      if(value._id){
        const res = await Taro.cloud.callFunction({name: "category",data: {action: 'set', data:value } });
        if(res.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(res.errMsg);
        }
      }else{
        const res = await Taro.cloud.callFunction({name: "category",data: {action: 'add', data:value } });
        if(res.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(res.errMsg);
        }
      }
      Taro.hideLoading()
      Taro.navigateBack();
    } catch (error) {
      Taro.hideLoading()
    }
  }

  const changeData = (key, val) => {
    value[key] = val;
    setValue({...value});
  }
  
  return (
    <View className={styles.category}>
      <AtInput 
        name='value' 
        title='科目名称' 
        type='text' 
        placeholder='请输入科目名称' 
        value={value.name} 
        onChange={e => changeData('name', e)} 
      />
      <MyTextArea
        title='科目描述'
        value={value.desc}
        onChange={e => changeData('desc', e)} 
        maxLength={200}
        placeholder='你的问题是...'
      />

      <AtButton type='primary' className={styles.button} onClick={onSubmit}>提交</AtButton>

    </View>
  )
}
