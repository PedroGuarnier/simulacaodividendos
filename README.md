# 💰 Simulador de Carteira de Dividendos

Simulador interativo de carteira de investimentos com foco em **dividendos reinvestidos** e **aportes mensais**, projetando a evolução patrimonial ao longo de 1 a 10 anos.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6B6B)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Sobre o Projeto

A aplicação simula o crescimento de uma carteira composta por dois portfólios brasileiros:

- **9 Fundos Imobiliários (FIIs)** — KNCR11, XPML11, MCRE11, BTHF11, VILG11, VGIA11, MCCI11, BTLG11 e SNAG11
- **8 Ações pagadoras de dividendos** — ITUB4, ITSA4, BBSE3, PETR4, CPLE3, TAEE11, CMIG4 e CURY3

O modelo considera:

- Investimento inicial de **R$ 20.000** (R$ 10k em FIIs + R$ 10k em Ações)
- Aportes mensais de **R$ 3.000** (50% para cada carteira)
- **Reinvestimento integral** dos dividendos recebidos
- Dividend Yield ponderado por peso de cada ativo na carteira
- Composição mensal para FIIs e conversão mensal equivalente para ações

## Funcionalidades

- **Slider interativo** para ajustar o horizonte de 1 a 10 anos
- **4 visualizações gráficas**: Patrimônio, Dividendos por Ano, Dividendos Acumulados e Aportes vs Ganho
- **KPIs dinâmicos** com patrimônio total, ganho sobre aportes, dividendos acumulados e renda passiva mensal estimada
- **Tabela detalhada** com evolução ano a ano (patrimônio, aportado, ganho líquido, dividendos)
- **Composição da carteira** com peso e yield de cada ativo
- Design responsivo com estética Art Deco (dark theme, gold accents)

## Preview

> <img width="1919" height="915" alt="Screenshot_122" src="https://github.com/user-attachments/assets/72f5f776-f6c6-4bb0-afcf-782a8c70e6ec" />


## Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 18** | Componentes, hooks (`useState`, `useMemo`) |
| **Recharts** | Gráficos de área e barras |
| **Vite** | Build tool e dev server |
| **CSS-in-JS** | Estilização inline com objetos de estilo |
| **Google Fonts** | Cormorant Garamond + DM Sans |

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/simulador-dividendos.git
cd simulador-dividendos

# Instale as dependências
npm install

# Rode em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

```
simulador-dividendos/
├── src/
│   ├── App.jsx          # Componente principal com toda a lógica
│   ├── main.jsx         # Entry point
│   └── index.css        # Reset de estilos (vazio ou mínimo)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Como funciona o cálculo

A simulação roda mês a mês internamente:

1. **Aporte mensal** é adicionado ao patrimônio de cada carteira
2. **Dividendos do mês** são calculados sobre o patrimônio atualizado
3. **Reinvestimento** — os dividendos são somados ao patrimônio imediatamente
4. Ao final de cada ciclo de 12 meses, um snapshot anual é registrado

Os FIIs utilizam o DY mensal informado por cada fundo. As ações utilizam o DY anual dos últimos 12 meses, convertido para taxa mensal equivalente via `(1 + DY_anual)^(1/12) - 1`.

## Premissas e Limitações

- DY considerado **constante** ao longo de todo o período
- **Não considera** valorização ou desvalorização das cotas
- **Não considera** inflação, impostos (IR sobre dividendos de ações, come-cotas) ou custos de corretagem
- Dados de referência: março de 2026 (cotações e DY dos últimos 12 meses)

## Personalização

Para adaptar a simulação à sua carteira, edite os arrays `FIIS` e `ACOES` no início do `App.jsx`:

```jsx
const FIIS = [
  { ticker: "KNCR11", peso: 16.67, valor: 1667, dyMensal: 1.12, cota: 104.55 },
  // ...adicione ou modifique seus FIIs
];

const ACOES = [
  { ticker: "ITUB4", peso: 18, valor: 1800, dyAnual: 7.3, cota: 43.00 },
  // ...adicione ou modifique suas ações
];
```

Também é possível alterar o aporte mensal nas constantes:

```jsx
const APORTE_MENSAL = 3000;
const APORTE_FII = 1500;
const APORTE_ACAO = 1500;
```

## Aviso Legal

Este simulador tem caráter **exclusivamente educacional e informativo**. Não constitui recomendação de investimento. Rentabilidade passada não garante resultados futuros. Consulte um assessor de investimentos antes de tomar decisões financeiras.

---

Desenvolvido com React + Recharts · 2026
