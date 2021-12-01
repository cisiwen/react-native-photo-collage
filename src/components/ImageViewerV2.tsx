import {
  GestureEvent,
  HandlerStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  StyleSheet,
  ImageLoadEventData,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  View,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
  },
  pinchableImage: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    overflow: 'visible',
  },
});

export const ImageViewerV2 = (props: { url: string }) => {
  let scale = useSharedValue(1);

  /**
   * Translate
   */

  let translateX = useSharedValue(0);
  let translateY = useSharedValue(0);

  let translateXNumber: number = 0;
  let translateYNumber: number = 0;
  let currentMaxTranslateX = useSharedValue(0);
  let currentMaxTranslateY = useSharedValue(0);
  const longPressed = useSharedValue(0);
  const onPanGestureHandlerV2 = useAnimatedGestureHandler({
    onStart: (_ev, ctx: any) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
      ctx.maxTranX = currentMaxTranslateX.value;
      ctx.maxTranY = currentMaxTranslateY.value;
    },
    onActive: (ev, ctx: any) => {
      if (longPressed.value === 0) {
        let x = ctx.offsetX + ev.translationX;
        let y = ctx.offsetY + ev.translationY;
        if (ev.translationX > 0) {
          // Translate to right
          if (x > 0) {
            x = 0;
          }
        } else if (ev.translationX < 0) {
          if (x < -ctx.maxTranX) {
            x = -ctx.maxTranX;
          }
        }

        if (ev.translationY > 0) {
          if (y > 0) {
            y = 0;
          }
        }

        //(ev.translationX, ctx.offsetX, ctx.maxTranX, x);

        translateXNumber = x;
        translateYNumber = 0;
        translateX.value = x; //Math.abs(x) > Math.abs(currentMaxTranslateX.value) ? (x < 0 ? -Math.abs(currentMaxTranslateX.value) : Math.abs(currentMaxTranslateX.value)) : x;
        translateY.value = 0;
        //currentTranslateX.value = translateX.value;
      } else {
        console.log(`move me ${props.url}`);
      }
    },
    onFinish: () => {
      console.log('done');
    },
  });

  const onPinchGestureHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (ev, ctx: any) => {
        ctx.lastScale = scale.value;
      },
      onActive: (ev, ctx: any) => {
        let value = ctx.lastScale * ev.scale;
        scale.value = value < 1 ? 1 : value;
      },
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  let [width, setWidth] = useState<number>(0);
  let [height, setHeight] = useState<number>(0);

  let [srcWidth, setSrcWidth] = useState<number>(0);
  let [srcHeight, setSrcHeight] = useState<number>(0);

  let containerWidth: number = 0;
  let containerHeight: number = 0;
  let imageWidth: number = 0;
  let imageHeight: number = 0;

  const onImageLayoutChange = (layout: LayoutChangeEvent) => {
    //console.log(layout.nativeEvent.layout);
  };
  const onLayoutChange = (layout: LayoutChangeEvent) => {
    containerWidth = layout.nativeEvent.layout.width;
    containerHeight = layout.nativeEvent.layout.height;
    constraintDimension(srcWidth, srcHeight, containerWidth, containerHeight);
  };
  const onImageLoaded = (evt: NativeSyntheticEvent<ImageLoadEventData>) => {
    imageWidth = evt.nativeEvent.source.width;
    imageHeight = evt.nativeEvent.source.height;
    setSrcWidth(imageWidth);
    setSrcHeight(imageHeight);
    constraintDimension(
      imageWidth,
      imageHeight,
      containerWidth,
      containerHeight
    );
  };

  const constraintDimension = (
    imgW: number,
    imgH: number,
    cW: number,
    cH: number
  ) => {
    if (imgW > 0 && imgH > 0 && cW > 0 && cH > 0) {
      let newWidth: number = 0,
        newHeight: number = 0;
      let ratioW = imgW / cW;
      let ratioH = imgH / cH;

      let min = Math.min(ratioH, ratioW);
      if (min === ratioW) {
        newWidth = cW;
        newHeight = (newWidth / imgW) * imgH;
      } else {
        newHeight = cH;
        newWidth = (newHeight / imgH) * imgW;
      }

      setHeight(newHeight);
      setWidth(newWidth);
      currentMaxTranslateX.value = newWidth - cW;
      currentMaxTranslateY.value = newHeight - cH;
      //console.log(constraintDimension.name, imgH, imgW, newHeight, newWidth, cH, cW);

      if (translateX.value === 0) {
        //translateX.value = (-currentMaxTranslateX.value / 2);
        //translateY.value = (currentMaxTranslateY.value / 2);
      }
      //currentTranslateX.value= translateX.value;
    }
  };

  const onHandlerStateChange = (
    evt: HandlerStateChangeEvent<LongPressGestureHandlerEventPayload>
  ) => {
    console.log(onHandlerStateChange.name, evt.nativeEvent.state);
    if (evt.nativeEvent.state === State.BEGAN) {
      longPressed.value = 0;
    } else if (evt.nativeEvent.state === State.ACTIVE) {
      console.log(onHandlerStateChange.name, evt.nativeEvent.state);
      longPressed.value = 1;
      //topStyle.value = evt.nativeEvent.absoluteY;
      //topStyle.value = evt.nativeEvent.absoluteX;
    }
  };

  const onLongPressGestureEvent = (
    evt: GestureEvent<LongPressGestureHandlerEventPayload>
  ) => {
    if (evt.nativeEvent.state === State.ACTIVE) {
    }
  };

  return (
    <PanGestureHandler maxPointers={1} onGestureEvent={onPanGestureHandlerV2}>
      <Animated.View
        onLayout={(evt) => {
          onLayoutChange(evt);
        }}
        style={[styles.rootContainer]}
      >
        <View style={[styles.flexOne]}>
          <PinchGestureHandler
            minPointers={2}
            onGestureEvent={onPinchGestureHandler}
          >
            <Animated.View style={[styles.container]} collapsable={false}>
              <Animated.Image
                onLayout={onImageLayoutChange}
                onLoad={onImageLoaded}
                resizeMode={'cover'}
                style={[styles.pinchableImage, animatedStyles]}
                source={{ uri: props.url }}
              />
            </Animated.View>
          </PinchGestureHandler>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};
