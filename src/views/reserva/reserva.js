import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
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
  const [selectedTime, setSelectedTime] = useState('');
  const [visitReason, setVisitReason] = useState('');

  const times = ['9:00', '10:15', '11:30', '12:45', '14:00', '15:15', '16:30', '17:45'];

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setLoadingSpecialties(false);
          return;
        }

        const response = await fetch('http://192.168.0.6:8080/api/specialty/', {
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

        const response = await fetch('http://192.168.0.6:8080/api/doctor/', {
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
      console.log('Selected Doctor DNI:', selectedDoctorObject.dni);
    }
  };

  const handleDateChange = (day) => {
    setSelectedDate(day.dateString);
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
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' }
        }}
        // Limiting to weekdays (Mon-Fri)
        minDate={moment().startOf('week').add(1, 'days').format('YYYY-MM-DD')}
        maxDate={moment().endOf('week').add(5, 'days').format('YYYY-MM-DD')}
        hideExtraDays={true}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
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
    borderColor: '#000',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default Reserva;
