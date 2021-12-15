FROM node:14-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY main.js .
COPY LogiX.json .
RUN npm i
CMD ["node","main.js"]