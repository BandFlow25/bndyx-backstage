import { ReactNode } from 'react';

export interface ProvidersProps {
  children: ReactNode;
}

declare const Providers: React.FC<ProvidersProps>;

export default Providers;
