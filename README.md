# Centro Médico Viver Bem — Website

Website premium e responsivo do **Centro Médico Viver Bem** (Petrópolis - RJ), com sistema
de agendamento online integrado ao WhatsApp.

> *"Cuidar é nossa especialidade, seu bem-estar é nossa missão"*

## Stack

- **React 18** + **Vite 5** (build ultrarrápido)
- **Tailwind CSS 4** com CSS Variables da identidade visual
- **Framer Motion** (micro-animações premium)
- **React Icons** (ícones das especialidades e UI)

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # build de produção em /dist
npm run preview  # pré-visualização do build
```

## Identidade visual

| Cor | Hex | Uso |
|---|---|---|
| Azul Marinho | `#1C2B92` | Confiança, botões, headings |
| Vermelho Vibrante | `#E60B18` | CTAs, destaque ultrassonografia |
| Rosa Suave | `#FFBDB9` | Seções alternadas, acolhimento |
| Texto Dark | `#2C3E50` | Corpo de texto |

Tipografia: **Poppins** (headlines), **Inter** (body), **Montserrat** (etiquetas), **Great Vibes** (slogan/logo).

## Estrutura

```
src/
├── components/        # Navbar, Hero, Especialidades, Ultrassonografia, Exames,
│   │                  # Equipe, Videos, Diferenciais, Localizacao, Footer
│   ├── Modal/         # AgendamentoModal (5 passos), SuccessModal, Calendario
│   └── ui/            # Button, Logo, SectionTitle, FadeIn (reutilizáveis)
├── context/           # AgendamentoContext (estado global do fluxo)
├── data/              # medicos, especialidades, exames, feriados (SIMULADOS)
├── utils/             # whatsapp (deep link), validacao, formatacao, horarios
└── styles/            # globals.css (tema Tailwind + paleta)
```

## Sistema de agendamento

Fluxo em 5 passos no modal: **Tipo** (consulta/exame) → **Data** (calendário que
bloqueia passado, fins de semana e feriados; clínica: seg-sex 07h30-18h) → **Horário** (apenas horários livres são
exibidos — a agenda completa nunca é exposta) → **Dados do paciente** (validação em
tempo real + máscara de telefone) → **Revisão e confirmação**.

Ao confirmar, abre o WhatsApp da clínica — `(24) 98847-7924` — com a mensagem
pré-preenchida contendo todos os dados, e exibe o modal de sucesso com as instruções
de pagamento de 50% para confirmação.

## Integrações futuras (preparado para)

- Os dados em `src/data/*.js` são **simulados** e espelham o formato esperado de uma
  API (`/api/medicos`, `/api/horarios`, `/api/agendamentos`).
- `src/utils/horarios.js` → substituir por `GET /api/horarios?recurso=&data=`
  (Supabase/Firebase/Google Calendar).
- Fotos reais da equipe: substituir o componente `Avatar` em `Equipe.jsx`.

## Observações

- Vídeos em `public/videos/` e artes em `public/img/` são conteúdo real do Instagram
  [@centromedicoviverbem](https://www.instagram.com/centromedicoviverbem).
- O snippet `?e2e` no `index.html` é um hook de teste automatizado (polyfill de
  requestAnimationFrame para abas suspensas) — inofensivo em produção, ativado apenas
  com o parâmetro `?e2e` na URL.
- Os profissionais em `src/data/medicos.js` são os da equipe real da clínica;
  os horários em `src/utils/horarios.js` continuam simulados até haver integração
  com a agenda real.
