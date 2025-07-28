import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface NavbarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabPress }) => {
  const navItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            activeTab === item.name && styles.activeNavItem,
          ]}
          onPress={() => onTabPress(item.name)}
          activeOpacity={0.7}
        >
          <Icon
            name={activeTab === item.name ? item.activeIcon : item.icon}
            size={26}
            color={activeTab === item.name ? '#CBA656' : '#B8B8B8'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    padding: 12,
    borderRadius: 16,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavItem: {
    backgroundColor: 'rgba(203, 166, 86, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.3)',
  },
});

export default Navbar;