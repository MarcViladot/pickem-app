import React, { FC } from "react";
import { Image, ImageStyle, StyleSheet } from "react-native";
import { User } from "../../interfaces/user.interface";

interface Props {
  user: User;
  styles: ImageStyle;
}

const UserImage: FC<Props> = ({user, styles}) => {
  return (
    <Image style={styles}
           source={{uri: user.photo || `https://eu.ui-avatars.com/api/?background=random&name=${user.name.split(' ').join('+')}`}}/>
  );
};

export default UserImage;
