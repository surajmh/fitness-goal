import { ExerciseFigure, type ExerciseFigureVariant } from '../icons';
import type { Exercise } from '@fitnessgoal/data-access/workout';
import { useCSSVariable, View } from '../primitives';

export function ExerciseArtwork({
  exercise,
  compact = false,
}: {
  exercise?: Exercise;
  compact?: boolean;
}) {
  const { color, variant } = useExerciseVisual(exercise);

  return (
    <View
      className={`items-center justify-center rounded-lg border border-outline bg-surface-raised ${
        compact ? 'h-11 w-12' : 'h-12 w-14'
      }`}
    >
      <ExerciseFigure
        color={color}
        size={compact ? 36 : 42}
        variant={variant}
      />
    </View>
  );
}

export function useExerciseVisual(exercise?: Exercise) {
  const coral = useCSSVariable('--coral') as string;
  const lime = useCSSVariable('--lime') as string;
  const cyan = useCSSVariable('--cyan') as string;
  const recovery = useCSSVariable('--recovery') as string;
  const warning = useCSSVariable('--warning') as string;
  const name = exercise?.name.toLowerCase() ?? '';
  const muscle = exercise?.muscleGroup.toLowerCase() ?? '';
  const type = exercise?.type.toLowerCase() ?? '';
  const bodyPart = exercise?.bodyPart?.toLowerCase() ?? '';
  let variant: ExerciseFigureVariant = 'generic';

  if (
    type === 'cardio' ||
    bodyPart === 'cardio' ||
    /run|jog|bike|cycling|jump|burpee|rope|elliptical/.test(name)
  )
    variant = 'cardio';
  else if (/deadlift|hip thrust|good morning|pull-through|hinge/.test(name))
    variant = 'hinge';
  else if (
    bodyPart === 'waist' ||
    /ab|core|crunch|plank|sit-up|twist/.test(name)
  )
    variant = 'core';
  else if (/squat|lunge|leg|calf|step-up/.test(name)) variant = 'squat';
  else if (/row|pull|lat|curl|chin/.test(name)) variant = 'pull';
  else if (/stretch|mobility|yoga|rotation/.test(name)) variant = 'mobility';
  else if (/press|bench|fly|push|dip/.test(name)) variant = 'press';

  const color =
    variant === 'press' || muscle.includes('chest')
      ? coral
      : variant === 'squat' ||
          variant === 'hinge' ||
          muscle.includes('quad') ||
          muscle.includes('glute')
        ? lime
        : variant === 'pull' || variant === 'cardio' || muscle.includes('back')
          ? cyan
          : variant === 'mobility' ||
              variant === 'core' ||
              muscle.includes('shoulder')
            ? recovery
            : warning;

  return { color, variant };
}
