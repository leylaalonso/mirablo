import {
  Button,
  Flex,
  IconButton,
  ListItem,
  Text,
} from '@react-native-material/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../../App';
import {Question} from '../Db';
import {useMutation, useQuestions} from '../hooks/commonHooks';
import BaseTemplate from '../templates/BaseTemplate';

type Props = NativeStackScreenProps<RootStackParamList, 'ShowOptions'>;

type QuestionListItemProps = {
  option: Question;
  onPress: (option: Question) => void;
  onEdit: (option: Question) => void;
  onDelete: (option: Question) => void;
};

const QuestionListItem = ({
  option,
  onPress,
  onEdit,
  onDelete,
}: QuestionListItemProps) => {
  const {updateQuestion} = useMutation();
  const {favorite} = option;

  const handleChangeFavorite = () => {
    updateQuestion(option.id, {...option, favorite: !favorite});
  };

  return (
    <ListItem
      title={option.title}
      secondaryText={option.options
        .map(o => o.title.substring(0, 10))
        .join(' | ')}
      onPress={() => onPress(option)}
      trailing={
        <Flex direction="row" justify="end">
          <IconButton
            onPress={() => onDelete(option)}
            icon={props => <Icon name="delete-outline" {...props} />}
          />
          <IconButton
            onPress={() => onEdit(option)}
            icon={props => <Icon name="pencil-outline" {...props} />}
          />
          <IconButton
            onPress={handleChangeFavorite}
            icon={props => (
              <Icon
                name={favorite ? 'cards-heart' : 'cards-heart-outline'}
                {...props}
              />
            )}
          />
        </Flex>
      }
    />
  );
};

const ShowOptionsScreen = ({navigation}: Props) => {
  const questions = useQuestions();
  const {deleteQuestion} = useMutation();
  const sortedQuestions = React.useMemo(
    () =>
      [...questions].sort((a, b) => {
        if (a.favorite && !b.favorite) {
          return -1;
        } else if (!a.favorite && b.favorite) {
          return 1;
        } else {
          return a.sort - b.sort;
        }
      }),
    [questions],
  );

  const handleOnPress = async (option: Question) => {
    navigation.push('SelectOption', {id: option.id});
  };

  const handleOnEdit = (option: Question) => {
    navigation.push('EditOptions', {id: option.id});
  };

  const handleOnDelete = (option: Question) => {
    deleteQuestion(option.id);
  };

  return (
    <BaseTemplate title="Seleccione una pregunta">
      <View style={styles.container}>
        <FlatList
          data={sortedQuestions}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <QuestionListItem
              onDelete={handleOnDelete}
              option={item}
              onPress={handleOnPress}
              onEdit={handleOnEdit}
            />
          )}
        />
      </View>
      <Button
        color="primary"
        title="Crear pregunta"
        onPress={() => navigation.push('EditOptions', {})}
      />
    </BaseTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShowOptionsScreen;
