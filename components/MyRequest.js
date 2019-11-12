import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components";

import { NavigationEvents } from "react-navigation";

import * as firebase from "firebase";
import "@firebase/firestore";

class MyRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myRequestList: []
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const user = this.props.user;
    const db = firebase.firestore();
    var collectionReference = db.collection("requests");
    var getList = [];
    collectionReference
      .where("user", "==", user.name)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var item = Object.assign({ uid: doc.id }, doc.data());
          getList.push(item);
          this.setState({ myRequestList: getList });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    const user = this.props.user;
    return (
      <>
        <NavigationEvents onDidFocus={() => this.init()} />
        <Container>
          <Image source={require("../assets/bg-my-request.jpg")} />
          <HeaderContainer>
            <SectionTitle>Your Requests</SectionTitle>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push("NewRequest", {
                  user: user
                });
              }}
            >
              <BtnNew>
                <BtnTxt> New </BtnTxt>
              </BtnNew>
            </TouchableOpacity>
          </HeaderContainer>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              paddingBottom: 10,
              alignItems: "center"
            }}
          >
            {this.state.myRequestList.map(request => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("MyRequest", {
                    List: request
                  });
                }}
              >
                <Card>
                  <Image
                    source={require("../assets/bg-request.png")}
                    size="cover"
                  />
                  <CardName>{request.name}</CardName>
                  <CardTags>{request.tags.map(tag => tag + " ")} </CardTags>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Container>
      </>
    );
  }
}

export default MyRequest;

const SectionTitle = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 26px;
`;

const Container = styled.View`
  width: 100%;
  height: 330px;
  overflow: hidden;
`;
const HeaderContainer = styled.View`
  flex-direction: row;
  margin: 45px 15px 0;
  width: 95%;
  justify-content: space-between;
`;

const BtnNew = styled.View`
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
  font-size: 15px;
  letter-spacing: 1px;
  font-weight: bold;
`;

const Card = styled.View`
  width: 270px;
  height: 185px;
  border-radius: 16px;
  margin: 5px 15px;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

const CardName = styled.Text`
  color: #263238;
  font-size: 18px;
  font-weight: 600;
  position: absolute;
  bottom: 40px;
  left: 10px;
`;

const CardTags = styled.Text`
  color: #263238;
  font-size: 13px;
  font-weight: 600;
  opacity: 0.5;
  position: absolute;
  bottom: 20px;
  left: 10px;
`;

const CardQtd = styled.Text`
  color: #263238;
  font-size: 22px;
  font-weight: 600;
  position: absolute;
  bottom: 40px;
  right: 10px;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
