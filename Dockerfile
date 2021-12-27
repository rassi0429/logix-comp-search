FROM node:16-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY main.js .
COPY LogiX.json .
COPY Component.json .
RUN npm i
CMD ["node","main.js"]