# Trender

Trender es una pequeña aplicación que analiza en tiempo real los Tweets relacionados a una palabra. Está programado en Javascript bajo el entorno de NodeJS. 

## Instalación

* Clona este repositorio

```bash
    git clone https://www.github.com/imsketch/trender
```

* Instala los paquetes 
```bash
    npm install
```

* Modifica el archivo ``config.js`` con los datos de tus claves API de Twitter y la clave API para Google Maps.

```js
module.exports = {
    twitter: {
        consumer_key: '' // Twitter consumer key,
        consumer_secret: '' // Twitter consumer secret,
        access_token_key: '' // Twitter access token,
        access_token_secret: '' // Twitter secret token
    },
    google_maps: {
        api_key: '' // Google Maps API key
    }
}
```

* Ejecuta la aplicación
```bash
    npm run start
```
