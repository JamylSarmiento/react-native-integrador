import React, { useState } from 'react';
import { StatusBar, Image, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, Text, ImageBackground } from 'react-native';
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
        const response = await fetch('https://api-ydqd.onrender.com/api/auth/loginUser', {
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
            Alert.alert('Error', 'Contraseña o Usuario Incorrecto');
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
    <ImageBackground source={require('../../../assets/tapizado3.jpg')} style={styles.background}>
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
          color="#001f54"
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 100,
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input1: {
    backgroundColor: '#1282A2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fefcfb',
  },
  input: {
    borderRadius: 5,
    color: '#fefcfb',
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1282A2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 30,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#001f54',
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
    color: '#1282a2',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;