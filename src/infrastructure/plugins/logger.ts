import HapiPino from 'hapi-pino';

const customHapiPino = {
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
    stream: `${__dirname}/../../../log_files/app_${new Date().toJSON().slice(0, 10)}.log`,
  },
};

export { customHapiPino };
