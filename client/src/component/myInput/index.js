// import {useState} from 'react';
import { View, Input} from '@tarojs/components'
import styles from './index.module.less';

export default (props) => {
  const { title, ...arg } = props;
  return (
    <View className={styles.myTextArea}>
      <View className={styles.category_desc_title}>{title}</View>
      <View className={styles.category_desc_textarea}>
        <Input {...arg} />
      </View>
    </View>
  )
}