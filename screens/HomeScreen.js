import React from "react";
import { ScrollView, StatusBar } from "react-native";
import { NavigationEvents } from "react-navigation";
import styled from "styled-components";

import MyRequest from "../components/MyRequest";
import OpenRequest from "../components/OpenRequest";
import SharedList from "../components/SharedList";
import TopUsers from "../components/TopUsers";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };

  load() {
    StatusBar.setBarStyle("light-content", true);
  }

  render() {
    const { navigation } = this.props;
    const user = navigation.getParam("user");
    return (
      <HomeContainer>
        <NavigationEvents onDidFocus={() => this.load()} />
        <ScrollView
          style={{ height: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <MyRequest navigation={this.props.navigation} user={user} />
          <OpenRequest navigation={this.props.navigation} user={user} />
          <SharedList navigation={this.props.navigation} user={user} />
          <TopUsers navigation={this.props.navigation} />
        </ScrollView>
      </HomeContainer>
    );
  }
}

export default HomeScreen;

const HomeContainer = styled.View`
  flex: 1;
  background: #3e496b;
`;
