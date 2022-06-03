FROM node:16.15.0-alpine
LABEL description='messenger-server dockerfile'
WORKDIR /messenger-server
COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3000
CMD ["npm", "start"]