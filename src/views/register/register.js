import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const Registro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    lastname: '',
    bornDate: '',
    phone: '',
    email: '',
    address: '',
    gender: 'M'
  });

  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const dataToSend = { ...formData, password };

    console.log('Datos enviados:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetch('https://api-ydqd.onrender.com/api/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado exitosamente');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', `Error: ${result.message}`);
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Algo salió mal al registrarse');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>
          ¿Ya tienes una cuenta?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Inicia sesión
          </Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={formData.lastname}
          onChangeText={(value) => handleInputChange('lastname', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento"
          value={formData.bornDate}
          onChangeText={(value) => handleInputChange('bornDate', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={formData.dni}
          onChangeText={(value) => handleInputChange('dni', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Celular"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Género:</Text>
          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Femenino" value="F" />
          </Picker>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <Button
            title={showPassword ? '🙈' : '👁️'}
            onPress={togglePasswordVisibility}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
          />
          <Button
            title={showConfirmPassword ? '🙈' : '👁️'}
            onPress={toggleConfirmPasswordVisibility}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    color: '#1e90ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Registro;