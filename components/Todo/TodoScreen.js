import React, {Component} from "react";
import {
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  Platform,
  View,
} from "react-native";
import randomColor from "randomcolor";

import { Header } from 'react-navigation';

import CustomProgressBar from "./CustomProgressBar";
import Util from "./Util";
import SortedList from "./SortedList";

/**
 * This is the root component for the Todo screen
 */
export default class TodoScreen extends Component {
  constructor(props) {
    super(props);
    this.util = new Util();
    this.state = {
      tasks: [],
      completedTasks: [],
      text: "",
      selected: null,
    };
  }

  componentDidMount() {
    // Fetch tasks from storage, if any.
    this.retrieveTasks();
  }

  /**
   * Returns tasks (if any) and updates state
   *
   * @returns {Promise<void>} the return promise can be ignored
   */
  retrieveTasks = async () => {
    try {
      const taskKeysJson = await AsyncStorage.getItem("TASKKEYS") || "[]";
      const taskKeys = JSON.parse(taskKeysJson);
      if (taskKeys.length > 0) {
        const tasksResult = await AsyncStorage.multiGet(taskKeys);
        console.log("taskRes:", tasksResult);
        const tasks = tasksResult
          .map(keyvalue => keyvalue[1])
          .map(objJson => JSON.parse(objJson));
        this.setState({tasks: tasks});
        console.log("tasks:", tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleAddTask = async () => {
    if (this.state.text.length > 0) {
      let key = await this.util.retrieveAndIncreaseKeyCount();
      key = "task_" + key;
      const task = {
        key: key,
        text: this.state.text,
        completed: false,
        color: randomColor({luminosity: 'dark', hue: "green"})
      };
      this.setState(
        prevState => {
          let {tasks} = prevState;
          return {
            tasks: tasks.concat(task),
            text: ""
          };
        }
      );
    Task.save(task);
    }
  };

  /**
   *  This method deletes task from the tasks, updates state and deletes
   *  the task from storage
   * @param task
   */
  handleDeleteTask = (task) => {
    const taskKey = task.key;
    this.setState((prevState) => {
      const taskToDelete = prevState.tasks.find(task => task.key === taskKey);
      const index = prevState.tasks.indexOf(taskToDelete);
      let tasksCopy = [...prevState.tasks];
      tasksCopy.splice(index,1);
      return {tasks: tasksCopy}
    });
    Task.delete(task);

  };

  /**
   * This method changes the completed-state for a task,
   * and you can toggle between the value of completed
   * @param key of task to complete/uncomplete
   */
  handleTaskCompletion = key => {
    this.setState(
      prevState => {
        let tasks = [...prevState.tasks];
        let task = tasks.find((task) => task.key === key);
        task.completed ? task.completed = false : task.completed = true;
        return {tasks: tasks};
      }
    );
    const task = this.state.tasks.find(task => task.key === key);
    Task.save(Object.assign({}, task, {completed: !task.completed}));
  };
  handleSelectedTask = key => {
    this.setState({selected: key});
  };

  handleEditFinish = () => {
    this.setState({selected: null})
  };
  /**
   * This method allows for tasks to be edited, the edited task
   * is saved to storage and state is updated.
   * @param text, new text to insert into state and storage
   * @param task, the task of which to edit
   */
  handleTextEdit = (text, task) => {
    const taskKey = task.key;
    let taskCopy = Object.assign({},task, {text});
    this.setState((prevState) => {
      const oldTask = prevState.tasks.find(task => task.key === taskKey);
      const index = prevState.tasks.indexOf(oldTask);
      let tasksCopy = [...prevState.tasks];
      tasksCopy[index] = taskCopy;
      return {tasks: tasksCopy}
    });
    Task.save(taskCopy);
  };

  handleChangeText = (text) => {
    this.setState({text: text})
  };

  render() {
    let numCompleted = this.state.tasks.filter(task => task.completed === true).length;
    let numUncompleted = this.state.tasks.length;
    let progress = numCompleted/numUncompleted;

    return (
      <View
        style={styles.container}
      >
        <ScrollView>
          <SortedList
            tasks={this.state.tasks}
            selected={this.state.selected}
            onDeleteTask={this.handleDeleteTask}
            onTextEdit={this.handleTextEdit}
            onEditStart={this.handleSelectedTask}
            onEditFinish={this.handleEditFinish}
            toggleComplete={this.handleTaskCompletion}
          />
        </ScrollView>

        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Header.HEIGHT + Platform.select({android: 20, ios: 0})}>
          <CustomProgressBar
            numCompleted={numCompleted}
            numUncompleted={numUncompleted}
            progress={progress}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleAddTask}
            blurOnSubmit={false}
            value={this.state.text}
            placeholder="Add task.."
            autoCorrect={false}
            autoFocus
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

class Task {

  /**
   * Saves the task as a new task in storage.
   * @param task, an object with a key, text, a completed boolean and a random color.
   * @returns {Promise<void>} the return promise can be ignored
   */
  static save = async (task) => {
    try {
      const taskKeysJSON = await AsyncStorage.getItem("TASKKEYS") || "[]";
      const taskKeys = JSON.parse(taskKeysJSON);
      if (!taskKeys.includes(task.key)) {
        taskKeys.push(task.key);
        await AsyncStorage.setItem("TASKKEYS", JSON.stringify(taskKeys));
      }
      await AsyncStorage.setItem(task.key, JSON.stringify(task));
    } catch (e) {
      console.error(e);
    }
  };


  /**
   * Deletes the task
   *
   * @param task, an object with a key, text, a completed boolean and a random color.
   * @returns {Promise<void>} the return promise can be ignored
   */
  static delete = async (task) => {
    try {
      const taskKeysJSON = await AsyncStorage.getItem("TASKKEYS") || "[]";
      const taskKeys = JSON.parse(taskKeysJSON);
      let index;
      if ((index = taskKeys.findIndex(el => el === task.key)) !== -1) {
        taskKeys.splice(index, 1);
        await AsyncStorage.setItem("TASKKEYS", JSON.stringify(taskKeys));
      }
      await AsyncStorage.removeItem(task.key);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * This method adds a new task, updates the state, and saves it to
   * storage.
   * @returns {Promise<void>}
   */
}


const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  textInput: {
    textAlign: "center",
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 5,
    fontSize: 25,
    height: 50,
  }
});
