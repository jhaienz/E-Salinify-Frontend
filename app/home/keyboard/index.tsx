import { SIGN_IMAGES, normalizeToSignKey } from "@/assets/HAND_SIGNS/signs";
import { KeyboardScreenStyle } from "@/assets/styles/KeyboardScreen.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Keyboard = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState<string>("");

  const handleNavigate = () => {
    router.back();
  };
  const handleTranslate = () => {
    setTranslated(text);
  };
  return (
    <View style={KeyboardScreenStyle.MainContainer}>
      <View style={KeyboardScreenStyle.BackButtonContainer}>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="long-arrow-left" size={35} />
        </TouchableOpacity>
        <TextInput
          style={style.input}
          placeholder="Click here…"
          value={text}
          onChangeText={setText}
        // onSubmitEditing={Keyboard.dismiss}
        />
        <Button
          onPress={handleTranslate}
          title="Translate"
          color="#841584"
          accessibilityLabel="Translate button"
        />
      </View>
      <View style={style.outputContainer}>
        <Text style={style.outputTitle}>Output</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={style.signsRow}>
          {translated.split("").map((ch, idx) => {
            const key = normalizeToSignKey(ch);
            if (key === ' ') {
              return <View key={`space-${idx}`} style={style.space} />;
            }
            if (key && SIGN_IMAGES[key]) {
              return (
                <Image
                  key={`img-${idx}-${key}`}
                  source={SIGN_IMAGES[key]}
                  style={style.signImage}
                  resizeMode="contain"
                />
              );
            }
            // Fallback for unsupported characters
            return (
              <View key={`unk-${idx}`} style={style.unknownWrap}>
                <Text style={style.unknownText}>{ch}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 36,
  },
  input: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  outputContainer: {
    marginTop: 16,
    width: '100%',
  },
  outputTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  signsRow: {
    alignItems: 'center',
  },
  signImage: {
    width: 56,
    height: 56,
    marginRight: 8,
    borderRadius: 6,
  },
  space: {
    width: 20,
    height: 1,
    marginRight: 8,
  },
  unknownWrap: {
    width: 56,
    height: 56,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  unknownText: {
    fontSize: 16,
  },
  status: {
    padding: 16,
    textAlign: 'center',
  },
});

export default Keyboard;
