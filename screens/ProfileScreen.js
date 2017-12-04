import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, Button, View, Alert } from 'react-native';
import Facebook from 'expo';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
    static navigationOptions = { header: null, title: 'Perfil' };

    componentWillMount() {
        const fireConfig = {
            apiKey: "AIzaSyAepNRi9SrtENwVKytN8pB3JX8FJ8RZC94",
            authDomain: "undefinedapp-d9003.firebaseapp.com",
            databaseURL: "https://undefinedapp-d9003.firebaseio.com",
            storageBucket: "undefinedapp-d9003.appspot.com",
        };

        firebase.initializeApp(fireConfig);
    }

    state = { userInfo: null };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        {!this.state.userInfo ? (
                        <Button title="Facebook Login" onPress={this._logIn} />
                        ) : (
                            this._renderUserInfo()
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }

    _logIn = async () => {
        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync( '756157084594074', { permissions: ['public_profile'] } );

        if (type === 'success') {

            let userInfoResponse = await fetch( `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)` );
            const userInfo = await userInfoResponse.json();
            this.setState({userInfo});

            Alert.alert(`Bem vindo ${this.state.userInfo.name}`);

            const credential = firebase.auth.FacebookAuthProvider.credential(token);

            firebase.auth().signInWithCredential(credential).catch((error) => {
                Alert.alert(`Erro ao Logar, tente novamente mais tarde ${error}`)
            });
        }
    };

    _renderUserInfo = () => {
        console.log(this.state.userInfo);
        return (
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={{ uri: this.state.userInfo.picture.data.url }}
                    style={{ width: 300, height: 300, borderRadius: 15 }}
                />
                <Text style={{ fontSize: 20 }}>{this.state.userInfo.name}</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
});
