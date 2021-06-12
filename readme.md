# Trender

Trender es una pequeña aplicación que analiza en tiempo real los Tweets relacionados a una palabra. Está programado en Javascript bajo el entorno de NodeJS. Este proyecto toma como base el [Twitter Trend Analyzer de IkwhanChang](https://github.com/IkwhanChang/twitter-trend-analyzer). 

## Requisitos
* Tener NodeJS (testeado en la v14.16.0).
* Tener clave API de Google Maps **(Maps JavaScript API)**.
* Tener clave API de Twitter.

Las claves las puedes conseguir a través de [Google Developers](https://developers.google.com/maps/documentation/embed/get-api-key) y [Twitter Developers](https://developer.twitter.com/)

## Instalación

* Clona este repositorio
```bash
    git clone https://github.com/ImSketch/trender.git
```

* Instala los paquetes 
```bash
    npm install
```

* Modifica el archivo ``config.js`` con los datos de tus claves API de Twitter y la clave API para Google Maps.
```js
module.exports = {
    twitter: {
        consumer_key: '',       // Twitter consumer key
        consumer_secret: '',    // Twitter consumer secret
        access_token_key: '',   // Twitter access token
        access_token_secret: '' // Twitter secret token
    },
    google_maps: {
        api_key: ''             // Google Maps API key
    }
}
```

* Ejecuta la aplicación
```bash
    npm run start
```

## Bugs
* 📌 No se muestran todas las ubicaciones en el mapa cuando hay muchos tweets, debido a que la API externa se satura.
* 📌 No se descarga correctamente el .csv (faltan tweets y no se orgnaiza de la forma debida).
