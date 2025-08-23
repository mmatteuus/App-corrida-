import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Place } from '@conexao-ativa/shared';
import { placesService } from '../services/places';
import { eventsService } from '../services/events';

export const CreateEventScreen = ({ navigation }: any) => {
  const [modality, setModality] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [totalSpots, setTotalSpots] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      const data = await placesService.getPlaces();
      setPlaces(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os locais');
    }
  };

  const handleSubmit = async () => {
    if (!modality || !selectedPlace || !totalSpots) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const spots = parseInt(totalSpots);
    if (isNaN(spots) || spots <= 0) {
      Alert.alert('Erro', 'Número de vagas deve ser um número positivo');
      return;
    }

    setLoading(true);
    try {
      await eventsService.createEvent({
        modality,
        placeId: selectedPlace,
        startsAt: date.toISOString(),
        totalSpots: spots,
      });

      Alert.alert('Sucesso', 'Evento criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Criar Evento</Text>

        <Text style={styles.label}>Modalidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Corrida 5K, Futebol, Vôlei..."
          value={modality}
          onChangeText={setModality}
        />

        <Text style={styles.label}>Local</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPlace}
            onValueChange={setSelectedPlace}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um local" value="" />
            {places.map((place) => (
              <Picker.Item
                key={place.id}
                label={place.name}
                value={place.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Horário</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatTime(date)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Número de vagas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10"
          value={totalSpots}
          onChangeText={setTotalSpots}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Criando...' : 'Criar Evento'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

