FROM node:21-alpine
WORKDIR /app
ADD ./client /app
ADD ./card /card/
RUN npm install -g vite
RUN cd /card
RUN npm install
RUN npm run build
RUN cd /app
RUN npm install
RUN npm run build
EXPOSE 8080
CMD [ "npm", "run", "preview" ]
