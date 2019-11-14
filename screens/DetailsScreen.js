import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ScrollView, TouchableOpacity } from "react-native";
import { db } from "../services/firebase";

export default function DetailsScreen({ navigation }) {
  const playlist = navigation.getParam("List");
  const [playlistDetail, setPlaylistDetail] = useState([]);

  useEffect(() => {
    function loadRequests() {
      var collectionReference = db.collection("recommends");
      var getList = [];
      collectionReference
        .where("request_id", "==", playlist.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            getList.push(doc.data());
          });
          setPlaylistDetail(getList);
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
    loadRequests();
  }, []);

  return (
    <ScrollView style={{ height: "100%", flex: 1 }}>
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
        <Span>Creator</Span>
        <Avatar source={{ uri: playlist.user_pic }} />
        <ListUser>{playlist.user}</ListUser>
        <TagView>
          {playlist.tags.map(tag => (
            <Tag>
              <TagText>{tag}</TagText>
            </Tag>
          ))}
        </TagView>
      </Header>

      <ListContainer>
        {playlistDetail.map(
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
DetailsScreen.navigationOptions = {
  header: null
};
const Header = styled.View`
  height: 350px;
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
  font-size: 40px;
  font-weight: 600;
`;

const Avatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-bottom: 10px;
`;

const Span = styled.Text`
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.6px;
  opacity: 0.7;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const ListUser = styled.Text`
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.6px;
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
const ListContainer = styled.View`
  padding: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  margin: 10px 0;
  height: 60px;
  align-items: center;
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
  justify-content: flex-start;
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
