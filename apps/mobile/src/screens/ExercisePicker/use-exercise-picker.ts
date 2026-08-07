import { useEffect, useMemo, useState } from 'react';
import type { Exercise } from '../../database';
import { filterExercises } from './exercise-picker.helpers';

export function useExercisePicker(exercises: Exercise[]) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('all');
  const [equipment, setEquipment] = useState('all');
  const [visibleLimit, setVisibleLimit] = useState(60);
  const filtered = useMemo(
    () => filterExercises(exercises, { query, muscle, equipment }),
    [equipment, exercises, muscle, query],
  );

  useEffect(() => setVisibleLimit(60), [equipment, muscle, query]);

  return {
    query,
    setQuery,
    muscle,
    setMuscle,
    equipment,
    setEquipment,
    filtered,
    visibleLimit,
    showMore: () => setVisibleLimit((value) => value + 60),
  };
}
