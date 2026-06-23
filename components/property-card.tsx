import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
};

type PropertyCardProps = {
  property: Property;
  onLongPress: (property: Property) => void;
};

export function PropertyCard({ property, onLongPress }: PropertyCardProps) {
  return (
    <Pressable
      onLongPress={() => onLongPress(property)}
      delayLongPress={350}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ThemedView style={styles.inner}>
        <Image source={{ uri: property.image }} style={styles.image} contentFit="cover" transition={200} />
        <ThemedView style={styles.info}>
          <ThemedText type="subtitle">{property.title}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            {property.price}
          </ThemedText>
          <ThemedText style={styles.location}>{property.location}</ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pressed: {
    opacity: 0.9,
  },
  inner: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  price: {
    color: '#0a7ea4',
  },
  location: {
    opacity: 0.8,
  },
});
