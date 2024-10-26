# Gunakan image node yang lebih ramping (misalnya node:18-alpine)
FROM node:18-alpine

WORKDIR /app

# Copy hanya package.json dan package-lock.json untuk mengurangi cache yang terbuang
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file ke dalam container
COPY . .

# Pastikan port yang diekspos sesuai dengan aplikasi
EXPOSE 3000

# Gunakan array JSON untuk CMD
CMD ["npm", "run", "dev"]
