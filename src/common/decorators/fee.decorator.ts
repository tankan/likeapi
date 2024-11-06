import { SetMetadata } from '@nestjs/common';

export const FEE_KEY = 'fee';
export const Fee = (fee: number) => SetMetadata(FEE_KEY, fee);
