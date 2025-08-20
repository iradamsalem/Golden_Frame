FROM node:20-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

# RUN apt-get update && apt-get install -y build-essential python3-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY rag/requirements.txt ./rag/requirements.txt
RUN pip3 install --no-cache-dir -r rag/requirements.txt

COPY . .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server.js"]
