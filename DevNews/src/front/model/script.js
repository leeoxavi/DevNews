
const preencherDados = (endereço) =>{
    document.getElementById('inputState').value = endereço.uf;
    document.getElementById('inputCity').value = endereço.localidade;
    document.getElementById('inputBairro').value = endereço.bairro;
    document.getElementById('inputRua').value = endereço.logradouro;
}

const Buscar = async() =>{
        const cep = document.getElementById('inputZip').value 
        console.log(cep)

        const url = `https://viacep.com.br/ws/${cep}/json/`

        const dados = await fetch(url);
        const endereço = await dados.json();

        preencherDados(endereço);
}
