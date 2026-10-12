// Loads portfolio categories + items from Supabase and renders them into the grid.
// If Supabase isn't configured (or is unreachable) the demo items stored in
// <template id="portfolio-fallback-*"> inside index.html are shown instead.
(function () {
  'use strict';

  /* ------------------------- pure helpers (unit-tested) ------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function safeUrl(u) {
    if (!u) return '';
    try {
      var x = new URL(String(u).trim());
      return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : '';
    } catch (e) { return ''; }
  }

  // value that is safe to drop inside  url(...)  in an inline style
  function cssUrl(u) {
    return safeUrl(u).replace(/[()'"\s\\]/g, function (c) {
      return '%' + ('0' + c.charCodeAt(0).toString(16).toUpperCase()).slice(-2);
    });
  }

  function slugClass(slug) {
    return 'cat-' + String(slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  function youtubeId(u) {
    var m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : '';
  }
  function vimeoId(u) {
    var m = String(u).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : '';
  }
  // Normalise any common YouTube/Vimeo link into one Magnific Popup understands
  function videoHref(type, u) {
    var url = safeUrl(u);
    if (!url) return '';
    if (type === 'youtube') { var y = youtubeId(url); return y ? 'https://www.youtube.com/watch?v=' + y : url; }
    if (type === 'vimeo')   { var v = vimeoId(url);   return v ? 'https://vimeo.com/' + v : url; }
    return url;
  }
  function soundcloudHref(u) {
    var url = safeUrl(u);
    if (!url) return '';
    if (/^https:\/\/w\.soundcloud\.com\/player\//.test(url)) return url;
    return 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&auto_play=true&visual=true';
  }

  function paragraphs(text) {
    return String(text || '').split(/\n+/).map(function (t) { return t.trim(); })
      .filter(Boolean).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
  }

  var ICONS = {
    youtube: 'social/youtube.svg', vimeo: 'social/vimeo.svg', soundcloud: 'social/soundcloud.svg',
    details: 'text.svg', image: 'maximize.svg'
  };
  var SVG_PATH = 'assets/img/svg/';
  var SPACER = 'assets/img/thumbs/1-1.jpg';
  var SPACER2 = 'assets/img/thumbs/4-2.jpg';

  function itemHtml(item, catName) {
    var type = ICONS[item.media_type] ? item.media_type : 'details';
    var thumb = cssUrl(item.thumbnail_url);
    var title = esc(item.title);
    var link = '', hidden = '';

    if (type === 'image') {
      link = '<a class="aali_tm_full_link zoom" href="' + esc(safeUrl(item.thumbnail_url)) + '" title="' + title + '"></a>';
    } else if (type === 'youtube' || type === 'vimeo') {
      link = '<a class="aali_tm_full_link popup-' + type + '" href="' + esc(videoHref(type, item.media_url)) + '"></a>';
    } else if (type === 'soundcloud') {
      link = '<a class="aali_tm_full_link soundcloude_link" href="' + esc(soundcloudHref(item.media_url)) + '"></a>';
    } else {
      link = '<a class="aali_tm_full_link portfolio_popup" href="#"></a>';
      var rows = '<li><span class="first">Category</span><span>' + esc(catName) + '</span></li>';
      var proj = safeUrl(item.media_url);
      if (proj) rows += '<li><span class="first">Link</span><span><a href="' + esc(proj) +
        '" target="_blank" rel="noopener noreferrer">View project</a></span></li>';
      var extras = (item.extra_images || []).map(cssUrl).filter(Boolean).map(function (u) {
        return '<li><div class="list_inner"><div class="my_image"><img src="' + SPACER2 +
          '" alt="" /><div class="main" data-img-url="' + esc(u) + '"></div></div></div></li>';
      }).join('');
      hidden = '<div class="hidden_content"><div class="popup_details">' +
        '<div class="main_details"><div class="textbox">' + paragraphs(item.description) + '</div>' +
        '<div class="detailbox"><ul>' + rows + '</ul></div></div>' +
        (extras ? '<div class="additional_images"><ul>' + extras + '</ul></div>' : '') +
        '</div></div>';
    }

    return '<li class="' + slugClass(item.category_slug) + '"><div class="list_inner">' +
      '<div class="image"><img src="' + SPACER + '" alt="" /><div class="main" data-img-url="' + esc(thumb) + '"></div></div>' +
      '<div class="overlay"></div>' +
      '<img class="svg" src="' + SVG_PATH + ICONS[type] + '" alt="" />' +
      '<div class="details"><span>' + esc(catName) + '</span><h3>' + title + '</h3></div>' +
      link + hidden + '</div></li>';
  }

  function filtersHtml(categories, items) {
    var used = {};
    items.forEach(function (i) { used[i.category_slug] = true; });
    var html = '<li><a href="#" class="current" data-filter="*">All</a></li>';
    categories.forEach(function (c) {
      if (used[c.slug]) html += '<li><a href="#" data-filter=".' + slugClass(c.slug) + '">' + esc(c.name) + '</a></li>';
    });
    return html;
  }

  function buildGrid(categories, items) {
    var names = {};
    categories.forEach(function (c) { names[c.slug] = c.name; });
    return {
      filters: filtersHtml(categories, items),
      items: items.map(function (i) { return itemHtml(i, names[i.category_slug] || ''); }).join('')
    };
  }

  /* Allow `node` to unit-test the pure helpers */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { esc: esc, safeUrl: safeUrl, cssUrl: cssUrl, slugClass: slugClass,
      videoHref: videoHref, soundcloudHref: soundcloudHref, itemHtml: itemHtml,
      filtersHtml: filtersHtml, buildGrid: buildGrid };
    return;
  }

  /* ------------------------------ page behaviour ------------------------------ */
  var $ = window.jQuery;
  if (!$) return;

  $(function () {
    var $list = $('.portfolio_list ul.gallery_zoom');
    var $filters = $('#portfolio_filters');
    if (!$list.length || !$filters.length) return;

    var cfg = window.PORTFOLIO_CONFIG || {};
    var configured = cfg.supabaseUrl && cfg.supabaseAnonKey &&
      cfg.supabaseUrl.indexOf('YOUR_') !== 0 && cfg.supabaseAnonKey.indexOf('YOUR_') !== 0;

    function api(path) {
      return fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/' + path, {
        headers: { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey }
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    }

    function afterRender() {
      if (window.aali_tm_data_images) window.aali_tm_data_images();
      if (window.aali_tm_imgtosvg) window.aali_tm_imgtosvg();
      if (window.aali_tm_portfolio_popup) window.aali_tm_portfolio_popup();

      // normalise links on demo items too (e.g. youtu.be short links)
      $list.find('a.popup-youtube').each(function () { this.href = videoHref('youtube', this.href) || this.href; });
      $list.find('a.popup-vimeo').each(function () { this.href = videoHref('vimeo', this.href) || this.href; });

      if ($.fn.magnificPopup) {
        $list.find('.popup-youtube, .popup-vimeo, .soundcloude_link').magnificPopup({
          type: 'iframe', mainClass: 'mfp-fade', removalDelay: 160,
          preloader: false, fixedContentPos: false
        });
        // image items: the container-level gallery set up in init.js handles a.zoom
      }
    }

    function render(grid) {
      $filters.html(grid.filters);
      $list.html(grid.items);
      afterRender();
    }

    function renderFallback() {
      var f = document.getElementById('portfolio-fallback-filters');
      var i = document.getElementById('portfolio-fallback-items');
      if (f) $filters.empty().append(document.importNode(f.content, true));
      if (i) $list.empty().append(document.importNode(i.content, true));
      afterRender();
    }

    // Filter buttons (delegated so they work for generated buttons)
    $filters.on('click', 'a', function () {
      var el = $(this);
      var selector = el.attr('data-filter');
      if ($.fn.isotope) {
        $list.isotope({
          filter: selector,
          animationOptions: { duration: 750, easing: 'linear', queue: false }
        });
      }
      $filters.find('a').removeClass('current');
      el.addClass('current');
      return false;
    });

    if (!configured) { renderFallback(); return; }

    Promise.all([
      api('portfolio_categories?select=slug,name,sort_order&order=sort_order.asc,name.asc'),
      api('portfolio_items?select=*&published=eq.true&order=sort_order.asc,created_at.desc')
    ]).then(function (res) {
      var cats = res[0], items = res[1];
      if (!items.length) {
        $filters.empty();
        $list.html('<li style="width:100%;float:none;text-align:center;padding:40px 0;">New projects are on the way. Check back soon.</li>');
        return;
      }
      render(buildGrid(cats, items));
    }).catch(function (err) {
      if (window.console) console.warn('Portfolio: could not load from Supabase, showing demo items.', err);
      renderFallback();
    });
  });
})();
