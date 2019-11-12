import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components";

import * as firebase from "firebase";
import "@firebase/firestore";

class TopUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: []
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const db = firebase.firestore();
    var collectionReference = db.collection("users");
    var getList = [];
    collectionReference
      .orderBy("rating", "desc")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          getList.push(doc.data());
          this.setState({ usersList: getList });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    return (
      <>
        <SectionTitle>Top Users</SectionTitle>
        <Container>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              alignItems: "center",
              paddingBottom: 10
            }}
          >
            {this.state.usersList.map(user => (
              <TouchableOpacity
                onPress={() => {
                  console.log("user");
                }}
              >
                <User>
                  <UserPhoto source={{ uri: user.user_pic }} />
                  <UserRating>{user.rating}%</UserRating>
                </User>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Container>
      </>
    );
  }
}

export default TopUsers;

const SectionTitle = styled.Text`
  color: #fff;
  font-weight: 200;
  font-size: 20px;
  margin: 40px 0 15px 15px;
`;

const Container = styled.View`
  width: 100%;
  height: 150px;
`;

const User = styled.View`
  width: 90px;
  height: 110px;
  margin: 5px 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  justify-content: center;
  align-items: center;
`;

const UserName = styled.Text`
  color: #fff;
  opacity: 0.85;
  font-size: 14px;
  margin-top: 5px;
`;

const UserPhoto = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
`;

const UserRating = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-top: 5px;
`;
