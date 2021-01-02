import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from "react-native";
import { Camera } from "expo-camera";
import { Icon, Text, ThemeContext } from "react-native-elements";

interface BarcodeInputType {
  type: "Barcode";
  onBarcodeScanned: (barcode: string) => void;
}

type InputType = BarcodeInputType;

interface Props {
  input: InputType;
  dismiss: () => void;
}

export default function CameraInput(props: Props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [ratio, setRatio] = useState("4:3");
  const [imagePadding, setImagePadding] = useState(0);
  const cameraRef = useRef<Camera>();
  const theme = useContext(ThemeContext);
  const [scannedText, setScannedText] = useState("");

  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;

  const setCameraReady = async () => {
    if (!isRatioSet) {
      if (cameraRef.current) {
        const ratios = await cameraRef.current.getSupportedRatiosAsync();

        const { ratio: minRatio, ratioString } = ratios.reduce(
          (closestRatio, ratio) => {
            const [width, height] = ratio.split(":").map((str) => parseInt(str));
            const realRatio = width / height;
            const diff = Math.abs(screenRatio - realRatio);
            if (!closestRatio) {
              return {
                diff,
                ratio: realRatio,
                ratioString: ratio,
              };
            }
            if (diff > closestRatio.diff) {
              return {
                diff,
                ratio: realRatio,
                ratioString: ratio,
              };
            } else {
              closestRatio;
            }
          },
          { diff: Infinity, ratio: 4 / 3, ratioString: "4:3" } as {
            diff: number;
            ratio: number;
            ratioString: string;
          }
        );

        const remainder = Math.floor((height - minRatio * width) / 2);
        // set the preview padding and preview ratio
        setImagePadding(remainder / 2);
        setRatio(ratioString);
        // Set a flag so we don't do this
        // calculation each time the screen refreshes
        console.log("remainder", ratio);
        setIsRatioSet(true);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        top: height * 0.5,
        width: "100%",
        height: height,
      }}
    >
      <Camera
        style={[styles.camera, { marginTop: imagePadding, marginBottom: imagePadding }]}
        onCameraReady={setCameraReady}
        onBarCodeScanned={(res) => {
          setScannedText(res.data);
        }}
        ref={cameraRef}
        type={type}
      />
      <View
        style={{
          zIndex: 10,
          position: "absolute",
          right: 10,
          bottom: height * 0.5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text h3 style={{ color: "white" }}>
          {scannedText}
        </Text>
        <View>
          <Icon
            reverse
            name="check"
            type="font-awesome-5"
            onPress={() => {
              if (props.input.onBarcodeScanned) {
                props.input.onBarcodeScanned(scannedText);
              }
            }}
          />
          <Icon
            reverse
            name="times"
            type="font-awesome-5"
            onPress={() => {
              props.dismiss();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    // padding: 10,
    alignContent: "center",
  },
});
