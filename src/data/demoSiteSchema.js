// src/data/demoSiteSchema.js
export const demoSiteSchema = {
  slug:    "zoluna-spa",
  logoUrl: "https://firebasestorage.googleapis.com/v0/b/merkagrama-crm.firebasestorage.app/o/logos%2F1750042390704_Captura%20de%20pantalla%202025-06-15%20a%20las%2020.36.03.png?alt=media",
  colors: {
     primary:   "#ff0000",
  secondary: "#0000ff",
  accent:    "#00ff00",
  text:      "#800080"
  },

  hero: {
    title:   "Redescubre tu belleza con confianza",
    subtitle:
      "En Zoluna Spa combinamos tecnología de vanguardia y manos expertas para lograr resultados visibles desde la primera sesión.",
    ctaText: "¡Reserva ahora!",
    ctaUrl:  "https://wa.me/8311760335",
      backgroundImageUrl: 'https://cdn.pixabay.com/photo/2021/08/19/09/18/woman-6557552_1280.jpg'
  },

  features: {
    title: "¿Qué nos hace únicos?",
    items: [
      {
        icon:  null,
        title: "Tecnología Premium",
        text:  "Equipos certificados de última generación que maximizan tu comodidad y eficacia."
      },
      {
        icon:  null,
        title: "Profesionales Expertos",
        text:  "Nuestro equipo cuenta con especialistas en estética y medicina, garantizando seguridad y calidad."
      },
      {
        icon:  null,
        title: "Atención Personalizada",
        text:  "Diseñamos cada tratamiento a tu medida para potenciar resultados duraderos."
      }
    ]
  },

  products: {
    title: "Nuestros Tratamientos Estrella",
    items: [
      {
        title:      "Láser 4D Premium",
        text:
          "Despídete del vello no deseado: disfruta de una piel suave y libre de irritaciones con nuestro láser de diodo avanzado.",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/merkagrama-crm.firebasestorage.app/o/keyItems%2F1750042391338_SPI-is-new-Super-Ice-contact-cooling-technology.png?alt=media",
        buttonText: "Descubre más",
        buttonUrl:  "#"
      },
      {
        title:      "SlimFit Estético",
        text:
          "Moldea tu figura sin esfuerzo con impulsos que tonifican tus músculos mientras te relajas.",
        imageUrl:   "",
        buttonText: "Descubre más",
        buttonUrl:  "#"
      },
      {
        title:      "Limpieza Facial Profunda",
        text:
          "Renueva tu piel con un protocolo dermatológico que oxigena, purifica y equilibra tu rostro al instante.",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/merkagrama-crm.firebasestorage.app/o/keyItems%2F1750042391339_63cee9c8e46b3b1bc76329c6_limpieza%20facial%20en%20casa.jpg?alt=media",
        buttonText: "Descubre más",
        buttonUrl:  "#"
      }
    ]
  },

  about: {
    title: "Nuestra Filosofía",
    text:
      "En Zoluna Spa creemos que la estética va más allá de la apariencia: es un viaje de bienestar que te empodera. " +
      "Por eso cuidamos cada detalle, desde la primera consulta hasta el seguimiento post-tratamiento."
  },

  menu: [
    { id: 'products', label: 'Talleres' },
    { id: 'products', label: 'Productos' },
    { id: 'contact',  label: 'Contáctanos' }
  ],
  contact: {
    whatsapp:  '8311760335',
    email:     'srgiomaldonado@gmail.com',
    facebook:  'https://facebook.com/…',
    instagram: 'https://instagram.com/…',
    youtube:   'https://youtube.com/…'
  },

  testimonials: {
    title: "Historias de Éxito",
    items: [
      {
        text:   "¡Increíble! Mi piel nunca había lucido tan radiante. El equipo de Zoluna superó mis expectativas.",
        author: "María G."
      },
      {
        text:   "Me sentí en manos seguras. El servicio, la tecnología y la atención fueron impecables.",
        author: "Carlos R."
      }
    ]
  },

  contact: {
    whatsapp:   "8311760335",
    email:      "srgiomaldonado@gmail.com",
    facebook:   "https://www.facebook.com/profile.php?id=61576515968471",
    instagram:  "https://www.facebook.com/profile.php?id=61576515968471"
  }
}
