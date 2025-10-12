# 🍛 Rana's Twist - Menu Digital com QR Code

Menu digital moderno e responsivo para o restaurante indiano Rana's Twist, desenvolvido com Next.js 15, React 19 e MongoDB.

## 🚀 Características

- ✅ **Menu Digital Interativo** - Interface mobile-first otimizada
- ✅ **QR Code por Mesa** - Sistema de tracking e analytics
- ✅ **Multi-idioma** - Português e Inglês (expandível)
- ✅ **Filtros Avançados** - Vegetariano, Vegano, Sem Glúten, Níveis de Picância
- ✅ **Busca Fuzzy** - Pesquisa inteligente com Fuse.js
- ✅ **Painel Admin** - Gestão de pratos e QR codes
- ✅ **Performance Otimizada** - Lighthouse Score > 90
- ✅ **SEO Friendly** - Meta tags e sitemap automático
- ✅ **PWA Ready** - Funciona offline

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB Atlas Account
- Cloudinary Account

## 🛠️ Instalação

1. **Clone o repositório** (ou extraia o ZIP)
```bash
cd ranas-twist-menu
```

2. **Configure as variáveis de ambiente**

Edite o arquivo `.env.local` com suas credenciais:

```env
# MongoDB
MONGODB_URI=sua_connection_string_aqui

# Cloudinary  
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Admin (mude em produção!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha_segura

# JWT Secret (gere uma string aleatória)
JWT_SECRET=string_aleatoria_segura

# URL da App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Instale as dependências**
```bash
npm install
```

4. **Popule o banco de dados com dados de exemplo**
```bash
npm run seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
- Menu: http://localhost:3000
- Admin: http://localhost:3000/admin

## 📱 Estrutura do Projeto

```
ranas-twist-menu/
├── app/
│   ├── [locale]/        # Páginas com i18n
│   ├── admin/           # Painel administrativo
│   ├── api/             # API Routes
│   └── global.css       # Estilos globais
├── components/
│   ├── ui/              # Componentes UI (shadcn/ui)
│   ├── menu/            # Componentes do menu
│   └── admin/           # Componentes admin
├── lib/
│   ├── db/              # Conexão MongoDB
│   ├── i18n/            # Configuração internacionalização
│   └── utils/           # Utilitários
├── models/              # Schemas MongoDB
├── messages/            # Traduções (pt.json, en.json)
├── public/              # Assets estáticos
└── scripts/             # Scripts auxiliares
```

## 🎯 Funcionalidades Principais

### Menu Digital
- Visualização por categorias
- Filtros dietéticos e de picância
- Busca em tempo real
- Detalhes expandidos dos pratos
- Badges (Popular, Novo, Especial do Chef)

### QR Codes
- Geração automática por mesa
- Download individual ou em lote
- Tracking de scans
- Analytics por mesa

### Painel Admin
- CRUD completo de pratos
- Upload de imagens via Cloudinary
- Gestão de categorias
- Configurações do restaurante

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático

### Outras Plataformas

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 📊 Modelo de Dados

### Dish (Prato)
```javascript
{
  name: { pt, en },
  description: { pt, en },
  category: ObjectId,
  price: Number,
  images: Array,
  dietaryInfo: Object,
  allergens: Array,
  spiceLevel: Number,
  badges: Array,
  available: Boolean
}
```

### Category (Categoria)
```javascript
{
  name: { pt, en },
  slug: String,
  order: Number,
  active: Boolean
}
```

### Table (Mesa)
```javascript
{
  tableNumber: String,
  qrCode: Object,
  analytics: Object
}
```

## 🔧 Configurações Avançadas

### Adicionar Novo Idioma

1. Crie o arquivo de tradução em `messages/`
2. Atualize `lib/i18n/config.ts`
3. Adicione a flag no seletor de idiomas

### Personalizar Tema

Edite as variáveis CSS em `app/global.css`:
```css
:root {
  --primary: 37 91% 50%;  /* Cor saffron */
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

## 📈 Analytics e Métricas

O sistema rastreia automaticamente:
- Visualizações por prato
- Scans de QR code por mesa
- Filtros mais utilizados
- Horários de pico

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Suporte

Para suporte, envie um email para suporte@ranastwist.pt ou abra uma issue no GitHub.

## 🙏 Agradecimentos

- Next.js Team
- Vercel
- MongoDB
- Cloudinary
- shadcn/ui

---

Desenvolvido com ❤️ para Rana's Twist Restaurant
