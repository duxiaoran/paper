
import {useState, useEffect} from 'react';
import { View, Swiper, SwiperItem, Image} from '@tarojs/components'
import Taro, {useReady } from '@tarojs/taro';
import { AtNoticebar, AtGrid } from 'taro-ui'
import { useDispatch} from 'react-redux';
import styles from './index.module.less'

export default () => {
  const dispatch = useDispatch();
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      const res = await Taro.cloud.callFunction({name: "category",data: {action: 'get' } });
      if(res.errMsg !== 'cloud.callFunction:ok'){
        throw new Error(res.errMsg);
      }
      dispatch({type: 'categroy.save', payload: {list: res.result.data}})
    })()
    getNotice();
    setInterval(()=>{ getNotice() }, 5000)
  },[dispatch])

  const getNotice = async () => {
    const res = await Taro.cloud.callFunction({name: "answer",data: {action: 'getAnswerList',data: { match: {status: 2, fullScore: true },sort:{examTime: -1}, limit: 1 }} });
    if(res.errMsg !== 'cloud.callFunction:ok'){
      return;
    }
    if(res.result.list.length === 1){
      const str = `祝贺${res.result.list[0].userList[0]?.nickName}在《${res.result.list[0].paperList[0]?.name}》中得到了满分(${res.result.list[0]?.totalScore}分)`;
      setMsg(str);
    }
  }

  const toDetal = () => {
    // 'pages/home/friendList/index'
  }

  return (
    <View className={styles.home}>
      <Swiper
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem >
          <Image
            mode='aspectFill'
            style={{width: '100%'}}
            src='cloud://duxiaoran-9gsxayj41a7fd66c.6475-duxiaoran-9gsxayj41a7fd66c-1304944264/swiper1.jpeg'
          /> 
        </SwiperItem>
        <SwiperItem>
          <Image
            mode='aspectFill'
            style={{width: '100%'}}
            src='cloud://duxiaoran-9gsxayj41a7fd66c.6475-duxiaoran-9gsxayj41a7fd66c-1304944264/swiper2.jpeg'
          />
        </SwiperItem>
        <SwiperItem>
          <Image
            mode='aspectFill'
            style={{width: '100%'}}
            src='cloud://duxiaoran-9gsxayj41a7fd66c.6475-duxiaoran-9gsxayj41a7fd66c-1304944264/swiper3.jpeg'
          />
        </SwiperItem>
      </Swiper>
      <View className={styles.home_noticebar}>
        <AtNoticebar icon='volume-plus' marquee>{msg}</AtNoticebar>
      </View>
      <AtGrid hasBorder={false} onClick={toDetal}  style={{background: 'white'}} data={
        [
          {
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
            value: '朋友圈'
          },
          {
            image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '文章'
          },
          {
            image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
            value: '考试成绩'
          },
          {
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
            value: '学语文'
          },
          {
            image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
            value: '学数学'
          },
          {
            image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
            value: '学英语'
          }
        ]
      }
      />
    </View>
  )
}
