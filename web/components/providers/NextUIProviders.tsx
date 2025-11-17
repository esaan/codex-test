'use client';

import { NextUIProvider } from '@nextui-org/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function NextUIProviders({ children }: Props) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
