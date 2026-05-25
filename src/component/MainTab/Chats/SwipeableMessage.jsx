import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = 60;

const SwipeableMessage = ({ children, onSwipe, isMyMessage }) => {
  const translateX = useSharedValue(0);
  const hasTriggered = useSharedValue(false);

  const pan = Gesture.Pan()
    .activeOffsetX(isMyMessage ? [-10, 999] : [-999, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      hasTriggered.value = false;
    })
    .onUpdate((event) => {
      const dx = event.translationX;

      if (isMyMessage && dx < 0) {
        translateX.value = Math.max(dx, -SWIPE_THRESHOLD * 1.3);
      } else if (!isMyMessage && dx > 0) {
        translateX.value = Math.min(dx, SWIPE_THRESHOLD * 1.3);
      }

      if (!hasTriggered.value && Math.abs(translateX.value) >= SWIPE_THRESHOLD) {
        hasTriggered.value = true;
        runOnJS(onSwipe)();
      }
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default SwipeableMessage;