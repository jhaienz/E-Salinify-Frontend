import { CameraScreenStyle } from "@/assets/styles/CameraScreen.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
const Camera = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.back();
  };
  return (
    <View style={CameraScreenStyle.MainContainer}>
      <View style={CameraScreenStyle.BackButtonContainer}>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="long-arrow-left" size={35} />
        </TouchableOpacity>
      </View>
      <Text>Camera</Text>
    </View>
  );
};

export default Camera;
