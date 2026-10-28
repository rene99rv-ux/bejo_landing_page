# Bejo Ibérica · Landing bejo.es

Propuesta de nueva página de inicio para [www.bejo.es](https://www.bejo.es), del trabajo final de la asignatura *Presencia Digital – Proyecto web* (Máster en Marketing Digital, ESIC). Autora: Irene Romera Vicente.

**Objetivo:** que el agricultor profesional contacte con su técnico de zona (conversión principal). Las microconversiones son consultar fichas de variedad, descargar el catálogo en PDF, entrar por grupo de cultivo y suscribirse a la newsletter.

## Estructura (recorrido del agricultor)

| Fase | Bloques |
|---|---|
| **Encontrar** | Hero con 2 CTA (*Buscar por cultivo* / *Hablar con un técnico*) · Acceso por cultivo (Allium, brásicas, hoja, fruto, raíz, ecológico) · Variedades de campaña · Catálogo PDF |
| **Confiar** | 5 pilares corporativos · Cifras · Innovación y tecnología · Noticias y eventos · Newsletter |
| **Contactar** | Selector de provincia + mapa de zonas → técnico (teléfono, email, WhatsApp) · Formulario de 3 campos obligatorios |

## Diseño

- Sistema visual de bejo.com: verde `#43B02A` para el campo y las CTA, azul `#6CACE4` para la innovación, negro y la banda lateral de color.
- Sin bloques grises. CTA verdes en lugar de negros. Degradado oscuro en el hero.
- DIN 2014 (con Barlow como sustituta web). Retícula de 12 columnas que pasa a 4 en móvil.
- En móvil hay una barra fija con «Hablar con mi técnico» y «Llamar». Se oculta al llegar al bloque de contacto.
- Accesibilidad: enlace para saltar al contenido, foco visible, mapa navegable con teclado, mensajes de error con `aria`, modo oscuro y `prefers-reduced-motion`.

## Archivos

```
index.html      Estructura y contenidos
css/styles.css  Estilos (tokens de marca, retícula, responsive)
js/main.js      Menú, buscador, mapa de zonas, formulario, analítica
js/mapa-provincias.js  Fronteras simplificadas de las 50 provincias para el mapa
```

## Antes de lanzar

1. **Técnicos y distribuidores:** `TECNICOS` en `js/main.js` ya tiene los 9 técnicos de zona con su teléfono y email, y los 3 distribuidores (Antoñanzas, Monso y Metal Agrícola). Para los distribuidores se muestra el contacto central (91 658 70 72 · info@bejo.es) hasta tener sus datos. La asignación de provincias está en `PROVINCIAS`.
2. **Envío del formulario:** en `CONFIG.formEndpoint` va la URL que recibirá el formulario (Formspree, CRM o API propia). Si se deja vacío, la consulta se abre ya redactada en el cliente de correo del usuario.
3. **Fotos y logo:** ahora se cargan desde bejo.es (la foto de Newlyn ya está en `/assets`). En producción conviene copiar el resto a `/assets`.
4. **Fichas de variedad:** Revolution, Bonnice y Newlyn ya enlazan a su ficha en bejo.es.
5. **Analítica:** cada CTA envía un evento a `dataLayer` (`bejo_click`, `bejo_zona`, `bejo_lead`, `bejo_busqueda`). Falta añadir el contenedor de Google Tag Manager y el banner de cookies.

## Ver en local

Abre `index.html` en el navegador, o publícalo con GitHub Pages (*Settings → Pages → Deploy from branch → main / root*).
