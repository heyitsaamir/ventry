import React, { useState, useRef, useContext } from "react";
import { View, Dimensions } from "react-native";
import { RNCamera, Point, Size, TrackedTextFeature } from "react-native-camera";
import { Icon, Text } from "react-native-elements";
import styled from "@emotion/native";
import { useHeaderHeight } from "@react-navigation/stack";
import { useThrottle } from "@react-hook/throttle";
import Modal from "react-native-modal";
import { ThemeProps, useTheme } from "../../Components/Theme";

interface BarcodeInputType {
  type: "Barcode";
  onBarcodeScanned: (barcode: string | undefined) => void;
}

interface TextInputType {
  type: "Text";
  onTextScanned: (text: string | undefined) => void;
}

type InputType = BarcodeInputType | TextInputType;

interface Props {
  title?: string;
  isVisible: boolean;
  input: InputType;
  dismiss: () => void;
}

export default function CameraInput(props: Props) {
  const { theme } = useTheme();
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [ratio, setRatio] = useState("4:3");
  const [imagePadding, setImagePadding] = useState(0);
  const cameraRef = useRef<RNCamera | null>(null);
  const [scannedText, setScannedText] = useThrottle<{
    text: string;
    bounds?: { origin: Point; size: Size };
  } | null>(null, 1);
  const headerHeight = useHeaderHeight();

  const { height: windowHeight, width } = Dimensions.get("window");
  const height = windowHeight - headerHeight;
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
              return closestRatio;
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
        setImagePadding(remainder);
        setRatio(ratioString);
        // Set a flag so we don't do this
        // calculation each time the screen refreshes
        setIsRatioSet(true);
      }
    }
  };

  return (
    <Modal style={{ margin: 0 }} isVisible={props.isVisible} onBackButtonPress={props.dismiss}>
      <Camera
        height={height}
        extraPadding={imagePadding}
        navHeight={headerHeight}
        captureAudio={false}
        onCameraReady={setCameraReady}
        onBarCodeRead={(res) => {
          if (props.input.type !== "Barcode") return;
          setScannedText({ text: res.data });
        }}
        onTextRecognized={(res) => {
          if (props.input.type !== "Text") return;
          if (res.textBlocks.length > 0) {
            const filteredBlocks = res.textBlocks.filter(acceptableTBs);
            const sortedTBs = filteredBlocks
              .map((tb) => ({ tb, size: sizeForTB(tb) }))
              .sort((tb1, tb2) => tb2.size - tb1.size)
              .map((tb) => tb.tb);
            const [textBlock] = sortedTBs;

            setScannedText({ text: textBlock.value, bounds: textBlock.bounds });
          }
        }}
        ratio={ratio}
        ref={cameraRef}
        type={"back"}
      >
        {props.title && (
          <TitleContainer theme={theme}>
            <Text style={{ color: theme.colors.text }}>{props.title}</Text>
          </TitleContainer>
        )}
        {scannedText?.bounds && (
          <View
            style={{
              borderColor: "wheat",
              borderWidth: 3,
              position: "absolute",
              top: scannedText.bounds.origin.y,
              right: scannedText.bounds.origin.x,
              width: scannedText.bounds.size.width,
              height: scannedText.bounds.size.height,
            }}
          />
        )}
      </Camera>
      <InfoContainer height={height} topPadding={imagePadding}>
        <Text h3 style={{ color: "white", flex: 1 }}>
          {scannedText && scannedText.text}
        </Text>
        <View style={{ flex: 0 }}>
          <Icon
            reverse
            raised
            name="times"
            color="red"
            type="font-awesome-5"
            onPress={() => {
              props.dismiss();
            }}
          />
          <Icon
            reverse
            name={"check"}
            type={"font-awesome-5"}
            color="green"
            onPress={() => {
              switch (props.input.type) {
                case "Barcode":
                  props.input.onBarcodeScanned(scannedText?.text);
                  break;
                case "Text":
                  props.input.onTextScanned(scannedText?.text);
                  break;
              }
            }}
          />
        </View>
      </InfoContainer>
    </Modal>
  );
}

const Camera = styled(RNCamera)<{
  height?: number;
  extraPadding: number;
  navHeight: number;
}>((props) => ({
  alignContent: "center",
  height: props.height,
  width: "100%",
}));

const InfoContainer = styled(View)<{ height: number; topPadding: number }>((props) => ({
  zIndex: 10,
  position: "absolute",
  right: 10,
  left: 10,
  height: props.height - props.topPadding,
  flexDirection: "row",
  alignItems: "flex-end",
}));

const TitleContainer = styled(View)<ThemeProps>((props) => ({
  height: 50,
  backgroundColor: props.theme.colors.background,
  padding: 5,
  alignItems: "center",
  justifyContent: "center",
}));

const sizeForTB = (tb: TrackedTextFeature) => tb.bounds.size.width * tb.bounds.size.height;
const acceptableTBs = (tb: TrackedTextFeature) => tb.value.split(" ").length < 5;
