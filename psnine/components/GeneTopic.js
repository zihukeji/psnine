import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  WebView,
  KeyboardAvoidingView,
  InteractionManager,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import HTMLView from './htmlToView';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor  } from '../config/colorConfig';
import CommentList from './CommentList'
import { getGeneAPI } from '../dao/dao'

let toolbarActions = [
  {title: '回复', iconName: 'md-create', show: 'always'},
  {title: '收藏', iconName: 'md-star' ,show: 'always'},
  {title: '感谢', iconName: 'md-thumbs-up', show: 'never'},
  {title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

class GeneTopic extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      mainContent: false
    }
  }

  _onActionSelected = (index) => {
    switch(index){
      case 0 :
        return;
      case 1 :
        // return this.refs[WEBVIEW_REF].reload();
      case 2 :
        return;
      case 3 :
        return;
    }
  }

  componentWillMount = async () => {
    InteractionManager.runAfterInteractions(() => {
      const data =  getGeneAPI(this.props.URL).then(data => {
        this.setState({
          data,
          isLoading: false
        })
      })
    });
  }

  renderHeader = () => {
    const { data: { titleInfo } } = this.state

    const nodeStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    const textStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    return (
      <View key={'header'} style={{
            flex: 1,              
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
            margin: 5,
            marginBottom: 0,
            marginTop: 0
        }}>
        <TouchableNativeFeedback  
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', justifyContent:'center', alignItems: 'center' ,padding: 5 }}>
            {/*<Image
              source={{ uri: this.props.rowData.avatar.replace('@50w.png', '@75w.png') }}
              style={{ width: 75, height: 75, alignSelf: 'flex-start'}}
              />*/}

            <View style={{ flex: 1, flexDirection: 'column', padding: 5}}>
              <HTMLView
                value={titleInfo.title}
                modeInfo={ this.props.modeInfo }
                stylesheet={styles}
                onLinkPress={(url) => console.log('clicked link: ', url)}
                imagePaddingOffset={30}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.psnid}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.date}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.reply}</Text>
              </View>
            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderContent = () => {
    const { data: { contentInfo } } = this.state
    // console.log(this.props.rowData)
    const unit = this.state.data.contentInfo.html ? 5 : 0
    return (
      <View key={'content'} style={{             
            elevation: 1,
            margin: 5,
            marginTop: 0,
            backgroundColor: this.props.modeInfo.backgroundColor,
            padding: unit * 2
        }}>
        <HTMLView
          value={contentInfo.html}
          modeInfo={ this.props.modeInfo }
          shouldShowLoadingIndicator={true}
          stylesheet={styles}
          alignCenter={true}
          onLinkPress={(url) => console.log('clicked link: ', url)}
          imagePaddingOffset={30}
        />
      </View>
    )
  }

  
  renderComment = () => {
    const { data: { commentList } } = this.state
    const list = []
    let readMore = null
    for (const rowData of commentList) {
      if (rowData.isGettingMoreComment === false) {
        list.push(
          <View key={ rowData.id } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                borderBottomWidth: 1,
                borderBottomColor: this.props.modeInfo.brighterLevelOne
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{

              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
                <Image
                  source={{ uri: rowData.img }}
                  style={styles.avatar}
                  />

                <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                  <HTMLView
                    value={rowData.content}
                    stylesheet={styles}
                    onLinkPress={(url) => console.log('clicked link: ', url)}
                    imagePaddingOffset={30 + 50 + 10}
                    modeInfo={ this.props.modeInfo }
                  />

                  <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text selectable={false} style={{ flex: -1, color: idColor ,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                    <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                  </View>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      } else {
        readMore = (
          <View key={ 'readmore' } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                elevation: 1
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{
                this.props.navigator.push({
                  component: CommentList,
                  params: {
                    URL: `${this.props.URL}/comment?page=1`
                  }
                })
              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
                  <Text style={{ flex: 2.5,color: accentColor}}>{'阅读更多评论'}</Text>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      }
    }
    return (
      <View>
        { readMore &&<View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>{ readMore }</View> } 
        <View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>
          { list }
        </View>
      </View>
    )
  }

  render() {
    // console.log('CommunityTopic.js rendered');
    return ( 
          <View 
            style={{flex:1, backgroundColor: this.props.modeInfo.backgroundColor}}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            >
              <Ionicons.ToolbarAndroid
                navIconName="md-arrow-back"
                overflowIconName="md-more"                 
                iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                title={`No.${this.props.rowData.id}`}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                actions={toolbarActions}
                onIconClicked={() => {
                  this.props.navigator.pop()
                }}
                onActionSelected={this._onActionSelected}
              />
              { this.state.isLoading && (
                  <ActivityIndicator
                    animating={this.state.isLoading}
                    style={{
                      flex: 999,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    color={accentColor}
                    size="large"
                  />
              )}
              { !this.state.isLoading && <ScrollView scrollEnabled={true} style={{
                backgroundColor: this.props.modeInfo.standardColor
              }}>
                { this.state.data && this.renderHeader() }
                { this.state.data && this.renderContent() }
                { this.state.data && this.renderComment() }
              </ScrollView>
              }
          </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  selectedTitle:{
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: idColor, // make links coloured pink
  },
});


export default GeneTopic