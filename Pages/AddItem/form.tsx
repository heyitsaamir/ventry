import styled from "@emotion/native";
import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { Text, View } from "react-native";
import { Button, Icon, ListItem } from "react-native-elements";
import { ScrollView, Switch, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { EmojiSelectorContext } from "../../Components/Navigation/emojiSelectorContext";
import { NavigatorProps } from "../../Components/Navigation/Routes";
import { SearchContext } from "../../Components/Navigation/searchContext";
import NumberInput from "../../Components/NumberInput";
import { InventoryState } from "../../Store/inventory";
import { Item, State } from "../../Store/types";
import CameraInput from "./cameraInput";
import { IsContainer } from "../../lib/modelUtilities/itemUtils";
import { useAnimation } from "../../lib/hooks/useAnimation";
import Animated from "react-native-reanimated";
import { SearchedItems } from "../Search";
import TagList from "../../Components/TagList";
import { EmptyBasic } from "../../Components/Empty/EmptyBasic";
import { ThemeProps, useTheme } from "../../Components/Theme";

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
  disabled?: boolean;
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
  comment?: string;
}

interface ContainerIdField extends FieldInfo<FieldType.containerId> {
  containerId?: string;
  itemId: string | undefined;
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

  isDisabled = (type: FieldType) => {
    return !!this.get(type).disabled;
  };
}

export interface FormRef {
  isModified(): boolean;
}
interface Props {
  fields: FieldInfoArgs;
  onDone: (fieldResults: FieldInfoArgs) => void;
  navigation: NavigatorProps;
  footer?: React.ReactNode;
}

const useTextInputState: <T = string | undefined>(
  initialValue: T
) => { value: T; onChangeText: (value: T) => void } = (initialValue) => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

const useNumberInputState = (initialValue: number | undefined) => {
  const [value, setValue] = React.useState<number | undefined>(initialValue);
  return { value, onChange: setValue };
};

const useBooleanInputState = (initialValue: boolean | undefined) => {
  const [value, setValue] = React.useState<boolean | undefined>(initialValue);
  return { value, onValueChange: setValue };
};

const Form = forwardRef<FormRef, Props>(({ fields, onDone, navigation, footer }: Props, ref) => {
  const iconInputState = useTextInputState(fields.get(FieldType.icon)?.icon);
  const titleInputState = useTextInputState(fields.get(FieldType.title)?.title);
  const upcInputState = useTextInputState(fields.get(FieldType.upc)?.upc);
  const quantityInputState = useNumberInputState(fields.get(FieldType.quantity)?.quantity);
  const isContainerInputState = useBooleanInputState(fields.get(FieldType.isContainer)?.isContainer);
  const containerIdInputState = useTextInputState<string>(
    fields.get(FieldType.containerId)?.containerId ?? ""
  );

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
        itemId: fields.get(FieldType.containerId).itemId,
      });
    }

    onDone(new FieldInfoArgs(fieldInfos));
  };

  useImperativeHandle(
    ref,
    () => ({
      isModified() {
        const isIconModified = fields.get(FieldType.icon)?.icon !== iconInputState.value;
        const isTitleModified = fields.get(FieldType.title)?.title !== titleInputState.value;
        const isUpcModified = fields.get(FieldType.upc)?.upc !== upcInputState.value;
        const isQuantityModified = fields.get(FieldType.quantity)?.quantity !== quantityInputState.value;
        const isIsContainerModified =
          fields.get(FieldType.isContainer)?.isContainer !== isContainerInputState.value;
        const isContainerIdModified =
          fields.get(FieldType.containerId)?.containerId !== containerIdInputState.value;
        return (
          isIconModified ||
          isTitleModified ||
          isUpcModified ||
          isQuantityModified ||
          isIsContainerModified ||
          isContainerIdModified
        );
      },
    }),
    [
      fields,
      iconInputState,
      titleInputState,
      upcInputState,
      quantityInputState,
      isContainerInputState,
      containerIdInputState,
    ]
  );

  const basicItemFields = fields.has(FieldType.title) || fields.has(FieldType.isContainer);
  const detailsFields =
    fields.has(FieldType.quantity) || fields.has(FieldType.upc) || fields.has(FieldType.containerId);

  return (
    <ScrollView>
      {fields.has(FieldType.icon) && (
        <IconSelector
          {...iconInputState}
          navigation={navigation}
          disabled={fields.isDisabled(FieldType.icon)}
          isContainer={isContainerInputState.value ?? false}
        />
      )}
      {basicItemFields && (
        <InputContainer label="Basic information">
          {fields.has(FieldType.title) && (
            <TitleSelector
              {...titleInputState}
              disabled={fields.isDisabled(FieldType.title)}
              originalTitle={fields.get(FieldType.title)?.title ?? ""}
            />
          )}
          {fields.has(FieldType.isContainer) && (
            <IsContainerSelector {...isContainerInputState} {...fields.get(FieldType.isContainer)} />
          )}
        </InputContainer>
      )}
      {detailsFields && (
        <InputContainer label="Details">
          {fields.has(FieldType.quantity) && !isContainerInputState.value && (
            <NumberSelector {...quantityInputState} disabled={fields.isDisabled(FieldType.quantity)} />
          )}
          {fields.has(FieldType.upc) && (
            <UPCSelector {...upcInputState} disabled={fields.isDisabled(FieldType.upc)} />
          )}
          {fields.has(FieldType.containerId) && (
            <ContainerIdSelector
              {...containerIdInputState}
              navigation={navigation}
              disabled={fields.isDisabled(FieldType.containerId)}
              itemId={fields.get(FieldType.containerId).itemId}
            />
          )}
        </InputContainer>
      )}
      <SubmitButton title="Submit" onPress={onSubmit} />
      {footer}
    </ScrollView>
  );
});

interface StringFieldSelector {
  value: string | undefined;
  onChangeText: (newValue: string) => void;
  disabled?: boolean;
}

interface NumberFieldSelector {
  value: number | undefined;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

interface BooleanFieldSelector {
  value: boolean | undefined;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
}

const IconSelector = ({
  value,
  onChangeText,
  navigation,
  disabled,
  isContainer,
}: StringFieldSelector & {
  navigation: NavigatorProps;
  isContainer: boolean;
}) => {
  const { theme } = useTheme();
  const emojiContext = useContext(EmojiSelectorContext);

  const navigateEmojiSelector = () => {
    if (disabled) return;
    emojiContext.setOnEmojiTap((emoji) => {
      onChangeText(emoji);
      navigation.goBack();
    });

    navigation.navigate("EmojiSelector");
  };

  return (
    <IconContainer backgroundColor={theme.colors.white} disabled={disabled}>
      <MainIconContainer backgroundColor={theme.colors.secondary} onPress={navigateEmojiSelector}>
        <MainIcon>
          {value || (
            <Icon
              type="font-awesome-5"
              name={isContainer ? "box-open" : "file-image"}
              color={theme.colors.background}
            />
          )}
        </MainIcon>
      </MainIconContainer>
    </IconContainer>
  );
};

const TitleSelector = (props: StringFieldSelector & { originalTitle: string }) => {
  const [showScanner, setShowScanner] = useState(false);
  const hasModifiedText = props.value !== props.originalTitle;
  const hasAnyText = !!props.value;
  const animation = useAnimation({ doAnimation: hasModifiedText && hasAnyText, duration: 200 });

  return (
    <>
      <ListItem bottomDivider>
        <ListItem.Title>Name</ListItem.Title>
        <ListItem.Content>
          <ListItem.Input placeholder="of the item" {...props} />
        </ListItem.Content>
        <Icon
          name="camera"
          type="material-community"
          disabled={props.disabled}
          onPress={() => {
            setShowScanner(true);
          }}
        />
      </ListItem>
      {
        <SimilarNameContainer
          style={{ height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }) }}
        >
          {<SearchedSuggestion searchedText={props.value ?? ""} />}
        </SimilarNameContainer>
      }
      <CameraInput
        title="Scan your item's name for faster input"
        isVisible={showScanner}
        dismiss={() => {
          setShowScanner(false);
        }}
        input={{
          type: "Text",
          onTextScanned: (text) => {
            if (text) props.onChangeText(text);
            setShowScanner(false);
          },
        }}
      />
    </>
  );
};

const SearchedSuggestion = ({ searchedText }: { searchedText: string }) => {
  const { theme } = useTheme();
  if (!searchedText) return null;
  return (
    <View>
      <SimilarNameText theme={theme}>Other possible items with similar names</SimilarNameText>
      <SearchedItems
        searchTerm={searchedText}
        onItemTap={() => {}}
        display={(props) => {
          if (props.items.length === 0)
            return (
              <EmptyBasic
                icon={{
                  name: "search",
                  type: "material",
                  size: 15,
                  color: theme.colors.border,
                }}
                direction="row"
                text="No items"
              />
            );
          return <ItemTagList {...props} />;
        }}
      />
    </View>
  );
};

const ItemTagList = (props: { items: Item[] }) => {
  return <TagList tags={props.items.map((item) => ({ id: item.id, value: item.name }))} />;
};

const UPCSelector = (props: StringFieldSelector) => {
  const [showScanner, setShowScanner] = useState(false);
  return (
    <>
      <ListItem bottomDivider>
        <ListItem.Title>UPC</ListItem.Title>
        <ListItem.Content>
          <ListItem.Input placeholder="Optionally add a UPC for quick search" {...props} />
        </ListItem.Content>
        <Icon
          name="barcode-scan"
          type="material-community"
          disabled={props.disabled}
          onPress={() => {
            setShowScanner(true);
          }}
        />
      </ListItem>
      <CameraInput
        title="Scan your item's barcode"
        isVisible={showScanner}
        dismiss={() => {
          setShowScanner(false);
        }}
        input={{
          type: "Barcode",
          onBarcodeScanned: (text) => {
            if (text) props.onChangeText(text);
            setShowScanner(false);
          },
        }}
      />
    </>
  );
};

const NumberSelector = (props: NumberFieldSelector) => {
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>How many?</ListItem.Title>
      </ListItem.Content>
      <NumberInput {...props} />
    </ListItem>
  );
};

const IsContainerSelector = (props: BooleanFieldSelector & Omit<IsContainerField, "isContainer">) => {
  const { theme } = useTheme();
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>Is this a container?</ListItem.Title>
        {props.comment && <ListItem.Subtitle>{props.comment}</ListItem.Subtitle>}
      </ListItem.Content>
      <Switch
        {...props}
        value={props.value ?? false}
        ios_backgroundColor={theme.colors.border}
        trackColor={{ true: theme.colors.secondary, false: theme.colors.border }}
      />
    </ListItem>
  );
};

const ContainerIdSelector = ({
  value,
  onChangeText,
  navigation,
  disabled,
  itemId,
}: StringFieldSelector & { value: string; navigation: NavigatorProps; itemId: string | undefined }) => {
  const searchContext = useContext(SearchContext);
  const containers = useSelector<State, InventoryState["items"]>(
    (state: State) => state.inventory.present.items
  );
  const parent = containers[value];
  const navigateSearch = () => {
    searchContext.setOnItemTap((item) => {
      onChangeText(item.id);
      searchContext.setOnItemTap(undefined);
      searchContext.setPredicate(undefined);
      navigation.goBack();
    });
    searchContext.setPredicate!((items) => {
      // Only allow containers that are not children of this item
      // otherwise we'll get cycles
      const containersOnly = Object.values(items).filter(IsContainer);
      if (itemId == null) {
        return containersOnly;
      }

      const currentItem = items[itemId];
      if (!IsContainer(currentItem)) return containersOnly;

      const containerDescendantsSet = new Set<string>();
      const recursiveSearch = (item: Item) => {
        if (!IsContainer(item)) return;
        containerDescendantsSet.add(item.id);
        item.itemsInside.forEach((itemId) => {
          const itemInside = items[itemId];
          recursiveSearch(itemInside);
        });
      };
      recursiveSearch(currentItem);
      return containersOnly.filter((container) => !containerDescendantsSet.has(container.id));
    });

    navigation.navigate("Search");
  };

  return (
    <ListItem onPress={navigateSearch} disabled={disabled}>
      <ListItem.Content>
        <ListItem.Title>Where is this item contained?</ListItem.Title>
      </ListItem.Content>
      <ListItem.Title>{parent.name || "Root"}</ListItem.Title>
      <ListItem.Chevron />
    </ListItem>
  );
};

const InputContainer = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const { theme } = useTheme();
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

const IconContainer = styled(View)<{ backgroundColor: string; disabled?: boolean }>((props) => ({
  height: 100,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: props.backgroundColor,
  opacity: !props.disabled ? 1 : 0.7,
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
  shadowRadius: 3,
}));

const MainIcon = styled(Text)({
  textAlign: "center",
  marginTop: 7,
  fontSize: 40,
});

const SubmitButton = styled(Button)({
  flex: 0,
  marginVertical: 20,
});

const SimilarNameText = styled(Text)<ThemeProps>((props) => ({
  marginTop: 5,
  marginLeft: 5,
  color: props.theme.colors.text,
  fontStyle: "italic",
}));

const SimilarNameContainer = styled(Animated.View)({
  width: "100%",
});

export default Form;
