# base image
FROM node:9.4

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts@1.1.0 -g --silent

EXPOSE 8500
EXPOSE 35729

ENTRYPOINT ["/bin/bash", "/usr/src/app/run.sh"]
CMD ["start"]
