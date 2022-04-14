
import {useState, useMemo} from 'react';
import { View, Button, RadioGroup, Label, Radio, CheckboxGroup, Checkbox, Text} from '@tarojs/components'
import Taro, { useRouter, useDidShow, useShareAppMessage} from '@tarojs/taro';
import {optionArr} from '../../../utils/config';
import styles from './index.module.less'


export default () => {
  const router = useRouter();
  const [paperInfo, setPaperInfo] = useState({});
  const [answer, setAnswer] = useState({value:{}, openid: router.params.openid, status: 1, paper_id: router.params.id});
  const [questionList, setQuestionList] = useState([]);

  useDidShow(async ()=>{
    try {
      Taro.showLoading({mask: true});
      const paperRes = await Taro.cloud.callFunction({name: "paper",data: {action: 'get',data: {_id: router.params.id} } });
      if(paperRes.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(paperRes.errMsg);
      }
      setPaperInfo(paperRes.result.data[0]);

      const answerRes = await Taro.cloud.callFunction({name: "answer",data: {action: 'get',data: {paper_id: router.params.id, openid: router.params.openid} } });
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
        {n.type === '0' && <RadioGroup  >
          {n.option.map((item, index) => {
            return (
              <View className={styles.paper_question_item_answer_item} key={index}>
                <Label for={index} key={index}>
                  <Radio value={index} disabled checked={answer.value[n._id]?.includes(`${index}`)}>{optionArr[index]}: {item}</Radio>
                </Label>
              </View>
            )
          })}
        </RadioGroup>}
        {n.type === '1' && <CheckboxGroup >
          {n.option.map((item, index) => {
            return (
              <View className={styles.paper_question_item_answer_item} key={index}>
                <Label for={index} key={index}>
                  <Checkbox value={index} disabled checked={answer.value[n._id]?.includes(`${index}`)}>{optionArr[index]}: {item}</Checkbox>
                </Label>
              </View>
            )
          })}
        </CheckboxGroup>}
        <View className={styles.paper_question_item_divider}></View>
        <View style={{display: 'flex', justifyContent: 'space-between'}}>
          <View>正常答案：{n.answer.map(n => optionArr[n]).join('，')}</View>
          <View>得分：<Text style={{color: 'red'}}>{n.answer.toString() === answer.value[n._id].toString() ? n.score : 0}分</Text></View>
        </View>
      </View>)}
      
    </View>
  )
}
