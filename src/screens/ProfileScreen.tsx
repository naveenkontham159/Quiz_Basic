import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../components/BottomNavbar';
import { getUserProfile, updateUserName, UserProfile } from '../services/userDataService';

const { width, height } = Dimensions.get('window');

interface ProfileScreenProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  userProfile?: UserProfile | null;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ activeTab, onTabPress }) => {
  const [userName, setUserName] = useState('John Doe');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Mock user data - in a real app, this would come from your state management/API
  const userStats = {
    gamesPlayed: 47,
    avgAccuracy: 78.5,
    bestScore: 95,
    userId: 'UXA294',
  };

  const handleEditName = () => {
    setIsEditing(true);
    setTempName(userName);
  };

  const handleSaveName = () => {
    if (tempName.trim().length === 0) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setUserName(tempName.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={60} color="#CBA656" />
            </View>
          </View>

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            {/* Name with Edit */}
            <View style={styles.nameContainer}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    autoFocus
                    selectTextOnFocus
                    maxLength={30}
                    placeholderTextColor="#666666"
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={[styles.editActionButton, styles.cancelButton]}
                      onPress={handleCancelEdit}
                    >
                      <Icon name="close" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editActionButton, styles.saveButton]}
                      onPress={handleSaveName}
                    >
                      <Icon name="checkmark" size={16} color="#4ECDC4" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameDisplayContainer}>
                  <Text style={styles.userName}>{userName}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditName}
                  >
                    <Icon name="pencil" size={18} color="#CBA656" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* User ID */}
            <Text style={styles.userId}>#{userStats.userId}</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            
            <View style={styles.statsContainer}>
              {/* Games Played */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="game-controller" size={24} color="#CBA656" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{userStats.gamesPlayed}</Text>
                  <Text style={styles.statLabel}>Games Played</Text>
                </View>
              </View>

              {/* Average Accuracy */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="analytics" size={24} color="#CBA656" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{userStats.avgAccuracy}%</Text>
                  <Text style={styles.statLabel}>Avg Accuracy</Text>
                </View>
              </View>

              {/* Best Score */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="trophy" size={24} color="#CBA656" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{userStats.bestScore}%</Text>
                  <Text style={styles.statLabel}>Best Score</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <BottomNavbar activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#CBA656',
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: 'serif',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    borderWidth: 2,
    borderColor: '#CBA656',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  nameContainer: {
    marginBottom: 12,
  },
  nameDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginRight: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
  },
  editContainer: {
    alignItems: 'center',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    borderBottomWidth: 2,
    borderBottomColor: '#CBA656',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 200,
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editActionButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  saveButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  userId: {
    fontSize: 16,
    color: '#CBA656',
    fontFamily: 'monospace',
    letterSpacing: 1,
    fontWeight: '500',
  },
  statsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  statsContainer: {
    gap: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.2)',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#CBA656',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 14,
    color: '#B8B8B8',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default ProfileScreen;