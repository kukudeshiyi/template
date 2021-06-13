import React, { memo } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedbackProps,
  Platform,
} from 'react-native';
import { scaleSize, setSpText2 } from '@mitra/rn-sdk';

interface PropType {
  /** 标题 */
  title: string;
  /** 显示返回按钮 */
  showBack?: boolean;
  /** 返回事件 */
  onBack?: TouchableWithoutFeedbackProps['onPress'];
  /** 显示右边按钮 */
  showRightButton?: boolean;
  /** 右边按钮事件 */
  onRightButton?: TouchableWithoutFeedbackProps['onPress'];
  /** 右边按钮文案 */
  rightButtonText?: string;
  /** 根据系统判断标题的位置，安卓会向左靠齐 */
  platformTitle?: boolean;
}

function Navbar(props: PropType) {
  const {
    title,
    showBack = true,
    onBack,
    showRightButton = false,
    onRightButton,
    platformTitle = false,
    rightButtonText = '',
  } = props;

  return (
    <View style={[styles.navbar, styles.elevationLow]}>
      {showBack && (
        <TouchableWithoutFeedback onPress={onBack}>
          <View style={styles.navbarLeft}>
            <Image source={require('../../assets/ic_g_back24.png')} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <Text style={[styles.title, platformTitle && styles.titlePlatform]}>
        {title}
      </Text>

      {showRightButton && (
        <TouchableWithoutFeedback onPress={onRightButton}>
          <View style={styles.navbarRight}>
            <Text style={styles.text}>{rightButtonText}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

export default memo(Navbar);

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    height: scaleSize(56),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    zIndex: 1000,
  },
  elevationLow: {
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  navbarLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    paddingHorizontal: scaleSize(12),
    height: scaleSize(56),
  },
  navbarRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    paddingHorizontal: scaleSize(12),
  },
  title: {
    fontSize: setSpText2(20),
    color: '#000000',
  },
  titlePlatform: {
    ...Platform.select({
      android: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: scaleSize(56),
        lineHeight: scaleSize(56),
      },
    }),
  },
  text: {
    fontSize: setSpText2(16),
    color: '#EE4D2D',
  },
});
