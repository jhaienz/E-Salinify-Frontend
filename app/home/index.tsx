import { HomeScreenStyle } from "@/assets/styles/HomeScreen.style";
import CameraCommunication from "@/components/homeScreen/CameraCommunication";
import { CameraCommunicationData } from "@/data/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
const Home = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleDeleteItem = () => {
    AsyncStorage.clear();
  };

  const handleActive = (id: number) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };
  return (
    <View style={HomeScreenStyle.MainContainer}>
      <View style={HomeScreenStyle.TextContainer}>
        <Text style={HomeScreenStyle.WelcomeText}>
          Hi! How do you want to communicate?
        </Text>
      </View>
      <View style={HomeScreenStyle.ImageMainContainer}>
        {CameraCommunicationData.map((data) => (
          <CameraCommunication
            key={data.id}
            id={data.id}
            title={data.title}
            description={data.description}
            imgURL={data.imgURL}
            isActive={activeId === data.id}
            onPressOption={handleActive}
          />
        ))}
      </View>
      <View style={HomeScreenStyle.StartButtonContainer}>
        {activeId ? (
          <TouchableOpacity
            style={HomeScreenStyle.StartButton}
            onPress={handleDeleteItem}
          >
            <Text style={HomeScreenStyle.StartButtonText}>Start Now</Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>
    </View>
  );
};

export default Home;
