import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailsScreen";
import MyRequestScreen from "../screens/MyRequestScreen";
import OpenRequestScreen from "../screens/OpenRequestScreen";
import NewRequestScreen from "../screens/NewRequestScreen";

const AppNavigator = createStackNavigator({
  Login: LoginScreen,
  Home: HomeScreen,
  Details: DetailScreen,
  MyRequest: MyRequestScreen,
  OpenRequest: OpenRequestScreen,
  NewRequest: NewRequestScreen
});

export default createAppContainer(AppNavigator);
