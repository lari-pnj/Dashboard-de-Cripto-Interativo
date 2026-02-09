//Chave API CoinGecko//
const apiKey = 'CG-2ZYU6RdNGNpcR4PHKzasrzMn'

//Declarações do bitcoin
const btcPreco = document.getElementById('btc-preco')
const btcImg = document.getElementById('btc-img')
const btcVariacao = document.getElementById('btc-variacao')


//Declarações ethereum
const ethPreco = document.getElementById('eth-preco')
const ethImg = document.getElementById('eth-img')
const ethVariacao = document.getElementById('eth-variacao')

//Declarações solana
const solPreco = document.getElementById('sol-preco')
const solImg = document.getElementById('sol-img')
const solVariacao = document.getElementById('sol-variacao')



//Variaveis dos graficos e lista//
const grafico = document.getElementById('graficos')
const lista = document.getElementById('mercado')

//Variaveis de infos rapidas//
const criptMercado = document.getElementById('total-balance')
const mov24h = document.getElementById('atividade')
const emAlta = document.getElementById('em-alta')


async function atualizarDashboard() {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=true&x_cg_demo_api_key=${apiKey}`;
        
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const btc = dados[0];
        const eth = dados[1];
        const sol = dados[2];

        btcPreco.innerText = btc.current_price.toLocaleString('pt-BR' , {style: 'currency', currency: 'BRL'});
        btcVariacao.innerText = btc.price_change_percentage_24h.toFixed(2) + '%';
        btcImg.src = btc.image;
        btcVariacao.style.color = btc.price_change_percentage_24h > 0? 'green': 'red';

        ethPreco.innerText = eth.current_price.toLocaleString('pt-BR' , {style: 'currency', currency: 'BRL'});
        ethVariacao.innerText = eth.price_change_percentage_24h.toFixed(2) + '%';
        ethImg.src = eth.image;
        ethVariacao.style.color = eth.price_change_percentage_24h > 0? 'green': 'red';

        solPreco.innerText = sol.current_price.toLocaleString('pt-BR' , {style: 'currency', currency: 'BRL'});
        solVariacao.innerText = sol.price_change_percentage_24h.toFixed(2) + '%';
        solImg.src = sol.image;
        solVariacao.style.color = sol.price_change_percentage_24h > 0? 'green': 'red';


    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
    }
}

atualizarDashboard();








