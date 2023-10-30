import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {mirabloTheme} from './src/Styles';
import EditOptionsScreen from './src/screens/EditOptionsScreen';
import {MirabloContextProvider} from './src/Db';
import {IconButton, ThemeProvider} from '@react-native-material/core';
import SelectOptionScreen from './src/screens/SelectOptionScreen';
import Tts from 'react-native-tts';
import ConfigScreen from './src/screens/ConfigScreen';
import EyesStatusPannel from './src/components/EyesStatusPannel';
import ShowOptionsScreen from './src/screens/ShowOptionsScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SideMenu from './src/components/SideMenu';
import AboutScreen from './src/screens/AboutScreen';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import NewEmailScreen from './src/screens/NewEmailScreen';

Tts.setDefaultVoice('es-ES-language');
const headersOptions = {
  headerStyle: {
    backgroundColor: '#f3edf7',
  },
  headerTitleAlign: 'center',
  title: 'MIRABLO',
} as const;

export type RootStackParamList = {
  // Home: undefined;
  //  Test: undefined;
  ShowOptions: undefined;
  EditOptions: {id?: string};
  SelectOption: {id: string};
  Config: undefined;
  Splash: undefined;
  Login: undefined;
  About: undefined;
  EmailLogin: undefined;
  NewEmailScreen: undefined;
};

export const NavigationStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const OpenMenuButton = (
    <IconButton
      onPress={() => setMenuOpen(true)}
      icon={props => <Icon name="menu" {...props} />}
    />
  );

  return (
    //@ts-ignore
    <ThemeProvider theme={mirabloTheme}>
      <MirabloContextProvider>
        <NavigationContainer>
          <NavigationStack.Navigator>
            <NavigationStack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <NavigationStack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <NavigationStack.Screen
              name="EmailLogin"
              component={EmailLoginScreen}
              options={{headerShown: false}}
            />
            <NavigationStack.Screen
              name="NewEmailScreen"
              component={NewEmailScreen}
              options={{headerShown: false}}
            />
            <NavigationStack.Screen
              name="ShowOptions"
              component={ShowOptionsScreen}
              options={{
                ...headersOptions,
                headerLeft: () => OpenMenuButton,
              }}
            />
            <NavigationStack.Screen
              name="EditOptions"
              component={EditOptionsScreen}
              options={headersOptions}
            />
            <NavigationStack.Screen
              name="SelectOption"
              component={SelectOptionScreen}
              options={headersOptions}
            />
            <NavigationStack.Screen
              name="Config"
              component={ConfigScreen}
              options={headersOptions}
            />
            <NavigationStack.Screen
              name="About"
              component={AboutScreen}
              options={headersOptions}
            />
          </NavigationStack.Navigator>
          <EyesStatusPannel />
          <SideMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </NavigationContainer>
      </MirabloContextProvider>
    </ThemeProvider>
  );
};

export default App;
