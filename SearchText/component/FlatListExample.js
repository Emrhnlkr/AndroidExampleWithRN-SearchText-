import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'dbdeneme.db', createFromLocation : 1});

export default class FlatListExample extends Component {
	state = {
		text: '',
        contacts:[],
        newContacts:[],
    };
    componentDidMount(){
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Users', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                console.log(temp);
                this.setState({
                    contacts: temp,
                    newContacts:temp,
                });
            });
        });
    }
	renderContactsItem = ({item, index}) => {
		return (
			<TouchableOpacity style={[styles.itemContainer, {backgroundColor: index % 2 === 1 ? '#fafafa' : ''}]}>
				<View style={styles.textContainer}>
		      <Text style={styles.name}>{item.Name} {item.Surname}</Text>
				</View>
			</TouchableOpacity>
		)
	};
	searchFilter = text => {
		const newData = this.state.contacts.filter(item => {
			const listItem = `${item.Name.toLowerCase()}`;
			return listItem.indexOf(text.toLowerCase()) > -1;
		});
		this.setState({
			newContacts: newData,
		});
	};
	renderHeader = () => {
		const {text} = this.state;
		return (
			<View style={styles.searchContainer}>
				<TextInput
					onChangeText={text => {
						this.setState({
							text,
						});
						this.searchFilter(text);
					}}
					value={text}
					placeholder="Arama..."
					style={styles.searchInput}/>
			</View>
		)
	};
	render() {
		return (
			<FlatList
				ListHeaderComponent={this.renderHeader()}
				renderItem={this.renderContactsItem}
				keyExtractor={item => item.Name}
				data={this.state.newContacts}/>
		);
	}
}
const styles = StyleSheet.create({
	itemContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginHorizontal: 10
	},
	textContainer: {
		justifyContent: 'space-around'
	},
	name: {
		fontSize: 16,
		marginLeft:10
	},
	searchContainer: {
		padding: 10
	},
	searchInput: {
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		padding: 10
	}
});