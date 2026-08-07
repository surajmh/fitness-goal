import { useState } from 'react';
import type { WorkoutPlan } from '@fitnessgoal/data-access/workout';

export function usePlansScreen() {
  const [building, setBuilding] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [message, setMessage] = useState('');
  return {
    building,
    setBuilding,
    selectedPlan,
    setSelectedPlan,
    message,
    setMessage,
  };
}
