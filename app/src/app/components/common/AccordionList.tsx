import React, { FC, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import {useTheme} from '@react-navigation/native';
import {ThemeText} from './ThemeText';

interface Props {
  name: string;
  listItems: any[];
  openByDefault: boolean;
}

const AccordionList: FC<Props> = ({name, listItems, openByDefault}) => {

  const { colors } = useTheme();
  const [open, setOpen] = useState(openByDefault);

  return (
    <View>
      <View style={styles.listHeader}>
        <ThemeText style={styles.listName}>{name}</ThemeText>
        <Pressable onPress={() => setOpen(prevState => !prevState)} testID={"toggleButton"}>
          <FontAwesomeIcon icon={open ?  faChevronUp : faChevronDown} color={'gray'} size={14} />
        </Pressable>
      </View>
      { open &&
        <View style={styles.listContent} testID={"listContent"}>
          {listItems.map((item) => item)}
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 12
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingRight: 15,
    paddingLeft: 15
  }
})

export default AccordionList;
