# -------- Build Stage --------
FROM node:20-alpine As builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all deps
RUN npm ci

# Copy rest of the app
COPY . .

# Build TypeScript
RUN npm run build


# -------- Production Stage --------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
