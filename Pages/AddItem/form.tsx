import styled from "@emotion/native";
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, ReactNode, Ref } from "react";
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
  containerId: string;
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

interface ValidationRef {
  validate(showErrors: boolean): boolean;
}

export interface FormRef extends ValidationRef {
  isModified(): boolean;
}

interface Props {
  fields: FieldInfoArgs;
  onDone: (fieldResults: FieldInfoArgs) => void;
  navigation: NavigatorProps;
  footer?: React.ReactNode;
}

const useError = () => {
  const [error, setError] = React.useState<string | undefined>();
  return { error, setError };
};

const useTextInputState: <T = string | undefined>(
  initialValue: T
) => { value: T; onChangeText: (value: T) => void } & ReturnType<typeof useError> = (initialValue) => {
  const [value, setTextValue] = React.useState(initialValue);
  const error = useError();
  const setValue = (val: typeof value): void => {
    if (error.error) {
      error.setError(undefined);
    }
    setTextValue(val);
  };
  return { value, onChangeText: setValue, ...error };
};

const useNumberInputState = (initialValue: number | undefined) => {
  const [value, setNumberValue] = React.useState<number | undefined>(initialValue);
  const error = useError();
  const setValue = (val: typeof value): void => {
    if (error.error) {
      error.setError(undefined);
    }
    setNumberValue(val);
  };
  return { value, onChange: setValue, ...error };
};

const useBooleanInputState = (initialValue: boolean | undefined) => {
  const [value, setBooleanValue] = React.useState<boolean | undefined>(initialValue);
  const error = useError();
  const setValue = (val: typeof value): void => {
    if (error.error) {
      error.setError(undefined);
    }
    setBooleanValue(val);
  };
  return { value, onValueChange: setValue, ...error };
};

const Form = forwardRef<FormRef, Props>(({ fields, onDone, navigation, footer }: Props, ref) => {
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
        itemId: fields.get(FieldType.containerId).itemId,
      });
    }

    onDone(new FieldInfoArgs(fieldInfos));
  };

  const titleRef = useRef<ValidationRef>(null);
  const upcRef = useRef<ValidationRef>(null);
  const quantityRef = useRef<ValidationRef>(null);
  const isContainerRef = useRef<ValidationRef>(null);
  const containerIdRef = useRef<ValidationRef>(null);

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
      validate(showErrors: boolean) {
        const isTitleValid = titleRef.current?.validate(showErrors) ?? true;
        const isUpcValid = upcRef.current?.validate(showErrors) ?? true;
        const isQuantityValid = quantityRef.current?.validate(showErrors) ?? true;
        const isIsContainerValid = isContainerRef.current?.validate(showErrors) ?? true;
        const isContainerIdValid = containerIdRef.current?.validate(showErrors) ?? true;
        return isTitleValid && isUpcValid && isQuantityValid && isIsContainerValid && isContainerIdValid;
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
      titleRef,
      upcRef,
      quantityRef,
      isContainerRef,
      containerIdRef,
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
              validationRef={titleRef}
              {...titleInputState}
              disabled={fields.isDisabled(FieldType.title)}
              originalTitle={fields.get(FieldType.title)?.title ?? ""}
            />
          )}
          {fields.has(FieldType.isContainer) && (
            <IsContainerSelector
              validationRef={isContainerRef}
              {...isContainerInputState}
              {...fields.get(FieldType.isContainer)}
            />
          )}
        </InputContainer>
      )}
      {detailsFields && (
        <InputContainer label="Details">
          {fields.has(FieldType.quantity) && !isContainerInputState.value && (
            <NumberSelector
              validationRef={quantityRef}
              {...quantityInputState}
              disabled={fields.isDisabled(FieldType.quantity)}
            />
          )}
          {fields.has(FieldType.upc) && (
            <UPCSelector
              {...upcInputState}
              validationRef={upcRef}
              disabled={fields.isDisabled(FieldType.upc)}
            />
          )}
          {fields.has(FieldType.containerId) && (
            <ContainerIdSelector
              validationRef={containerIdRef}
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

interface ValidationError {
  error?: string;
  setError: (error: string | undefined) => void;
}

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
} & ValidationError) => {
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

const Validation = forwardRef<
  ValidationRef,
  ValidationError & {
    validate: () => string | undefined;
    children: (error?: string) => JSX.Element;
  }
>((props, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      validate(showErrors: boolean) {
        const error = props.validate();
        if (error) {
          if (showErrors) {
            props.setError(error);
          }
          return false;
        }
        return true;
      },
    }),
    [props.setError, props.validate]
  );

  const { children: Child } = props;
  return Child(props.error);
});

const TitleSelector = forwardRef<
  ValidationRef,
  StringFieldSelector & { originalTitle: string } & ValidationError & { validationRef: Ref<ValidationRef> }
>((props, ref) => {
  const { theme } = useTheme();
  const [showScanner, setShowScanner] = useState(false);
  const hasModifiedText = props.value !== props.originalTitle;
  const hasAnyText = !!props.value;
  const animation = useAnimation({ doAnimation: hasModifiedText && hasAnyText, duration: 200 });

  return (
    <Validation
      ref={props.validationRef}
      {...props}
      validate={() => (!props.value ? "Name must be set" : undefined)}
    >
      {(error) => (
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
          <Error>{error}</Error>
        </>
      )}
    </Validation>
  );
});

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

const UPCSelector = (
  props: StringFieldSelector & ValidationError & { validationRef: Ref<ValidationRef> }
) => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <Validation ref={props.validationRef} {...props} validate={() => undefined}>
      {(error) => (
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
          <Error>{error}</Error>
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
      )}
    </Validation>
  );
};

const NumberSelector = (
  props: NumberFieldSelector & ValidationError & { validationRef: Ref<ValidationRef> }
) => {
  return (
    <Validation
      ref={props.validationRef}
      {...props}
      validate={() =>
        !props.value
          ? "Quantity must be set"
          : props.value < 0
          ? "Quantity needs to be greater or equal to 0"
          : undefined
      }
    >
      {(error) => (
        <>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>How many?</ListItem.Title>
            </ListItem.Content>
            <NumberInput {...props} />
          </ListItem>

          <Error>{error}</Error>
        </>
      )}
    </Validation>
  );
};

const IsContainerSelector = (
  props: BooleanFieldSelector &
    Omit<IsContainerField, "isContainer"> &
    ValidationError & { validationRef: Ref<ValidationRef> }
) => {
  const { theme } = useTheme();
  return (
    <Validation ref={props.validationRef} {...props} validate={() => undefined}>
      {(error) => (
        <>
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
          <Error>{error}</Error>
        </>
      )}
    </Validation>
  );
};

const ContainerIdSelector = (
  props: StringFieldSelector & {
    value: string;
    navigation: NavigatorProps;
    itemId: string | undefined;
  } & ValidationError & { validationRef: Ref<ValidationRef> }
) => {
  const { value, onChangeText, navigation, disabled, itemId } = props;
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
    <Validation ref={props.validationRef} {...props} validate={() => undefined}>
      {(error) => (
        <>
          <ListItem onPress={navigateSearch} disabled={disabled}>
            <ListItem.Content>
              <ListItem.Title>Where is this item contained?</ListItem.Title>
            </ListItem.Content>
            <ListItem.Title>{parent.name || "Root"}</ListItem.Title>
            <ListItem.Chevron />
          </ListItem>
          <Error>{error}</Error>
        </>
      )}
    </Validation>
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

const SimilarNameText = styled(Text)((props) => ({
  marginTop: 5,
  marginLeft: 5,
  color: props.theme.colors.text,
  fontStyle: "italic",
}));

const SimilarNameContainer = styled(Animated.View)({
  width: "100%",
});

const Error = (props: { children: React.ReactNode }) => {
  if (props.children) {
    return <StyledError>{props.children}</StyledError>;
  }
  return null;
};

const StyledError = styled(ListItem.Subtitle)((props) => ({
  color: props.theme.colors.error,
  padding: 5,
  fontStyle: "italic",
}));

export default Form;
