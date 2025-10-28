API:er:
REST Countries API – information om länder
https://restcountries.com/v3.1/all
https://restcountries.com/v3.1/name/{name}
Open-Meteo API – aktuellt väder
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true
Unsplash API / Pexels API – bilder på länder
Pexels: https://api.pexels.com/v1/search?query={country}&per_page=3
Wikipedia API – kort introduktion / summary
https://en.wikipedia.org/api/rest_v1/page/summary/{country_name}

Hosting: Vercel (produktion) -- finns version på raspberry pi genom cloudflare DNS i mitt kök. 


Klona repot: 

git clone https://github.com/Sparven0/travelgustaf.git
cd travelgustaf

Utv.server:
npm run dev

Prod.build:
npm run build
npm run preview


