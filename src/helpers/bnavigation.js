import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';



const NavBar = () => {
  return (
    <tab.Navigator>
      <tab.Screen name='Home' component={Home}/>
      <tab.Screen name='Perfil' component={Perfil}/>
      <tab.Screen name='Reserva' component={Reserva}/>
    </tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 60,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default NavBar;
