import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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

  const themes: { name: ThemeType; description: string; icon: string; locked?: boolean }[] = [
    { name: 'Dark', description: 'Classic dark theme', icon: 'moon' },
    { name: 'Light', description: 'Clean light theme', icon: 'sunny', locked: true },
    { name: 'Gold', description: 'Luxurious gold theme', icon: 'diamond', locked: true },
  ];

  const handleThemeSelect = (theme: ThemeType) => {
    const selectedThemeData = themes.find(t => t.name === theme);
    if (selectedThemeData?.locked) {
      Alert.alert(
        'Theme Locked',
        `${theme} theme is coming soon! Stay tuned for updates.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setSelectedTheme(theme);
    // Here you would implement theme switching logic
    console.log(`Theme changed to: ${theme}`);
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
                    theme.locked && styles.lockedThemeOption,
                  ]}
                  onPress={() => handleThemeSelect(theme.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeLeft}>
                    <View style={[
                      styles.themeIconContainer,
                      theme.locked && styles.lockedIconContainer
                    ]}>
                      <Icon 
                        name={theme.icon} 
                        size={20} 
                        color={theme.locked ? "#666666" : "#CBA656"} 
                      />
                    </View>
                    <View style={styles.themeInfo}>
                      <View style={styles.themeTitleContainer}>
                        <Text style={[
                          styles.themeTitle,
                          theme.locked && styles.lockedThemeTitle
                        ]}>
                          {theme.name}
                        </Text>
                        {theme.locked && (
                          <Icon name="lock-closed" size={14} color="#666666" style={styles.lockIcon} />
                        )}
                      </View>
                      <Text style={[
                        styles.themeDescription,
                        theme.locked && styles.lockedThemeDescription
                      ]}>
                        {theme.locked ? 'Coming soon' : theme.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedTheme === theme.name && styles.radioButtonSelected,
                      theme.locked && styles.lockedRadioButton
                    ]}>
                      {selectedTheme === theme.name && !theme.locked && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
  lockedThemeOption: {
    opacity: 0.6,
  },
  lockedIconContainer: {
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
  },
  themeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedThemeTitle: {
    color: '#666666',
  },
  lockIcon: {
    marginLeft: 8,
  },
  lockedThemeDescription: {
    color: '#666666',
  },
  lockedRadioButton: {
    borderColor: '#444444',
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