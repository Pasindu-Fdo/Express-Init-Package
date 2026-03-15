# -------- Production Stage --------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
