import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { Text, ThemeContext } from "react-native-elements";
import { CameraContext } from "../../Components/Navigation/cameraContext";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [ratio, setRatio] = useState("4:3");
  const [imagePadding, setImagePadding] = useState(0);
  const cameraRef = useRef<Camera>();
  const theme = useContext(ThemeContext);
  const cameraContext = useContext(CameraContext);

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
            const diff = screenRatio - realRatio;
            if (!closestRatio) {
              return {
                diff,
                ratio: realRatio,
                ratioString: ratio,
              };
            }
            if (diff > 0 && realRatio < closestRatio.diff) {
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
          } | null
        );

        const remainder = Math.floor((height - minRatio * width) / 2);
        // set the preview padding and preview ratio
        setImagePadding(remainder / 2);
        setRatio(ratioString);
        // Set a flag so we don't do this
        // calculation each time the screen refreshes
        console.log("remainder", remainder);
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
    <View style={{ flex: 1, backgroundColor: theme.theme.colors.black }}>
      <Camera
        style={[styles.camera, { marginTop: imagePadding, marginBottom: imagePadding }]}
        onCameraReady={setCameraReady}
        onBarCodeScanned={(res) => {
          if (cameraContext.onBarcodeScanned) {
            return cameraContext.onBarcodeScanned(res.data);
          }
        }}
        ref={cameraRef}
        ratio={ratio}
        type={type}
      />
      <View style={{ zIndex: 100 }}>
        <View style={{ backgroundColor: "white", flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
              );
            }}
          >
            <Text h3> Flip </Text>
          </TouchableOpacity>
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
