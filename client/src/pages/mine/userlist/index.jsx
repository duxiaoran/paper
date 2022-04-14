
import {useState, useEffect} from 'react';
import { View, Text, Button } from '@tarojs/components'
import Taro, {showLoading, hideLoading, useDidShow, useRouter} from '@tarojs/taro';
import { AtSegmentedControl, AtAvatar} from 'taro-ui'
// import {useSelector} from 'react-redux';
import time from '../../../utils/utils';
import styles from './index.module.less'

export default () => {
  const router = useRouter();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState([]);

  useDidShow(()=>{
    getPaperList();
  })

  const getPaperList = async ()=>{
    try {
      showLoading();
      const res = await Taro.cloud.callFunction({name: "answer",data: {action: 'getAnswerList',data: { match: {paper_id: router.params.paper_id}} } });
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      setData(res.result.list);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const toDetail = (info) => {
    Taro.navigateTo({url: `/pages/mine/questionlist/index?id=${info.paperList[0]?._id}&openid=${info.userList[0]?.openid}`});
  }


  return (
    <View className={styles.answerlist}>
      <View className={styles.answerlist_control} >
        <AtSegmentedControl 
          onClick={setCurrent}
          fontSize='30'
          current={current}
          values={['未交卷', '已交卷']}
        />
      </View>
      
      {data.filter(w => w.status === (current + 1)).map(n => <View onClick={()=> toDetail(n)} key={n._id} className={styles.answerlist_item}>
        <View>
          <AtAvatar circle image={n.userList[0]?.avatarUrl}></AtAvatar>
        </View>
        <View>
          <View className='at-article__h3'>{n.userList[0]?.nickName}</View>
          <View  className='at-article__info'>
            交卷时间：{n.status === 2 ? time.formatTimeTwo(n.examTime, 'Y-M-D h:m:s') : '未交卷'}
          </View>
        </View>
        
        {n.status === 2 && <View className={styles.answerlist_item_score}>{n.totalScore}</View>}
      </View>)}
    </View>
  )
}
