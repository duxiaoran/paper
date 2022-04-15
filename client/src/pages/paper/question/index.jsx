
import {useState, useMemo} from 'react';
import { View, Button, RadioGroup, Label, Radio, CheckboxGroup, Checkbox, Text} from '@tarojs/components'
import Taro, { useRouter, useDidShow, useShareAppMessage, useReady} from '@tarojs/taro';
import {optionArr} from '../../../utils/config';
import styles from './index.module.less'


export default () => {
  
  const router = useRouter();
  const [paperInfo, setPaperInfo] = useState({});
  const [answer, setAnswer] = useState({value:{}, status: 1, paper_id: router.params.id});
  const [questionList, setQuestionList] = useState([]);

  useShareAppMessage(()=>{
    return {
      title: '做作业了，小朋友！',
      // path: "/pages/home/index?scene=sharePaper&paper_id=" + router.params.id
    }
  })

  useDidShow(async ()=>{
    try {
      const res = await Taro.cloud.callFunction({name: "login",data: {}})
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }

      Taro.showLoading({mask: true});
      const paperRes = await Taro.cloud.callFunction({name: "paper",data: {action: 'get',data: {_id: router.params.id} } });
      if(paperRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(paperRes.errMsg);
      }
      setPaperInfo(paperRes.result.data[0]);

      const answerRes = await Taro.cloud.callFunction({name: "answer",data: {action: 'get',data: {paper_id: router.params.id, openid: res.result.openid} } });
      if(answerRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(answerRes.errMsg);
      }

      if(answerRes.result.data.length === 1){
        setAnswer(answerRes.result.data[0]);
      }
      
      const questionRes = await Taro.cloud.callFunction({name: "question",data: {action: 'get',data: {paper_id: router.params.id} } });
      if(questionRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(questionRes.errMsg);
      }
      setQuestionList(questionRes.result.data);

      Taro.hideLoading()
    } catch (error) {
      Taro.showToast({title: error.message, icon: 'none'})
      Taro.hideLoading()
    }
  })

  const changeValue = async (id, val) => {
    const userInfo = Taro.getStorageSync('userInfo');
    answer.value[id] = val.sort((a, b) => a - b);
    if(answer._id){
      const data = {...answer, updateTime: (new Date()).valueOf()};
      const questionRes = await Taro.cloud.callFunction({name: "answer",data: {action: 'set',data} });
      if(questionRes.errMsg !== 'cloud.callFunction:ok'){
        return;
      }
    }else{
      const data = {...answer, openid: userInfo.openid, updateTime: (new Date()).valueOf()};
      const questionRes = await Taro.cloud.callFunction({name: "answer",data: {action: 'add',data} });
      if(questionRes.errMsg !== 'cloud.callFunction:ok'){
        return;
      }
      answer._id = questionRes.result._id;
    }
  }

  const submit = async () => {

    let num = 0;
    let totalScore= 0;
    for(let i = 0; i< questionList.length; i++){
      if(!answer.value[questionList[i]._id] || answer.value[questionList[i]._id].length === 0){
        num += i;
        break;
      }
      if(answer.value[questionList[i]._id].toString() === questionList[i].answer.toString()){
        totalScore += questionList[i].score;
      }
    }
    if(num){
      Taro.showToast({title: `第${num +1}题还没有完成`, icon: 'none'});
      return;
    }
    const userInfo = Taro.getStorageSync('userInfo');
    if(!userInfo.avatarUrl){
      const res = await Taro.getUserProfile({desc: '登陆'});
      const data = {...userInfo, ...res.userInfo} ;
      await Taro.cloud.callFunction({name: "user",data: {action: 'set', data } });
      Taro.setStorageSync('userInfo', data);
    }
    try {
      Taro.showLoading({mask: true})
      const data = {...answer, status: 2, totalScore, fullScore: paperInfo.totalScore === totalScore, examTime: (new Date()).valueOf()};
      const answerRes = await Taro.cloud.callFunction({name: "answer",data: {action: 'set',data: data } });
      if(answerRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(answerRes.errMsg);
      }

      const paperPassRes = await Taro.cloud.callFunction({name: "paper",data: {action: 'updatePass',data: {openid: userInfo.openid, paper_id: router.params.id } } });
      if(paperPassRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(paperPassRes.errMsg);
      }
      Taro.hideLoading();
      Taro.showModal({
        title: '交卷成功',
        content: `考试成功：${totalScore}分`,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            Taro.reLaunch({
              url: '/pages/home/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({title: error.message, icon:'error'});
    }

  }

  return (
    <View className={styles.paper_question}>
      <View className={styles.paper_question_title}>
        {paperInfo.name}{paperInfo.totalScore && `(${paperInfo.totalScore}分)`}
        {answer.status === 2 && <Text className={styles.paper_question_title_status}>已交卷</Text>}
      </View>

      {questionList.map((n, i) =><View className={styles.paper_question_item} key={n._id}>
        <View className={styles.paper_question_item_question}>
          <View className={styles.paper_question_item_question_middle}>{i + 1}、{n.title}</View>
          <View>{n.score}分</View>
        </View>
        {n.type === '0' && <RadioGroup onChange={(e)=> changeValue(n._id, [e.detail.value])} >
          {n.option.map((item, index) => {
            return (
              <View className={styles.paper_question_item_answer_item} key={index}>
                <Label for={index} key={index}>
                  <Radio value={index} disabled={answer.status === 2} checked={answer.value[n._id]?.includes(`${index}`)}>{optionArr[index]}: {item}</Radio>
                </Label>
              </View>
            )
          })}
        </RadioGroup>}
        {n.type === '1' && <CheckboxGroup onChange={(e)=> changeValue(n._id, e.detail.value)} >
          {n.option.map((item, index) => {
            return (
              <View className={styles.paper_question_item_answer_item} key={index}>
                <Label for={index} key={index}>
                  <Checkbox value={index} disabled={answer.status === 2} checked={answer.value[n._id]?.includes(`${index}`)}>{optionArr[index]}: {item}</Checkbox>
                </Label>
              </View>
            )
          })}
        </CheckboxGroup>}
      </View>)}
      {questionList.length > 0 && answer.status !== 2 && <Button onClick={submit} style={{margin: '30px 10px'}} type="primary">提交</Button>}
    </View>
  )
}
