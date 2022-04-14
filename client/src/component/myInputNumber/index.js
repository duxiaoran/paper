// import {useState} from 'react';
import { View, Text } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import styles from './index.module.less';

export default (props) => {
  const { title, ...arg } = props;
  return (
    <View className={styles.myInputNumber}>
      <Text>试题分值：</Text>
      <AtInputNumber
        {...arg}
      />
    </View>
  )
}