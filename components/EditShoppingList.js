import React, { useState } from 'react'
import { VStack, FormControl, Input, Center, Text, Button, HStack, Collapse, Alert, IconButton, CloseIcon, Box } from 'native-base'
import axios from 'axios'
import { useMutation } from 'react-query'
import { queryClient } from '../common'

export default function Edit({ route, navigation }) {

    const [show, setShow] = useState(false)

    const [nomeInput, setNomeInput] = useState(route.params.nome)

    const [descricaoInput, setDescricaoInput] = useState(route.params.descricao)

    const [precoInput, setPrecoInput] = useState(route.params.preco.toString())

    const { mutateAsync } = useMutation(editProduct)

    async function editProduct(id) {
        const { data } = await axios.put(`https://i-pet-api.herokuapp.com/produto/${id}`, {
            nome: nomeInput,
            descricao: descricaoInput,
            preco: precoInput
        })

        return data
    }

    async function edit() {
        try {
            await mutateAsync(route.params.id)
            queryClient.invalidateQueries("products")
            navigation.navigate("Lista de compras")
        } catch (err) {
            setShow(true)
        }
    }

    return (
        <Center>
            <Collapse isOpen={show}>
                <Alert w="100%" status="error">
                    <VStack space={1} flexShrink={1} w="100%">
                        <HStack
                            flexShrink={1}
                            space={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <HStack flexShrink={1} space={2} alignItems="center">
                                <Alert.Icon />
                                <Text
                                    fontSize="md"
                                    fontWeight="medium"
                                    _dark={{
                                        color: "coolGray.800",
                                    }}
                                >
                                    Erro!
                                </Text>
                            </HStack>
                            <IconButton
                                variant="unstyled"
                                icon={<CloseIcon size="3" color="coolGray.600" />}
                                onPress={() => setShow(false)}
                            />
                        </HStack>
                        <Box
                            pl="6"
                            _dark={{
                                _text: {
                                    color: "coolGray.600",
                                },
                            }}
                        >
                            Não conseguimos editar o item. Dica: no preço, coloque o número como no exemplo: 10.90
                        </Box>
                    </VStack>
                </Alert>
            </Collapse>
            <VStack w={300} space="lg" alignItems="center" mt={7}>
                <FormControl>
                    <FormControl.Label><Text bold fontSize="xl">Produto</Text></FormControl.Label>
                    <Input value={nomeInput} onChangeText={e => setNomeInput(e)} size="xl" placeholder="Insira aqui o produto desejado" />
                </FormControl>
                <FormControl>
                    <FormControl.Label><Text bold fontSize="xl">Observação</Text></FormControl.Label>
                    <Input value={descricaoInput} onChangeText={e => setDescricaoInput(e)} size="xl" placeholder="Sabor, tipo ou outra info sobre o produto" />
                </FormControl>
                <FormControl>
                    <FormControl.Label><Text bold fontSize="xl">Preço</Text></FormControl.Label>
                    <Input value={precoInput} onChangeText={e => setPrecoInput(e)} type="number" size="xl" placeholder="Por quanto você compra esse produto?" />
                </FormControl>
                <Button mt="2" size="lg" colorScheme="primary" onPress={() => edit()}>
                    Editar
                </Button>
            </VStack>
        </Center>
    )
}