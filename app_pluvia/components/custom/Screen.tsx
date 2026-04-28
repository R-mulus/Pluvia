import * as React from 'react'
import { SafeAreaView} from 'react-native-safe-area-context';
import { ViewProps, View } from 'react-native';

export function Screen({ children, className, ...props }: ViewProps) {
  return (
    // edges={['top']} garante que ele só aplique o espaço no topo.
    <View 
      // edges={['top']}
      className={`flex-1 bg-bg px-5 py-4 gap-4 ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}