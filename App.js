import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Login from './src/views/login/login';
import Home from './src/views/home/home';
import Reserva from './src/views/reserva/reserva';
import Perfil from './src/views/perfil/perfil';
import Registro from './src/views/register/register';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Reserva" component={Reserva} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Registro" component={Registro} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;





