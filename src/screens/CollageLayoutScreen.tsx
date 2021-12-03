import * as React from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';

//import { ImageViewer } from './ImageViewer';
import { MediaCollage } from '../components/MediaCollage';
import { Layout5, Layout5_W2W2W2W2W1 } from '../layouts/Layout5Items';
import { ControlBar, IControlBarProps } from '../components/ControlBar';
import { ICollageLayout } from '../models/Collage';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlobalSetting } from '../components/GlobalSetting';
import {
  collageLayoutToCollageItem,
  getLinkItemByIds,
} from '../utility/Utitliy';
import { MCEventBus, MCEventType } from '../components/EventBus';
import { ControlBorderRadius } from '../components/ControlBorderRadius';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRecordScreenZone } from '../components/ViewRecorder';
export interface ICollageLayoutScreenProps {
  mediasUri: string[];
}

export function CollageLayoutScreen(props: ICollageLayoutScreenProps) {
  let w: number, h: number, borderW: number, radius: number, spacing: number;

  w = h = Dimensions.get('screen').width;
  borderW = 1;
  spacing = 5;
  radius = 10;

  GlobalSetting.spacing = useSharedValue(spacing);
  GlobalSetting.spacingV2 = new Animated.Value(spacing);
  GlobalSetting.radius = useSharedValue(radius);

  let totalSpaceWidth = borderW * 2;

  let lists = Layout5(w, h, totalSpaceWidth);
  let urls: string[] = props?.mediasUri ?? [
    'https://www.fsbus.com/wp-content/uploads/2016/02/0713084kx.jpg',
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1115%2F51d76cebj00r2l9oq004wc000ku00tqg.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1115%2Feec49515j00r2l9oq0048c000ku00v9g.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1115%2F8419eac2j00r2l9pc001lc000ku00dwg.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1115%2F11062988j00r2l9q0002sc000ku00u0g.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1115%2F5f30e2c3j00r2l9q3003dc000ku00u0g.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
  ];

  const defaultLayout5: ICollageLayout = {
    title: Layout5_W2W2W2W2W1.name,
    items: collageLayoutToCollageItem(Layout5_W2W2W2W2W1(), w, h, borderW),
  };

  defaultLayout5.items.forEach((a) => {
    //console.log(a.resizerItem)
  });
  //assignValue(defaultLayout5.items);
  defaultLayout5.items.forEach((a, i) => {
    //console.log("bottomResizerPointLinks", a.resizerItem.bottomResizerPointLinks?.value);
    //console.log("topResizerPointLinks", a.resizerItem.topResizerPointLinks?.value);
    //console.log("leftResizerPointLinks", a.resizerItem.leftResizerPointLinks?.value);
    //console.log("rightResizerPointLinks", a.resizerItem.rightResizerPointLinks?.value);
    a.uri = urls[i];
  });

  const onControlItemPressed = (
    evt: GestureResponderEvent,
    payload: ICollageLayout
  ) => {
    console.log(evt.nativeEvent);
    MCEventBus.dispatchEevent(MCEventType.LayoutChanged, payload);
    let newLayout = lists.find((a) => a.title === payload.title);
    if (newLayout) {
      GlobalSetting.newLayout = newLayout;
      defaultLayout5.items.forEach((a) => {
        let newSetting = newLayout?.items.find((b) => b.id === a.id);
        newSetting.uri = a.uri;
        if (newSetting) {
          //a.resizerItem = newSetting.resizerItem;
          //a.resizerItemValue.value = newSetting.resizerItem;
          a.style.translateX.value = newSetting.style.translateX.value;
          a.style.translateY.value = newSetting.style.translateY.value;
          a.style.bottomEdge.value = newSetting.style.bottomEdge.value;
          a.style.topEdge.value = newSetting.style.topEdge.value;
          a.style.leftEdge.value = newSetting.style.leftEdge.value;
          a.style.rightEdge.value = newSetting.style.rightEdge.value;
          a.style.top.value = withTiming(newSetting.style.top.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          a.style.left.value = withTiming(newSetting.style.left.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          a.style.width.value = withTiming(newSetting?.style.width.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          a.style.height.value = withTiming(newSetting?.style.height.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          let newResizer = newSetting.resizerItem;
          a.resizerItem.bottomResizerPointLinks.bottom.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.bottomResizerPointLinks?.bottomIds
          );
          a.resizerItem.bottomResizerPointLinks.top.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.bottomResizerPointLinks?.topIds
          );

          a.resizerItem.topResizerPointLinks.bottom.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.topResizerPointLinks?.bottomIds
          );
          a.resizerItem.topResizerPointLinks.top.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.topResizerPointLinks?.topIds
          );

          a.resizerItem.leftResizerPointLinks.left.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.leftResizerPointLinks?.leftIds
          );
          a.resizerItem.leftResizerPointLinks.right.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.leftResizerPointLinks?.rightIds
          );

          a.resizerItem.rightResizerPointLinks.left.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.rightResizerPointLinks?.leftIds
          );
          a.resizerItem.rightResizerPointLinks.right.value = getLinkItemByIds(
            defaultLayout5.items,
            newResizer.rightResizerPointLinks?.rightIds
          );
        }
      });
    }
  };

  const data: IControlBarProps = {
    onControlItemPressed: (
      evt: GestureResponderEvent,
      payload: ICollageLayout
    ) => {
      onControlItemPressed(evt, payload);
    },
    layouts: lists,
  };

  const { startRecording, stopRecording, RecordScreenZone } =
    useRecordScreenZone();

  let recordBtnWidth = useSharedValue<number>(50);
  let recordBtnRadius = useSharedValue<number>(50);
  let recordButtonStyle = useAnimatedStyle(() => {
    return {
      width: recordBtnWidth.value,
      height: recordBtnWidth.value,
      borderRadius: recordBtnRadius.value,
      backgroundColor: 'green',
    };
  });

  const handleOnStartRecording = async () => {
    recordBtnRadius.value = withTiming(0, {
      duration: 100,
      easing: Easing.elastic(),
    });
    recordBtnWidth.value = withTiming(20, {
      duration: 100,
      easing: Easing.elastic(),
    });
    let result = await startRecording();
    console.log('handleOnStartRecording', result);
  };

  const handleOnStopRecording = async () => {
    recordBtnRadius.value = withTiming(50, {
      duration: 100,
      easing: Easing.elastic(),
    });
    recordBtnWidth.value = withTiming(50, {
      duration: 100,
      easing: Easing.elastic(),
    });
    const res = await stopRecording();
    if (res) {
      console.log('handleOnStopRecording', res);
    }
  };

  let isRecording: boolean = false;
  const onRecordButtonPressed = () => {
    if (!isRecording) {
      isRecording = true;
      handleOnStartRecording();
    } else {
      isRecording = false;
      handleOnStopRecording();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.layoutContainer]}>
        <Text style={[styles.textStyle]}>
          山是水的温柔，天是地的厮守，谁为谁而等候。
        </Text>
        <RecordScreenZone style={[styles.collageContainer]}>
          <MediaCollage layout={defaultLayout5} />
        </RecordScreenZone>
      </View>
      <View style={[styles.controlContainer]}>
        <View style={[styles.recordContainer]}>
          <Pressable onPress={onRecordButtonPressed}>
            <Animated.View style={[recordButtonStyle]} />
          </Pressable>
        </View>
        <ControlBorderRadius />
        <ControlBar data={data} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'visible',
  },
  recordContainer: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  recordStartButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'green',
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    justifyContent: 'center',
  },
  textStyle: {
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 5,
    color: '#212121',
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: '900',
    fontFamily: 'Chalkduster',
    padding: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
    transform: [
      {
        translateY: 10,
      },
      {
        skewY: '0deg',
      },
      {
        skewX: '0deg',
      },
    ],
  },
  collageContainer: {
    zIndex: 2,
    opacity: 1,
  },
  controlContainer: {
    display: 'flex',
    paddingBottom: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
