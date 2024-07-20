import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const Reserva = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialtyUid, setSelectedSpecialtyUid] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDoctorDni, setSelectedDoctorDni] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [visitReason, setVisitReason] = useState('');

  const times = ['9:00', '10:15', '11:30', '12:45', '14:00', '15:15', '16:30', '17:45'];
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSpecialties = async () => {
      const dni = await AsyncStorage.getItem('dni');
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setLoadingSpecialties(false);
          return;
        }
        console.log('DNI:', dni);

        const response = await fetch('https://api-ydqd.onrender.com/api/specialty/', {
          method: 'GET',
          headers: {
            'token': token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched specialties:', data);

        if (Array.isArray(data)) {
          setSpecialties(data);
        } else {
          console.error('Unexpected response format:', data);
        }

        setLoadingSpecialties(false);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setLoadingDoctors(false);
          return;
        }

        const response = await fetch('https://api-ydqd.onrender.com/api/doctor/', {
          method: 'GET',
          headers: {
            'token': token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched doctors:', data);

        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          console.error('Unexpected response format:', data);
        }

        setLoadingDoctors(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedSpecialtyUid) {
      const filtered = doctors.filter(doctor =>
        doctor.specialty.some(specialty => specialty.uid === selectedSpecialtyUid)
      );
      setFilteredDoctors(filtered);
    }
  }, [selectedSpecialtyUid, doctors]);

  const handleSpecialtyChange = (itemValue) => {
    setSelectedSpecialty(itemValue);
    const selectedSpecialtyObject = specialties.find(specialty => specialty.name === itemValue);
    console.log('Selected specialty object:', selectedSpecialtyObject);
    if (selectedSpecialtyObject) {
      setSelectedSpecialtyUid(selectedSpecialtyObject.id);
      console.log('Selected Specialty UID:', selectedSpecialtyObject.id);
    }
  };

  const handleDoctorChange = (itemValue) => {
    setSelectedDoctor(itemValue);
    const selectedDoctorObject = filteredDoctors.find(doctor => doctor.name === itemValue);
    if (selectedDoctorObject) {
      setSelectedDoctorDni(selectedDoctorObject.dni);
      console.log('Selected Doctor DNI:', selectedDoctorObject.dni);
    }
  };

  const handleDateChange = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDni = await AsyncStorage.getItem('dni');

      if (!token || !userDni) {
        console.error('Missing token or user DNI');
        return;
      }

      const appointmentData = {
        reason: visitReason,
        date: selectedDate,
        time: selectedTime,
        doctor: selectedDoctorDni,
        user: userDni,
      };

      const response = await fetch('https://api-ydqd.onrender.com/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Appointment booked successfully:', data);
      Alert.alert('Success', 'Appointment booked successfully');
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  // Function to disable weekends
  const isDisabledDate = (date) => {
    const dayOfWeek = moment(date).day();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  };

  // Generate marked dates for disabled weekends
  const getMarkedDates = () => {
    const dates = {};
    const startDate = moment();
    const endDate = moment().endOf('month');

    for (let date = startDate; date.isBefore(endDate); date.add(1, 'days')) {
      if (isDisabledDate(date)) {
        dates[date.format('YYYY-MM-DD')] = { disabled: true, disableTouchEvent: true };
      }
    }

    if (selectedDate) {
      dates[selectedDate] = { selected: true, selectedColor: 'blue' };
    }

    return dates;
  };

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

  const handleProfile = () => {
    navigation.navigate('Perfil');
  };

  return (
    <ImageBackground source={require('../../../assets/tapizado3.jpg')} style={styles.background}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.text}>Pantalla de Reserva</Text>
        {loadingSpecialties ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={selectedSpecialty}
            onValueChange={handleSpecialtyChange}
            style={styles.picker}
          >
            {specialties.map((specialty) => (
              <Picker.Item key={specialty.id} label={specialty.name} value={specialty.name} />
            ))}
          </Picker>
        )}
        {loadingDoctors ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={selectedDoctor}
            onValueChange={handleDoctorChange}
            style={styles.picker}
          >
            {filteredDoctors.map((doctor) => (
              <Picker.Item key={doctor.dni} label={doctor.name} value={doctor.name} />
            ))}
          </Picker>
        )}
        <Calendar
          onDayPress={handleDateChange}
          markedDates={getMarkedDates()}
          disableAllTouchEventsForDisabledDays={true}
          minDate={moment().format('YYYY-MM-DD')}
          maxDate={moment().endOf('month').format('YYYY-MM-DD')}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#034078',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'blue',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
        <Text style={styles.dateText}>Fecha seleccionada: {selectedDate}</Text>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={styles.picker}
        >
          {times.map((time, index) => (
            <Picker.Item key={index} label={time} value={time} />
          ))}
        </Picker>
        <TextInput
          style={styles.textInput}
          placeholder="Razón de visita:"
          value={visitReason}
          onChangeText={(text) => setVisitReason(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar Cita</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleProfile} style={styles.navButton}>
          <Text style={styles.navButtonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Citas</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 30,
    color: '#001F54',
    marginBottom: 20,
  },
  picker: {
    width: '80%',
    height: 50,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#1282a2',
    borderWidth: 4,
  },
  dateText: {
    fontSize: 18,
    marginTop: 20,
  },
  textInput: {
    width: '80%',
    height: 50,
    borderColor: '#1282a2',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    marginBottom: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 60,
    backgroundColor: '#034078',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Reserva;