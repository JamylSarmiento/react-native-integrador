// Perfil.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TextInput, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Perfil = () => {
  const [currentSection, setCurrentSection] = useState('Usuario');
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const getUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const dni = await AsyncStorage.getItem('dni');
      if (token && dni) {
        const response = await fetch(`http://192.168.0.6:8080/api/user/${dni}`, {
          method: 'GET',
          headers: {
            'token': token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserName(data.name);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        }
      } else {
        Alert.alert('Error', 'No se encontró un token válido. Por favor, inicia sesión.');
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      Alert.alert('Error', 'Algo salió mal al obtener la información del usuario.');
    }
  };

  const updateUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const dni = await AsyncStorage.getItem('dni');
      if (token && dni) {
        const response = await fetch(`http://192.168.0.6:8080/api/user/${dni}`, {
          method: 'PUT',
          headers: {
            'token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserName(data.name);
          setIsEditing(false);
          Alert.alert('Éxito', 'Información del usuario actualizada correctamente.');
        } else {
          Alert.alert('Error', 'No se pudo actualizar la información del usuario.');
        }
      } else {
        Alert.alert('Error', 'No se encontró un token válido. Por favor, inicia sesión.');
      }
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      Alert.alert('Error', 'Algo salió mal al actualizar la información del usuario.');
    }
  };

  const handleChange = (name, value) => {
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('dni');
      Alert.alert('Desconexión', 'Sesión cerrada correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Algo salió mal al cerrar sesión.');
    }
  };

  const handleReserva = async () => {
    try {
      navigation.navigate('Reserva');  
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      Alert.alert('Error', 'Algo salió mal al realizar la reserva.');
    }
  };

  const handleProfile = () => {
    navigation.navigate('Perfil');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/paciente.png')} style={styles.pacienteIcon} />
        <Text style={styles.title}>Perfil de Usuario</Text>
        <Text style={styles.greeting}>Hola, {userName || 'Usuario'}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Usuario" onPress={() => setCurrentSection('Usuario')} />
      </View>
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentSection === 'Usuario' && (
          <View style={styles.userInfoContainer}>
            {isEditing ? (
              <>
                <Text style={styles.label}>DNI:</Text>
                <TextInput style={styles.input} value={userData.dni} editable={false} />

                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.name}
                  onChangeText={(value) => handleChange('name', value)}
                />

                <Text style={styles.label}>Apellidos:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.lastname}
                  onChangeText={(value) => handleChange('lastname', value)}
                />

                <Text style={styles.label}>Fecha de Nacimiento:</Text>
                <TextInput
                  style={styles.input}
                  value={formatDate(userData.bornDate)}
                  onChangeText={(value) => handleChange('bornDate', value)}
                />

                <Text style={styles.label}>Teléfono:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.phone}
                  onChangeText={(value) => handleChange('phone', value)}
                />

                <Text style={styles.label}>Correo:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.email}
                  editable={false}
                />

                <Text style={styles.label}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.address}
                  onChangeText={(value) => handleChange('address', value)}
                />

                <Text style={styles.label}>Género:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.gender}
                  onChangeText={(value) => handleChange('gender', value)}
                />

                <View style={styles.buttonGroup}>
                  <Button title="Guardar" onPress={updateUserData} />
                  <View style={styles.buttonSeparator} />
                  <Button title="Cancelar" onPress={() => setIsEditing(false)} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.label}>DNI:</Text>
                <Text style={styles.value}>{userData.dni}</Text>

                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{userData.name}</Text>

                <Text style={styles.label}>Apellidos:</Text>
                <Text style={styles.value}>{userData.lastname}</Text>

                <Text style={styles.label}>Fecha de Nacimiento:</Text>
                <Text style={styles.value}>{formatDate(userData.bornDate)}</Text>

                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{userData.phone}</Text>

                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.value}>{userData.email}</Text>

                <Text style={styles.label}>Dirección:</Text>
                <Text style={styles.value}>{userData.address}</Text>

                <Text style={styles.label}>Género:</Text>
                <Text style={styles.value}>{userData.gender}</Text>

                <Button title="Editar" onPress={() => setIsEditing(true)} />
              </>
            )}
          </View>
        )}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pacienteIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 18,
    color: '#555555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  userInfoContainer: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonSeparator: {
    width: 10,
  },
});

export default Perfil;
