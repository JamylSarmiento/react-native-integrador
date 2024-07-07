import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const dni = await AsyncStorage.getItem('dni');
      if (token && dni) {
        await fetchAppointments(token, dni);
      } else {
        Alert.alert('Error', 'No se encontró un token válido. Por favor, inicia sesión.');
      }
    } catch (error) {
      console.error('Error al obtener el token:', error);
      Alert.alert('Error', 'Algo salió mal al obtener el token.');
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const fetchAppointments = async (token, dni) => {
    try {
      const response = await fetch(`http://192.168.0.6:8080/api/appointment/${dni}`, {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos de la cita recibidos:', data);
        if (Array.isArray(data) && data.length > 0) {
          setAppointmentData(data);

          // Obtener los detalles de los doctores
          const doctorDnis = data.map(appointment => appointment.doctor);
          const uniqueDoctorDnis = [...new Set(doctorDnis)];
          const doctorDetails = await fetchDoctorData(token, uniqueDoctorDnis);
          setDoctorData(doctorDetails);
        } else {
          Alert.alert('Error', 'La lista de citas está vacía o no es válida.');
        }
      } else {
        console.log('Respuesta del servidor no OK:', response.status);
        Alert.alert('Error', 'No se pudo obtener la lista de citas.');
      }
    } catch (error) {
      console.error('Error al obtener citas:', error);
      Alert.alert('Error', 'Algo salió mal. Por favor, intenta de nuevo.');
    }
  };

  const fetchDoctorData = async (token, doctorDnis) => {
    try {
      const details = {};
      for (let dni of doctorDnis) {
        const response = await fetch(`http://192.168.0.6:8080/api/doctor/${dni}`, {
          method: 'GET',
          headers: {
            'token': token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          details[dni] = data;
        } else {
          console.log(`No se pudo obtener los datos del doctor con DNI ${dni}:`, response.status);
        }
      }
      return details;
    } catch (error) {
      console.error('Error al obtener datos del doctor:', error);
      return {};
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getToken().then(() => setRefreshing(false));
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('dni');
      Alert.alert('Desconexión', 'Sesión cerrada correctamente.');
      navigation.navigate('Login');  // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Algo salió mal al cerrar sesión.');
    }
  };

  const handleReserva = async () => {
    try {
      Alert.alert('cambio');
      navigation.navigate('Reserva');  
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Algo salió mal al cerrar sesión.');
    }
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReserva} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Lista de Citas:</Text>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointmentData.length > 0 ? (
          appointmentData.map((appointment, index) => (
            <View key={index} style={styles.appointmentContainer}>
              <Text style={styles.label}>Razón: <Text style={styles.text}>{appointment.reason}</Text></Text>
              <Text style={styles.label}>Fecha: <Text style={styles.text}>{formatDate(appointment.date)}</Text></Text>
              <Text style={styles.label}>Hora: <Text style={styles.text}>{appointment.time}</Text></Text>
              <Text style={styles.label}>Doctor DNI: <Text style={styles.text}>{appointment.doctor}</Text></Text>
              <Text style={styles.label}>Doctor: <Text style={styles.text}>{doctorData[appointment.doctor]?.name}</Text></Text>
              <Text style={styles.label}>Especialidad: <Text style={styles.text}>{doctorData[appointment.doctor]?.specialty ? doctorData[appointment.doctor].specialty.map(specialty => specialty.name).join(', ') : 'N/A'}</Text></Text>
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Cargando citas...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C6EF5', // Fondo azul más claro
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoutButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  scrollView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  appointmentContainer: {
    backgroundColor: '#e0f7fa', // Color azul claro
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#FFD700', // Sombra amarilla
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 100,
    shadowRadius: 50,
    elevation: 100, // Elevación para la sombra en Android
  },
  label: {
    fontWeight: 'bold',
    color: '#004d40', // Color verdoso claro
  },
  text: {
    fontWeight: 'normal',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
});

export default Home;