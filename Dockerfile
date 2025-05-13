# base image
FROM node:18

# set working directory
WORKDIR /app

# copy source files
COPY . .

# install dependencies
RUN npm install

# expose port (สมมุติว่า API ฟังที่พอร์ต 3000)
EXPOSE 3000

# start API
CMD ["npm", "start"]
