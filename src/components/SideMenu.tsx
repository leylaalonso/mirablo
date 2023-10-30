import {Divider} from '@react-native-material/core';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../../App';
import auth from '@react-native-firebase/auth';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideMenu: React.FC<Props> = ({isOpen, setIsOpen}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      {isOpen && (
        <>
          <TouchableOpacity style={styles.background} onPress={toggleMenu} />
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Config');
                toggleMenu();
              }}>
              <Icon style={styles.menuIcon} name="cog" />
              <Text style={styles.menuText}>Configuración</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon style={styles.menuIcon} name="help-circle" />
              <Text style={styles.menuText}>Ayuda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('About');
                toggleMenu();
              }}>
              <Icon style={styles.menuIcon} name="information-variant" />
              <Text style={styles.menuText}>Acerca de</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                auth().signOut();
                navigation.navigate('Login');
                toggleMenu();
              }}>
              <Icon style={styles.menuIcon} name="logout" />
              <Text style={styles.menuText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    opacity: 0.5,
  },
  menuButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#fff',
    padding: 10,
  },
  menuItem: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 20,
    color: '#333',
  },
  menuIcon: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  divider: {
    marginVertical: 20,
  },
});

export default SideMenu;
