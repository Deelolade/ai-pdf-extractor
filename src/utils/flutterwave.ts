const Flutterwave = require('flutterwave-node-v3');
import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from './env';

export const flw = new Flutterwave(
    FLW_PUBLIC_KEY,
    FLW_SECRET_KEY
)