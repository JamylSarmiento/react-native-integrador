import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reserva = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialtyUid, setSelectedSpecialtyUid] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

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

  const handleSpecialtyChange = (itemValue, itemIndex) => {
    setSelectedSpecialty(itemValue);
    const selectedSpecialtyObject = specialties.find(specialty => specialty.name === itemValue);
    console.log('Selected specialty object:', selectedSpecialtyObject);
    if (selectedSpecialtyObject) {
      setSelectedSpecialtyUid(selectedSpecialtyObject.id);
      console.log('Selected Specialty UID:', selectedSpecialtyObject.id);
    }
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
          selectedValue={selectedSpecialtyUid}
          style={styles.picker}
        >
          {filteredDoctors.map((doctor) => (
            <Picker.Item key={doctor.dni} label={doctor.name} value={doctor.name} />
          ))}
        </Picker>
      )}
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
});

export default Reserva;
