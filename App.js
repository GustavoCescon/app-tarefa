import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableHighlight,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
// const image = { uri: "./resources/bg.jpg" };
console.disableYellowBox = true;
export default function App() {
  const image = require("./resources/bg.jpg");

  const [tarefas, setTarefa] = useState([]);
  const [tarefaAtual, setTarefaAtual] = useState("");
  const [modal, setModal] = useState(false);

  let [fontsLoaded, fontError] = useFonts({
    Lato_400Regular,
  });

  useEffect(() => {
    (async () => {
      try {
        let tarefasAtual = await AsyncStorage.getItem("tarefas");
        if (tarefasAtual == null) {
          setTarefa([]);
        } else {
          setTarefa(JSON.parse(tarefasAtual));
        }
      } catch (error) {}
    })();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  function deletarTarefa(id) {
    let novaTarefa = tarefas.filter((val) => {
      return val.id != id;
    });
    setTarefa(novaTarefa);

    (async () => {
      try {
        await AsyncStorage.setItem("tarefas", JSON.stringify(novaTarefa));
      } catch (error) {}
    })();
  }

  function addTarefa() {
    setModal(false);

    let id = 0;
    if (tarefas.length > 0) {
      id = tarefas[tarefas.length - 1].id + 1;
    }
    let tarefa = {
      id: id,
      tarefa: tarefaAtual,
    };
    setTarefa([...tarefas, tarefa]);

    (async () => {
      try {
        await AsyncStorage.setItem(
          "tarefas",
          JSON.stringify([...tarefas, tarefa])
        );
      } catch (error) {}
    })();
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={(text) => setTarefaAtual(text)}
              autoFocus={true}
            ></TextInput>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196f3" }}
              onPress={() => addTarefa()}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.text}>MINHAS TAREFAS</Text>
        </View>
      </ImageBackground>
      {tarefas.map((ele) => {
        return (
          <View style={styles.tarefaSingle}>
            <View style={{ flex: 1, width: "100%", padding: 10 }}>
              <Text>{ele.tarefa}</Text>
            </View>
            <View style={{ alignItems: "flex-end", flex: 1, padding: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  deletarTarefa(ele.id);
                }}
              >
                <EvilIcons name="minus" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      <TouchableOpacity
        style={styles.btnAddTarefa}
        onPress={() => {
          setModal(true);
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Adicionar tarefa
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 80,
  },
  text: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: "Lato_400Regular",
    marginTop: Constants.statusBarHeight,
  },
  coverView: {
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tarefaSingle: {
    marginTop: 30,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    flexDirection: "row",
    paddingBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  btnAddTarefa: {
    width: 200,
    padding: 8,
    backgroundColor: "gray",
    marginTop: 20,
  },
});
