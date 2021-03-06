import React, { useState, useEffect } from "react";
import { StatusBar, ImageBackground, ScrollView } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  StatusBar.setBarStyle("light-content", true);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const usersRef = await db.collection("users").get();
      const snapData = usersRef.docs.map(doc => doc.data());
      setUsersList(snapData);
    }
    loadUsers();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/bg-login.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <Container>
        <TextView>
          <Title>Request a playlist</Title>
          <Subtitle>Receive worldwide music suggestions</Subtitle>
        </TextView>
        <ChooseView>
          <Span> Choose one </Span>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              alignItems: "center",
              paddingBottom: 10
            }}
          >
            {usersList.map(user => (
              <User
                onPress={() => {
                  navigation.navigate("Home", {
                    user: user
                  });
                }}
              >
                <UserPhoto source={{ uri: user.user_pic }} />
              </User>
            ))}
          </ScrollView>
        </ChooseView>
        <BtnView>
          <Span> Soon </Span>
          <BtnSocial>
            <BtnGoogle>
              <LogoGoogle
                source={require("../assets/logo-google.png")}
                resizeMode="contain"
              />
              <BtnTxtDark> Google </BtnTxtDark>
            </BtnGoogle>
            <BtnFacebook>
              <Ionicons name="logo-facebook" size={24} color="#fff" />
              <BtnTxt> Facebook </BtnTxt>
            </BtnFacebook>
          </BtnSocial>
        </BtnView>
      </Container>
    </ImageBackground>
  );
}
LoginScreen.navigationOptions = {
  header: null
};

const Container = styled.View`
  flex: 1;
  height: 100%;
`;

const TextView = styled.View`
  justify-content: flex-end;
  padding: 20px;
  height: 50%;
`;

const Title = styled.Text`
  font-size: 30px;
  color: #fff;
  letter-spacing: 0.8px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #fff;
  margin-top: 5px;
  letter-spacing: 0.8px;
`;

const ChooseView = styled.View`
  padding: 20px 0px;
`;

const Span = styled.Text`
  padding-left: 15px;
  font-size: 16px;
  color: #fff;
  margin-bottom: 10px;
`;

const LogoGoogle = styled.Image`
  width: 24px;
`;

const BtnView = styled.View`
  justify-content: flex-end;
  padding: 20px 10px 40px;
  flex: 1;
`;

const BtnTxt = styled.Text`
  font-size: 15px;
  color: #fff;
  padding-left: 5px;
`;

const BtnTxtDark = styled.Text`
  font-size: 15px;
  color: #2b2b2b;
  padding-left: 5px;
`;

const BtnSocial = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const BtnGoogle = styled.View`
  background-color: #fff;
  border-radius: 25px;
  height: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 40%;
  opacity: 0.6;
`;

const BtnFacebook = styled.View`
  background-color: #39579f;
  border-radius: 25px;
  height: 50px;
  width: 40%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  opacity: 0.6;
`;

const BtnEmail = styled.View`
  background-color: #201229;
  border-radius: 25px;
  height: 50px;
  width: 96%;
  padding: 5px;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const User = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  margin: 5px 2px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.35);
  justify-content: center;
  align-items: center;
`;

const UserPhoto = styled.Image`
  width: 68px;
  height: 68px;
  border-radius: 34px;
`;
