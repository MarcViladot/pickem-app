import React, { FC, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Props {
  name: string;
  listItems: any[];
  openByDefault: boolean;
}

const AccordionList: FC<Props> = ({name, listItems, openByDefault}) => {

  const [open, setOpen] = useState(openByDefault);

  return (
    <View>
      <View style={styles.listHeader}>
        <Text style={styles.listName}>{name}</Text>
        <Pressable onPress={() => setOpen(prevState => !prevState)}>
          <FontAwesomeIcon icon={open ?  faChevronUp : faChevronDown} color={'gray'} size={12} />
        </Pressable>
      </View>
      { open &&
        <View style={styles.listContent}>
          {listItems.map((item) => (
            <>{item}</>
          ))}
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
    paddingRight: 15,
    paddingLeft: 15
  },
  listName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  listContent: {
    paddingRight: 15,
    paddingLeft: 15
  }
})

export default AccordionList;
