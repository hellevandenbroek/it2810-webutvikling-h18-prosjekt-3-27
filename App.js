import React, {Component} from 'react';
import {createBottomTabNavigator, createStackNavigator} from "react-navigation";
import HomeScreen from "./components/HomeScreen";
import ContactsScreen from "./components/Contacts/ContactsScreen";
import AddContactScreen from "./components/Contacts/AddContactScreen";
import Icon from "react-native-vector-icons/Ionicons";
import {Text} from "react-native-elements";
import EditContactScreen from "./components/Contacts/EditContactScreen";
import TodoScreen from "./components/Todo/TodoScreen"
import CalendarScreen from "./components/Calendar/CalendarScreen";
import AddAgendaScreen from "./components/Calendar/AddAgendaScreen";
import EditAgendaScreen from "./components/Calendar/EditAgendaScreen";
import PedometerScreen from "./components/Pedometer/PedometerScreen";


/*
 * This is the React Native entry point. The component
 * that is default exported from here will be the
 * root component, and its render function will be
 * called to render our application
 *
 * This application uses react-native-navigation to
 * handle navigation. The navigation exported from
 * here serves as the root component.
 *
 * Our navigation tree is as follows:
 *  RootBottomTabNavigator : BottomTabNavigator
 *   * HomeStack : StackNavigator
 *    * HomeScreen
 *   * ContactsStack : StackNavigator
 *    * ContactsScreen
 *    * AddContactScreen
 *    * EditContactScreen
 *   * CalendarStack : StackNavigator
 *    * CalendarScreen
 *    * AddAgendaScreen
 *    * EditAgendaScreen
 *   * TodoStack : StackNavigator
 *    * TodoScreen
 *
 */


const HomeStack = createStackNavigator({
  Home: HomeScreen
});

const ContactsStack = createStackNavigator({
  Contacts: ContactsScreen,
  AddContact: AddContactScreen,
  EditContact: EditContactScreen
});

const CalendarStack = createStackNavigator({
  Calendar: CalendarScreen,
  AddAgenda: AddAgendaScreen,
  EditAgenda: EditAgendaScreen
});

// hide tabbar on certain screens
// from https://reactnavigation.org/docs/en/navigation-options-resolution.html
CalendarStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {tabBarVisible};
};

const TodoStack = createStackNavigator({
  Todo: TodoScreen
});

const PedometerStack = createStackNavigator({
  Pedometer: PedometerScreen
});

const RootBottomTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-home" color={tintColor} size={24}/>
      )
    }
  },
  Contacts: {
    screen: ContactsStack,
    navigationOptions: {
      tabBarLabel: 'Contacts',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-contacts" color={tintColor} size={24}/>
      )
    }
  },
  Calendar: {
    screen: CalendarStack,
    navigationOptions: {
      tabBarLabel: 'Calendar',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-calendar" color={tintColor} size={24}/>
      )
    }
  },
  Todo: {
    screen: TodoStack,
    navigationOptions: {
      tabBarLabel: 'Todo',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-checkmark-circle" color={tintColor} size={24}/>
      )
    }
  },
  Pedometer: {
    screen: PedometerStack,
    navigationOptions: {
      tabBarLabel: 'Pedometer',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-walk" color={tintColor} size={24}/>
      )
    }
  },
},{
  tabBarOptions: {
    activeTintColor:'green',
  },
});

export default RootBottomTabNavigator;
