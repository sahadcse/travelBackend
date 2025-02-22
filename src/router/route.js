class Route {
  constructor(method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.paramNames = [];
    this.regex = this.createRouteRegex(path);
  }

  createRouteRegex(path) {
    let paramNames = [];
    let regexPath = path.replace(/:(\w+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });
    regexPath = regexPath.replace(/\//g, "\\/");
    this.paramNames = paramNames;
    return new RegExp(`^${regexPath}$`);
  }

  match(method, path) {
    if (this.method !== method) {
      return null;
    }

    const match = this.regex.exec(path);
    if (!match) {
      return null;
    }

    const params = {};
    this.paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  }
}

module.exports = Route;
