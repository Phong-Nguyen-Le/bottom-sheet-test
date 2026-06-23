import { Pressable, StyleSheet, View } from "react-native";

import { usePropertySheet } from "@/components/bottom-sheet/property-sheet-provider";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { PropertyCard, type Property } from "@/components/property-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";

const PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Loft",
    price: "$1,250,000",
    location: "123 Market St, San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: "2",
    title: "Cozy Suburban Home",
    price: "$850,000",
    location: "456 Oak Ave, Austin, TX",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  },
];

function PropertySheetContent({ property }: { property: Property }) {
  const { hide } = usePropertySheet();

  return (
    <View style={styles.sheetContent}>
      <ThemedText type="title" style={styles.sheetTitle}>
        {property.title}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.sheetPrice}>
        {property.price}
      </ThemedText>
      <ThemedText style={styles.sheetLocation}>{property.location}</ThemedText>

      <Pressable
        onPress={hide}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Close
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const { show } = usePropertySheet();

  const openSheet = (property: Property) => {
    show(<PropertySheetContent property={property} />);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Properties</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Long-press any property card below to open the contextual bottom
          sheet.
        </ThemedText>
      </ThemedView>

      {PROPERTIES.map((property) => (
        <ThemedView key={property.id} style={styles.cardWrapper}>
          <PropertyCard property={property} onLongPress={openSheet} />
        </ThemedView>
      ))}

      <Pressable
        onPress={() => openSheet(PROPERTIES[0])}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Show property sheet
        </ThemedText>
      </Pressable>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  sheetContent: {
    flex: 1,
    gap: 8,
  },
  sheetTitle: {
    fontSize: 24,
  },
  sheetPrice: {
    color: "#0a7ea4",
  },
  sheetLocation: {
    opacity: 0.8,
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
  },
});
