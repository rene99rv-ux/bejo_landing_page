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

  // Técnicos por zona (1-9) y distribuidores (A, C, D) de Bejo Ibérica.
  // Los distribuidores no tienen contacto propio en la web: se muestra el contacto central.
  var TECNICOS = {
    '1': { nombre: 'Félix Andrés',        especialidad: 'Especialista en puerro',               telefono: '+34629264656', telefonoTxt: '(+34) 629 264 656', email: 'f.andres@bejo.es' },
    '2': { nombre: 'Feliu Cusidó',        especialidad: 'Especialista en cultivo ecológico',    telefono: '+34618746499', telefonoTxt: '(+34) 618 746 499', email: 'f.cusido@bejo.es' },
    '3': { nombre: 'Miriam Sánchez',      especialidad: '',                                     telefono: '+34679228367', telefonoTxt: '(+34) 679 228 367', email: 'm.sanchez@bejo.es' },
    '4': { nombre: 'Juan Carlos Sánchez', especialidad: 'Especialista en microbulbos de cebolla', telefono: '+34629084931', telefonoTxt: '(+34) 629 084 931', email: 'j.sanchez@bejo.es' },
    '5': { nombre: 'Manuel Romero',       especialidad: '',                                     telefono: '+34609500189', telefonoTxt: '(+34) 609 500 189', email: 'm.romero@bejo.es' },
    '6': { nombre: 'Damián Pallarés',     especialidad: '',                                     telefono: '+34629085633', telefonoTxt: '(+34) 629 085 633', email: 'd.pallares@bejo.es' },
    '7': { nombre: 'Javier Perales',      especialidad: '',                                     telefono: '+34669676503', telefonoTxt: '(+34) 669 676 503', email: 'j.perales@bejo.es' },
    '8': { nombre: 'Miguel Ángel Teruel', especialidad: '',                                     telefono: '+34699923519', telefonoTxt: '(+34) 699 923 519', email: 'm.teruel@bejo.es' },
    '9': { nombre: 'Luis Carreira',       especialidad: '',                                     telefono: '+34689265594', telefonoTxt: '(+34) 689 265 594', email: 'l.carreira@bejo.es' },
    'A': { distribuidor: 'Antoñanzas' },
    'C': { distribuidor: 'Monso' },
    'D': { distribuidor: 'Metal Agrícola' }
  };
  function zonaLabel(z) { var t = TECNICOS[z] || {}; return t.distribuidor ? 'distribuidor ' + t.distribuidor : 'zona ' + z; }

  // Provincias: [nombre, código, columna, fila, zona] — el código es la etiqueta del mapa
  var PROVINCIAS = [
    ['A Coruña','C',0,0,'9'],['Lugo','LU',1,0,'9'],['Asturias','O',2,0,'9'],['Cantabria','S',3,0,'9'],
    ['Bizkaia','BI',4,0,'1'],['Gipuzkoa','SS',5,0,'1'],
    ['Pontevedra','PO',0,1,'9'],['Ourense','OR',1,1,'9'],['León','LE',2,1,'1'],['Palencia','P',3,1,'1'],
    ['Burgos','BU',4,1,'1'],['Álava','VI',5,1,'1'],['Navarra','NA',6,1,'A'],
    ['Huesca','HU',7,1,'2'],['Lleida','L',8,1,'2'],['Girona','GI',9,1,'2'],
    ['Zamora','ZA',1,2,'1'],['Valladolid','VA',2,2,'1'],['Segovia','SG',3,2,'1'],['Soria','SO',4,2,'1'],
    ['La Rioja','LO',5,2,'A'],['Zaragoza','Z',6,2,'A'],['Tarragona','T',8,2,'2'],['Barcelona','B',9,2,'2'],
    ['Salamanca','SA',1,3,'1'],['Ávila','AV',2,3,'1'],['Madrid','M',3,3,'1'],['Guadalajara','GU',4,3,'1'],
    ['Cuenca','CU',5,3,'3'],['Teruel','TE',6,3,'2'],['Castellón','CS',7,3,'4'],['Illes Balears','PM',9,3,'C'],
    ['Cáceres','CC',1,4,'3'],['Toledo','TO',2,4,'3'],['Ciudad Real','CR',3,4,'3'],['Albacete','AB',4,4,'8'],['Valencia','V',5,4,'4'],
    ['Badajoz','BA',1,5,'5'],['Córdoba','CO',2,5,'3'],['Jaén','J',3,5,'3'],['Murcia','MU',4,5,'6'],['Alicante','A',5,5,'8'],
    ['Huelva','H',1,6,'5'],['Sevilla','SE',2,6,'5'],['Granada','GR',3,6,'7'],['Almería','AL',4,6,'7'],
    ['Cádiz','CA',2,7,'5'],['Málaga','MA',3,7,'7'],
    ['Las Palmas','GC',7,7,'D'],['Santa Cruz de Tenerife','TF',6,7,'D']
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
    function fail() {
      // Primero prueba la foto alternativa (data-alt-src), si la hay
      if (img.dataset.altSrc && !img.dataset.altTried) { img.dataset.altTried = '1'; img.src = img.dataset.altSrc; return; }
      var p = img.closest('.photo') || img.parentElement; p.classList.add('is-empty');
    }
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
    window.open(item.href, '_blank', 'noopener');
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
     Técnico de zona: selector de provincia + mapa de provincias
     ------------------------------------------------------------------ */
  var zoneSel = $('#zoneSelect'), formSel = $('#f-prov');
  var byName = {};
  PROVINCIAS.slice().sort(function (a, b) { return a[0].localeCompare(b[0], 'es'); }).forEach(function (p) {
    byName[p[0]] = p;
    [zoneSel, formSel].forEach(function (s) {
      var o = document.createElement('option'); o.value = p[0]; o.textContent = p[0]; s.appendChild(o);
    });
  });

  // Mapa SVG con las fronteras reales de las 50 provincias (datos en js/mapa-provincias.js)
  var NS = 'http://www.w3.org/2000/svg', M = window.MAPA_PROVINCIAS;
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + M.w + ' ' + M.h);
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', 'Mapa de España por provincias, agrupadas por zona técnica');
  var inset = document.createElementNS(NS, 'rect');
  inset.setAttribute('class', 'map-inset');
  inset.setAttribute('x', M.inset[0]); inset.setAttribute('y', M.inset[1]);
  inset.setAttribute('width', M.inset[2]); inset.setAttribute('height', M.inset[3]);
  svg.appendChild(inset);
  var labels = document.createElementNS(NS, 'g');
  labels.setAttribute('class', 'map-labels'); labels.setAttribute('aria-hidden', 'true');
  PROVINCIAS.forEach(function (p) {
    if (!M.p[p[0]]) return;
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'tile'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', p[0] + ', ' + zonaLabel(p[4])); g.dataset.prov = p[0]; g.dataset.zone = p[4];
    var path = document.createElementNS(NS, 'path'); path.setAttribute('d', M.p[p[0]]);
    var title = document.createElementNS(NS, 'title'); title.textContent = p[0] + ' · ' + zonaLabel(p[4]);
    g.appendChild(title); g.appendChild(path); svg.appendChild(g);
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', M.l[p[0]][0]); t.setAttribute('y', M.l[p[0]][1]);
    t.dataset.prov = p[0]; t.dataset.zone = p[4]; t.textContent = p[1];
    labels.appendChild(t);
  });
  svg.appendChild(labels);
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
    $$('.map-labels text', svg).forEach(function (t) {
      t.classList.toggle('active', !!p && t.dataset.prov === name);
      t.classList.toggle('in-zone', !!p && t.dataset.zone === p[4] && t.dataset.prov !== name);
    });
    // La provincia elegida pasa al frente para que su borde no quede tapado
    var act = $('.tile.active', svg); if (act) svg.insertBefore(act, labels);
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
    if (tec.distribuidor) {
      $('#techName').textContent = 'Distribuidor · ' + tec.distribuidor;
      $('#techZone').textContent = name + ' · te atiende nuestro distribuidor ' + tec.distribuidor + ' a través de Bejo Ibérica';
      updateContact(CONFIG.defaultPhone, CONFIG.defaultPhoneTxt, CONFIG.defaultEmail, tec.distribuidor + ' (' + name + ')');
    } else {
      $('#techName').textContent = tec.nombre;
      $('#techZone').textContent = 'Técnico de zona ' + zone + (tec.especialidad ? ' · ' + tec.especialidad : '') + ' · ' + name;
      updateContact(tec.telefono, tec.telefonoTxt, tec.email, 'zona ' + zone + ' (' + name + ')');
    }
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
      (data.provincia ? '\nProvincia: ' + data.provincia + ' (' + zonaLabel(data.zona) + ')' : '') +
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
