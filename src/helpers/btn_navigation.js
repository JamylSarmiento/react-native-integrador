import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NavBar = ({ onProfilePress, onReservaPress, onLogoutPress }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={onProfilePress} style={styles.navButton}>
        <Text style={styles.navButtonText}>Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReservaPress} style={styles.navButton}>
        <Text style={styles.navButtonText}>Reservar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogoutPress} style={styles.navButton}>
        <Text style={styles.navButtonText}>Salir</Text>
      </TouchableOpacity>
    </View>
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
