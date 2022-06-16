FROM node:16.15.0 AS stage-one
LABEL description='messenger-server dockerfile'

RUN \
	set -x \
	&& apt-get update \
	&& apt-get install -y net-tools build-essential python3 python3-pip

WORKDIR /messenger-server
COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3000
CMD ["npm", "start"]