
import {useState, useEffect} from 'react';
import { View, Text, Button } from '@tarojs/components'
import Taro, {useDidShow, usePullDownRefresh} from '@tarojs/taro';
import { AtTabs, AtTabsPane, AtSearchBar, AtListItem, AtFab } from 'taro-ui'
import {useSelector} from 'react-redux';
import styles from './index.module.less'

export default () => {
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
    
    const res = await Taro.cloud.callFunction({name: "paper",data: {action: 'get',data: {category_id, openid: Taro.getStorageSync('userInfo')?.openid} } });
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

  const toDetail = (info) => {
    if(info.status === 2){
      Taro.navigateTo({url: `/pages/mine/userlist/index?paper_id=${info._id}`});
    }else{
      Taro.navigateTo({url: `/pages/mine/paperDetail/index?id=${info._id}`});
    }
    
  }

  const toEdit = () => {
    Taro.navigateTo({url: '/pages/mine/paperEdit/index'});
  }

  return (
    <View className={styles.paperlist}>
      <AtSearchBar
        value={searchValue}
        onChange={setSearchValue}
      />
      <AtTabs current={current} tabList={list.map(n => ({title: n.name}))} onClick={changeCurrent}>
        {list.map((n,i) => <AtTabsPane style={{height: '100%'}} key={n._id} current={current} index={i} >
          <View style='background-color: #FAFBFC;' >
            {objlist[n._id]?.map(w => <AtListItem 
              onClick={()=> toDetail(w)} 
              key={w._id} 
              note={w.desc}
              isSwitch
              // disabled={w.status === 2}
              hasBorder={false}
              className={styles.paperlist_item} 
              extraText={w.status === 2 ? '已发布' : '待发布'}
              title={w.name} 
              arrow='right'
            />)}
          </View>
        </AtTabsPane>)}
      </AtTabs>
      <AtFab onClick={toEdit} className={styles.paperlist_add}>
        <Text className='at-fab__icon at-icon at-icon-add'></Text>
      </AtFab>
    </View>
  )
}
