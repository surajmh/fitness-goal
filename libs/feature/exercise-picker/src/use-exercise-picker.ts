import { useEffect, useMemo, useState } from 'react';
import type { Exercise } from '@fitnessgoal/data-access/workout';
import { filterExercises } from './exercise-picker.helpers';

export function useExercisePicker(exercises: Exercise[]) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('all');
  const [equipment, setEquipment] = useState('all');
  const [visibleLimit, setVisibleLimit] = useState(60);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () => filterExercises(exercises, { query, muscle, equipment }),
    [equipment, exercises, muscle, query],
  );

  useEffect(() => setVisibleLimit(60), [equipment, muscle, query]);

  const resetFilters = () => {
    setQuery('');
    setMuscle('all');
    setEquipment('all');
  };

  const isFiltered =
    query.trim() !== '' || muscle !== 'all' || equipment !== 'all';

  const activeFilterCount =
    (muscle !== 'all' ? 1 : 0) + (equipment !== 'all' ? 1 : 0);

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
    resetFilters,
    isFiltered,
    showFilters,
    setShowFilters,
    toggleFilters: () => setShowFilters((prev) => !prev),
    activeFilterCount,
  };
}
