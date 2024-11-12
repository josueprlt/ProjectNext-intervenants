# Utiliser l'image Node.js officielle
FROM node:18

# Créer un répertoire de travail
WORKDIR /my-app

# Copier les fichiers package.json et package-lock.json
# COPY package.json package-lock.json ./



# Copier le reste des fichiers de l'application
COPY . .

# Installer les dépendances
RUN npm install

RUN chmod +x node_modules/.bin/next


# Exposer le port sur lequel Next.js va écouter
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]