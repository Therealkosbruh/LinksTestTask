FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci  

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm run start:dev"]
