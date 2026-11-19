/* ============================================================
   ✏️  AQUÍ EDITAS TODO: textos, fotos y canción.
   No hace falta tocar ningún otro archivo.

   · Los saltos de línea se escriben con \n
   · Fotos:   pon tus imágenes en  assets/photos/  y escribe su ruta
              en "src" (ej: "assets/photos/foto1.jpg"). Si dejas "src"
              vacío se muestra un marco elegante de reemplazo.
   · Canción: pon tu .mp3 en  assets/music/  y escribe su ruta en
              music.src (ej: "assets/music/cancion.mp3").
   ============================================================ */
window.CONTENT = {

  meta: {
    title: "Un pequeño secreto para ti ❤️"
  },

  /* 1 · Bienvenida */
  intro: {
    eyebrow: "Un pequeño secreto",
    title: "Hola, tengo algo que contarte...",
    button: "Descubrir"
  },

  /* 2 · Una pequeña historia */
  story: {
    lead: "No sé exactamente en qué momento pasó, pero poco a poco comenzaste a convertirte en alguien muy especial para mí.",
    lines: [
      "Al principio fue algo pequeño: una sonrisa, una conversación cualquiera.",
      "Luego empecé a esperar tus mensajes más de lo que me animo a admitir.",
      "Descubrí que tu risa mejora hasta mis peores días.",
      "Y sin darme cuenta, pensar en ti se volvió mi costumbre favorita.",
      "Por eso quise escribirte algo... despacio, y con cariño."
    ],
    tapHint: "Toca la pantalla para avanzar más rápido",
    button: "Seguir"
  },

  /* 3 · El sobre y la carta */
  letter: {
    title: "Te escribí una carta",
    hint: "Toca el sobre para abrirlo",
    envelopeLabel: "Abrir el sobre",
    greeting: "Para ti,",
    paragraphs: [
      "No sé si hay un momento perfecto para decir ciertas cosas, así que decidí escribirlas con calma, tal como las siento.",
      "Me encanta cómo eres: tu forma de reír, de escuchar, de hacer que lo cotidiano se sienta distinto. Contigo hasta los días normales tienen algo de especial.",
      "No te escribo esto para que cambie nada entre nosotros, ni para ponerte en ningún compromiso. Solo quería que supieras lo importante que eres para mí, y que sí vale la pena ser sincero.",
      "Gracias por existir y por estar, aunque no lo sepas."
    ],
    signature: "Con todo mi cariño,\nTu nombre",
    skip: "Mostrar completa",
    button: "Continuar"
  },

  /* 4 · Galería (hasta 8 fotos funciona bien) */
  gallery: {
    title: "Pequeños momentos",
    subtitle: "Cosas que me hacen sonreír",
    placeholder: "Tu foto aquí",
    placeholderLabel: "Espacio reservado para una foto",
    photos: [
      { src: "", caption: "El día que nos conocimos" },
      { src: "", caption: "Esa risa tuya" },
      { src: "", caption: "Un recuerdo bonito" },
      { src: "", caption: "Y lo que venga..." }
    ],
    button: "Continuar"
  },

  /* 5 · Canción */
  music: {
    title: "Una canción para ti",
    subtitle: "Dale play cuando quieras",
    track: "Nombre de la canción",
    artist: "Artista",
    src: "",
    placeholder: "Aquí sonará una canción muy especial",
    error: "No se pudo reproducir la canción",
    button: "Continuar"
  },

  /* 6 · El momento final */
  final: {
    pre: "Hay algo que llevo un tiempo queriendo decirte...",
    big: "Me gustas.",
    text: "Y quería que lo supieras de una manera especial. No sé qué nos espera, pero me encantaría tener la oportunidad de descubrirlo contigo.",
    button: "Tenía muchas ganas de decirte esto ❤️",
    after: "Gracias por leerlo hasta el final.\nNo hay prisa ni presión: solo quería que lo supieras. 🤍",
    replay: "Volver a empezar"
  },

  /* Textos de interfaz (accesibilidad) */
  ui: {
    play: "Reproducir canción",
    pause: "Pausar canción",
    seek: "Progreso de la canción",
    mini: "Controlar la música",
    prev: "Foto anterior",
    next: "Foto siguiente"
  }
};
