import React from "react";
import styled from "styled-components";
import { StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Genres, Decades, Moods } from "../db";
import * as firebase from "firebase";
import "@firebase/firestore";

class NewRequestScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      request: {
        name: "",
        tags: []
      },
      genre: "",
      mood: "",
      decade: ""
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const user_ = navigation.getParam("user");
    this.setState({
      user: user_.name,
      user_pic: user_.user_pic
    });
  }

  add() {
    var tags = [this.state.genre, this.state.mood, this.state.decade];
    var request = {
      name: this.state.request.name,
      user: this.state.user,
      user_pic: this.state.user_pic,
      tags: tags
    };
    const db = firebase.firestore();
    db.collection("requests")
      .add(request)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      })
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
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
          <LabelForm>Name</LabelForm>
          <InputForm
            onChangeText={name =>
              this.setState({
                request: {
                  ...this.state.request,
                  name
                }
              })
            }
            value={this.state.request.name}
          />
          {(this.state.genre != "" ||
            this.state.decade != "" ||
            this.state.mood != "") && (
            <Tags>
              <Tag> {this.state.genre} </Tag>
              <Tag> {this.state.decade} </Tag>
              <Tag> {this.state.mood} </Tag>
            </Tags>
          )}
          {this.state.genre != "" &&
            this.state.decade != "" &&
            this.state.mood != "" &&
            this.state.request.name != "" && (
              <TouchableOpacity
                onPress={() => {
                  this.add();
                }}
              >
                <BtnAdd>
                  <BtnTxt>Finish</BtnTxt>
                </BtnAdd>
              </TouchableOpacity>
            )}
          {(this.state.genre == "" ||
            this.state.decade == "" ||
            this.state.mood == "" ||
            this.state.request.name == "") && (
            <BtnAddDisabled>
              <BtnTxt>Finish</BtnTxt>
            </BtnAddDisabled>
          )}
          <LabelForm>Genre</LabelForm>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              alignItems: "center",
              paddingBottom: 10
            }}
          >
            {Genres.map(genre => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ genre });
                }}
              >
                <Card>
                  <Image
                    source={require("../assets/bg-shared.jpg")}
                    size="cover"
                  />
                  <CardText> {genre} </CardText>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <LabelForm>Decade</LabelForm>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              alignItems: "center",
              paddingBottom: 10
            }}
          >
            {Decades.map(decade => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ decade });
                }}
              >
                <Card>
                  <Image
                    source={require("../assets/bg-my-request.jpg")}
                    size="cover"
                  />
                  <CardText> {decade} </CardText>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <LabelForm>Mood</LabelForm>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              alignItems: "center",
              paddingBottom: 10
            }}
          >
            {Moods.map(mood => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ mood });
                }}
              >
                <Card>
                  <Image
                    source={require("../assets/bg-recommended.jpg")}
                    size="cover"
                  />
                  <CardText> {mood} </CardText>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Container>
      </ScrollView>
    );
  }
}

export default NewRequestScreen;

const Container = styled.View`
  flex: 1;
  background: #252c48;
  padding-top: 30px;
`;

const LabelForm = styled.Text`
  color: #fff;
  font-size: 22px;
  letter-spacing: 1px;
  padding-left: 15px;
  margin-top: 20px;
  font-weight: bold;
`;

const InputForm = styled.TextInput`
  height: 50px;
  border: 1px solid #ccc;
  margin: 20px 15px;
  border-radius: 25px;
  padding-left: 25px;
  color: #fff;
`;
const Tags = styled.View`
  flex-direction: row;
  width: 90%;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const Tag = styled.Text`
  color: #fff;
  font-size: 15px;
  letter-spacing: 1.2px;
  margin-right: 15px;
`;

const Card = styled.View`
  width: 150px;
  height: 100px;
  border-radius: 20px;
  margin: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  background: #262f48;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CardText = styled.Text`
  color: #fff;
  font-size: 15px;
  letter-spacing: 1.2px;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
`;

const BtnAdd = styled.View`
  background: #43a047;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 220px;
  padding: 12px 0;
  box-shadow: 0 5px 10px rgba(0, 155, 0, 0.15);
  margin: 10px auto 20px;
`;
const BtnAddDisabled = styled.View`
  background: #43a047;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 220px;
  padding: 12px 0;
  box-shadow: 0 5px 10px rgba(0, 155, 0, 0.15);
  margin: 10px auto 20px;
  opacity: 0.4;
`;

const BtnTxt = styled.Text`
  color: #fff;
  font-size: 17px;
  letter-spacing: 0.8;
  font-weight: bold;
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
