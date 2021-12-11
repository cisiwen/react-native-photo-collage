import * as React from 'react';
import { CollageLayoutScreen, ImageViewer } from 'react-native-photo-collage';

export default function App() {
  let urls: string[] = [
    'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1201%2F7548af23j00r3fegg0017c000hs00npg.jpg&thumbnail=650x2147483647&quality=80&type=jpg',
    'https://www.popo8.com/host/data/202111/30/7/95f5f5a.jpg',
    'https://www.popo8.com/host/data/202111/30/15/8c72c92.jpg',
    'https://www.popo8.com/host/data/202111/30/9/bbdadbf.jpg',
    'https://www.popo8.com/host/data/202111/30/5/9a238d0.jpg',
  ];
  return <CollageLayoutScreen mediasUri={urls} />;
  //return <ImageViewer />;
}
