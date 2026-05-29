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
  const translateX = useSharedValue(0); //Stores horizontal movement.
  const hasTriggered = useSharedValue(false); //Prevents multiple replies from triggering.

  const pan = Gesture.Pan() //Create swipe gesture.
    .activeOffsetX(isMyMessage ? [-10, 999] : [-999, 10]) // right swipe only
    .failOffsetY([-10, 10]) //If finger moves vertically cancel gesture
    .onStart(() => {
      hasTriggered.value = false; //fresh swipe
    })
    .onUpdate((event) => { //run continuosly while dragging
      const dx = event.translationX;  //gets horizontal movement

      if (isMyMessage && dx < 0) {
        translateX.value = Math.max(dx, -SWIPE_THRESHOLD * 1.3); //limit swiping distance
      } else if (!isMyMessage && dx > 0) {
        translateX.value = Math.min(dx, SWIPE_THRESHOLD * 1.3);
      }

      if (!hasTriggered.value && Math.abs(translateX.value) >= SWIPE_THRESHOLD) {
        hasTriggered.value = true; //trigger reply prevent duplicate
        runOnJS(onSwipe)();
      }
    })
    .onEnd(() => {
      translateX.value = withSpring(0); //move message back smoothly
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