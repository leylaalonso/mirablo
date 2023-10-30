import {StyleProp} from 'react-native';
import {requireNativeComponent} from 'react-native';

type Props = {} & StyleProp<any>;

export const EyeTrackingViewManager = requireNativeComponent<Props>(
  'EyeTrackingViewManager',
);
