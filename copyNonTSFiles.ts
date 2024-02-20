import * as shell from 'shelljs';

shell.mkdir('-p', 'build/infrastructure/log_files');
shell.cp('-R', 'src/views', 'build/');
