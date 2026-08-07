import { ScrollView } from '../primitives';

export function Page({ children }: React.PropsWithChildren) {
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="px-5 pb-32 pt-4"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
