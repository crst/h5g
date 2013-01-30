// We use 'H5G' as namespace for everything we do not want to export.
var H5G = {};

// But we are also going to add one function for every HTML5 element
// to the global namespace, and export our state to yet another global
// variable named 'h'.
var h;

// Element list with all HTML5 elements taken from:
// https://developer.mozilla.org/en/docs/HTML/HTML5/HTML5_element_list
H5G.elements = [
  'html',
  'head', 'style',
  'script', 'noscript',
  'body', 'section', 'nav', 'article', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hgroup', 'header', 'footer', 'address',
  'p', 'pre', 'blockquote', 'ol', 'ul', 'li', 'dl', 'dt', 'dd',
  'figure', 'figcaption', 'div',
  'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr',
  'data', 'time', 'code', 'var', 'samp', 'kbd',
  'sub', 'sup', 'i', 'b', 'u', 'mark',
  'ruby', 'rt',
  'rp', 'bdi', 'bdo', 'span',
  'ins', 'del',
  'iframe', 'object', 'video', 'audio',
  'canvas', 'map', 'svg', 'math',
  'table', 'caption', 'colgroup', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
  'form', 'fieldset', 'legend', 'label', 'button', 'select',
  'datalist', 'optgroup', 'option', 'textarea', 'output', 'progress', 'meter',
  'details', 'summary', 'menu'
];

H5G.void_elements = [
  'base', 'link', 'meta',
  'hr', 'br', 'wbr', 'img',
  'embed', 'param', 'source', 'track',
  'area', 'col', 'input', 'keygen', 'command'
];

// Then combine all elements into one map with the value stating
// whether the element needs a closing tag.
H5G.html5 = {};
for (var i = 0; i < H5G.elements.length; i++) { H5G.html5[H5G.elements[i]] = true; }
for (var i = 0; i < H5G.void_elements.length; i++) { H5G.html5[H5G.void_elements[i]] = false; }


// Now add a global function that creates a corresponding node for
// every HTML5 element from the map.
for (var key in H5G.html5) { if (H5G.html5.hasOwnProperty(key)) {
  window[key] = function () {
    var closure = key;
    return function (args, text) { return H5G.generator(closure, args, text); };
  }();
}}


// Create a new markup generator.
H5G.generator = function (elem, args, text) {
  // The markup generator.
  var gen = {};

  // Buffer for the generated markup.
  gen._buffer = [];
  // Stack for closing nodes.
  gen._stack  = [];

  // Add functions for all html elements.
  for (var key in H5G.html5) { if (H5G.html5.hasOwnProperty(key)) {
    gen[key] = function () {
      var kc = key, vc = H5G.html5[key];
      return function (args, text) { return gen._mk_node(kc, args, text, vc); };
    }();
  }}

  // Add a closing element corresponding to the last opened
  // element. If there is no unclosed element left, return the
  // generated HTML as string. This means we can only generate trees
  // with a single root node within one step.
  gen.x = function () {
    gen._buffer.push(gen._stack.pop());
    h = gen._stack.length > 0 ? gen : gen._buffer.join('');
    return h;
  };

  // Add all remaining closing elements and return joined buffer.
  gen.flush = function () {
    while (gen._stack.length > 1) { gen.x(); }
    return gen.x();
  };

  // Add a new opening node to the buffer.
  gen._mk_node = function (elem, args, text, closing) {
    // We simply switch parameters if no args were given.
    if (typeof(args) === 'string') {
      text = args;
      args = {};
    }

    // Build the opening node.
    gen._buffer.push('<', elem);
    for (var arg in args) if (args.hasOwnProperty(arg)) {{
      if (typeof(args[arg]) !== 'string') { args[arg] = args[arg].join(' '); }
      gen._buffer.push(' ', arg, '="', args[arg], '"');
    }}
    gen._buffer.push('>');

    // Add optional text between the nodes.
    if (text) { gen._buffer.push(text); }

    // Add closing node iff neccessary.
    if (closing) { gen._stack.push('</' + elem + '>'); }

    // Update global state.
    h = gen;
    return gen;
  };

  return gen[elem](args, text);
};
