import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';


const Profile = () => {
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                setUserEmail(user.email); // Set user's email
                setUserName(user.displayName); // Set user's display name
            } else {
                // User is signed out
                setUserEmail('');
                setUserName('');
            }
        });

        return unsubscribe;
    }, []);


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatar(result.uri);
        }
    };

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => alert(error.message));
    };

    return (
        <View style={styles.container}>
            <Header title="Logo/Name" avatar="path_to_user_avatar" />
            
            {/* Content */}
            <View style={styles.contentContainer}>
                {/* Avatar and Upload Button */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarPlaceholder}>
                        {avatar ? (
                            <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.avatar}
                        />
                        ) : (
                            <Text>Your Avatar</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                </View>

                {/* User Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Name: {userName}</Text>
                    <Text style={styles.label}>Email: {userEmail}</Text>
                </View>

                {/* Buttons for Saved Trips, Bookmarks, Feedback */}
                <View style={styles.buttonsContainer}>
                    <Pressable style={[styles.button, styles.buttonPressable]} onPress={() => {}}>
                        <Text style={styles.buttonText}>Saved Trips</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.buttonPressable]} onPress={() => {}}>
                        <Text style={styles.buttonText}>Feedback</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.buttonPressable]} onPress={() => {}}>
                        <Text style={styles.buttonText}>Bookmarks</Text>
                    </Pressable>
                    {/* <Pressable style={[styles.button, styles.buttonPressable]} onPress={() => {}}>
                        <Text style={styles.buttonText}>Settings</Text>
                    </Pressable> */}
                </View>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#F4E5C2',
  
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop:50,
        marginBottom: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        backgroundColor: '#C49F5A',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#C49F5A',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    uploadText: {
        color: '#272343',
        fontWeight: 'bold',
    },
    detailsContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        marginBottom: 10,
        fontSize: 18,
        color: '#272343',
        fontWeight:'800',
    },
    buttonsContainer: {
        marginBottom: 15,
        alignItems: 'center',
        width: '60%',
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#556C2F',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonPressable: {
        width: '100%',
    },
    signOutButton: {
        backgroundColor: '#556C2F',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign:'center',
        fontFamily:'Poppins',
        fontSize: 18,
        fontWeight:'500'
    },
});

export default Profile;
