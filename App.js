/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { 
  StyleSheet,
  TextInput,
  View,
  Button,
  FlatList,
  Image,
  Text
} from 'react-native';


export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      text: '',
      list: {},
      page: 1
    }
  }
  loadMore() {
    const page = this.state.page + 1
    this.search(page)
    this.setState({ page })
  }
  search(page=1, isRest = false) {
    if (this.state.text.length > 3) {
      const value = this.state.text
      const url = `https://api.shutterstock.com/v2/images/search?query=${value}&page=${page}`
      const header = { Authorization: 'Basic MzM1MmFlZmZiZDI0ZDMzZjg4NTk6MDk3ZjgzMjI0MmFkMzcxZDlmMDEyNzcwY2FiZGIxZTZjZWJjNDMzYQ==' }
      return fetch(url, {
        headers: header
      }).then((response) => {
        return new Promise((resolve) => {
          if (response.status == 200) {
            response.json().then((res) => {
              resolve({
                status: response.status,
                body: res
              })
            })
          } else {
            resolve({
              status: response.status,
              body: {}
            })
          }
        })
      }).then((responseJson) => {
        let retValue = responseJson.body || {}
        retValue.code = responseJson.status
        let data = []
        if (!isRest) {
          data = this.state.list['data'] || []
        }
        data = data.concat(retValue.data);
        retValue.data = data
        this.setState({ list: retValue })
      }).catch((error) => {
        console.log(error)
      })
    }
  }
  renderItem({ item, index }) {
    if ( typeof item == 'object') {
      return (
        <View style={styles.images}>
          <Image 
            source = {{ uri: item.assets.preview.url }}
            style = {{ height: 150, width: 150 }}
          />
          <Text numberOfLines={1}>{item.description}</Text>
        </View>

      )
    }
    return null
    
  }
  renderImage() {
    if( typeof this.state.list['data'] == 'object') {
      if (this.state.list['data'].length > 0) {
        return (
          <FlatList
            contentContainerStyle = { styles.list }
            extraData = { this.state }
            data = { this.state.list['data'] }
            renderItem = { this.renderItem }
            keyExtractor = { (item, index) => item.id }
            onEndReachedThreshold = { 0.05 }
            onEndReached = {() => this.loadMore()}
          />
        )
      } else {
        return(<Text style={styles.list}>No Image found</Text>)
      }
      
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style = { styles.textInput }>
          <TextInput
            onChangeText = { (text) => this.setState({text}) }
            value = { this.state.text }
            style = {{ flex: 1 }}
          />
          <Button
            onPress = { () => this.search(1, true)}
            title = { "Search" }
            color = { "#841584" }
          />
        </View>
        {this.renderImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 25
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 20,
    paddingBottom: 20
  },
  textInput: {
    height: 50, 
    borderColor: 'gray', 
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5
  },
  images: {
    flex: 1,
    margin: 5,
    width: 170,
    height: 180,
  }
});
