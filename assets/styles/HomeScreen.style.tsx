import { COLOR } from "@/constant/colors";
import { StyleSheet } from "react-native";
import { fonts } from "../fonts/fonts";
export const HomeScreenStyle = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: COLOR.primary,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },
  TextContainer: {
    width: "100%",
  },
  WelcomeText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: COLOR.secondary,
    textAlign: "left",
  },
  HomeScreenImage: {
    width: 250,
    height: 180,
  },

  HomeScreenImageContainer: {
    width: "80%",
    height: "70%",
    backgroundColor: COLOR.accent,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  HomeScreenImageContainerActive: {
    borderWidth: 4,
    borderColor: COLOR.secondary,
  },

  ImageMainContainer: {
    height: "80%",
    width: "100%",
    alignItems: "center",
  },

  ImageSecondaryContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ImagePrimaryText: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },

  StartButton: {
    backgroundColor: COLOR.secondary,
    width: "60%",
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
  },

  StartButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  StartButtonText: {
    color: COLOR.primary,
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.bold,
  },
});
