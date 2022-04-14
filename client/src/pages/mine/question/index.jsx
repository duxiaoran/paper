
import {useState, useEffect} from 'react';
import { View, Text, Button, Picker, Input, Textarea, Checkbox, CheckboxGroup  } from '@tarojs/components'
import Taro,{useRouter} from '@tarojs/taro';
import { AtButton, AtIcon } from 'taro-ui';
import MyPicker from '../../../component/myPicker';
import MyInputNumber from '../../../component/myInputNumber';
import MyInput from '../../../component/myInput';
// import { useSelector, useDispatch } from "react-redux";

import styles from './index.module.less'

const questionType = ['单选', '多选' ]

export default () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [value, setValue] = useState({
    option: [],
    answer: [],
    score: 5,
    type: "0"
  });

  useEffect(()=>{
    const getValue = async ()=>{
      Taro.showLoading();
      const res = await Taro.cloud.callFunction({name: "question",data: {action: 'get', data: {_id: router.params._id} } });
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
    
    try {
      if(!value.type){
        throw new Error('题目类型必填');
      }
      if(!value.title){
        throw new Error('题目描述必填');
      }
      if(value.type === "0" && value.answer.length !== 1 ){
        throw new Error('单选答案必须选一项');
      }

      if(value.type === "1" && value.answer.length === 0 ){
        throw new Error('多选答案至少选一项');
      }

      if(value.option.includes('')){
        throw new Error('答案项必填');
      }
      
      Taro.showLoading();
      if(value._id){
        value.updatedTime = (new Date()).valueOf();
        const res = await Taro.cloud.callFunction({name: "question",data: {action: 'set', data:value } });
        if(res.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(res.errMsg);
        }
      }else{
        value.createdTime = (new Date()).valueOf();
        value.updatedTime = (new Date()).valueOf();
        value.openid = Taro.getStorageSync('userInfo')?.openid;
        value.paper_id = router.params.paper_id;
        const res = await Taro.cloud.callFunction({name: "question",data: {action: 'add', data:value } });
        if(res.errMsg !== 'cloud.callFunction:ok'){
          throw new Error(res.errMsg);
        }
      }
      Taro.hideLoading()
      Taro.navigateBack();
    } catch (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      Taro.hideLoading()
    }
  }

  const changeData = (key, val) => {
    value[key] = val;
    setValue({...value});
  }

  const add = () => {
    if(value.option){
      value.option.push('');
    }else{
      value.option = [''];
    }
    setValue({...value})
  }

  console.log(value, 7777);

  return (
    <View className={styles.question}>
        <MyPicker 
      title="题目类型"
      data={questionType}
      value={questionType[value.type]}
      onChange={e => changeData('type', e )}
      />
    
      <MyInputNumber
        title="试题分值"
        min={1}
        max={10}
        step={1}
        value={value.score}
        onChange={e => changeData('score', e)}
      />

      <MyInput 
        title="试题描述"
        type='text' value={value.title} onInput={e => changeData('title', e.detail.value)} placeholder='请输入试题描述'
      />

      <View className={styles.question_answer_title}>
        试题选项：
        <Text onClick={add}>
          <AtIcon  value='add-circle' size='20' ></AtIcon>
          添加
        </Text>
      </View>
      <View className={styles.question_answer}>
        <CheckboxGroup value={value} onChange={e => {value.answer = e.detail.value; setValue({...value})}}>
          {value.option?.map((n,i) => <View key={i} className={styles.question_answer_item}>
            <Checkbox  value={`${i}`} style={{marginRight: '10px'}} checked={value.answer.includes(`${i}`)} ></Checkbox>
            <View className={styles.question_answer_input}>
              <Input type='text' value={value.option[i]} onInput={e => {value.option[i] = e.detail.value; setValue({...value})}} placeholder='将会获取焦点' />
            </View>
            <View style={{marginLeft: '10px'}} >
              <AtIcon onClick={() => {value.option.splice(i,1); value.answer = []; setValue({...value})}} value='close-circle' size='20' ></AtIcon>
            </View>
          </View>)}
        </CheckboxGroup>
      </View>

      <AtButton type='primary' onClick={onSubmit}>提交</AtButton>

    </View>
  )
}
