import Flutterwave from 'flutterwave-node-v3';
import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from './env';

const flw = new Flutterwave(
    FLW_PUBLIC_KEY,
    FLW_SECRET_KEY
)