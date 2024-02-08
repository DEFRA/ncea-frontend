
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const shell = require('shelljs');

shell.mkdir('-p', 'build/infrastructure/log_files');
shell.cp('-R', 'src/views', 'build/views');
shell.cp('-R', 'src/public', 'build/public');
