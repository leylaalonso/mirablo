import {
  Box,
  Button,
  Flex,
  IconButton,
  Spacer,
  TextInput,
} from '@react-native-material/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useContext} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import {RootStackParamList} from '../../App';
import {MirabloContext, Question} from '../Db';
import {useMutation, useQuestion} from '../hooks/commonHooks';
import BaseTemplate from '../templates/BaseTemplate';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'EditOptions'>;

const baseQuestion: Question = {
  id: '',
  title: '',
  sort: 0,
  favorite: false,
  options: [
    {
      id: '1',
      title: '',
      image: '',
    },
    {
      id: '2',
      title: '',
      image: '',
    },
  ],
};

const EditOptionsScreen = ({navigation, route}: Props) => {
  const context = useContext(MirabloContext);
  const [editingPictogram, setEditingPictogram] = React.useState<
    number | undefined
  >(undefined);
  const [pictogram, setPictogram] = React.useState<string>('');
  const [images, setImages] = React.useState<string[]>(context.customImages);
  const {id} = route.params;
  const isEdit = !!id;
  const initQuestion = useQuestion(id) ?? baseQuestion;
  const [question, setQuestion] = React.useState(initQuestion);
  const {createQuestion, updateQuestion} = useMutation();

  const handleOnSave = () => {
    if (isEdit) {
      updateQuestion(question.id, question);
    } else {
      createQuestion({...question, id: uuid.v4().toString()});
    }
    navigation.goBack();
  };

  const handleUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });
      response.forEach(async (file: any) => {
        console.log('file', file.name, typeof file.type);
        if (!context.user) return;

        if (!file.type.startsWith('image')) {
          Alert.alert('Error', 'El archivo debe ser una imagen');
        }
        if (file.size > 40 * 1024 * 1024) {
          Alert.alert('Error', 'El tamaño máximo de la imagen es de 40MB');
          return;
        }
        context.setCustomImages([...context.customImages, file.uri]);
        setImages([...images, file.uri]);
      });
    } catch (err) {
      console.error(err);
    }
  }, [context, images]);

  const handleSearchPictograms = async () => {
    if (!pictogram) {
      setImages(context.customImages);
    }
    setImages([]);
    const resp = await fetch(
      `https://api.arasaac.org/api/pictograms/es/search/${pictogram}`,
    );
    const data = await resp.json();
    setImages(
      data.map(
        ({_id}: {_id: string}) =>
          `https://static.arasaac.org/pictograms/${_id}/${_id}_300.png`,
      ),
    );
  };

  const handleSelectPicogram = (image: string) => {
    setQuestion({
      ...question,
      options: question.options.map((option, index) =>
        index === editingPictogram ? {...option, image} : option,
      ),
    });
    setEditingPictogram(undefined);
    setPictogram('');
    setImages(context.customImages);
  };

  const removeCustomImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    context.setCustomImages(newImages);
  };

  return (
    <BaseTemplate
      title={isEdit ? 'Edita la pregunta' : 'Crea una nueva pregunta'}>
      <Modal
        animationType="slide"
        transparent
        visible={editingPictogram !== undefined}
        onRequestClose={() => {
          setEditingPictogram(undefined);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button
              variant="text"
              leading={props => <Icon name="close" {...props} />}
              title="Cancelar"
              onPress={() => setEditingPictogram(undefined)}
            />
            <Box style={styles.selectImageArea}>
              <TextInput
                label="Pictograma"
                keyboardType="web-search"
                trailing={
                  <IconButton
                    icon={props => <Icon name="magnify" {...props} />}
                    onPress={handleSearchPictograms}
                  />
                }
                style={{flex: 1}}
                onBlur={handleSearchPictograms}
                value={pictogram}
                onChangeText={text => setPictogram(text)}
              />
              <IconButton
                style={styles.uploadIcon}
                icon={props => <Icon name="upload" {...props} style={{color: 'white'}} />}
                onPress={handleUpload}
              />
            </Box>
            <ScrollView>
              <Box style={styles.pictogramSelector}>
                {images.map((image, index) => (
                  <Pressable
                    key={image}
                    onPress={() => handleSelectPicogram(image)}
                    style={{marginTop: 10}}>
                    <Image
                      style={{width: 100, height: 100}}
                      source={{
                        uri: image,
                      }}
                    />
                    {!pictogram && (
                      <IconButton
                        color="error"
                        style={styles.removeCustomImage}
                        onPress={() => removeCustomImage(index)}
                        icon={props => (
                          <Icon
                            name="close-circle"
                            {...props}
                            style={{padding: 0, margin: 0}}
                          />
                        )}
                      />
                    )}
                  </Pressable>
                ))}
              </Box>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Flex fill justify="evenly">
        <TextInput
          style={{marginBottom: 10}}
          label="Pregunta"
          placeholder="Escribe la pregunta"
          value={question.title}
          onChangeText={text => setQuestion({...question, title: text})}
        />

        <Flex direction="row">
          <Flex fill borderRight={1}>
            <TextInput
              label="Opción Izquierda"
              value={question.options[0].title}
              onChangeText={text =>
                setQuestion({
                  ...question,
                  options: [
                    {...question.options[0], title: text},
                    question.options[1],
                  ],
                })
              }
            />
            <Flex center>
              <Pressable onPress={() => setEditingPictogram(0)}>
                <Image
                  style={{width: 100, height: 100}}
                  source={{
                    uri:
                      question.options[0].image ||
                      'https://static.arasaac.org/pictograms/3418/3418_300.png',
                  }}
                />
              </Pressable>
            </Flex>
          </Flex>
          <Flex fill>
            <TextInput
              label="Opción Derecha"
              value={question.options[1].title}
              onChangeText={text =>
                setQuestion({
                  ...question,
                  options: [
                    question.options[0],
                    {...question.options[1], title: text},
                  ],
                })
              }
            />
            <Flex center>
              <Pressable onPress={() => setEditingPictogram(1)}>
                <Image
                  style={{width: 100, height: 100}}
                  source={{
                    uri:
                      question.options[1].image ||
                      'https://static.arasaac.org/pictograms/3418/3418_300.png',
                  }}
                />
              </Pressable>
            </Flex>
          </Flex>
        </Flex>
        <Spacer />
        <Button color="primary" title="Guardar" onPress={handleOnSave} />
      </Flex>
    </BaseTemplate>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  modalView: {
    flex: 1,
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  pictogramSelector: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  removeCustomImage: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 25,
    height: 25,
    gap: 0,
    padding: 0,
    margin: 0,
    backgroundColor: 'white',
  },
  selectImageArea: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  uploadIcon: {
    backgroundColor: '#6750A4',
    color: '#FFFFFF',
  },
});

export default EditOptionsScreen;
