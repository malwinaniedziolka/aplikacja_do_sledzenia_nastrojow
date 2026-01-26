FROM node:latest
COPY package.json .
RUN npm install
ENV PG_DATABASE=moods PG_PORT=5432 PG_HOST=postgres PG_USER=postgres PG_PASSWORD=TestDB123!
COPY . .
EXPOSE 3002
CMD ["npm", "start"]