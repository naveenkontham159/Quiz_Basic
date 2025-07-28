import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../components/BottomNavbar';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

type ThemeType = 'Dark' | 'Light' | 'Gold';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ activeTab, onTabPress }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('Dark');
  const [notificationSound, setNotificationSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  const themes: { name: ThemeType; description: string; icon: string }[] = [
    { name: 'Dark', description: 'Classic dark theme', icon: 'moon' },
    { name: 'Light', description: 'Clean light theme', icon: 'sunny' },
    { name: 'Gold', description: 'Luxurious gold theme', icon: 'diamond' },
  ];

  const handleThemeSelect = (theme: ThemeType) => {
    setSelectedTheme(theme);
    // Here you would implement theme switching logic
    console.log(`Theme changed to: ${theme}`);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your quiz progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Here you would implement progress reset logic
            Alert.alert('Success', 'Your progress has been reset.');
            console.log('Progress reset');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Selection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Theme Selection</Text>
            <View style={styles.sectionCard}>
              {themes.map((theme) => (
                <TouchableOpacity
                  key={theme.name}
                  style={[
                    styles.themeOption,
                    theme.name === themes[themes.length - 1].name && styles.lastOption,
                  ]}
                  onPress={() => handleThemeSelect(theme.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeLeft}>
                    <View style={styles.themeIconContainer}>
                      <Icon name={theme.icon} size={20} color="#CBA656" />
                    </View>
                    <View style={styles.themeInfo}>
                      <Text style={styles.themeTitle}>{theme.name}</Text>
                      <Text style={styles.themeDescription}>{theme.description}</Text>
                    </View>
                  </View>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedTheme === theme.name && styles.radioButtonSelected
                    ]}>
                      {selectedTheme === theme.name && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.sectionCard}>
              {/* Notification Sound Toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Icon name="notifications" size={20} color="#CBA656" />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Notification Sound</Text>
                    <Text style={styles.settingDescription}>Play sound for notifications</Text>
                  </View>
                </View>
                <Switch
                  value={notificationSound}
                  onValueChange={setNotificationSound}
                  trackColor={{ false: '#2A2A2A', true: 'rgba(203, 166, 86, 0.3)' }}
                  thumbColor={notificationSound ? '#CBA656' : '#666666'}
                  ios_backgroundColor="#2A2A2A"
                />
              </View>

              <View style={styles.separator} />

              {/* Vibration Toggle */}
              <View style={[styles.settingRow, styles.lastSettingRow]}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Icon name="phone-portrait" size={20} color="#CBA656" />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Vibration</Text>
                    <Text style={styles.settingDescription}>Vibrate on interactions</Text>
                  </View>
                </View>
                <Switch
                  value={vibration}
                  onValueChange={setVibration}
                  trackColor={{ false: '#2A2A2A', true: 'rgba(203, 166, 86, 0.3)' }}
                  thumbColor={vibration ? '#CBA656' : '#666666'}
                  ios_backgroundColor="#2A2A2A"
                />
              </View>
            </View>
          </View>

          {/* Data Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <View style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetProgress}
                activeOpacity={0.7}
              >
                <View style={styles.resetLeft}>
                  <View style={styles.resetIconContainer}>
                    <Icon name="refresh" size={20} color="#FF6B6B" />
                  </View>
                  <View style={styles.resetInfo}>
                    <Text style={styles.resetTitle}>Reset Progress</Text>
                    <Text style={styles.resetDescription}>Clear all quiz data and statistics</Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.sectionCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.separator} />
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.infoLabel}>Build</Text>
                <Text style={styles.infoValue}>2024.01</Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
        
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
    fontFamily: 'serif',
  },
  sectionCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
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
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  themeDescription: {
    fontSize: 14,
    color: '#B8B8B8',
    letterSpacing: 0.2,
  },
  radioContainer: {
    marginLeft: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#CBA656',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBA656',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  lastSettingRow: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  settingDescription: {
    fontSize: 14,
    color: '#B8B8B8',
    letterSpacing: 0.2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  resetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resetInfo: {
    flex: 1,
  },
  resetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  resetDescription: {
    fontSize: 14,
    color: '#B8B8B8',
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#CBA656',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 24,
  },
});

export default SettingsScreen;