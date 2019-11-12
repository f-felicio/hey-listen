import React from "react";
import styled from "styled-components";
import { ScrollView, TouchableOpacity } from "react-native";

import * as firebase from "firebase";
import "@firebase/firestore";

class DetailsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      playlist: []
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const db = firebase.firestore();
    var collectionReference = db.collection("recommends");
    var getList = [];
    const { navigation } = this.props;
    const playlist = navigation.getParam("List");
    collectionReference
      .where("request_id", "==", playlist.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          getList.push(doc.data());
          this.setState({ playlist: getList });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    const { navigation } = this.props;
    const playlist = navigation.getParam("List");
    return (
      <ScrollView style={{ height: "100%", flex: 1 }}>
        <Header>
          <Cover source={require("../assets/bg-shared.jpg")} size="cover" />
          <BackArea>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Home");
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
          {this.state.playlist.map(
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
}

export default DetailsScreen;

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
