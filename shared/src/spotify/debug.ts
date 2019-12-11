const spDebug = function e(t: string): any {
  return function(...args: any[]) { return console.debug(`[${ t }]`, ...args) }
};

export default spDebug