import React, {PropsWithChildren, useEffect, useState} from 'react';
import EyeTrackingState, {
  EyeTrackingStateType,
} from './native/EyeTrackingState';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export type QuestionOption = {
  id: string;
  title: string;
  image: string;
};

export type Question = {
  id: string;
  sort: number;
  favorite: boolean;
  title: string;
  options: QuestionOption[];
};

const mockQuestions: Question[] = [
  {
    id: '1',
    sort: 1,
    favorite: false,
    title: 'Que te gustaría hacer?',
    options: [
      {
        id: '1',
        title: 'Comer',
        image: 'https://static.arasaac.org/pictograms/6456/6456_300.png',
      },
      {
        id: '2',
        title: 'Beber',
        image: 'https://static.arasaac.org/pictograms/6061/6061_300.png',
      },
    ],
  },
  {
    id: '2',
    sort: 2,
    favorite: false,
    title: 'Si o no?',
    options: [
      {
        id: '1',
        title: 'Si',
        image: 'https://static.arasaac.org/pictograms/5584/5584_300.png',
      },
      {
        id: '2',
        title: 'No',
        image: 'https://static.arasaac.org/pictograms/5526/5526_300.png',
      },
    ],
  },
];

export type Gesture =
  | 'LOOKING_LEFT'
  | 'LOOKING_RIGHT'
  | 'LOOKING_UP'
  | 'LOOKING_DOWN'
  | 'BLINKING';

type Config = {
  lookLeftThreshold: number;
  lookRightThreshold: number;
  lookUpThreshold: number;
  lookDownThreshold: number;
  blinkingThreshold: number;
  gestureDuration: number;
};

export const defaultConfig: Config = {
  lookLeftThreshold: 0.3,
  lookRightThreshold: 0.3,
  lookUpThreshold: 0.3,
  lookDownThreshold: 0.3,
  blinkingThreshold: 0.3,
  gestureDuration: 2000,
};

type EyeTrackingStateTypeExtended = EyeTrackingStateType & {
  x: number;
  y: number;
};

export type User = FirebaseAuthTypes.User | null;

type State = {
  user: User;
  questions: Question[];
  eyeTrackingState: EyeTrackingStateTypeExtended | undefined;
  currentGesture: Gesture | undefined;
  config: Config;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  customImages: string[];
  setCustomImages: React.Dispatch<React.SetStateAction<string[]>>;
};

export const MirabloContext = React.createContext<State>({
  user: null,
  questions: mockQuestions,
  eyeTrackingState: undefined,
  currentGesture: undefined,
  config: defaultConfig,
  setQuestions: () => {},
  setConfig: () => {},
  customImages: [],
  setCustomImages: () => {},
});

type Props = PropsWithChildren<{}>;

export const MirabloContextProvider: React.FC<Props> = ({children}: Props) => {
  const [questions, _setQuestions] = useState<Question[]>([]);
  const [customImages, _setCustomImages] = useState<string[]>([]);
  const [user, setUser] = useState<User>(null);
  const [config, setConfig] = React.useState<Config>(defaultConfig);
  const [eyeTrackingState, setEyeTrackingState] = React.useState<
    EyeTrackingStateTypeExtended | undefined
  >(undefined);
  const [currentGesture, setCurrentGesture] = React.useState<Gesture>();

  const setQuestions = React.useCallback(
    (newQuestionsDispatc: React.Dispatch<React.SetStateAction<Question[]>>) => {
      if (!user) {
        return;
      }
      const newQuestions =
        typeof newQuestionsDispatc === 'function'
          ? newQuestionsDispatc(questions)
          : newQuestionsDispatc;
      firestore()
        .collection('users')
        .doc(user.uid)
        .set({questions: newQuestions}, {merge: true});
    },
    [user, questions],
  );

  const setCustomImages = React.useCallback(
    (
      newCustomImagesDispatch: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
      if (!user) {
        return;
      }
      const newCustomImages =
        typeof newCustomImagesDispatch === 'function'
          ? newCustomImagesDispatch(customImages)
          : newCustomImagesDispatch;
      firestore()
        .collection('users')
        .doc(user.uid)
        .set({customImages: newCustomImages}, {merge: true});
    },
    [user, customImages],
  );

  const _setConfig = React.useCallback(
    (newConfig: Config) => {
      if (!user) {
        return;
      }
      firestore()
        .collection('users')
        .doc(user.uid)
        .set({config: newConfig}, {merge: true});
    },
    [user],
  );

  // debounce setConfig
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      _setConfig(config);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [_setConfig, config]);

  useEffect(() => {
    return auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    console.log('on start db');
    if (!user) {
      _setQuestions([]);
      return;
    }
    return firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((snapshot: any, error: unknown | undefined) => {
        console.log('on snapshot');
        if (error) {
          console.error(error);
          return;
        }
        const data = snapshot.data();
        if (!data || !data.questions) {
          setQuestions(() => mockQuestions);
          setConfig(() => defaultConfig);
          return;
        }
        _setQuestions(data.questions);
        _setConfig(data.config ?? defaultConfig);
        _setCustomImages(data.customImages ?? []);
      });
  }, [user]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      EyeTrackingState.getCurrentState(newState => {
        if (!newState) {
          setCurrentGesture(undefined);
          setEyeTrackingState(undefined);
          return;
        }

        let x = 0;
        x += newState.eyeLookOutLeft;
        x += newState.eyeLookInRight;
        x -= newState.eyeLookInLeft;
        x -= newState.eyeLookOutRight;

        x /= 2;

        let y = 0;
        y += newState.eyeLookUpLeft;
        y += newState.eyeLookUpRight;
        y -= newState.eyeLookDownLeft;
        y -= newState.eyeLookDownRight;

        y /= 2;

        if (x > config.lookRightThreshold) {
          setCurrentGesture('LOOKING_RIGHT');
        } else if (-x > config.lookLeftThreshold) {
          setCurrentGesture('LOOKING_LEFT');
        } else if (y > config.lookUpThreshold) {
          setCurrentGesture('LOOKING_UP');
        } else if (-y > config.lookDownThreshold) {
          setCurrentGesture('LOOKING_DOWN');
        } else {
          setCurrentGesture(undefined);
        }

        setEyeTrackingState({...newState, x, y});
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [config]);

  const value = {
    questions,
    setQuestions,
    eyeTrackingState,
    currentGesture,
    config,
    setConfig,
    user,
    customImages,
    setCustomImages,
  };

  return (
    <MirabloContext.Provider value={value}>{children}</MirabloContext.Provider>
  );
};
