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
```

## Antes de lanzar

1. **Técnicos reales:** en `js/main.js` hay que rellenar `TECNICOS` con el nombre, el teléfono y el email de cada zona. Mientras estén vacíos, se muestra el contacto central (91 658 70 72 · info@bejo.es).
2. **Envío del formulario:** en `CONFIG.formEndpoint` va la URL que recibirá el formulario (Formspree, CRM o API propia). Si se deja vacío, la consulta se abre ya redactada en el cliente de correo del usuario.
3. **Fotos y logo:** ahora se cargan desde bejo.es. En producción conviene copiarlos a `/assets`. La coliflor Newlyn necesita una foto real.
4. **Fichas de variedad:** Bonnice y Newlyn enlazan al catálogo de variedades. Cuando existan, hay que cambiarlo por la URL de cada ficha.
5. **Analítica:** cada CTA envía un evento a `dataLayer` (`bejo_click`, `bejo_zona`, `bejo_lead`, `bejo_busqueda`). Falta añadir el contenedor de Google Tag Manager y el banner de cookies.

## Ver en local

Abre `index.html` en el navegador, o publícalo con GitHub Pages (*Settings → Pages → Deploy from branch → main / root*).
