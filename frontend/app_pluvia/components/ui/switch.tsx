import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform } from 'react-native';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex h-[1.15rem] shrink-0 flex-row py-3 w-12 items-center rounded-full border-[2px] border-[#9A9A9A] shadow-sm shadow-black/5 bg-white',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-primaria-azul' : 'bg-white',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background size-4 rounded-full transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          props.checked
            ? 'bg-white translate-x-6'
            : 'bg-[#9A9A9A] translate-x-1'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
