import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = Math.min(SCREEN_HEIGHT * 0.55, 420);

const SPRING_CONFIG = {
  damping: 32,
  stiffness: 260,
  mass: 0.9,
  overshootClamping: true,
};

const CLOSE_CONFIG = {
  duration: 230,
  easing: Easing.in(Easing.cubic),
};

type PropertyBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export function PropertyBottomSheet({
  visible,
  onClose,
  children,
}: PropertyBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const CLOSED_Y = SHEET_HEIGHT + insets.bottom;

  const translateY = useSharedValue(CLOSED_Y);
  const contextY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else {
      translateY.value = withTiming(CLOSED_Y, CLOSE_CONFIG);
    }
  }, [visible, CLOSED_Y, translateY]);

  const pan = Gesture.Pan()
    .activeOffsetY([-5, 5])
    .onStart(() => {
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextY = contextY.value + event.translationY;

      translateY.value = Math.max(-8, nextY);
    })
    .onEnd((event) => {
      const shouldClose =
        translateY.value > SHEET_HEIGHT * 0.25 || event.velocityY > 700;

      if (shouldClose) {
        scheduleOnRN(onClose);
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const tint = isDark ? "dark" : "light";
  const solidBackground = isDark ? "#1c1c1e" : "#ffffff";

  return (
    <View
      style={styles.container}
      pointerEvents={visible ? "box-none" : "none"}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheetShadow,
            {
              height: SHEET_HEIGHT + insets.bottom,
            },
            Platform.OS === "android" && styles.androidShadow,
            sheetAnimatedStyle,
          ]}
        >
          <View style={styles.sheetClip}>
            {Platform.OS === "ios" ? (
              <>
                <BlurView
                  intensity={90}
                  tint={tint}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.35)",
                    },
                  ]}
                />
              </>
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: solidBackground,
                  },
                ]}
              />
            )}

            <View
              style={[
                styles.inner,
                {
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
            >
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    {
                      backgroundColor: isDark ? "#555" : "#ccc",
                    },
                  ]}
                />
              </View>

              <View style={styles.content}>{children}</View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },

  sheetShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 36,
    shadowColor: "#000",
  },

  sheetClip: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  androidShadow: {
    elevation: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
  },

  inner: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 20,
  },

  handleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },

  content: {
    flex: 1,
    paddingTop: 8,
    gap: 8,
  },
});
