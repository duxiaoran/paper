// import {useState} from 'react';
import { View, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import styles from './index.module.less';

export default (props) => {
  const {data, onChange, value, title} = props;
  return (
    <View className={styles.mypicker}>
      <Picker mode='selector' range={data || []} onChange={e => onChange && onChange(e.detail.value )}>
        <View className={styles.question_picker_show}>
          <View>{title}</View>
          <View>{value} <AtIcon  value='chevron-right' size='20' ></AtIcon></View>
        </View>
      </Picker>
    </View>
  )
}