// todo
function colorConsole(color: string, prefix: string, ...args: any[]) {
  const info = [...([`%c [${prefix}]:`].concat(args))]
  console.log(info.join(' '), `color: ${color};`);

}
export default {
  info(...args: any[]) {
    colorConsole('#93e871', 'info', ...args);
  },
  warn(...args: any[]) {
    colorConsole('#ff7700', 'warn', ...args);
  },
  error(...args: any[]) {
    colorConsole('#ff3000', 'error', ...args);
  },
  debug(...args: any[]) {
    colorConsole('#007dff', 'debug', ...args);
  }
};
