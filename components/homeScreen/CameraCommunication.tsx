import { HomeScreenStyle } from "@/assets/styles/HomeScreen.style";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

type CameraCommunicationProps = {
  title: string;
  description: string;
  imgURL: string;
  id: number;
  isActive: boolean;
  onPressOption: (id: number) => void;
};

const CameraCommunication = ({
  title,
  description,
  imgURL,
  id,
  isActive,
  onPressOption,
}: CameraCommunicationProps) => {
  return (
    <View style={HomeScreenStyle.ImageSecondaryContainer}>
      <Pressable
        style={[
          HomeScreenStyle.HomeScreenImageContainer,
          isActive && HomeScreenStyle.HomeScreenImageContainerActive,
        ]}
        onPress={() => onPressOption(id)}
      >
        <View>
          <Image
            style={[
              HomeScreenStyle.HomeScreenImage,
              id === 1 && { height: 200, width: 140 },
            ]}
            source={imgURL}
          />
        </View>
      </Pressable>
      <Text style={HomeScreenStyle.ImagePrimaryText}>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
};

export default CameraCommunication;
