# Usa imagem Node oficial
FROM node:18

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta do backend
EXPOSE 3000

# Comando para rodar o servidor
CMD ["npm", "run", "dev"]