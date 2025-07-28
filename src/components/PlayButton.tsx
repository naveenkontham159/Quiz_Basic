import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface PlayButtonProps {
  onPress: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#CBA656', '#FFD700', '#CBA656']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Icon name="play" size={28} color="#000000" style={styles.icon} />
        <Text style={styles.buttonText}>Play Quiz</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginVertical: 50,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 45,
    borderRadius: 50,
    minWidth: width * 0.65,
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.3)',
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'System', // Will use system sans-serif
  },
});

export default PlayButton;