import React from 'react'
import { VStack, HStack, Heading, Center, Box, FlatList, Text, IconButton, Icon, ScrollView } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'react-query'
import axios from 'axios'
import { queryClient } from '../common'

async function fetchProducts() {
    const data = await axios.get('https://i-pet-api.herokuapp.com/produto')
    return data
}

async function deleteProductByID(id) {
    const data = await fetch(`https://i-pet-api.herokuapp.com/produto/${id}`, { method: 'DELETE' })

    if (!data.ok) {
        throw new Error(data.json().message)
    }

    return true
}

async function getProduct(id) {
    const { data } = await axios.get(`https://i-pet-api.herokuapp.com/produto/${id}`)

    return data
}

function Products(props) {

    const { data, isLoading, isError, error } = useQuery('products', fetchProducts)

    const { mutateAsync } = useMutation(deleteProductByID)

    const remove = async (id) => {
        await mutateAsync(id)
        queryClient.invalidateQueries('products')
    }

    if (isLoading) {
        return (
            <Center>Carregando...</Center>
        )
    }

    if (isError) {
        return (
            <Center>Ocorreu um erro! {error.message}</Center>
        )
    }

    return (
        <FlatList data={data.data} keyExtractor={item => item.id} renderItem={({ item }) => (
            <HStack w="300" h="81" bg="primary.500" rounded="md" shadow={3} m={2} justifyContent="space-between">
                <VStack ml={4} mt={1} >
                    <Text bold fontSize="2xl" textAlign="left" color="primary.50">{item.nome}</Text>
                    <Text italic fontSize="lg" color="primary.50">{item.descricao}</Text>
                    <Text color="primary.50">R${item.preco.toFixed(2)}</Text>
                </VStack>
                <HStack mt={4}>
                    <IconButton
                        onPress={() => props.edit(item.id)}
                        icon={
                            <Icon
                                as={MaterialIcons}
                                name="edit"
                                color="primary.50"
                            />
                        }
                    />
                    <IconButton
                        onPress={() => remove(item.id)}
                        icon={
                            <Icon
                                as={MaterialIcons}
                                name="delete"
                                color="primary.50"
                            />
                        }
                    />
                </HStack>
            </HStack>
        )}></FlatList>
    )
}

export default function List({ navigation }) {

    const edit = async (id) => {
        const editData = await getProduct(id)
        navigation.navigate("Editar produto", { id: editData.id, nome: editData.nome, descricao: editData.descricao, preco: editData.preco })
    }

    return (
        <VStack space={4} alignItems="center">
            <Heading textAlign="center" mt="4">
                Lista de compras <MaterialIcons name="shopping-cart" size={20} />
            </Heading>
            <Text textAlign="center" bold color="muted.600">Adicione um item no botão abaixo ou edite/apague os existentes</Text>
            <IconButton onPress={() => navigation.navigate("Adicionar produto")} icon={
                <Icon
                    as={MaterialIcons}
                    name="add-box"
                    color="primary.500"
                    size="2xl"
                />
            } />
            <Products edit={edit} />
        </VStack>
    )
}