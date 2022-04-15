

import {useState, useEffect} from 'react';
import { View, Text, Button } from '@tarojs/components'
import Taro, {useDidShow, usePullDownRefresh, useReady } from '@tarojs/taro';
import { AtTabs, AtTabsPane, AtSearchBar, AtListItem } from 'taro-ui'
import {useSelector, useDispatch} from 'react-redux';
import styles from './index.module.less'


export default () => {
  const userinfo = Taro.getStorageSync('userInfo');
  const {list} = useSelector(state => state.category);
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(0);
  const [objlist, setObjlist] = useState({});

  useDidShow(()=>{
    getPaperList(current);
  })

  usePullDownRefresh(() => {
    getPaperList(current);
  })

  const getPaperList = async (index)=>{
    const category_id = list[index]?._id;
    if(!category_id) return;
    
    const res = await Taro.cloud.callFunction({name: "paper",data: {action: 'get',data: {category_id, status: 2} } });
    if(res.errMsg !== 'cloud.callFunction:ok'){
      throw new Error(res.errMsg);
    }
    objlist[category_id] = res.result.data;
    setObjlist({...objlist});
    Taro.stopPullDownRefresh();
  };

  const changeCurrent = (val) => {
    if(val !== current){
      setCurrent(val);
      getPaperList(val);
    } 
  }
  
  const toDetail = (data) => {
    Taro.navigateTo({url: `/pages/paper/question/index?id=${data._id}`});
  }

  return (
    <View className={styles.home_paper}>
      <AtSearchBar
        value={searchValue}
        onChange={setSearchValue}
      />
      <AtTabs current={current} tabList={list.map(n => ({title: n.name}))} onClick={changeCurrent}>
        {list.map((n,i) => <AtTabsPane style={{height: '100%'}} key={n._id} current={current} index={i} >
          <View style='background-color: #FAFBFC;' >
            {objlist[n._id]?.map(w => 
              <AtListItem 
                onClick={()=> toDetail(w)} 
                key={w._id} 
                hasBorder={false} 
                className={styles.paperlist_item} 
                title={w.name} 
                arrow='right' 
                extraText={w.pass?.includes(userinfo?.openid) ? '已交卷' : ''}
                note={w.desc}
              />)}
          </View>
        </AtTabsPane>)}
      </AtTabs>
    </View>
  )
}