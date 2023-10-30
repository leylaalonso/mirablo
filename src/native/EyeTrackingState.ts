import {NativeModules} from 'react-native';

export type EyeTrackingStateType = {
  _neutral: number;
  browDownLeft: number;
  browDownRight: number;
  browInnerUp: number;
  browOuterUpLeft: number;
  browOuterUpRight: number;
  cheekPuff: number;
  cheekSquintLeft: number;
  cheekSquintRight: number;
  eyeBlinkLeft: number;
  eyeBlinkRight: number;
  eyeLookDownLeft: number;
  eyeLookDownRight: number;
  eyeLookInLeft: number;
  eyeLookInRight: number;
  eyeLookOutLeft: number;
  eyeLookOutRight: number;
  eyeLookUpLeft: number;
  eyeLookUpRight: number;
  eyeSquintLeft: number;
  eyeSquintRight: number;
  eyeWideLeft: number;
  eyeWideRight: number;
  jawForward: number;
  jawLeft: number;
  jawOpen: number;
  jawRight: number;
  mouthClose: number;
  mouthDimpleLeft: number;
  mouthDimpleRight: number;
  mouthFrownLeft: number;
  mouthFrownRight: number;
  mouthFunnel: number;
  mouthLeft: number;
  mouthLowerDownLeft: number;
  mouthLowerDownRight: number;
  mouthPressLeft: number;
  mouthPressRight: number;
  mouthPucker: number;
  mouthRight: number;
  mouthRollLower: number;
  mouthRollUpper: number;
  mouthShrugLower: number;
  mouthShrugUpper: number;
  mouthSmileLeft: number;
  mouthSmileRight: number;
  mouthStretchLeft: number;
  mouthStretchRight: number;
  mouthUpperUpLeft: number;
  mouthUpperUpRight: number;
  noseSneerLeft: number;
  noseSneerRight: number;
};

interface EyeTrackingStateInterface {
  getCurrentState(
    callback: (sate: EyeTrackingStateType | undefined) => void,
  ): void;
}

export default NativeModules.EyeTrackingState as EyeTrackingStateInterface;
