import React, { useState } from 'react';
import { StatusBar, Image, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa el ícono de Ionicons


const Login = ({ navigation }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const ipAddresses = ['http://192.168.0.105:8080', 'http://192.168.0.6:8080', 'http://192.168.18.40:8080'];
  const maxAttempts = ipAddresses.length;
  
  const handleRegister = () => {
    navigation.navigate('Registro');
  };

  const handleLogin = async () => {
    let success = false;
    let attempts = 0;

    while (!success && attempts < maxAttempts) {
      try {
        const response = await fetch(`http://192.168.0.6:8080/api/auth/loginUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dni, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('dni', dni);
            Alert.alert('¡Inicio de sesión exitoso!');
            navigation.navigate('Home');
            success = true;
          } else {
            Alert.alert('Error', 'DNI o contraseña incorrectos');
          }
        } else {
          attempts++;
          if (attempts === maxAttempts) {
            Alert.alert('Error', 'Fallo en la conexión con el servidor');
          }
        }
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          Alert.alert('Error', 'Algo salió mal. Por favor, intenta de nuevo.');
          console.error('Error en el inicio de sesión:', error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input1}
          placeholder="DNI"
          placeholderTextColor="#FFFFFF"
          onChangeText={text => setDni(text)}
          value={dni}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#FFFFFF"
            secureTextEntry={!showPassword}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          color="#40E0D0"
        />
        <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        >
        <Text style={styles.registerButtonText}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 50,
  },
  formContainer: {
    width: '80%',
    maxWidth: 300,
  },
  input1: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 5,
    color: '#FFFFFF',
  },
  input: {
    borderRadius: 5,
    color: '#FFFFFF',
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 30,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#40E0D0',
    padding: 8,
    borderRadius: 3,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 15,

  },
  registerLink: {
    color: '#1e90ff',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;