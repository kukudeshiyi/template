import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { scaleSize, setSpText2 } from '@mitra/rn-sdk';

interface PropsType {
  /** 标题 */
  title: string;
}

export default memo(function ({ title }: PropsType) {
  return (
    <View style={styles.lineBreak}>
      <View style={styles.line} />
      <Text style={styles.lineText}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
});

const styles = StyleSheet.create({
  lineBreak: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  line: {
    height: StyleSheet.hairlineWidth,
    width: scaleSize(20),
    backgroundColor: COLORS.GREY,
  },
  lineText: {
    paddingHorizontal: scaleSize(8),
    fontSize: setSpText2(14),
    color: COLORS.GREY,
  },
});
