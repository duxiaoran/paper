// import {useState} from 'react';
import { View } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import styles from './index.module.less';

export default (props) => {
  const { title, ...arg } = props;
  return (
    <View className={styles.myTextArea}>
      <View className={styles.category_desc_title}>{title}</View>
      <View className={styles.category_desc_textarea}>
        <AtTextarea
          {...arg}
        />
      </View>
    </View>
  )
}