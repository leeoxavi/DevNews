//Função principal - recebe o input do HTML;
export function valida(input) {
        //Variável recebe como valor o campo de input, e seleciona o data attribute do tipo -  tipo.
        const tipoDeInput = input.dataset.tipo
        //Passa para função validadores o dataset do input e o valor do input.

        if (validadores[tipoDeInput]) {
                validadores[tipoDeInput](input);
        };

        //Verifica o atributo do valor do input, no campo de validity, se o attribute .valid é true ou false. 
        if (input.validity.valid) {
                //Caso o retorno seja true, remove a mensagem de erro.

                input.parentElement.classList.remove('form-group-erro');
                input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';

                //Caso o retorno seja false, adiciona a mensagem de erro através da função mostraMensagemDeErro. (manipulação de DOM)
        } else {
                input.parentElement.classList.add('form-group-erro');
                input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input);

        };
};

//Vetor contendo a lista de erros. Erros retirados dos atributos de validação de campos.

const tiposDeErro = [
        'valueMissing',
        'typeMismatch',
        'patternMismatch',
        'customError'
]

//Objeto que contem as mensagens de erro, onde cada atributo é um data data attributes, contendo um valor de validação do objeto.

const mensagensDeErro = {
        nomeResponsavel: {
                valueMissing: 'O campo de nome do responsavel não pode estar vazio.'
        },

        nomeAluno: {
                valueMissing: 'O campo nome não pode estar vazio.'
        },

        email: {
                valueMissing: 'O campo de email não pode estar vazio.',
                typeMismatch: 'O email digitado não é válido.'
        },

        senha: {
                valueMissing: 'O campo de senha não pode estar vazio.',
                patternMismatch: 'A senha não atende os requisitos.'
        },

        confirmarSenha: {
                valueMissing: 'O campo de confirmação de senha não pode estar vazio.',
                customError: 'As senhas não correspondem.'
        },

        rg: {
                valueMissing: 'O campo de RG não pode estar vazio.',
                customError: 'O RG digitado é inválido'
        },

        cep: {
                valueMissing: 'O campo de CEP não pode estar vazio.',
                customError: 'O CEP digitado é inválido'
        },

        numero: {
                valueMissing: 'O campo de numero não pode estar vazio.'
        }


};

//Objeto para erros de função ou com funções específicas (customErros).

const validadores = {
        confirmarSenha: input => validadorDeSenha(input),
        rg: input => validadorDeRg(input),
        cep: input => buscaCep(input)

};

//Função para selecionar dentro dos objetos o erro e o tipo de erro, retornando o valor da mensagem.
function mostraMensagemDeErro(tipoDeInput, input) {
        let mensagem = '';
        tiposDeErro.forEach(erro => {
                if (input.validity[erro]) {
                        mensagem = mensagensDeErro[tipoDeInput][erro];
                }
        });

        return mensagem;
}


//Declarando a função buscaCep, que faz a solicitação à API.
function buscaCep(input) {
        input.setCustomValidity('');
        $('#inputState').val('');
        $('#inputCity').val('');
        $('#inputBairro').val('');
        $('#inputRua').val('');
        
        let cep = input.value.replace(/\D/g, '');
        try {
                if (cep == '') throw 'vazio';
                if (isNaN(cep)) throw 'não é um número'
                if (cep.length > 9) throw 'muito longo'
                if (cep.length < 8) throw 'muito curto'
                $.ajax({
                        url: `https://viacep.com.br/ws/${cep}/json/`,
                        method: 'GET',

                        //Caso tenha sucesso ele busca o (parametro).
                        success: function (parametro) {
                                //Api dos correios retorna "sucesso com erro" desde que siga o padrão de quantidade de digitos, 
                                //colocamos uma validação para esse caso específico, mas por causa do retorno assincrono da chamada do api a validação não funciona.
                                if(parametro.erro){
                                        let mensagem = 'Cep Inválido';
                                        input.setCustomValidity(mensagem);
                                        return;
                                }
                                //Checa a validação do input e remove o erro caso de input invalido.
                                
                                //Realiza a manipulação de DOM, preenchendo os campos.
                                $('#inputState').val(parametro.uf);
                                $('#inputCity').val(parametro.localidade);
                                $('#inputBairro').val(parametro.bairro);
                                $('#inputRua').val(parametro.logradouro);
                        }
                });

        } catch (errorCatch) {
                input.setCustomValidity(errorCatch);
        };
};

//Função para validação de senha, comparando os valores dos campos senha e conformação de senha. Se o valor for diferente retorna mensagem específica (customErro).
function validadorDeSenha(input) {
        const senha = document.querySelector('#inputPassword4').value;
        const confirmaSenha = input.value;
        let mensagem = '';
        if (senha != confirmaSenha) {
                mensagem = 'As senhas não correspondem.';
        }
        input.setCustomValidity(mensagem);
};

//Função para validação do RG, trata o tamanho do rg (considerando apenas números), caso o tamanho dele for menor que 8 caracteres (considerando os 0 a esquerda) e maior que 9 caracteres retorna mensagem específica (customErro).
function validadorDeRg(input) {
        const rg = input.value.replace(/\D/g, '');
        let mensagem = '';
        if (rg.length < 8 || rg.length > 9) {
                mensagem = 'O RG digitado é inválido'

        };
        input.setCustomValidity(mensagem);
};
