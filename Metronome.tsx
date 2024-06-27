import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const Metronome: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tick, setTick] = useState<Sound | null>(null);

  // Load the tick sound
  useEffect(() => {
    Sound.setCategory('Playback');
    const sound = new Sound(require('./assets/tick.wav'), (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setTick(sound);
    });

    // Cleanup sound when component unmounts
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  // Toggle metronome
  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && tick) {
      // Calculate the interval in milliseconds for 120 BPM
      const intervalTime = (60 / 120) * 1000;

      interval = setInterval(() => {
        tick.play((success) => {
          if (!success) {
            console.log('Failed to play sound');
          }
        });
      }, intervalTime);
    }

    // Cleanup interval on stop or component unmount
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Metronome at 120 BPM</Text>
      <Button title={isPlaying ? "Stop" : "Start"} onPress={toggleMetronome} />
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
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Metronome;
