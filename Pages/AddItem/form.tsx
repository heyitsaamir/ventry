import styled from "@emotion/native";
import React, { useContext, useMemo, useState } from "react";
import { Modal, Text, View } from "react-native";
import { Button, Icon, ListItem, ThemeContext } from "react-native-elements";
import { ScrollView, Switch, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { EmojiSelectorContext } from "../../Components/Navigation/emojiSelectorContext";
import { NavigatorProps } from "../../Components/Navigation/Routes";
import { SearchContext } from "../../Components/Navigation/searchContext";
import NumberInput from "../../Components/NumberInput";
import { InventoryState } from "../../Store/inventory";
import { State } from "../../Store/types";
import CameraInput from "./cameraInput";

export enum FieldType {
  icon,
  title,
  quantity,
  upc,
  isContainer,
  containerId,
}

interface FieldInfo<T extends FieldType> {
  type: T;
}

interface IconField extends FieldInfo<FieldType.icon> {
  icon?: string;
}

interface TitleField extends FieldInfo<FieldType.title> {
  title?: string;
}

interface QuantityField extends FieldInfo<FieldType.quantity> {
  quantity?: number;
}

interface UPCField extends FieldInfo<FieldType.upc> {
  upc?: string;
}

interface IsContainerField extends FieldInfo<FieldType.isContainer> {
  isContainer?: boolean;
}

interface ContainerIdField extends FieldInfo<FieldType.containerId> {
  containerId?: string;
}

export type FieldInfos =
  | IconField
  | TitleField
  | QuantityField
  | UPCField
  | IsContainerField
  | ContainerIdField;

type FieldInfoByFieldType = {
  [FieldType.icon]: IconField;
  [FieldType.title]: TitleField;
  [FieldType.containerId]: ContainerIdField;
  [FieldType.isContainer]: IsContainerField;
  [FieldType.quantity]: QuantityField;
  [FieldType.upc]: UPCField;
};

export class FieldInfoArgs {
  private map: Map<FieldType, FieldInfo<FieldType>>;
  constructor(fieldInfos: FieldInfos[]) {
    this.map = fieldInfos.reduce((map, field) => {
      map.set(field.type, field);
      return map;
    }, new Map<FieldType, FieldInfo<FieldType>>());
  }

  has = (type: FieldType) => {
    return this.map.has(type);
  };

  get = <T extends FieldType>(type: T): FieldInfoByFieldType[T] => {
    return this.map.get(type) as FieldInfoByFieldType[T];
  };
}

interface Props {
  fields: FieldInfoArgs;
  onDone: (fieldResults: FieldInfoArgs) => void;
  navigation: NavigatorProps;
}

const useTextInputState = (initialValue: string = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useNumberInputState = (initialValue: number = 1) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChange: setValue };
};

const useBooleanInputState = (initialValue: boolean = false) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onValueChange: setValue };
};

const Form = ({ fields, onDone, navigation }: Props) => {
  const iconInputState = useTextInputState(fields.get(FieldType.icon)?.icon);
  const titleInputState = useTextInputState(fields.get(FieldType.title)?.title);
  const upcInputState = useTextInputState(fields.get(FieldType.upc)?.upc);
  const quantityInputState = useNumberInputState(fields.get(FieldType.quantity)?.quantity);
  const isContainerInputState = useBooleanInputState(fields.get(FieldType.isContainer)?.isContainer);
  const containerIdInputState = useTextInputState(fields.get(FieldType.containerId)?.containerId);

  const onSubmit = () => {
    const fieldInfos: FieldInfos[] = [];
    if (fields.has(FieldType.icon)) {
      fieldInfos.push({
        type: FieldType.icon,
        icon: iconInputState.value,
      });
    }

    if (fields.has(FieldType.title)) {
      fieldInfos.push({
        type: FieldType.title,
        title: titleInputState.value,
      });
    }

    if (fields.has(FieldType.upc)) {
      fieldInfos.push({
        type: FieldType.upc,
        upc: upcInputState.value,
      });
    }

    if (fields.has(FieldType.quantity)) {
      fieldInfos.push({
        type: FieldType.quantity,
        quantity: quantityInputState.value,
      });
    }

    if (fields.has(FieldType.isContainer)) {
      fieldInfos.push({
        type: FieldType.isContainer,
        isContainer: isContainerInputState.value,
      });
    }

    if (fields.has(FieldType.containerId)) {
      fieldInfos.push({
        type: FieldType.containerId,
        containerId: containerIdInputState.value,
      });
    }

    onDone(new FieldInfoArgs(fieldInfos));
  };

  return (
    <ScrollView>
      {fields.has(FieldType.icon) && <IconSelector {...iconInputState} navigation={navigation} />}
      <InputContainer label="Item info">
        {fields.has(FieldType.title) && <TitleSelector {...titleInputState} />}
        {fields.has(FieldType.quantity) && !isContainerInputState.value && (
          <NumberSelector {...quantityInputState} />
        )}
        {fields.has(FieldType.upc) && <UPCSelector {...upcInputState} />}
      </InputContainer>
      <InputContainer label="Container info">
        {fields.has(FieldType.isContainer) && <IsContainerSelector {...isContainerInputState} />}
        {fields.has(FieldType.containerId) && (
          <ContainerIdSelector {...containerIdInputState} navigation={navigation} />
        )}
      </InputContainer>
      <SubmitButton title="Submit" onPress={onSubmit} />
    </ScrollView>
  );
};

interface StringFieldSelector {
  value: string;
  onChangeText: (newValue: string) => void;
}

interface NumberFieldSelector {
  value: number;
  onChange: (newValue: number) => void;
}

interface BooleanFieldSelector {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const IconSelector = ({
  value,
  onChangeText,
  navigation,
}: StringFieldSelector & {
  navigation: NavigatorProps;
}) => {
  const { theme } = useContext(ThemeContext);
  const emojiContext = useContext(EmojiSelectorContext);

  const navigateEmojiSelector = () => {
    emojiContext.setOnEmojiTap((emoji) => {
      onChangeText(emoji);
      navigation.goBack();
    });

    navigation.navigate("EmojiSelector");
  };

  return (
    <IconContainer backgroundColor={theme.colors.white}>
      <MainIconContainer backgroundColor={theme.colors.primary} onPress={navigateEmojiSelector}>
        <MainIcon>{value || "🍋"}</MainIcon>
      </MainIconContainer>
    </IconContainer>
  );
};

const TitleSelector = (props: StringFieldSelector) => {
  const [showScanner, setShowScanner] = useState(false);
  return (
    <>
      <ListItem>
        <ListItem.Title>Name</ListItem.Title>
        <ListItem.Content>
          <ListItem.Input placeholder="of the item" {...props} />
        </ListItem.Content>
        <Icon
          name="camera"
          type="font-awesome-5"
          onPress={() => {
            setShowScanner(true);
          }}
        />
      </ListItem>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showScanner}
        onRequestClose={() => {
          setShowScanner(false);
        }}
      >
        <CameraInput
          dismiss={() => {
            setShowScanner(false);
          }}
          input={{
            type: "Text",
            onTextScanned: (text) => {
              props.onChangeText(text);
              setShowScanner(false);
            },
          }}
        />
      </Modal>
    </>
  );
};

const UPCSelector = (props: StringFieldSelector) => {
  const [showScanner, setShowScanner] = useState(false);
  return (
    <>
      <ListItem>
        <ListItem.Title>UPC</ListItem.Title>
        <ListItem.Content>
          <ListItem.Input placeholder="Optionally add a UPC for quick search" {...props} />
        </ListItem.Content>
        <Icon
          name="qrcode"
          type="font-awesome-5"
          onPress={() => {
            setShowScanner(true);
          }}
        />
      </ListItem>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showScanner}
        onRequestClose={() => {
          setShowScanner(false);
        }}
      >
        <CameraInput
          dismiss={() => {
            setShowScanner(false);
          }}
          input={{
            type: "Barcode",
            onBarcodeScanned: (text) => {
              props.onChangeText(text);
              setShowScanner(false);
            },
          }}
        />
      </Modal>
    </>
  );
};

const NumberSelector = (props: NumberFieldSelector) => {
  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>How many?</ListItem.Title>
      </ListItem.Content>
      <NumberInput {...props} />
    </ListItem>
  );
};

const IsContainerSelector = (props: BooleanFieldSelector) => {
  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>Is this a container?</ListItem.Title>
      </ListItem.Content>
      <Switch {...props} />
    </ListItem>
  );
};

const ContainerIdSelector = ({
  value,
  onChangeText,
  navigation,
}: StringFieldSelector & { navigation: NavigatorProps }) => {
  const searchContext = useContext(SearchContext);
  const containers = useSelector<State, InventoryState["items"]>((state: State) => state.inventory.items);
  const parent = containers[value];
  const navigateSearch = () => {
    searchContext.setOnItemTap((item) => {
      onChangeText(item.id);
      navigation.goBack();
    });

    navigation.navigate("Search", {
      containersOnly: true,
    });
  };

  return (
    <ListItem onPress={navigateSearch}>
      <ListItem.Content>
        <ListItem.Title>Where is this item contained?</ListItem.Title>
      </ListItem.Content>
      <ListItem.Title>{parent.name || "Root"}</ListItem.Title>
      <ListItem.Chevron />
    </ListItem>
  );
};

const InputContainer = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View>
      <View
        style={{ backgroundColor: theme.colors.grey5, height: 50, justifyContent: "flex-end", padding: 10 }}
      >
        <Text style={{ fontSize: 16 }}>{label}</Text>
      </View>
      {children}
    </View>
  );
};

const IconContainer = styled(View)<{ backgroundColor: string }>((props) => ({
  height: 100,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: props.backgroundColor,
}));

const MainIconContainer = styled(TouchableOpacity)<{ backgroundColor: string }>((props) => ({
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 40,
  width: 80,
  height: 80,
  backgroundColor: props.backgroundColor,
  shadowColor: "rgba(0,0,0, .4)",
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 1,
  shadowRadius: 1,
}));

const MainIcon = styled(Text)({
  textAlign: "center",
  fontSize: 40,
});

const SubmitButton = styled(Button)({
  flex: 0,
  marginVertical: 20,
});

export default Form;
