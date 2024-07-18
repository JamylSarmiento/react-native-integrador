import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

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

  return (
    <View style={styles.container}>
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
      />
      {selectedDate ? (
        <Text style={styles.dateText}>Fecha seleccionada: {selectedDate}</Text>
      ) : null}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E7ECEF',
  },
  text: {
    fontSize: 30,
    color: '#001F54', // 
  },
  picker: {
    width: 200,
    height: 50,
  },
  dateText: {
    fontSize: 18,
    marginTop: 20,
  },
  textInput: {
    width: 200,
    height: 50,
    borderColor: '#1282a2',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#034078', // Color naranja para el botón
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FEFCFB',
    fontSize: 16,
  },
});

export default Reserva;