(function($) {
  // CODEFROM: http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
  var clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) {
      return obj;
    }

    var copy;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        var i;
        for (i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        var attr;
        for (attr in obj) { if (obj.hasOwnProperty(attr)) {
          copy[attr] = clone(obj[attr]);
        }}
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  };

  $.trueClone = clone;
}(jQuery));

(function($) {
  // CODEFROM: http://stackoverflow.com/questions/???
  $.fn.trueOffset = function(options) {
    // CODEFROM: jQuery
    if (arguments.length) {
      return options === undefined ?
        this :
        this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
    }

    var node = $(this).first()[0];
    var x = 0, y = 0, win = window;
    if (!node.ownerDocument) {
      return;
    }

    var getStyle = function(node) {
      return node.currentStyle || // IE
             win.getComputedStyle(node, '');
    };

    var addOffset = function(node) {
      var p = node.offsetParent, style, X, Y;
      x += parseInt(node.offsetLeft, 10) || 0;
      y += parseInt(node.offsetTop, 10) || 0;

      if (p) {
        x -= parseInt(p.scrollLeft, 10) || 0;
        y -= parseInt(p.scrollTop, 10) || 0;

        if (p.nodeType === 1) {
          var parentStyle = getStyle(p),
              localName   = p.localName,
              parent      = node.parentNode;
          if (parentStyle.position !== 'static') {
            x += parseInt(parentStyle.borderLeftWidth, 10) || 0;
            y += parseInt(parentStyle.borderTopWidth, 10) || 0;

            if (localName === 'TABLE') {
              x += parseInt(parentStyle.paddingLeft, 10) || 0;
              y += parseInt(parentStyle.paddingTop, 10) || 0;
            }
            else if (localName === 'BODY') {
              style = getStyle(node);
              x += parseInt(style.marginLeft, 10) || 0;
              y += parseInt(style.marginTop, 10) || 0;
            }
          }
          else if (localName === 'BODY') {
            x += parseInt(parentStyle.borderLeftWidth, 10) || 0;
            y += parseInt(parentStyle.borderTopWidth, 10) || 0;
          }

          while (p !== parent) {
            x -= parseInt(parent.scrollLeft, 10) || 0;
            y -= parseInt(parent.scrollTop, 10) || 0;
            parent = parent.parentNode;
          }
          addOffset(p);
        }
      }
      else {
        if (node.localName === 'BODY') {
          style = getStyle(node);
          x += parseInt(style.borderLeftWidth, 10) || 0;
          y += parseInt(style.borderTopWidth, 10) || 0;

          var htmlStyle = getStyle(node.parentNode);
          x -= parseInt(htmlStyle.paddingLeft, 10) || 0;
          y -= parseInt(htmlStyle.paddingTop, 10) || 0;
        }

        X = node.scrollLeft;
        if (X) {
          x += parseInt(X, 10) || 0;
        }
        Y = node.scrollTop;
        if (Y) {
          y += parseInt(Y, 10) || 0;
        }
      }
    };

    if (node) {
      addOffset(node);
    }
    return { left: x, top: y };
  };
}(jQuery));

(function($) {
  $.fn.trueCenterPoint = function() {
    var element = $(this).first();
    var offset = element.trueOffset();
    return {
      x: offset.left + element.width() / 2,
      y: offset.top + element.height() / 2
    };
  };
}(jQuery));

(function($) {
  $.fn.trueCenter = function(options) {
    var settings = $.extend({
      ignorePaddings: true
    }, options);

    return this.each(function() {
      if (!settings.container) {
        settings.container = $(this).parent();
      } else {
        if (typeof settings.container === 'string') {
          settings.container = $(this).parents(settings.container);
        }
      }

      container = settings.container

      // TODO: Asymetrical paddings.
      var padding = { left: 0, top: 0 };
      if (!settings.ignorePaddings) {
        padding = {
          left: (container.outerWidth() - container.width()) / 2,
          top: (container.outerHeight() - container.height()) / 2
        };
      }

      var left = (container.width() - $(this).width()) / 2 + padding.left;
      var top = (container.height() -  $(this).height()) / 2 + padding.top;
      $(this).css({
        'left': left + 'px',
        'top': top + 'px'
      });

      return this;
    });
  };
}(jQuery));

(function($) {
  $.fn.trueImageSize = function(callback) {
    var img = new Image();
    img.onload = function() {
      callback({ width: this.width, height: this.height });
    };
    img.src = $(this).attr('src');
  };
}(jQuery));

(function($) {
  var resize = function(content, container_size, method, aspectRatio) {
    var width = 0;
    var height = 0;

    if (aspectRatio) {
      var containerAspectRatio = container_size.width / container_size.height;
      var contentAspectRatio = content.width() / content.height();

      if ((containerAspectRatio > contentAspectRatio && method === 'fit') ||
          (containerAspectRatio < contentAspectRatio && method === 'fill')) {
          // Container higher than content.
          height = container_size.height;
          width = content.width() * (container_size.height / content.height());
      } else {
          // Container wider than content.
          width = container_size.width;
          height = content.height() * (container_size.width / content.width());
      }
    } else {
      width = container_size.width;
      height = container_size.height;
    }
    content.css({
      'width': width + 'px',
      'height': height + 'px'
    });
  };

  $.fn.trueResize = function(options) {
    var settings = $.extend({
      method: 'fit',
      preserveAspectRatio: true
    }, options);

    return this.each(function() {
      if (!settings.size) {
        if (!settings.container) {
          settings.container = $(this).parent();
        } else {
          if (typeof settings.container === 'string') {
            settings.container = $(this).parents(settings.container);
          }
        }
        settings.size = {
          width: settings.container.width(),
          height: settings.container.height(),
        }
      }

      resize($(this), settings.size, settings.method, settings.preserveAspectRatio);

      return this;
    });
  };

  $.fn.trueFit = function(options) {
    return $(this).trueResize(options, 'fit');
  };

  $.fn.trueFill = function(options) {
    return $(this).trueResize(options, 'fill');
  };
}(jQuery));

(function($) {
  var line_angle = function(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  };

  var remove_transform = function(style) {
    style = style.replace(/ -webkit-transform:.*;/i, '');
    style = style.replace(/ -ms-transform:.*;/i, '');
    style = style.replace(/ transform:.*;/i, '');
    return style;
  };

  var set_transform = function(style, transform) {
    style = remove_transform(style);
    style += ' -webkit-transform: ' + transform + ';' +
             ' -ms-transform: ' + transform + ';' +
             ' transform: ' + transform + ';';
    return style;
  };

  var methods = {
    init: function(options) {
      var settings = $.extend({
        // Defaults
      }, options);
      return this.each(function() {
        var $this = $(this),
            data = $this.data('trueRotatable');
        if (!data) {
          var isRotating = false;
          var center;
          var handle = $('<div></div>')
            .addClass('true-rotatable-handle')
            .on('mousedown', function(e) {
              center = $this.trueCenterPoint();
              isRotating = true;
              e.preventDefault();
              e.stopPropagation();
            });
          $this.append(handle);
          var tip = $('<div></div>')
            .addClass('true-rotatable-handle-tip');
          $(document)
            .on('mousemove', function(e) {
              if (!isRotating) {
                return;
              }
              var angle = line_angle(center.x, center.y, e.pageX, e.pageY) +
                          Math.PI / 2;
              var style = $this.attr('style');
              style = set_transform(style, 'rotate(' + angle + 'rad)');
              $this.attr('style', style);
              e.preventDefault();
              e.stopPropagation();
            })
            .on('mouseup', function(e) {
              if (isRotating) {
                if (settings.stop) {
                  settings.stop(e);
                }
                center = undefined;
                isRotating = false;
              }
            });
          handle.append(tip);

          $this
            .addClass('true-rotatable')
            .data('trueRotatable', {
              handle: handle,
              settings: $.trueClone(settings)
            });
        }
      });
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this),
            data = $this.data('trueRotatable');
        if (!data) {
          $.error('Object not jQuery.trueRotatable');
          return;
        }
        $this.find('.true-rotatable-handle').remove();
        $this
          .removeClass('true-rotatable')
          .data('trueRotatable', null);
      });
    }
  };

  $.fn.trueRotatable = function(method) {
    var result;
    if (methods[method]) {
      result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      result = methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.trueRotatable');
    }
    return result;
  };

}(jQuery));


(function($) {
  var line_length = function(pos1, pos2) {
    return Math.pow(
      Math.pow(pos2.top - pos1.top, 2) +
      Math.pow(pos2.left - pos1.left, 2),
      0.5);
  };

  var point_projection_on_line = function(point, line_p0, line_p1) {
    var result = {};
    var line_dx = line_p0.left - line_p1.left;
    var line_dy = line_p0.top - line_p1.top;
    var b1 = point.left * line_dx +
             point.top * line_dy;
    var b2 = line_p0.left * line_p1.top - line_p0.top * line_p1.left;

    result.top = Math.pow(line_dx, 2) + Math.pow(line_dy, 2);

    var det_k = b1 * line_dx - b2 * line_dy;
    result.left = det_k / result.top;

    det_k = line_dx * b2 + line_dy * b1;
    result.top = det_k / result.top;

    return result;
  };

  var distance_from_point_to_line = function(point, line_p0, line_p1) {
    var a = line_p0.top - line_p1.top,
        b = line_p1.left - line_p0.left,
        c = line_p0.left * line_p1.top - line_p0.top * line_p1.left;
    return (a * point.left + b * point.top + c) / Math.sqrt(a * a + b * b);
  };

  var real_center = function(element) {
    var real_rect = element[0].getBoundingClientRect();
    return {
      left: real_rect.left + real_rect.width / 2,
      top: real_rect.top + real_rect.height / 2
    };
  };

  var methods = {
    init: function(options) {
      var settings = $.extend({
        containment: 'document',
        aspectRatio: true
      }, options);
      return this.each(function() {
        var $this = $(this),
            data = $this.data('trueResizable');
        if (!data) {
          var handles = {};
          var handlesNames = ['tl', 'tr', 'br', 'bl'];
          var handlesCount = handlesNames.length;
          var resizing;
          var mousedown_handler_factory = function(handle) {
            return function(e) {
              resizing = {
                update: {
                  left: false,
                  top: false
                }
              };

              var oppositeHandle, heightHandle, widthHandle;
              var widthReversedOrder = false,
                  heightReversedOrder = false;

              if (handle.data('name') === 'tl') {
                oppositeHandle = handles.br;
                widthHandle = handles.bl;
                heightHandle = handles.tr;
                widthReversedOrder = true;
              } else if (handle.data('name') === 'tr') {
                oppositeHandle = handles.bl;
                widthHandle = handles.br;
                heightHandle = handles.tl;
                heightReversedOrder = true;
              } else if (handle.data('name') === 'br') {
                oppositeHandle = handles.tl;
                widthHandle = handles.tr;
                heightHandle = handles.bl;
                widthReversedOrder = true;
              } else if (handle.data('name') === 'bl') {
                oppositeHandle = handles.tr;
                widthHandle = handles.tl;
                heightHandle = handles.br;
                heightReversedOrder = true;
              }

              var active_point = real_center(handle),
                opposite_point = real_center(oppositeHandle),
                  height_point = real_center(heightHandle),
                   width_point = real_center(widthHandle);


              resizing.start_css = {
                left: $this.position().left,
                top: $this.position().top,
                width: $this.width(),
                height: $this.height()
              };

              resizing.calculateDeltaX = function(point) {
                var result;
                if (widthReversedOrder) {
                  result = distance_from_point_to_line(
                            point, active_point, width_point);
                } else {
                  result = distance_from_point_to_line(
                            point, width_point, active_point);
                }
                return result;
              };

              resizing.calculateDeltaY = function(point) {
                var result;
                if (heightReversedOrder) {
                  result = distance_from_point_to_line(
                            point, active_point, height_point);
                } else {
                  result = distance_from_point_to_line(
                            point, height_point, active_point);
                }
                return result;
              };

              resizing.transformPointToPreserveAspectRatio = function(point) {
                return point_projection_on_line(
                  point, active_point, opposite_point
                );
              };

              e.stopPropagation();
              e.preventDefault();
            };
          };
          $(document)
            .on('mousemove', function(e) {
              if (!resizing) {
                return;
              }
              var point = {
                left: e.pageX,
                top: e.pageY
              };
              if (settings.aspectRatio) {
                point = resizing.transformPointToPreserveAspectRatio(point);
              }

              var deltaX = resizing.calculateDeltaX(point);
              var deltaY = resizing.calculateDeltaY(point);

              var width = resizing.start_css.width + deltaX * 2;
              var height = resizing.start_css.height + deltaY * 2;
              var left = resizing.start_css.left - deltaX;
              var top = resizing.start_css.top - deltaY;

              var css = {
                width: width + 'px',
                height: height + 'px',
                left: left + 'px',
                top: top + 'px'
              };
              $this.css(css);

              e.preventDefault();
              e.stopPropagation();
            })
            .on('mouseup', function(e) {
              if (resizing) {
                if (settings.stop) {
                  settings.stop(e);
                }
                resizing = null;
              }
            });
          var i;
          for (i = 0; i < handlesCount; ++i) {
            var name = handlesNames[i];
            var handle = $('<div></div>')
              .addClass('true-resizable-handle')
              .addClass(name)
              .data('name', name);
            handle
              .on('mousedown', mousedown_handler_factory(handle));
            $this.append(handle);
            handles[name] = handle;
          }
          $this
            .addClass('true-resizable')
            .css({
              width: $this.width() + 'px',
              height: $this.height() + 'px'
             })
            .data('trueResizable', {
              handles: handles,
              settings: $.trueClone(settings)
            });
        }
      });
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this),
            data = $this.data('trueResizable');
        if (!data) {
          $.error('Object not jQuery.trueResizable');
          return;
        }
        $this.find('.true-resizable-handle').remove();
        $this
          .removeClass('true-resizable')
          .data('trueResizable', null);
      });
    }
  };

  $.fn.trueResizable = function(method) {
    var result;
    if (methods[method]) {
      result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      result = methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.trueResizable');
    }
    return result;
  };
}(jQuery));
