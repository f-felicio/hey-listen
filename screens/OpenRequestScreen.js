import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  View
} from "react-native";
import { db } from "../services/firebase";
export default function OpenRequestScreen({ navigation }) {
  const playlist = navigation.getParam("List");
  const user = navigation.getParam("User");

  const [modal, setModal] = useState(false);
  const [recommended, setRecommended] = useState(null);
  const [data, setData] = useState([]);
  const [playlistUpdate, setPlaylistUpdate] = useState([]);

  resetModal = () => {
    setModal(false);
    setRecommended(null);
    setData([]);
  };

  searchFilterFunction = text => {
    if (text.length > 2) {
      var headers = {
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        "X-RapidAPI-Key": "cd0f8fe47amshd61e57756498bb2p1da0e7jsn240cfc5d9cea"
      };
      fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + text, {
        headers
      })
        .then(response => response.json())
        .then(responseJson => {
          setData(responseJson.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    function loadRequests() {
      const collectionReference = db.collection("recommends");
      const musics_added = [];
      collectionReference
        .where("request_id", "==", playlist.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            musics_added.push(doc.data());
          });
          setPlaylistUpdate(musics_added);
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
    loadRequests();
  }, []);

  add = music => {
    const item = Object.assign({
      request_id: playlist.uid,
      added: false,
      skipped: false,
      user: user.name,
      user_pic: user.user_pic,
      artist: music.artist.name,
      title: music.title,
      art: music.album.cover_big
    });

    db.collection("recommends")
      .add(item)
      .then(docRef => {
        resetModal();
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Modal
        animationType="slide"
        transparent
        visible={modal}
        onRequestClose={() => {
          setMusic({});
        }}
      >
        <ModalContainer>
          <ModalBody>
            <CloseArea>
              <TouchableOpacity onPress={resetModal}>
                <BtnClose>
                  <TxtBack>{"X"}</TxtBack>
                </BtnClose>
              </TouchableOpacity>
            </CloseArea>
            <LabelForm>Song:</LabelForm>
            <InputForm
              onChangeText={text => searchFilterFunction(text)}
              autoCorrect={false}
            />
            {!recommended && (
              <BtnAddContainer>
                <BtnAddDisabled>
                  <BtnTxt>Add Music</BtnTxt>
                </BtnAddDisabled>
              </BtnAddContainer>
            )}
            {recommended && (
              <TouchableOpacity
                onPress={() => {
                  add(recommended);
                }}
              >
                <BtnAdd>
                  <BtnTxt>Add Music</BtnTxt>
                </BtnAdd>
              </TouchableOpacity>
            )}
            <LabelForm>Results:</LabelForm>
            <Results style={{ flex: 1 }}>
              <ScrollView>
                <ModalContent>
                  {data.length > 0 &&
                    data.map(item => (
                      <TouchableOpacity
                        onPress={() => {
                          setRecommended(item);
                        }}
                      >
                        <Row>
                          <Art source={{ uri: item.album.cover_big }} />
                          <Info>
                            <Title>{item.title}</Title>
                            <Artist>{item.artist.name}</Artist>
                          </Info>
                        </Row>
                      </TouchableOpacity>
                    ))}
                </ModalContent>
              </ScrollView>
            </Results>
          </ModalBody>
        </ModalContainer>
      </Modal>
      <Header>
        <Cover source={require("../assets/bg-shared.jpg")} size="cover" />
        <BackArea>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <BtnBack>
              <TxtBack>{"X"}</TxtBack>
            </BtnBack>
          </TouchableOpacity>
        </BackArea>
        <ListName>{playlist.name}</ListName>
        <Span>Looking for:</Span>
        <TagView>
          {playlist.tags.map(tag => (
            <Tag>
              <TagText>{tag}</TagText>
            </Tag>
          ))}
        </TagView>
      </Header>

      <TouchableHighlight
        onPress={() => {
          setModal(true);
        }}
      >
        <BtnAdd>
          <BtnTxt>Recommend a song</BtnTxt>
        </BtnAdd>
      </TouchableHighlight>

      <ListContainer>
        <SectionTitle>Songs in the list</SectionTitle>
        {playlistUpdate.map(
          music =>
            music.added && (
              <Row>
                <Art source={{ uri: music.art }} />
                <Info>
                  <Title>{music.title}</Title>
                  <Artist>{music.artist}</Artist>
                </Info>
              </Row>
            )
        )}
      </ListContainer>
    </ScrollView>
  );
}

OpenRequestScreen.navigationOptions = {
  header: null
};

const ModalContainer = styled.View`
  margin-top: 50px;
  height: 100%;
`;

const Close = styled.View`
  height: 30px;
  width: 100px;
  background: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 20px;
`;

const CloseTxt = styled.Text`
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.8px;
`;

const ModalBody = styled.View`
  background: #fff;
  height: 100%;
  padding-top: 10px;
`;

const LabelForm = styled.Text`
  color: #394370;
  font-size: 15px;
  letter-spacing: 0.6px;
  padding-left: 15px;
  margin-top: 10px;
  font-weight: bold;
`;

const InputForm = styled.TextInput`
  height: 50px;
  border: 1px solid #ccc;
  margin: 0 15px;
  border-radius: 25px;
  padding-left: 25px;
  margin-top: 10px;
`;

const Results = styled.View`
  background: #f7f7f7;
`;
const ModalContent = styled.View``;

const Header = styled.View`
  height: 35%;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Cover = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const ListName = styled.Text`
  color: #fff;
  font-size: 30px;
  font-weight: 600;
`;

const Span = styled.Text`
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.6px;
  opacity: 0.7;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const TagView = styled.View`
  flex-direction: row;
  margin-top: 15px;
`;

const Tag = styled.View`
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  margin-right: 10px;
`;

const TagText = styled.Text`
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.6px;
  opacity: 0.8;
`;

const BtnAddContainer = styled.View`
  align-items: center;
  height: 70px;
`;
const BtnAdd = styled.View`
  background: #43a047;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  width: 200px;
  padding: 12px 0;
  margin: 10px auto;
`;
const BtnAddDisabled = styled.View`
  background: #43a047;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 200px;
  padding: 15px 0;
  margin: 10px auto;
  box-shadow: 0 5px 10px rgba(0, 155, 0, 0.15);
  opacity: 0.4;
`;

const BtnTxt = styled.Text`
  color: #fff;
  font-size: 17px;
  letter-spacing: 0.8;
`;

const ListContainer = styled.View`
  padding: 0px 15px;
  height: 80%;
`;

const SectionTitle = styled.Text`
  color: #394370;
  font-size: 18px;
  letter-spacing: 1.5px;
  font-weight: bold;
  margin-top: 30px;
`;

const Row = styled.View`
  flex-direction: row;
  margin: 10px 0;
  height: 60px;
  align-items: center;
  padding-left: 10px;
`;

const Art = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 6px;
  margin-right: 10px;
`;

const Info = styled.View``;

const Title = styled.Text`
  color: #394370;
  font-size: 18px;
  letter-spacing: 0.8px;
  font-weight: bold;
`;

const Artist = styled.Text`
  color: #394370;
  font-size: 13px;
  letter-spacing: 0.6px;
  opacity: 0.65;
  margin-top: 5px;
`;

const BackArea = styled.View`
  width: 100%;
  align-items: flex-start;
`;

const BtnBack = styled.View`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin: 5px 15px;
`;

const TxtBack = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const CloseArea = styled.View`
  width: 100%;
  align-items: flex-end;
`;

const BtnClose = styled.View`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 1);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin: 5px 15px;
`;
