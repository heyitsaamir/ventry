import React from "react";
import { Item } from "../../Store/types";

export type OnBarcodeScanned = (barcodeString: string) => void;

export const CameraContext = React.createContext<{
  onBarcodeScanned?: OnBarcodeScanned;
  setOnBarcodeScanned: (fn?: OnBarcodeScanned) => void;
}>({
  onBarcodeScanned: undefined,
  setOnBarcodeScanned: (fn?: OnBarcodeScanned) => {},
});
