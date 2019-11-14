import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components";

import MyRequest from "../components/MyRequest";
import OpenRequest from "../components/OpenRequest";
import SharedList from "../components/SharedList";

export default function HomeScreen({ navigation }) {
  const user = navigation.getParam("user");

  return (
    <HomeContainer>
      <ScrollView
        style={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <MyRequest navigation={navigation} user={user} />
        <OpenRequest navigation={navigation} user={user} />
        <SharedList navigation={navigation} />
      </ScrollView>
    </HomeContainer>
  );
}
HomeScreen.navigationOptions = {
  header: null
};
const HomeContainer = styled.View`
  flex: 1;
  background: #3e496b;
`;
