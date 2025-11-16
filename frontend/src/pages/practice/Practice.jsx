import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SubtopicSelection from '../../components/practice/SubtopicSelection';
import PracticeProblem from '../../components/practice/PracticeProblem';

const Practice = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="subtopics" replace />} />
      <Route path="subtopics" element={<SubtopicSelection />} />
      <Route path="problem/:subtopicId" element={<PracticeProblem />} />
      <Route path="*" element={<Navigate to="subtopics" replace />} />
    </Routes>
  );
};

export default Practice;