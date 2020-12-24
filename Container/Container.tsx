import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {DragDropGrid} from 'react-native-drag-drop-grid-library';

const styles = StyleSheet.create({
  block: {
    borderColor: "#eee",
    borderBottomWidth: 1,
  },
});


export default function Container(props) {
  const refSortGrid = React.useRef<DragDropGrid>();
  return <View style={{ flex: 1 }}>
  <DragDropGrid
       ref={sortGrid => {
        refSortGrid.current = sortGrid;
       }}
       blockTransitionDuration={400}
       activeBlockCenteringDuration={200}
       itemsPerRow={4}
       dragActivationTreshold={200}
       onDragRelease   = { (itemOrder) => console.log("Drag was released, the blocks are in the following order: ", itemOrder)       }   
      onDragStart = { (key)          => console.log("Some block is being dragged now!",key) }   
      onMerge = {(itemKey,mergeBlockKey) => console.log("item and merge item",itemKey,mergeBlockKey)}
      merge={true}>
         {
           ['1','2','3','4','5','6',
           '7','8','9','10','11','12',
           '13','14','15','16','17','18',
           '19','20','21','22','23','24'].map( (letter, index) =>
             <View key={letter} style={styles.block}
             >
             <Text
              style={{color: '#666', fontSize: 50}}>{letter}</Text>
             </View>
           )
         }
      </DragDropGrid>
      </View>;
}