/* ==========================================================================
   Bejo Ibérica · Landing bejo.es — interacción
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIGURACIÓN (editar antes de lanzar)
     ------------------------------------------------------------------ */
  var CONFIG = {
    // Endpoint que recibe el formulario por POST (JSON). Ejemplos:
    //   Formspree:  'https://formspree.io/f/xxxxxxx'
    //   CRM/propio: 'https://www.bejo.es/api/contacto'
    // Si se deja vacío, la consulta se prepara en el cliente de correo del usuario.
    formEndpoint: '',
    defaultEmail: 'info@bejo.es',
    defaultPhone: '+34916587072',
    defaultPhoneTxt: '91 658 70 72',
    whatsapp: 'https://wa.me/message/UYOLJTFTJJBNB1'
  };

  // Técnicos por zona. Rellenar nombre, teléfono y email reales de cada técnico.
  // Mientras un campo esté vacío se muestra el contacto central de Bejo Ibérica.
  var TECNICOS = {
    'Sureste':                     { nombre: '', telefono: '', email: '' },
    'Andalucía':                   { nombre: '', telefono: '', email: '' },
    'Centro':                      { nombre: '', telefono: '', email: '' },
    'Valle del Ebro y País Vasco': { nombre: '', telefono: '', email: '' },
    'Levante y Baleares':          { nombre: '', telefono: '', email: '' },
    'Castilla y León':             { nombre: '', telefono: '', email: '' },
    'Noroeste':                    { nombre: '', telefono: '', email: '' },
    'Cataluña':                    { nombre: '', telefono: '', email: '' },
    'Extremadura':                 { nombre: '', telefono: '', email: '' },
    'Canarias':                    { nombre: '', telefono: '', email: '' }
  };

  // Provincias: [nombre, código, columna, fila, zona] — columna/fila para el mapa de teselas
  var PROVINCIAS = [
    ['A Coruña','C',0,0,'Noroeste'],['Lugo','LU',1,0,'Noroeste'],['Asturias','O',2,0,'Noroeste'],['Cantabria','S',3,0,'Noroeste'],
    ['Bizkaia','BI',4,0,'Valle del Ebro y País Vasco'],['Gipuzkoa','SS',5,0,'Valle del Ebro y País Vasco'],
    ['Pontevedra','PO',0,1,'Noroeste'],['Ourense','OR',1,1,'Noroeste'],['León','LE',2,1,'Castilla y León'],['Palencia','P',3,1,'Castilla y León'],
    ['Burgos','BU',4,1,'Castilla y León'],['Álava','VI',5,1,'Valle del Ebro y País Vasco'],['Navarra','NA',6,1,'Valle del Ebro y País Vasco'],
    ['Huesca','HU',7,1,'Valle del Ebro y País Vasco'],['Lleida','L',8,1,'Cataluña'],['Girona','GI',9,1,'Cataluña'],
    ['Zamora','ZA',1,2,'Castilla y León'],['Valladolid','VA',2,2,'Castilla y León'],['Segovia','SG',3,2,'Castilla y León'],['Soria','SO',4,2,'Castilla y León'],
    ['La Rioja','LO',5,2,'Valle del Ebro y País Vasco'],['Zaragoza','Z',6,2,'Valle del Ebro y País Vasco'],['Tarragona','T',8,2,'Cataluña'],['Barcelona','B',9,2,'Cataluña'],
    ['Salamanca','SA',1,3,'Castilla y León'],['Ávila','AV',2,3,'Castilla y León'],['Madrid','M',3,3,'Centro'],['Guadalajara','GU',4,3,'Centro'],
    ['Cuenca','CU',5,3,'Centro'],['Teruel','TE',6,3,'Valle del Ebro y País Vasco'],['Castellón','CS',7,3,'Levante y Baleares'],['Illes Balears','PM',9,3,'Levante y Baleares'],
    ['Cáceres','CC',1,4,'Extremadura'],['Toledo','TO',2,4,'Centro'],['Ciudad Real','CR',3,4,'Centro'],['Albacete','AB',4,4,'Centro'],['Valencia','V',5,4,'Levante y Baleares'],
    ['Badajoz','BA',1,5,'Extremadura'],['Córdoba','CO',2,5,'Andalucía'],['Jaén','J',3,5,'Andalucía'],['Murcia','MU',4,5,'Sureste'],['Alicante','A',5,5,'Sureste'],
    ['Huelva','H',1,6,'Andalucía'],['Sevilla','SE',2,6,'Andalucía'],['Granada','GR',3,6,'Andalucía'],['Almería','AL',4,6,'Sureste'],
    ['Cádiz','CA',2,7,'Andalucía'],['Málaga','MA',3,7,'Andalucía'],
    ['Las Palmas','GC',7,7,'Canarias'],['Santa Cruz de Tenerife','TF',6,7,'Canarias']
  ];

  // Índice del buscador (cultivos, variedades y contenidos)
  var SEARCH = [
    { t: 'Allium', s: 'Cebolla, puerro, microbulbos', k: 'cebolla puerro chalota allium microbulbo', crop: 'allium' },
    { t: 'Brásicas', s: 'Coliflor, brócoli, coles', k: 'brasicas coliflor brocoli col repollo lombarda kale berza', crop: 'brasicas' },
    { t: 'Cultivos de hoja', s: 'Lechuga, apio, kale', k: 'hoja lechuga iceberg batavia apio escarola endivia kale', crop: 'hoja' },
    { t: 'Cultivos de fruto', s: 'Pepino, calabacín, judía', k: 'fruto pepino calabacin judia', crop: 'fruto' },
    { t: 'Cultivos de raíz', s: 'Zanahoria, remolacha, hinojo', k: 'raiz zanahoria remolacha hinojo chirivia', crop: 'raiz' },
    { t: 'Ecológico', s: 'Semilla ecológica · Right from the start', k: 'ecologico organico bio eco', crop: 'eco' },
    { t: 'Revolution', s: 'Cebolla amarilla de día corto', k: 'revolution cebolla', href: '#var-revolution' },
    { t: 'Bonnice', s: 'Lechuga iceberg · Bremia 29-40', k: 'bonnice lechuga iceberg', href: '#var-bonnice' },
    { t: 'Newlyn', s: 'Coliflor de invierno', k: 'newlyn coliflor', href: '#var-newlyn' },
    { t: 'B-Mox®', s: 'Tecnología de semilla', k: 'bmox b-mox pregerminacion tecnologia', href: 'https://www.bejo.es/magazine/b-moxr' },
    { t: 'Microbulbos de cebolla', s: 'Tecnología de semilla', k: 'microbulbos bulbillos cebolla', href: 'https://www.bejo.es/conoce-nuestros-microbulbos-de-cebolla' },
    { t: 'Cropalyser', s: 'Herramienta de seguimiento del cultivo', k: 'cropalyser app herramienta', href: 'https://www.bejo.es/magazine/cropalyser' },
    { t: 'Catálogo general 2026–2028 (PDF)', s: 'Descargar', k: 'catalogo pdf descargar', href: 'https://www.bejo.es/sites/bejo-drupal/files/media/files/ES-CatalogoGeneralEspana2628.pdf' },
    { t: 'Hablar con mi técnico', s: 'Contacto por zona', k: 'contacto tecnico telefono llamar comercial zona', href: '#tecnico' },
    { t: 'Trabaja con nosotros', s: 'Empleo en Bejo', k: 'empleo trabajo careers', href: 'https://www.bejo.es/careers' }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  /* ------------------------------------------------------------------
     Analítica: eventos al dataLayer (listo para Google Tag Manager)
     ------------------------------------------------------------------ */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var o = { event: event }; for (var k in params) o[k] = params[k];
    window.dataLayer.push(o);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track('bejo_click', { accion: el.getAttribute('data-track'), destino: el.getAttribute('href') || '' });
  });

  /* ------------------------------------------------------------------
     Imágenes: si una foto no carga, mostrar el bloque de reserva
     ------------------------------------------------------------------ */
  $$('img[data-fallback]').forEach(function (img) {
    function fail() { var p = img.closest('.photo') || img.parentElement; p.classList.add('is-empty'); }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });
  $$('.logo img').forEach(function (img) {
    function fail() { img.closest('.logo').classList.add('is-text'); }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  /* ------------------------------------------------------------------
     Header: sombra al hacer scroll + menú móvil
     ------------------------------------------------------------------ */
  var header = $('.header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  function toggleMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { toggleMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  $('#searchBtn').addEventListener('click', function () { toggleMenu(true); setTimeout(function () { $('#mobSearch').focus(); }, 260); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  /* ------------------------------------------------------------------
     Buscador de cultivos y variedades
     ------------------------------------------------------------------ */
  function goTo(item) {
    toggleMenu(false);
    track('bejo_busqueda', { termino: item.t });
    if (item.crop) {
      var tile = $('[data-crop="' + item.crop + '"]');
      $('#variedades').scrollIntoView({ behavior: 'smooth' });
      tile.classList.add('flash');
      tile.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setTimeout(function () { tile.classList.remove('flash'); }, 2200);
      tile.focus({ preventScroll: true });
      return;
    }
    if (item.href.charAt(0) === '#') { $(item.href).scrollIntoView({ behavior: 'smooth' }); return; }
    window.location.href = item.href;
  }
  $$('[data-search]').forEach(function (form) {
    var input = $('input', form), list = $('.search-results', form), results = [], idx = -1;
    function render() {
      var q = norm(input.value.trim());
      results = !q ? [] : SEARCH.filter(function (i) { return norm(i.t + ' ' + i.k).indexOf(q) > -1; }).slice(0, 7);
      if (q && !results.length) results = [{ t: 'Ver todas las variedades', s: 'Sin resultados para «' + input.value.trim() + '» · ir al buscador de bejo.es', href: 'https://www.bejo.es/variedades' }];
      idx = -1;
      list.innerHTML = results.map(function (r, i) {
        return '<li role="option" id="' + list.id + '-' + i + '"><a href="#" data-i="' + i + '">' + r.t + '<small>' + r.s + '</small></a></li>';
      }).join('');
      list.classList.toggle('open', results.length > 0);
      input.setAttribute('aria-expanded', results.length > 0);
    }
    function highlight() {
      $$('a', list).forEach(function (a, i) { a.classList.toggle('active', i === idx); });
      if (idx > -1) input.setAttribute('aria-activedescendant', list.id + '-' + idx); else input.removeAttribute('aria-activedescendant');
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (!results.length) return;
      if (e.key === 'ArrowDown') { idx = (idx + 1) % results.length; highlight(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { idx = (idx - 1 + results.length) % results.length; highlight(); e.preventDefault(); }
    });
    list.addEventListener('mousedown', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); goTo(results[+a.getAttribute('data-i')]); list.classList.remove('open'); input.value = '';
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!results.length) render(); if (!results.length) return;
      goTo(results[idx > -1 ? idx : 0]); list.classList.remove('open'); input.value = ''; input.blur();
    });
    input.addEventListener('blur', function () { setTimeout(function () { list.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); }, 150); });
  });

  /* ------------------------------------------------------------------
     Técnico de zona: selector de provincia + mapa de teselas
     ------------------------------------------------------------------ */
  var zoneSel = $('#zoneSelect'), formSel = $('#f-prov');
  var byName = {};
  PROVINCIAS.slice().sort(function (a, b) { return a[0].localeCompare(b[0], 'es'); }).forEach(function (p) {
    byName[p[0]] = p;
    [zoneSel, formSel].forEach(function (s) {
      var o = document.createElement('option'); o.value = p[0]; o.textContent = p[0]; s.appendChild(o);
    });
  });

  // Mapa SVG
  var S = 40, G = 4, NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + (10 * (S + G)) + ' ' + (8 * (S + G)));
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Provincias de España agrupadas por zona técnica');
  var inset = document.createElementNS(NS, 'rect');
  inset.setAttribute('class', 'map-inset');
  inset.setAttribute('x', 6 * (S + G) - 4); inset.setAttribute('y', 7 * (S + G) - 4);
  inset.setAttribute('width', 2 * (S + G) + 4); inset.setAttribute('height', S + 8);
  svg.appendChild(inset);
  PROVINCIAS.forEach(function (p) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'tile'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', p[0] + ', zona ' + p[4]); g.dataset.prov = p[0]; g.dataset.zone = p[4];
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', p[2] * (S + G)); r.setAttribute('y', p[3] * (S + G));
    r.setAttribute('width', S); r.setAttribute('height', S); r.setAttribute('rx', 3);
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', p[2] * (S + G) + S / 2); t.setAttribute('y', p[3] * (S + G) + S / 2);
    t.textContent = p[1];
    var title = document.createElementNS(NS, 'title'); title.textContent = p[0] + ' · ' + p[4];
    g.appendChild(title); g.appendChild(r); g.appendChild(t); svg.appendChild(g);
  });
  var mapBox = $('#map'); mapBox.appendChild(svg);
  var cap = document.createElement('p'); cap.className = 'map-caption'; cap.textContent = 'Pulsa tu provincia en el mapa o elígela en la lista.';
  mapBox.appendChild(cap);
  svg.addEventListener('click', function (e) { var g = e.target.closest('.tile'); if (g) setProvince(g.dataset.prov, true); });
  svg.addEventListener('keydown', function (e) {
    var g = e.target.closest('.tile'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setProvince(g.dataset.prov, true); }
  });

  function telHref(t) { return 'tel:' + t.replace(/[^\d+]/g, ''); }
  function setProvince(name, fromUser) {
    var p = byName[name];
    zoneSel.value = p ? name : ''; formSel.value = p ? name : '';
    $$('.tile', svg).forEach(function (g) {
      g.classList.toggle('active', !!p && g.dataset.prov === name);
      g.classList.toggle('in-zone', !!p && g.dataset.zone === p[4] && g.dataset.prov !== name);
    });
    var card = $('#techCard');
    if (!p) {
      card.dataset.empty = 'true';
      $('#techName').textContent = 'Equipo técnico-comercial de Bejo Ibérica';
      $('#techZone').textContent = 'Elige tu provincia para ver tu zona';
      updateContact(CONFIG.defaultPhone, CONFIG.defaultPhoneTxt, CONFIG.defaultEmail, '');
      return;
    }
    var zone = p[4], tec = TECNICOS[zone] || {};
    card.dataset.empty = 'false';
    $('#techName').textContent = tec.nombre || 'Técnico de zona · ' + zone;
    $('#techZone').textContent = 'Zona ' + zone + ' · ' + name + (tec.nombre ? '' : ' · te atiende el equipo técnico-comercial');
    var phone = tec.telefono || CONFIG.defaultPhone;
    updateContact(phone, tec.telefono ? tec.telefono : CONFIG.defaultPhoneTxt, tec.email || CONFIG.defaultEmail, zone + ' (' + name + ')');
    if (fromUser) track('bejo_zona', { provincia: name, zona: zone });
  }
  function updateContact(phone, phoneTxt, email, zoneLabel) {
    $('#techPhone').href = telHref(phone);
    $('#techPhoneTxt').textContent = phoneTxt;
    $('#stickyCall').href = telHref(phone);
    var subject = 'Consulta para mi técnico de zona' + (zoneLabel ? ' – ' + zoneLabel : '');
    $('#techMail').href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject);
    $('#techMail').dataset.email = email;
  }
  zoneSel.addEventListener('change', function () { setProvince(zoneSel.value, true); });
  formSel.addEventListener('change', function () { setProvince(formSel.value, true); });

  // Recordar la provincia elegida (comodidad por visitante)
  try { var saved = localStorage.getItem('bejo_provincia'); if (saved && byName[saved]) setProvince(saved, false); } catch (err) {}
  [zoneSel, formSel].forEach(function (s) {
    s.addEventListener('change', function () { try { localStorage.setItem('bejo_provincia', s.value); } catch (err) {} });
  });

  /* ------------------------------------------------------------------
     Formulario: 3 campos obligatorios (nombre, cultivo, teléfono o email)
     ------------------------------------------------------------------ */
  var form = $('#contactForm'), ok = $('#formOk'), errBox = $('#formErr');
  var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validContact(v) {
    v = v.trim();
    if (v.indexOf('@') > -1) return reEmail.test(v);
    var digits = v.replace(/[^\d]/g, '');
    return digits.length >= 9 && digits.length <= 13 && /^[\d\s+().-]+$/.test(v);
  }
  function checkField(el) {
    var bad = el.id === 'f-contact' ? !validContact(el.value) : !el.value.trim();
    el.closest('.field').classList.toggle('error', bad);
    el.setAttribute('aria-invalid', bad);
    return !bad;
  }
  $$('[required]', form).forEach(function (el) {
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'blur', function () { if (el.closest('.field').classList.contains('error') || el.value) checkField(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('error')) checkField(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ok.classList.remove('show');
    var first = null;
    $$('[required]', form).forEach(function (el) { if (!checkField(el) && !first) first = el; });
    if (first) { errBox.classList.add('show'); first.focus(); track('bejo_form_error', {}); return; }
    errBox.classList.remove('show');
    if (form.web.value) return; // honeypot anti-spam

    var prov = form.provincia.value || zoneSel.value;
    var zone = prov && byName[prov] ? byName[prov][4] : '';
    var data = {
      nombre: form.nombre.value.trim(), cultivo: form.cultivo.value, contacto: form.contacto.value.trim(),
      provincia: prov, zona: zone, mensaje: form.mensaje.value.trim(), origen: 'landing bejo.es', fecha: new Date().toISOString()
    };
    var btn = $('button[type="submit"]', form);

    function done(msg) {
      ok.textContent = msg; ok.classList.add('show'); ok.focus();
      track('bejo_lead', { cultivo: data.cultivo, zona: data.zona || 'sin zona' });
      form.reset(); if (prov) formSel.value = prov;
      btn.disabled = false; btn.textContent = 'Enviar consulta al técnico';
    }

    if (CONFIG.formEndpoint) {
      btn.disabled = true; btn.textContent = 'Enviando…';
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done('¡Gracias, ' + data.nombre + '! Consulta enviada. Tu técnico de zona te responde en 48 h laborables.'); })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Enviar consulta al técnico';
          errBox.textContent = 'No hemos podido enviar la consulta. Llámanos al ' + CONFIG.defaultPhoneTxt + ' o escríbenos a ' + CONFIG.defaultEmail + '.';
          errBox.classList.add('show'); errBox.focus();
        });
      return;
    }
    // Sin endpoint: preparar el correo con los datos ya rellenos
    var to = (zone && TECNICOS[zone] && TECNICOS[zone].email) || CONFIG.defaultEmail;
    var body = 'Nombre: ' + data.nombre + '\nCultivo: ' + data.cultivo + '\nContacto: ' + data.contacto +
      (data.provincia ? '\nProvincia: ' + data.provincia + ' (zona ' + data.zona + ')' : '') +
      (data.mensaje ? '\n\nMensaje:\n' + data.mensaje : '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Consulta técnico de zona – ' + data.cultivo) + '&body=' + encodeURIComponent(body);
    done('Hemos preparado tu consulta en tu aplicación de correo: solo tienes que pulsar «Enviar». Tu técnico de zona te responde en 48 h laborables.');
  });

  /* ------------------------------------------------------------------
     Barra fija móvil: se oculta cuando el bloque de contacto está a la vista
     ------------------------------------------------------------------ */
  var sticky = $('#stickyCta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { sticky.classList.toggle('hide', en.isIntersecting); });
    }, { threshold: 0.15 }).observe($('#tecnico'));
  }

  /* ------------------------------------------------------------------
     Pie: año y acordeones (abiertos en escritorio, plegados en móvil)
     ------------------------------------------------------------------ */
  $('#year').textContent = new Date().getFullYear();
  var mq = window.matchMedia('(max-width:860px)');
  function syncFooter() { $$('.footer details').forEach(function (d) { d.open = !mq.matches; }); }
  syncFooter();
  if (mq.addEventListener) mq.addEventListener('change', syncFooter); else mq.addListener(syncFooter);
})();
