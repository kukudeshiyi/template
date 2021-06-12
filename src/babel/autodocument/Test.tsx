import React from 'react';

interface PropsType {
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

export default class Test extends React.Component<PropsType> {
  constructor(p: PropsType) {
    super(p);
  }
  render() {
    return <div>123</div>;
  }
}
