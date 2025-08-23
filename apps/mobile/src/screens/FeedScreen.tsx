import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@conexao-ativa/shared';
import { eventsService } from '../services/events';

export const FeedScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsService.getEvents();
      setEvents(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os eventos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const response = await eventsService.joinEvent(eventId);
      if (response.success) {
        Alert.alert('Sucesso', 'Você se inscreveu no evento!');
        loadEvents(); // Recarregar eventos para atualizar participantes
      } else {
        Alert.alert('Erro', response.error || 'Não foi possível se inscrever');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao se inscrever');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      OPEN: '#4CAF50',
      FULL: '#FF9800',
      DONE: '#9E9E9E',
      CANCELLED: '#F44336',
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      OPEN: 'Aberto',
      FULL: 'Lotado',
      DONE: 'Finalizado',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const participantsCount = item.participants?.length || 0;
    const spotsLeft = item.totalSpots - participantsCount;
    const canJoin = item.status === 'OPEN' && spotsLeft > 0;

    return (
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventModality}>{item.modality}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.eventPlace}>{item.place?.name}</Text>
        
        <Text style={styles.eventDate}>
          {format(new Date(item.startsAt), "dd 'de' MMMM 'às' HH:mm", {
            locale: ptBR,
          })}
        </Text>

        <View style={styles.eventInfo}>
          <Text style={styles.eventOwner}>
            Organizado por: {item.owner?.name}
          </Text>
          <Text style={styles.eventSpots}>
            {participantsCount}/{item.totalSpots} participantes
          </Text>
        </View>

        {canJoin && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoinEvent(item.id)}
          >
            <Text style={styles.joinButtonText}>Participar</Text>
          </TouchableOpacity>
        )}

        {!canJoin && item.status === 'OPEN' && (
          <Text style={styles.fullText}>Evento lotado</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed de Eventos</Text>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventModality: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventPlace: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  eventOwner: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  eventSpots: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullText: {
    textAlign: 'center',
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

