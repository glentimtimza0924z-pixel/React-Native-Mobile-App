import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialLabsData } from '../constants/labsData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global Pair Parameters
  const [partner1, setPartner1] = useState('[Your Name]');
  const [partner2, setPartner2] = useState('[Partner\'s Name]');
  const [course, setCourse] = useState('CS 321 - Mobile Computing');
  const [section, setSection] = useState('BSCS 4-B');
  const [academicYear, setAcademicYear] = useState('A.Y. 2026-2027 (1st Sem)');

  // Dynamic Laboratory State (no hardcoded static list)
  const [labs, setLabs] = useState(initialLabsData);

  // Dynamic pairNames combined string
  const pairNames = useMemo(() => {
    if (partner1 && partner2) {
      return `${partner1} & ${partner2}`;
    }
    return partner1 || partner2 || '[Your Name] & [Partner\'s Name]';
  }, [partner1, partner2]);

  // Unified profile object reflecting live state
  const profile = useMemo(
    () => ({
      pairNames,
      partner1,
      partner2,
      course,
      section,
      academicYear,
      projectName: 'DevLab Master Compilation App',
      pair: [
        {
          id: '1',
          name: partner1,
          studentId: '2023-XXXXX-1',
          role: 'Lead UI/UX & Responsive Layouts',
          avatar: '👨‍💻',
          contribution: 'Custom Component Architecture, Responsive Flexbox, and Dashboard UI.',
        },
        {
          id: '2',
          name: partner2,
          studentId: '2023-XXXXX-2',
          role: 'Global State & Navigation Architect',
          avatar: '👩‍💻',
          contribution: 'Context API Global State, Multi-Screen Navigation, and Real-Time Synchronization.',
        },
      ],
    }),
    [pairNames, partner1, partner2, course, section, academicYear]
  );

  // Add a new laboratory activity dynamically
  const addLab = ({ title, category, description, status, dueDate }) => {
    setLabs((prevLabs) => {
      const nextNum = String(prevLabs.length + 1).padStart(2, '0');
      const newEntry = {
        id: `lab-${Date.now()}`,
        number: nextNum,
        title: title?.trim() || `Activity #${nextNum}`,
        category: category?.trim() || 'General Mobile',
        badge: 'Laboratory',
        description:
          description?.trim() ||
          'Laboratory activity compiled for course requirement evaluation.',
        objectives: [
          'Fulfill designated laboratory deliverable requirements',
          'Demonstrate component architecture and responsive mobile layout',
          'Evaluate code quality, state handling, and interactive UI'
        ],
        status: status || 'Pending',
        score: status === 'Completed' ? '100 / 100' : 'Pending Review',
        dueDate: dueDate?.trim() || 'Current Term',
        icon: '📱',
        interactiveType: 'custom',
        createdAt: new Date().toISOString(),
      };
      return [newEntry, ...prevLabs];
    });
  };

  // Delete a laboratory activity by ID
  const deleteLab = (labId) => {
    setLabs((prevLabs) => prevLabs.filter((lab) => lab.id !== labId));
  };

  // Update a lab by ID
  const updateLab = (labId, updatedData) => {
    setLabs((prevLabs) =>
      prevLabs.map((lab) => (lab.id === labId ? { ...lab, ...updatedData } : lab))
    );
  };

  // Toggle completion status for a specific laboratory
  const toggleLabStatus = (labId) => {
    setLabs((prevLabs) =>
      prevLabs.map((lab) => {
        if (lab.id === labId) {
          const nextStatus =
            lab.status === 'Completed'
              ? 'Pending'
              : lab.status === 'Pending'
              ? 'In Progress'
              : 'Completed';
          return {
            ...lab,
            status: nextStatus,
            score: nextStatus === 'Completed' ? '100 / 100' : 'Pending Review',
          };
        }
        return lab;
      })
    );
  };

  const setLabStatus = (labId, status) => {
    setLabs((prevLabs) =>
      prevLabs.map((lab) =>
        lab.id === labId
          ? {
              ...lab,
              status,
              score: status === 'Completed' ? '100 / 100' : 'Pending Review',
            }
          : lab
      )
    );
  };

  const resetLabProgress = () => {
    setLabs([]);
  };

  // Derived statistics recalculated immediately in real time
  const stats = useMemo(() => {
    const total = labs.length;
    const completed = labs.filter((l) => l.status === 'Completed').length;
    const inProgress = labs.filter((l) => l.status === 'In Progress').length;
    const pending = labs.filter((l) => l.status === 'Pending').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      total,
      completed,
      inProgress,
      pending,
      percentage,
    };
  }, [labs]);

  const value = useMemo(
    () => ({
      pairNames,
      partner1,
      partner2,
      course,
      section,
      profile,
      labs,
      stats,
      setPartner1,
      setPartner2,
      setCourse,
      setSection,
      addLab,
      deleteLab,
      updateLab,
      toggleLabStatus,
      setLabStatus,
      resetLabProgress,
    }),
    [pairNames, partner1, partner2, course, section, profile, labs, stats]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
