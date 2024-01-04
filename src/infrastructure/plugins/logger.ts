import HapiPino from 'hapi-pino';

module.exports = {
  plugin: HapiPino,
  options: {
    level: 'info',
    redact: ['req.headers.authorization'],
    formatters: {
      bindings: (bindings: { pid: number; hostname: string }) => ({
        process_id: bindings.pid,
        host: bindings.hostname,
      }),
      level: (label: string) => ({ severity: label.toUpperCase() }),
    },
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    stream: `${__dirname}/../logs/app_${new Date().toJSON().slice(0, 10)}.log`,
  },
};