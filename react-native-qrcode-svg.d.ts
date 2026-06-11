declare module 'react-native-qrcode-svg' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface QRCodeProps extends ViewProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    quietZone?: number;
    logo?: number | string;
    logoSize?: number;
    logoMargin?: number;
    logoBorderRadius?: number;
    logoBackgroundColor?: string;
    logoBorderColor?: string;
    ecl?: 'L' | 'M' | 'Q' | 'H';
  }

  export default class QRCode extends React.Component<QRCodeProps> {}
}
