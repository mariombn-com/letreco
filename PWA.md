# PWA - Progressive Web App

Este aplicativo agora é uma PWA completa!

## 🚀 Funcionalidades PWA

### ✅ Instalável
- Pode ser instalado no dispositivo do usuário (desktop, mobile)
- Aparece como um app nativo na tela inicial
- Abre em janela própria, sem barra de navegador

### ✅ Offline
- Funciona sem conexão de internet
- Service Worker cacheia recursos importantes
- Jogo continua jogável offline

### ✅ Responsivo
- Adapta-se a qualquer tamanho de tela
- Layout otimizado para mobile e desktop

### ✅ Rápido
- Carregamento instantâneo em visitas subsequentes
- Cache inteligente de recursos
- Melhor performance geral

## 📱 Como Instalar

### Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no ícone de instalação (➕) na barra de endereços
3. Clique em "Instalar"

### Mobile (Android)
1. Abra o site no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### Mobile (iOS/Safari)
1. Abra o site no Safari
2. Toque no botão Compartilhar (□↑)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Toque em "Adicionar"

## 🛠️ Tecnologias Utilizadas

- **Service Worker**: Para funcionalidade offline e cache
- **Web App Manifest**: Configurações da PWA
- **Cache API**: Armazenamento local de recursos
- **React**: Framework JavaScript

## 🔧 Desenvolvimento

### Service Worker
O Service Worker está localizado em `public/service-worker.js` e implementa:
- Cache de recursos estáticos
- Estratégia Network First com fallback para Cache
- Atualização automática de cache

### Manifest
Configurado em `public/manifest.json` com:
- Nome do app
- Ícones em múltiplos tamanhos
- Cores do tema
- Modo de exibição standalone

## 📊 Testando a PWA

### Lighthouse (Chrome DevTools)
1. Abra DevTools (F12)
2. Vá para a aba "Lighthouse"
3. Selecione "Progressive Web App"
4. Clique em "Generate report"

### Offline Test
1. Abra o app
2. Abra DevTools (F12)
3. Vá para "Network" → "Offline"
4. Recarregue a página
5. O app deve continuar funcionando

## 🔄 Atualizações

Quando uma nova versão é publicada:
1. O Service Worker detecta automaticamente
2. Baixa os novos arquivos em background
3. Mostra um prompt ao usuário para atualizar
4. Após confirmação, recarrega com a nova versão

## 📝 Notas

- O Service Worker só é registrado em produção (NODE_ENV=production)
- Em desenvolvimento, use `npm start` normalmente
- Para testar a PWA em desenvolvimento, faça um build de produção com `npm run build`

## 🔒 HTTPS Obrigatório

Service Workers requerem HTTPS em produção (exceto localhost para desenvolvimento).
