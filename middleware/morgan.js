import morgan from 'morgan';
import chalk from 'chalk';

// Morgan custom token for colored status code
morgan.token('statusColored', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    if (status >= 200) return chalk.green(status);
    return status;
});

// Morgan custom token for timestamp
morgan.token('date', () => new Date().toISOString());

// Morgan custom token for user IP
morgan.token('remote-ip', (req) => req.ip || req.connection.remoteAddress);

const morganFormat = ':date :remote-ip :method :url :statusColored :response-time ms';

export const morganMiddleware = morgan(morganFormat);