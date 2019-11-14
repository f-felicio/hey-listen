import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../services/firebase";

import { ScrollView, TouchableOpacity, Modal, Switch } from "react-native";

export default function MyRequestScreen({ navigation }) {
  const [modal, setModal] = useState(false);
  const [music, setMusic] = useState({});
  const [recommendedList, setRecommendedList] = useState([]);
  const [qtd, setQtd] = useState(0);
  const [shared, setShared] = useState(false);
  const playlist = navigation.getParam("List");

  useEffect(() => {
    function loadRequests() {
      var collectionReference = db.collection("recommends");
      var getList = [];
      collectionReference
        .where("request_id", "==", playlist.uid)
        .get()
        .then(snapshot => {
          var i = 0;
          snapshot.forEach(doc => {
            const item = Object.assign({ uid: doc.id }, doc.data());
            getList.push(item);
            item.added ? i++ : "";
            setQtd(+i);
          });
          setRecommendedList(getList);
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
      setShared(playlist.shared);
    }
    loadRequests();
  }, [modal]);

  add = music => {
    db.collection("recommends")
      .doc(music.uid)
      .update({
        added: true
      })
      .then(() => {
        setModal(false);
        setQtd(+1);
      });
  };
  skip = music => {
    db.collection("recommends")
      .doc(music.uid)
      .update({
        skipped: true
      })
      .then(() => {
        setModal(false);
      });
  };

  toggleSwitch = () => {
    db.collection("requests")
      .doc(playlist.uid)
      .update({
        shared: !shared
      })
      .then(() => {
        setShared(!shared);
      });
  };

  return (
    <ScrollView style={{ height: "100%", flex: 1 }}>
      <Modal
        animationType="slide"
        transparent
        visible={modal}
        onRequestClose={() => {
          setMusic({});
        }}
      >
        <ModalContainer>
          <ModalHeader>
            <ModalHeaderCover
              source={require("../assets/bg-recommended.jpg")}
              size="cover"
            />
            <CloseArea>
              <TouchableOpacity
                onPress={() => {
                  setModal(false);
                }}
              >
                <BtnBack>
                  <TxtBack>{"X"}</TxtBack>
                </BtnBack>
              </TouchableOpacity>
            </CloseArea>
            <ModalSpan>Recommended by</ModalSpan>
            <ModalAvatar source={{ uri: music.user_pic }} />
            <ModalUser>{music.user}</ModalUser>
          </ModalHeader>

          <ModalBody style={{ flex: 1 }}>
            <ScrollView
              style={{
                background: "#f7f7f7",
                borderWidth: 1,
                borderColor: "#000"
              }}
            >
              <ModalContent>
                <ModalCover>
                  <ModalArt source={{ uri: music.art }} />
                </ModalCover>
                <Title>{music.title}</Title>
                <Artist>{music.artist}</Artist>

                <Span>Listen in: {"(Soon)"}</Span>
                <ListenContainer>
                  <ListenIcon
                    source={{
                      uri:
                        "http://www.sccpre.cat/png/big/40/401161_spotify-png-logo.jpg"
                    }}
                  />
                  <ListenIcon
                    source={{
                      uri:
                        "http://www.vectorico.com/download/social_media/youtube-red-square.png"
                    }}
                  />
                </ListenContainer>

                <BtnsContainer>
                  <TouchableOpacity
                    onPress={() => {
                      skip(music);
                    }}
                  >
                    <BtnSkip>
                      <BtnTxt2>Skip</BtnTxt2>
                    </BtnSkip>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      add(music);
                    }}
                  >
                    <BtnAdd>
                      <BtnTxt>Add</BtnTxt>
                    </BtnAdd>
                  </TouchableOpacity>
                </BtnsContainer>
              </ModalContent>
            </ScrollView>
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
        <Count>{qtd}/10</Count>
        <TagView>
          {playlist.tags.map(tag => (
            <Tag>
              <TagText>{tag}</TagText>
            </Tag>
          ))}
        </TagView>
        <ContainerSwitch>
          <TextSwitch> Public </TextSwitch>
          <Switch onValueChange={toggleSwitch} value={shared} />
        </ContainerSwitch>
      </Header>

      <RecommendedContainer>
        <SectionTitle> Hey Listen </SectionTitle>
        {recommendedList.length < 1 && (
          <TextEmpty> No recommendations yet </TextEmpty>
        )}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingTop: 10,
            alignItems: "center",
            paddingBottom: 10
          }}
        >
          {recommendedList.map(
            music =>
              !music.added &&
              !music.skipped && (
                <TouchableOpacity
                  onPress={() => {
                    setModal(true);
                    setMusic(music);
                  }}
                >
                  <Recommended>
                    <ArtBig source={{ uri: music.art }} />
                    <TitleRecommended>{music.title}</TitleRecommended>
                    <ArtistRecommended>{music.artist}</ArtistRecommended>
                  </Recommended>
                </TouchableOpacity>
              )
          )}
        </ScrollView>
      </RecommendedContainer>

      <SectionTitle2> Songs Added </SectionTitle2>
      <ListContainer>
        {recommendedList.map(
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

MyRequestScreen.navigationOptions = {
  header: null
};

const ModalContainer = styled.View`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: 50px;
  height: 100%;
  flex: 1;
`;

const ModalHeader = styled.View`
  height: 25%;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  background: #394370;
`;

const ModalHeaderCover = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 0;
`;

const Span = styled.Text`
  font-size: 16px;
  color: #394370;
  font-size: 15px;
  margin-top: 20px;
`;

const CloseTxt = styled.Text`
  color: #fff;
  font-size: 22px;
`;

const ModalAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-bottom: 10px;
`;

const ModalSpan = styled.Text`
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.6px;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const ModalUser = styled.Text`
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.6px;
`;

const ModalBody = styled.View`
  background: #f7f7f7;
`;

const ModalContent = styled.View`
  justify-content: center;
  align-items: center;
`;
const ModalCover = styled.View`
  width: 65%;
  height: 55%;
  overflow: hidden;
  padding: 25px;
  box-shadow: 0 5px 10px rgba(57, 67, 112, 0.45);
  margin-top: 20%;
`;

const ModalArt = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const CloseArea = styled.View`
  width: 100%;
  align-items: flex-end;
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

const ListenContainer = styled.View`
  flex-direction: row;
  margin: 10px auto;
  width: 70%;
  justify-content: space-around;
`;

const ListenIcon = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  opacity: 0.7;
`;

const BtnsContainer = styled.View`
  flex-direction: row;
  margin: 20px auto;
  width: 90%;
  justify-content: space-between;
`;

const BtnAdd = styled.View`
  background: #43a047;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 100px;
  padding: 12px 0;
  box-shadow: 0 5px 10px rgba(0, 155, 0, 0.15);
`;

const BtnTxt = styled.Text`
  color: #fff;
  font-size: 17px;
  letter-spacing: 0.8;
  font-weight: bold;
`;
const BtnTxt2 = styled.Text`
  color: #2b2b2b;
  font-size: 17px;
  letter-spacing: 0.8;
  font-weight: bold;
`;

const BtnSkip = styled.View`
  background: #eceff1;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 100px;
  padding: 12px 0;
`;

const Header = styled.View`
  height: 305px;
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

const Count = styled.Text`
  color: #fff;
  font-size: 44px;
  letter-spacing: 0.9px;
  opacity: 0.9;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const TagView = styled.View`
  flex-direction: row;
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
const ContainerSwitch = styled.View`
  flex-direction: row;
  margin: 20px 15px 0;
  width: 100%;
  align-items: center;
  height: 35px;
  padding-left: 20px;
`;

const TextSwitch = styled.Text`
  color: #fff;
  font-size: 15px;
  letter-spacing: 0.8;
  margin-right: 20px;
`;

const RecommendedContainer = styled.View`
  padding: 10px 0 10px 10px;
  background: #262f48;
`;

const SectionTitle = styled.Text`
  color: #fff;
  font-size: 28px;
  letter-spacing: 1.5px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 5px;
`;
const TextEmpty = styled.Text`
  color: #fff;
  font-size: 15px;
  letter-spacing: 0.8;
  padding: 30px 10px;
`;

const Recommended = styled.View`
  height: 160px;
  margin: 0 10px;
  align-items: center;
  justify-content: center;
`;

const ArtBig = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  margin-top: 5px;
  box-shadow: 0 5px 10px rgba(57, 67, 112, 0.65);
`;

const TitleRecommended = styled.Text`
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.8px;
  font-weight: bold;
  margin-top: 10px;
`;

const ArtistRecommended = styled.Text`
  color: #fff;
  font-size: 11px;
  letter-spacing: 0.6px;
  opacity: 0.65;
  margin-top: 2px;
`;

const ListContainer = styled.View`
  padding: 20px;
`;
const SectionTitle2 = styled.Text`
  color: #394370;
  font-size: 18px;
  letter-spacing: 1.5px;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 15px;
`;
const Row = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
`;

const Art = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  margin-right: 10px;
`;

const Info = styled.View``;

const Title = styled.Text`
  color: #394370;
  font-size: 15px;
  letter-spacing: 0.8px;
  font-weight: bold;
`;

const Artist = styled.Text`
  color: #394370;
  font-size: 12px;
  letter-spacing: 0.6px;
  opacity: 0.65;
  margin-top: 5px;
`;
