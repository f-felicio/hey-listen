import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components";

import { db } from "../services/firebase";

export default function SharedList({ navigation }) {
  const [sharedList, setSharedList] = useState([]);

  useEffect(() => {
    function loadRequests() {
      var collectionReference = db.collection("requests");
      var getList = [];
      collectionReference
        .where("shared", "==", true)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const item = Object.assign({ uid: doc.id }, doc.data());
            getList.push(item);
          });
          setSharedList(getList);
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
    loadRequests();
  }, []);

  return (
    <>
      <SectionTitle>Shared Lists</SectionTitle>
      <Container>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            alignItems: "center"
          }}
        >
          {sharedList.map((list, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate("Details", {
                  List: list
                });
              }}
            >
              <Card>
                <Image
                  source={require("../assets/bg-shared.jpg")}
                  size="cover"
                />
                <Avatar source={{ uri: list.user_pic }} />
                <CardName>{list.name}</CardName>
                <CardTags>{list.tags.map(tag => tag + " ")} </CardTags>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Container>
    </>
  );
}

const SectionTitle = styled.Text`
  color: #fff;
  font-weight: 200;
  font-size: 20px;
  margin: 25px 0 15px 15px;
`;

const Container = styled.View`
  width: 100%;
  height: 230px;
  background: #262f48;
`;

const Card = styled.View`
  width: 270px;
  height: 165px;
  border-radius: 16px;
  margin: 5px 15px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Avatar = styled.Image`
  width: 38px;
  height: 38px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 19px;
  opacity: 0.9;
`;

const CardName = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  position: absolute;
  bottom: 40px;
  left: 10px;
  letter-spacing: 0.6px;
`;

const CardTags = styled.Text`
  color: #fff;
  font-size: 13px;
  opacity: 0.7;
  position: absolute;
  bottom: 20px;
  left: 10px;
`;
