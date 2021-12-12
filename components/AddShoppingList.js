import React, { useState } from 'react'
import { VStack, FormControl, Input, Center, Text, Button, HStack, Collapse, Alert, IconButton, CloseIcon, Box } from 'native-base'
import axios from 'axios'
import { useMutation } from 'react-query'
import { queryClient } from '../common'

export default function Add({ navigation }) {

    const [show, setShow] = useState(false)

    const [nomeInput, setNomeInput] = useState()

    const [descricaoInput, setDescricaoInput] = useState()

    const [precoInput, setPrecoInput] = useState()

    const { mutateAsync } = useMutation(createProduct)

    async function createProduct() {
        const { data } = await axios.post('https://i-pet-api.herokuapp.com/produto', {
            nome: nomeInput,
            descricao: descricaoInput,
            preco: precoInput
        })

        return data
    }

    async function postProduct() {
        try {
            await mutateAsync(nomeInput, descricaoInput, precoInput)
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
                            Não conseguimos adicionar o item à lista de compras. Dica: no preço, coloque o número como no exemplo: 10.90
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
                <Button mt="2" size="lg" colorScheme="primary" onPress={() => postProduct()}>
                    Adicionar
                </Button>
            </VStack>
        </Center>
    )
}