export function trace(input, prefix = "TRACE") {
  console.log(prefix, input);
  return input;
}

export function traceFunc(func, prefix = "TRACE") {
  return (...args) => {
    func(...args);
    console.log(prefix, args);
  };
}

export function throttleEvent(type, name, obj) {
  obj = obj || window;
  var running = false;
  var func = function() {
    if (running) {
      return;
    }
    running = true;
    requestAnimationFrame(function() {
      obj.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  obj.addEventListener(type, func);
}

export function isBrowser() {
  return typeof window !== "undefined" && window.document;
}
