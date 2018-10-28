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

export function isBrowser() {
  return typeof window !== "undefined" && window.document;
}
