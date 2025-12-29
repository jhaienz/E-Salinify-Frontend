import { KeyboardScreenStyle } from "@/assets/styles/KeyboardScreen.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const Keyboard = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.back();
  };
  return (
    <View style={KeyboardScreenStyle.MainContainer}>
      <View style={KeyboardScreenStyle.BackButtonContainer}>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="long-arrow-left" size={35} />
        </TouchableOpacity>
      </View>
      <Text>Keyboard</Text>
    </View>
  );
};

export default Keyboard;
