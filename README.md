# Un pequeño secreto para ti ❤️

Una pequeña historia interactiva para declarar tus sentimientos. HTML + CSS + JavaScript puro: sin instalaciones, sin dependencias y sin pasos de compilación. Funciona abriendo `index.html`, y se publica tal cual.

## Qué personalizar (solo un archivo)

Todo el contenido está en **`js/content.js`**. Cambia ahí los textos, las fotos y la canción; no necesitas tocar nada más.

| Quieres cambiar… | Dónde |
| --- | --- |
| Mensajes de la historia | `story.lead` y `story.lines` |
| La carta (saludo, párrafos, firma) | `letter.greeting`, `letter.paragraphs`, `letter.signature` |
| Fotos | `gallery.photos` → `{ src: "assets/photos/foto1.jpg", caption: "…" }` |
| Canción | `music.src`, `music.track`, `music.artist` |
| Mensaje final | `final.*` |

Recuerda cambiar **"Tu nombre"** en `letter.signature`.

### Fotos
1. Copia tus imágenes a `assets/photos/` (mejor JPG, de unos 800 px de lado y menos de 300 KB cada una, para que carguen rápido en el celular).
2. Escribe su ruta en `src`. Si dejas `src` vacío se muestra un marco de reemplazo.
3. Puedes añadir o quitar fotos libremente en la lista.

### Canción
1. Copia tu `.mp3` a `assets/music/`.
2. Escribe `src: "assets/music/cancion.mp3"` en `music.src`.
3. La música **nunca** suena sola: empieza solo cuando ella pulsa play.

> Si la canción tiene derechos de autor, ten en cuenta que subir el MP3 a un repositorio público lo distribuye públicamente. Para algo más seguro, usa una pista libre de derechos o un audio grabado por ti (por ejemplo, tú cantando o diciéndole unas palabras).

## Probarlo en tu computadora
Abre `index.html` con doble clic. Para verlo como en el celular: en Chrome, F12 → icono de móvil.

## Publicarlo gratis

### GitHub Pages
1. Crea un repositorio nuevo en GitHub.
2. Sube **todo el contenido de esta carpeta** (`index.html`, `css/`, `js/`, `assets/`).
3. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
4. En uno o dos minutos tendrás tu enlace: `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

### Vercel o Netlify
Arrastra la carpeta completa a [vercel.com/new](https://vercel.com/new) o a [app.netlify.com/drop](https://app.netlify.com/drop). No hay que configurar nada.

### Privacidad
- Un sitio de GitHub Pages es público para cualquiera que tenga el enlace. Elige un nombre de repositorio poco obvio (por ejemplo, no pongas su nombre).
- La página incluye `noindex`, así que los buscadores no deberían listarla.
- Evita poner apellidos, teléfonos o datos personales en los textos.

## Estructura

```
index.html        las 6 escenas
css/styles.css    diseño, colores y animaciones
js/content.js     ← tus textos, fotos y canción
js/utils.js       utilidades compartidas
js/particles.js   cielo: estrellas, luces, corazones y destellos
js/scenes.js      transiciones, progreso y fondo
js/story.js       escena 2 · historia
js/letter.js      escena 3 · sobre y carta
js/gallery.js     escena 4 · galería
js/player.js      escena 5 · reproductor
js/final.js       escena 6 · declaración
js/main.js        arranque
assets/           tus fotos y tu música
```

## Detalles pensados con cariño
- Los mensajes aparecen a un ritmo de lectura cómodo; tocar la pantalla los adelanta.
- Destellos dorados siguen el dedo o el cursor.
- Respeta la opción de «reducir movimiento» del dispositivo: muestra todo sin animaciones.
- Accesible: navegación con teclado, foco visible, etiquetas para lectores de pantalla y carta legible aunque se escriba animada.
- Eficiente: un solo canvas, sprites pre-renderizados y límite de partículas; se pausa cuando la pestaña no está visible.
- El final no pide ninguna respuesta: solo dice lo que sientes, sin presionar.

## Tipografías
Se cargan desde Google Fonts (*Great Vibes*, *Cormorant Garamond* y *Nunito*). Sin conexión, el navegador usa tipografías de reemplazo y todo sigue funcionando.
