FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run migrate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
