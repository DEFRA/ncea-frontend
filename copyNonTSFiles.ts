import * as shell from 'shelljs';

shell.mkdir('-p', 'build/infrastructure/log_files');
shell.cp('-R', 'src/views', 'build/views');
shell.cp('-R', 'public', 'build/public');