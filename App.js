import Login from "./src/views/login/login"
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./src/views/home/home";
import Reserva from "./src/views/reserva/reserva";
import Perfil from "./src/views/perfil/perfil";
import NavBar from "./src/helpers/bnavigation"; 
import Registro from "./src/views/register/register";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home}  options={{headerShown: false}} />
        <Stack.Screen name="Reserva" component={Reserva}  options={{headerShown: false}}/>
        <Stack.Screen name="Perfil" component={Perfil}  options={{headerShown: false}}/>
        <Stack.Screen name="Registro" component={Registro}  options={{headerShown: false}}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;

