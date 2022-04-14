
import {useState, useMemo} from 'react';
import { View, Text } from '@tarojs/components'
import Taro, {useRouter, useDidShow} from '@tarojs/taro';
import { AtCard, AtCheckbox, AtFab} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import styles from './index.module.less'

export default () => {
  const router = useRouter();
  const [info, setInfo] = useState({});
  const [questionList, setQuestionList] = useState([]);

  const totalScore = useMemo(()=>{
    return questionList.reduce((num,n)=> num += n.score,0)
  },[questionList])

  useDidShow(async ()=>{
    try {
      Taro.showLoading();
      const infoData  = await Taro.cloud.callFunction({name: "paper",data: {action: 'get',data: {_id: router.params.id } }});
      if(infoData.errMsg !== 'cloud.callFunction:ok' || infoData.result.data.length !== 1){
        throw new Error(infoData.errMsg);
      }
      setInfo(infoData.result.data[0] || {});

      const questionData  = await Taro.cloud.callFunction({name: "question",data: {action: 'get',data: {paper_id: infoData.result.data[0]._id } }});
      if(questionData.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(questionData.errMsg);
      }
      setQuestionList(questionData.result.data);
      Taro.hideLoading()
    } catch (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      Taro.hideLoading()
    }
  })

  const toEdit = (id) => {
    let url = `/pages/mine/question/index?paper_id=${info._id}`;
    if(id){
      url = url + `&_id=${id}`;
    }
    Taro.navigateTo({url});
  }

  const toEditPaper = (_id) => {
    Taro.navigateTo({url: `/pages/mine/paperEdit/index?_id=${_id}`});
  }

  const toPush = () => {
    if(questionList.length === 0){
      Taro.showToast({title: '请先添加试题', icon: 'none'});
      return;
    }
    Taro.showModal({
      title: '发布试卷',
      content: '试卷发布之后不可更改',
      async success (res) {
        if (res.confirm) {
          const questionData  = await Taro.cloud.callFunction({name: "paper",data: {action: 'set',data: {...info, totalScore, status: 2, publishTime: (new Date().valueOf()) } }});
          if(questionData.errMsg === 'cloud.callFunction:ok'){
            Taro.showToast('发布成功');
            Taro.navigateBack();
          }else{
            Taro.showToast({title: '发布失败', icon: 'none'});
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

  return (
    <View className={styles.paperDetal}>
      <View className={styles.paperDetal_header}>
        <View className={styles.paperDetal_header_title}>{info.name}({totalScore}分)</View>
        <View className={styles.paperDetal_header_desc} onClick={() => toEditPaper(info._id)}>{info.desc}</View>
        <View className={styles.paperDetal_header_tollbar}>
  
          <Text onClick={() => toPush(info._id)} style={{color: '#07c160'}}>发布</Text>
          <Text onClick={() => toEditPaper(info._id)} style={{color: '#1890ff', marginLeft: '20px'}}>编辑</Text>

        </View>
      </View>
      
      {questionList.map(n => <AtCard
        note={`分值：${n.score}分`}
        key={n._id}
        extra='详情'
        extraStyle={{color: '#0bb855'}}
        title={n.title}
        onClick={()=> toEdit(n._id)}
        className={styles.paperDetal_AtCheckbox}
        thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
      >
        <AtCheckbox
          options={n.option.map((w, i) => ({label: w, value: `${i}`}))}
          selectedList={n.answer}
        />
      </AtCard>)}
      <AtFab onClick={()=> toEdit()} className={styles.paperDetal_add}>
        <Text className='at-fab__icon at-icon at-icon-add'></Text>
      </AtFab>
    </View>
  )
}
