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
const grafico = document.getElementById('grafico')
const lista = document.getElementById('tabela')


//Variaveis de infos rapidas//
const total = document.getElementById('total-balance')
const mov24h = document.getElementById('atividade')
const emAlta = document.getElementById('em-alta')



// funcão papa atualizar as moedas principais
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

//funcão para renderizar o grafico
async function renderizarGrafico() {
    const coinId = 'bitcoin';
    const currency = 'BRL';
    const days = '7';

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`);
        const data = await response.json();

        const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
        const prices = data.prices.map(p => p[1]);

        const ctx = document.getElementById('grafico').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Preço de ${coinId.toUpperCase()} (Últimos ${days} dias)`,
                    data: prices,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: false }
                   }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}
renderizarGrafico();

//função para carregar a tabela das top 10 moedas
async function carregarTabelaMercado() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const moedas = await response.json();

        const tabelaBody = document.getElementById('lista-moedas');
        tabelaBody.innerHTML = '';

        moedas.forEach((moeda, index) => {

            const corVariacao = moeda.price_change_percentage_24h >= 0 ? '#00ff88' : '#ff4d4d';

            const linha = `
            <tr>
                <td>${index + 1}</td>
                <td>
                   <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${moeda.image}" width="20" height="20">
                        <span>${moeda.name} <strong>(${moeda.symbol.toUpperCase()})</strong></span>
                   </div>   
                </td>
                <td>${moeda.current_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</td>
                <td style="color: ${corVariacao}">
                    ${moeda.price_change_percentage_24h.toFixed(2)}%
                </td>
            </tr> 
          `;
          tabelaBody.innerHTML += linha;                       
        });
    } catch (error) {
        console.error("Erro ao carregar tabela:" , error)
    }
}
carregarTabelaMercado()


// função sidebar direita

async function atualizarDadosMercado() {
    try {
        // Dados Globais
        const resGlobal = await fetch('https://api.coingecko.com/api/v3/global');
        const dadosGlobal = await resGlobal.json();
        const global = dadosGlobal.data;

        const formatarMoeda = (valor) => 
            valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

        // Preenchendo Total Market Cap
        document.getElementById('total-balance').innerHTML = `
            <i class="fa-solid fa-chart-line"></i>
            <p>Valor Total Mercado</p>
            <strong>${formatarMoeda(global.total_market_cap.brl)}</strong>
        `;

        // Preenchendo Volume 24h
        document.getElementById('atividade').innerHTML = `
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
            <p>Movimentação 24h</p>
            <strong>${formatarMoeda(global.total_volume.brl)}</strong>
        `;

        // Moedas em Alta (Trending)
        const resTrending = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const dadosTrending = await resTrending.json();
        
        // Gera tags para as 3 primeiras moedas
        const tags = dadosTrending.coins.slice(0, 3).map(c => 
            `<span class="tag-moeda">${c.item.symbol}</span>`
        ).join('');

        document.getElementById('em-alta').innerHTML = `
            <i class="fa-solid fa-fire"></i>
            <p>Moedas Bombando</p>
            <div style="margin-top:10px">${tags}</div>
        `;

    } catch (erro) {
        console.error("Erro na API:", erro);
    }
}
atualizarDadosMercado();