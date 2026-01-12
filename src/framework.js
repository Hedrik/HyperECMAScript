/**
 * @file This file implements the core framework for creating and manipulating GUI elements.
 * @summary The framework provides a foundation for developing web applications with rich, interactive user interfaces.
 * It extends HTMLElement.prototype to allow for direct, click-and-drag interaction with all DOM elements across multiple layers.
 */

(function() {
  'use strict';

  /**
   * Global state management for the Manipulation Framework.
   */
  window.ManipulationFramework = {
    enabled: false,
    currentLayer: 'document', // 'document', 'template', 'page'
    selectedElements: new Set(),
    isMultiSelect: false,
    currentAction: null, // 'move', 'resize', 'duplicate'
    startMousePos: { x: 0, y: 0 },
    startElementPos: new Map(), // Stores starting positions for all selected elements
    
    // Layer management
    layers: {
      document: { uid: 'layer-doc-001', name: 'document', ordinal: 1, elements: new Map(), eventHandlers: {} },
      template: { uid: 'layer-temp-001', name: 'template', ordinal: 2, elements: new Map(), eventHandlers: {} },
      page: { uid: 'layer-page-001', name: 'page', ordinal: 3, elements: new Map(), eventHandlers: {} }
    },
    
    // Clipboard system
    clipboard: {
      elements: [], // Array of serialized element data
      sourceLayer: null,
      timestamp: null
    }
  };

  /**
   * Generates a unique identifier.
   * @returns {string} A unique ID string.
   */
  function generateUID() {
    return 'uid-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
  }

  /**
   * Utility to check if a name is unique within a specific layer.
   * @param {string} name - The name to check.
   * @param {string} layerName - The layer to check within.
   * @returns {boolean} True if unique.
   */
  function isNameUniqueInLayer(name, layerName) {
    const layer = window.ManipulationFramework.layers[layerName];
    if (!layer) return true;
    return !Array.from(layer.elements.values()).some(el => el.name === name);
  }

  /**
   * Serializes an HTMLElement into a JSON-compatible object.
   * Includes attributes, styles, innerHTML, event handlers, and custom properties.
   * @param {HTMLElement} element - The element to serialize.
   * @returns {Object} Serialized element data.
   */
  function serializeElement(element) {
    const data = {
      tagName: element.tagName,
      attributes: {},
      styles: {},
      innerHTML: element.innerHTML,
      eventHandlers: {},
      customProperties: {},
      frameworkProperties: {
        name: element.name,
        ordinal: element.ordinal,
        layer: element.layer
      }
    };

    // Serialize attributes
    Array.from(element.attributes).forEach(attr => {
      if (!attr.name.startsWith('data-framework-')) { // Skip internal framework attributes
        data.attributes[attr.name] = attr.value;
      }
    });

    // Serialize inline styles
    if (element.style) {
      Array.from(element.style).forEach(prop => {
        data.styles[prop] = element.style.getPropertyValue(prop);
      });
    }

    // Serialize event handlers (on* properties that are functions)
    for (let key in element) {
      if (key.startsWith('on') && typeof element[key] === 'function') {
        data.eventHandlers[key] = element[key].toString();
      }
    }

    // Serialize custom properties (excluding standard and internal ones)
    const standardProps = ['tagName', 'attributes', 'style', 'innerHTML', 'outerHTML', 'uid', 'name', 'ordinal', 'layer'];
    Object.getOwnPropertyNames(element).forEach(prop => {
      if (!standardProps.includes(prop) && !prop.startsWith('on') && typeof element[prop] !== 'function') {
        try {
          // Only serialize serializable properties
          JSON.stringify(element[prop]);
          data.customProperties[prop] = element[prop];
        } catch (e) {
          // Skip non-serializable properties
        }
      }
    });

    return data;
  }

  // Export internal utilities to the framework object for internal use
  window.ManipulationFramework._utils = {
    generateUID,
    isNameUniqueInLayer,
    serializeElement
  };

  /**
   * Initialize framework properties on an HTMLElement.
   * @param {string} layerName - The layer this element belongs to.
   */
  HTMLElement.prototype.initializeFramework = function(layerName = 'document') {
    const layer = window.ManipulationFramework.layers[layerName];
    if (!layer) throw new Error(`Layer ${layerName} does not exist.`);

    const uid = generateUID();
    const defaultName = `element-${uid.split('-')[1]}`;

    Object.defineProperties(this, {
      uid: {
        value: uid,
        writable: false,
        enumerable: true,
        configurable: true
      },
      _name: {
        value: defaultName,
        writable: true,
        enumerable: false,
        configurable: true
      },
      name: {
        get: function() { return this._name; },
        set: function(value) {
          if (!isNameUniqueInLayer(value, this.layer)) {
            throw new Error(`Name "${value}" is not unique in layer "${this.layer}"`);
          }
          this._name = value;
          this.setAttribute('data-name', value);
        },
        enumerable: true,
        configurable: true
      },
      _ordinal: {
        value: layer.elements.size + 1,
        writable: true,
        enumerable: false,
        configurable: true
      },
      ordinal: {
        get: function() { return this._ordinal; },
        set: function(value) {
          this._ordinal = value;
          this.setAttribute('data-ordinal', value);
        },
        enumerable: true,
        configurable: true
      },
      _layer: {
        value: layerName,
        writable: true,
        enumerable: false,
        configurable: true
      },
      layer: {
        get: function() { return this._layer; },
        set: function(value) {
          if (!window.ManipulationFramework.layers[value]) {
            throw new Error(`Layer ${value} does not exist.`);
          }
          const oldLayer = this._layer;
          window.ManipulationFramework.layers[oldLayer].elements.delete(this.uid);
          this._layer = value;
          window.ManipulationFramework.layers[value].elements.set(this.uid, this);
          this.setAttribute('data-layer', value);
        },
        enumerable: true,
        configurable: true
      }
    });

    // Register with layer
    layer.elements.set(this.uid, this);
    this.setAttribute('data-uid', this.uid);
    this.setAttribute('data-name', this.name);
    this.setAttribute('data-layer', this.layer);
    this.setAttribute('data-ordinal', this.ordinal);
  };

  /**
   * Toggles manipulation mode globally.
   */
  window.ManipulationFramework.toggleMode = function() {
    this.enabled = !this.enabled;
    document.body.classList.toggle('manipulation-mode', this.enabled);
    
    if (!this.enabled) {
      this.selectedElements.clear();
      // Show all layers when not in manipulation mode
      Object.keys(this.layers).forEach(l => {
        document.querySelectorAll(`[data-layer="${l}"]`).forEach(el => el.style.display = '');
      });
    } else {
      // Show only current layer
      this.switchLayer(this.currentLayer);
    }
  };

  /**
   * Switches the active layer.
   * @param {string} layerName - The name of the layer to switch to.
   */
  window.ManipulationFramework.switchLayer = function(layerName) {
    if (!this.layers[layerName]) return;
    this.currentLayer = layerName;
    this.selectedElements.clear();

    if (this.enabled) {
      Object.keys(this.layers).forEach(l => {
        const elements = document.querySelectorAll(`[data-layer="${l}"]`);
        elements.forEach(el => {
          el.style.display = (l === layerName) ? '' : 'none';
        });
      });
    }
  };

  /**
   * Layer Management API
   */
  window.ManipulationFramework.addLayer = function(name, ordinal) {
    if (this.layers[name]) throw new Error(`Layer ${name} already exists.`);
    const uid = generateUID();
    this.layers[name] = {
      uid: uid,
      name: name,
      ordinal: ordinal || Object.keys(this.layers).length + 1,
      elements: new Map(),
      eventHandlers: {}
    };
    return this.layers[name];
  };

  window.ManipulationFramework.removeLayer = function(name) {
    if (name === 'document') throw new Error('Cannot remove document layer.');
    if (this.layers[name]) {
      this.layers[name].elements.forEach(el => el.remove());
      delete this.layers[name];
      if (this.currentLayer === name) this.switchLayer('document');
    }
  };

  window.ManipulationFramework.duplicateLayer = function(name) {
    const source = this.layers[name];
    if (!source) throw new Error(`Layer ${name} not found.`);
    const newName = `${name}-copy-${Date.now()}`;
    const newLayer = this.addLayer(newName);
    
    source.elements.forEach(el => {
      const clone = el.cloneNode(true);
      document.body.appendChild(clone);
      clone.initializeFramework(newName);
    });
    
    return newLayer;
  };

  /**
   * Layered Event System
   */

  /**
   * Checks if an element has an event handler for a specific event type.
   * @param {string} eventType - The type of event (e.g., 'click').
   * @returns {boolean} True if a handler exists.
   */
  HTMLElement.prototype.hasHandler = function(eventType) {
    const onProp = 'on' + eventType;
    return typeof this[onProp] === 'function';
  };

  /**
   * Executes event handlers for an element, then propagates up the layer hierarchy if not handled.
   * @param {Event} event - The DOM event object.
   */
  HTMLElement.prototype.handleLayeredEvent = function(event) {
    // If we're in manipulation mode, the framework handles events differently (drag/drop)
    if (window.ManipulationFramework.enabled) return;

    const eventType = event.type;
    
    // 1. Check element's own handler
    if (this.hasHandler(eventType)) {
      return this['on' + eventType](event);
    }

    // 2. Check current layer's non-visible element handlers
    const currentLayerName = this.layer;
    const currentLayer = window.ManipulationFramework.layers[currentLayerName];
    if (currentLayer && currentLayer.eventHandlers[eventType]) {
      return currentLayer.eventHandlers[eventType](event);
    }

    // 3. Propagate to next layers
    const layerHierarchy = ['page', 'template', 'document'];
    const startIndex = layerHierarchy.indexOf(currentLayerName);
    
    if (startIndex !== -1) {
      for (let i = startIndex + 1; i < layerHierarchy.length; i++) {
        const nextLayerName = layerHierarchy[i];
        const nextLayer = window.ManipulationFramework.layers[nextLayerName];
        if (nextLayer && nextLayer.eventHandlers[eventType]) {
          return nextLayer.eventHandlers[eventType](event);
        }
      }
    }
  };

  /**
   * Interaction Logic
   */

  function handleMouseDown(event) {
    if (!window.ManipulationFramework.enabled) return;
    
    const target = event.target.closest('[data-uid]');
    if (!target) return;
    
    const mf = window.ManipulationFramework;
    
    // Multi-select with Ctrl
    if (event.ctrlKey) {
      if (mf.selectedElements.has(target)) {
        mf.selectedElements.delete(target);
        target.classList.remove('selected');
      } else {
        mf.selectedElements.add(target);
        target.classList.add('selected');
      }
    } else {
      if (!mf.selectedElements.has(target)) {
        mf.selectedElements.forEach(el => el.classList.remove('selected'));
        mf.selectedElements.clear();
        mf.selectedElements.add(target);
        target.classList.add('selected');
      }
    }

    mf.currentAction = event.altKey ? 'resize' : (event.shiftKey ? 'duplicate' : 'move');
    mf.startMousePos = { x: event.clientX, y: event.clientY };
    mf.startElementPos.clear();

    const elementsToProcess = Array.from(mf.selectedElements);
    elementsToProcess.forEach(el => {
      mf.startElementPos.set(el.uid, {
        left: parseInt(el.style.left) || 0,
        top: parseInt(el.style.top) || 0,
        width: el.offsetWidth,
        height: el.offsetHeight
      });

      if (mf.currentAction === 'duplicate') {
        const clone = el.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = el.style.left;
        clone.style.top = el.style.top;
        
        document.body.appendChild(clone);
        clone.initializeFramework(el.layer);
        
        mf.selectedElements.delete(el);
        el.classList.remove('selected');
        mf.selectedElements.add(clone);
        clone.classList.add('selected');
        
        mf.startElementPos.set(clone.uid, mf.startElementPos.get(el.uid));
      }
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event) {
    const mf = window.ManipulationFramework;
    const dx = event.clientX - mf.startMousePos.x;
    const dy = event.clientY - mf.startMousePos.y;

    mf.selectedElements.forEach(el => {
      const startPos = mf.startElementPos.get(el.uid);
      if (!startPos) return;

      if (mf.currentAction === 'move' || mf.currentAction === 'duplicate') {
        el.style.position = 'absolute';
        el.style.left = (startPos.left + dx) + 'px';
        el.style.top = (startPos.top + dy) + 'px';
      } else if (mf.currentAction === 'resize') {
        el.style.width = Math.max(10, startPos.width + dx) + 'px';
        el.style.height = Math.max(10, startPos.height + dy) + 'px';
      }
    });
  }

  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    window.ManipulationFramework.currentAction = null;
  }

  // Initialize event listeners
  document.addEventListener('mousedown', handleMouseDown);

  /**
   * Clipboard API
   */

  window.ManipulationFramework.copy = function() {
    const mf = window.ManipulationFramework;
    if (mf.selectedElements.size === 0) return;

    mf.clipboard.elements = Array.from(mf.selectedElements).map(el => serializeElement(el));
    mf.clipboard.sourceLayer = mf.currentLayer;
    mf.clipboard.timestamp = Date.now();
  };

  window.ManipulationFramework.cut = function() {
    const mf = window.ManipulationFramework;
    if (mf.selectedElements.size === 0) return;

    this.copy();
    mf.selectedElements.forEach(el => {
      mf.layers[el.layer].elements.delete(el.uid);
      el.remove();
    });
    mf.selectedElements.clear();
  };

  window.ManipulationFramework.paste = function(targetLayerName) {
    const mf = window.ManipulationFramework;
    const targetLayer = targetLayerName || mf.currentLayer;
    if (mf.clipboard.elements.length === 0) return;

    const pastedElements = [];

    mf.clipboard.elements.forEach((data, index) => {
      const el = document.createElement(data.tagName);
      Object.entries(data.attributes).forEach(([k, v]) => el.setAttribute(k, v));
      Object.entries(data.styles).forEach(([k, v]) => el.style.setProperty(k, v));
      el.innerHTML = data.innerHTML;
      document.body.appendChild(el);
      el.initializeFramework(targetLayer);
      
      let baseName = data.frameworkProperties.name;
      let name = baseName;
      let counter = 1;
      while (!isNameUniqueInLayer(name, targetLayer)) {
        name = `${baseName}_${counter++}`;
      }
      el.name = name;

      Object.entries(data.eventHandlers).forEach(([event, code]) => {
        try {
          const fn = new Function('event', `return (${code})(event)`);
          el[event] = fn;
        } catch (e) {
          console.warn(`Failed to restore event handler ${event} for ${name}`, e);
        }
      });

      Object.entries(data.customProperties).forEach(([k, v]) => el[k] = v);

      if (el.style.position === 'absolute') {
        const offset = (index + 1) * 20;
        el.style.left = (parseInt(el.style.left) || 0) + offset + 'px';
        el.style.top = (parseInt(el.style.top) || 0) + offset + 'px';
      }

      pastedElements.push(el);
    });

    mf.selectedElements.forEach(el => el.classList.remove('selected'));
    mf.selectedElements.clear();
    pastedElements.forEach(el => {
      mf.selectedElements.add(el);
      el.classList.add('selected');
    });
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    const mf = window.ManipulationFramework;

    if (event.ctrlKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      mf.toggleMode();
      return;
    }

    if (!mf.enabled) return;

    if (event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 'c':
          event.preventDefault();
          mf.copy();
          break;
        case 'x':
          event.preventDefault();
          mf.cut();
          break;
        case 'v':
          event.preventDefault();
          mf.paste();
          break;
      }
    }

    switch (event.key) {
      case 'F1':
        event.preventDefault();
        mf.switchLayer('document');
        break;
      case 'F2':
        event.preventDefault();
        mf.switchLayer('template');
        break;
      case 'F3':
        event.preventDefault();
        mf.switchLayer('page');
        break;
    }
  });

})();
