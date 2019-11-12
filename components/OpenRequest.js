import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components";

import { NavigationEvents } from "react-navigation";

import * as firebase from "firebase";
import "@firebase/firestore";

class OpenRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RequestList: []
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const db = firebase.firestore();
    var collectionReference = db.collection("requests");
    var getList = [];
    collectionReference
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var item = Object.assign({ uid: doc.id }, doc.data());
          getList.push(item);
          this.setState({ RequestList: getList });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    const user_ = this.props.user;
    return (
      <>
        <NavigationEvents onDidFocus={() => this.init()} />
        <SectionTitle> Let's help them </SectionTitle>
        <Container>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              paddingBottom: 10,
              alignItems: "center"
            }}
          >
            {this.state.RequestList.map(
              request =>
                request.user != user_.name && (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.push("OpenRequest", {
                        List: request,
                        User: user_
                      });
                    }}
                  >
                    <User>
                      <UserPhoto source={{ uri: request.user_pic }} />
                    </User>
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
        </Container>
      </>
    );
  }
}

export default OpenRequest;

const SectionTitle = styled.Text`
  color: #fff;
  font-weight: 200;
  font-size: 20px;
  margin: 40px 0 15px 15px;
`;

const Container = styled.View`
  width: 100%;
  height: 120px;
`;

const User = styled.View`
  width: 80px;
  height: 80px;
  margin: 5px 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  justify-content: center;
  align-items: center;
`;

const UserPhoto = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
`;
