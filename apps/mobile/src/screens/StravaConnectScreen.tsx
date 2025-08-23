import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import api from '../services/api';

export const StravaConnectScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleConnectStrava = async () => {
    setLoading(true);
    try {
      // Buscar URL de autorização do Strava
      const response = await api.get('/oauth/strava/start');
      
      if (response.data.success && response.data.data.authUrl) {
        // Abrir browser para autorização
        const result = await WebBrowser.openBrowserAsync(
          response.data.data.authUrl
        );
        
        if (result.type === 'cancel') {
          Alert.alert('Cancelado', 'Autorização cancelada pelo usuário');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível iniciar a autorização');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert('Aviso', 'Conta Strava já conectada');
      } else {
        Alert.alert('Erro', 'Erro ao conectar com Strava');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Conectar com Strava</Text>
        
        <Text style={styles.description}>
          Conecte sua conta do Strava para sincronizar suas atividades e
          acompanhar seu progresso na plataforma Conexão Ativa.
        </Text>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Benefícios:</Text>
          <Text style={styles.benefit}>• Sincronização automática de atividades</Text>
          <Text style={styles.benefit}>• Acompanhamento de progresso</Text>
          <Text style={styles.benefit}>• Integração com comunidade</Text>
          <Text style={styles.benefit}>• Estatísticas detalhadas</Text>
        </View>

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.buttonDisabled]}
          onPress={handleConnectStrava}
          disabled={loading}
        >
          <Text style={styles.connectButtonText}>
            {loading ? 'Conectando...' : 'Conectar com Strava'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Ao conectar, você autoriza o Conexão Ativa a acessar suas atividades
          públicas do Strava. Você pode desconectar a qualquer momento.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  benefitsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  benefit: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#FC4C02',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  connectButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
});

