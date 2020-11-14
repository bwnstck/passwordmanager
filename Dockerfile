#Each instruction in this file creates a new layer
#Here we are getting mongoDB as Base image
FROM mongo:latest
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/mongo
#setting working directory in the container
WORKDIR /usr/src/mongo
#container exposed network port number
EXPOSE 27017