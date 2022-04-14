
import {useState, useEffect} from 'react';
import { View } from '@tarojs/components'
import Taro,{useRouter} from '@tarojs/taro';
import { AtInput, AtButton } from 'taro-ui'
import MyPicker from '../../../component/myPicker';
import MyTextArea from '../../../component/myTextArea';
// import { useSelector, useDispatch } from "react-redux";

import styles from './index.module.less'

export default () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [value, setValue] = useState({});

  useEffect(()=>{
    (async ()=>{
      const res = await Taro.cloud.callFunction({name: "category",data: {action: 'get' } });
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      setList(res.result.data);
    })()
  },[])

  useEffect(()=>{
    const getValue = async ()=>{
      Taro.showLoading();
      const res = await Taro.cloud.callFunction({name: "paper",data: {action: 'get', data: {_id: router.params._id} } });
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      setValue(res.result.data[0]);
      Taro.hideLoading()
    };
    if(router.params._id){
      getValue();
    }
  },[router])

  const onSubmit = async () => {
    if(!value.category_id){
      Taro.showToast({title: '科目不能为空', icon: 'none'});
      return;
    }

    if(!value.name){
      Taro.showToast({title: '试卷名称不能为空', icon: 'none'});
      return;
    }

    const userInfos = Taro.getStorageSync('userInfo');
    if(!userInfos.nickName){
      const res = await Taro.getUserProfile({desc: '登陆'});
      const userInfoData = await Taro.cloud.callFunction({name: "user",data: {action: 'get', data: {openid: userInfos.openid } } });
      const data = {...userInfoData.result.data[0], ...res.userInfo} ;
      await Taro.cloud.callFunction({name: "user",data: {action: 'set', data } });
      Taro.setStorageSync('userInfo', data);
    }
    try {
      Taro.showLoading();
      if(value._id){
        value.updatedTime = (new Date()).valueOf();
        const res = await Taro.cloud.callFunction({name: "paper",data: {action: 'set', data:value } });
        if(res.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(res.errMsg);
        }
      }else{
        value.createdTime = (new Date()).valueOf();
        value.updatedTime = (new Date()).valueOf();
        value.status = 1;
        value.openid = Taro.getStorageSync('userInfo')?.openid
        const res = await Taro.cloud.callFunction({name: "paper",data: {action: 'add', data:value } });
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
      <MyPicker 
        title='题目类型'
        data={list.map(n => n.name)} 
        value={list.find(n => n._id === value.category_id)?.name}
        onChange={e => changeData('category_id', list[e]._id)}
      />

      <AtInput 
        name='value' 
        title='试卷名称' 
        type='text'
        className={styles.category_input}
        placeholder='请输入科目名称' 
        value={value.name} 
        onChange={e => changeData('name', e)} 
      />
      <MyTextArea 
        title='试卷描述'
        value={value.desc}
        onChange={e => changeData('desc', e)} 
        maxLength={200}
        placeholder='你的问题是...'
      /> 
      <AtButton type='primary' className={styles.button} onClick={onSubmit}>提交</AtButton>
    </View>
  )
}
