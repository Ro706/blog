FROM node
ENV MONGO_URI=mongodb://admin:qwerty@localhost:27017/blog?authSource=admin

RUN mkdir -p blogbackend
WORKDIR /blogbackend 
COPY /package.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]