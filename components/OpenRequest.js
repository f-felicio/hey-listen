import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components";

import { NavigationEvents } from "react-navigation";

import { db } from "../services/firebase";

export default function OpenRequest({ navigation, user }) {
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    function loadRequests() {
      var collectionReference = db.collection("requests");
      var getList = [];
      collectionReference
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const item = Object.assign({ uid: doc.id }, doc.data());
            getList.push(item);
          });
          setRequestList(getList);
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
    loadRequests();
  }, []);

  return (
    <>
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
          {requestList.map(
            request =>
              request.user != user.name && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("OpenRequest", {
                      List: request,
                      User: user
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
