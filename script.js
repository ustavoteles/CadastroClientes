'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal')
        .classList.remove('active')

}


/*//cliente
const tempClient = {
    nome: "teste",
    email: "gustavoteles@gmail.com",
    celular: "13123451314",
    cidade: "São Vicente"
}*/

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
// funcao para pegar o db_client do local storage e passar pra json  //?? se for nulo retorna array vazio

const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))
//funcao para setar o item cliente e passar em string

//CRUD


//CREATE - CRIAR
const createClient = (client) => {
    const dbClient = getLocalStorage()
    //chamando funcao para pegar

    dbClient.push(client)
    //acrescentar o novo cliente

    setLocalStorage(dbClient)
    //entregar o cliente
}

//READ - LER
const readClient = () => getLocalStorage()
//função para ler o localStorage
//caso eu lance no console, irá aparecer os clientes

//UPDATE-ATUALIZAR/EDITAR
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
    //aqui ele vai ler o client
    //pegar o index (numero do cliente)
    //e atualizar conforme o index e setar o novo client

    //aqui a função vai pegar os dados do banco
    //vai ler e colocar em um váriavel
}


//DELETE - DELETAR/EXCLUIR
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    //aqui foi usado o splice pra "cortar" um array
    //começando do numero do index, e só vai cortar um
    setLocalStorage(dbClient)
    //aqui vai mandar a atualizacao do banco atraves da funcao
}
///////////////////////FIM DO CRUD
//////////////////////////////////////////////

const CamposValidos = () => {
    return document.getElementById('form').reportValidity()
    //será pego o form e verificado se estao sendo preenchidos e ira retornar
    //reportValidity é uma função se todos os campos foram preenchidos
}
const clearFields = () => {
    const campos = document.querySelectorAll('.modal-field')
    campos.forEach(campo => campo.value = '')
    //vai pegar todos os campos e limpar
}
//INTERAÇÃO COM O LAYOUT
const saveClient = () => {
    if (CamposValidos()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {//se o data set for igual a new é um novo cleinte
            createClient(client)
            //aqui foi pego todos os campos e foram validados
            //e criando um cliente, através do botao salvar

            updateTable()
            //pra atualizar a tabela
            closeModal()
            //vai fechar a tela
        }
        else {
            updateClient(index, client)//vai atualizar o cliente
            updateTable()
            closeModal()
        }
    }
}
const criarLinha = (client, index) => {//pegando o index e o cliente para criar a linha
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
    <td> ${client.nome} </td>
    <td> ${client.email}</td>
    <td> ${client.celular} </td>
    <td> ${client.cidade}</td>
    <td>
    <button type="button" class="button green" id="editar-${index}"> Editar </button>
    <button type="button" class="button red" id="excluir-${index}"> Excluir </button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(novaLinha)
    //criação da classe filha para ir para a tabela do html
}
//o criar Linha vai criar a linha com dados html

const clearTable = () => {
    const linhas = document.querySelectorAll('#tableClient>tbody tr')
    //selecionando todas as linhas (tr's)
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
    //pra cada linha pega a linha, o elemento pai (tbody) e remove o filho, que é a linha
}
const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    //para limpar as tabelas
    dbClient.forEach(criarLinha)
}
//vai pegar cada cliente do localStorage e vai enviar pra função CriarLinha
//vai criar a linha pra cada cliente

updateTable()
//função pra atualizar a tabela

const preencherCampos = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index

}

const editClient = (index) => { // o index do elemento que eu quero mudar
    const client = readClient()[index]// vai ler o cliente
    client.index = index //vai ter o index para identificar a alteraçao
    preencherCampos(client)
    openModal()
}
const editDelete = (event) => {
    if (event.target.type == 'button') { //o que nao for botao ele nao vai entrar no if

        const [action, index] = event.target.id.split('-')
        //desestruturação //fazendo target pra diferenciar o botao que esta sendo apertado
        //splint transforma em array
        if (action == 'editar') {
            editClient(index)

        } else {
            const client = readClient()[index]
            const resposta = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (resposta) {
                deleteClient(index)//vai deletar o cliente
                updateTable()
            }
        }
    }
}


//EVENTOS
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)