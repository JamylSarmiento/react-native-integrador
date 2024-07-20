import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TextInput, ScrollView, RefreshControl, TouchableOpacity,ImageBackground} from 'react-native';
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
        const response = await fetch(`https://api-ydqd.onrender.com/api/user/${dni}`, {
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
        const response = await fetch(`https://api-ydqd.onrender.com/api/user/${dni}`, {
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
    <ImageBackground source={require('../../../assets/tapizado.jpg')} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/paciente.png')} style={styles.pacienteIcon} />
        <Text style={styles.title}>Perfil de Usuario</Text>
        <Text style={styles.greeting}>Hola, {userName || 'Usuario'}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentSection('Usuario')}>
          <Text style={styles.buttonText}>Usuario</Text>
        </TouchableOpacity>
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
                  <TouchableOpacity style={styles.button} onPress={updateUserData}>
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                  <View style={styles.buttonSeparator} />
                  <TouchableOpacity style={styles.button} onPress={() => setIsEditing(false)}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
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

                <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reserva')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Reservar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
          <Text style={styles.navButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View></ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
 
  container: {
    flex: 1,
    paddingTop: 20,
    
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
    color: '#001F54',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3685B5',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 60, // Espacio para la barra de navegación
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
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#034078',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Perfil;