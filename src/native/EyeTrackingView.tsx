import React, {useEffect, useRef} from 'react';
import {PixelRatio, UIManager, findNodeHandle} from 'react-native';

import {EyeTrackingViewManager} from './EyeTrackingViewManager';

const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    //@ts-ignore
    UIManager.EyeTrackingViewManager.Commands.create.toString(),
    [viewId],
  );

const EyeTracking = () => {
  const ref = useRef(null);

  useEffect(() => {
    const viewId = findNodeHandle(ref.current);
    createFragment(viewId);
  }, []);

  return (
    <EyeTrackingViewManager
      style={{
        height: PixelRatio.getPixelSizeForLayoutSize(20),
        width: PixelRatio.getPixelSizeForLayoutSize(50),
        margin: 0,
        padding: 0,
      }}
      ref={ref}
    />
  );
};

export default EyeTracking;
