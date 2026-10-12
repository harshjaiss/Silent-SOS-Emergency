import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// Silent SOS Emergency Web App - React Component
// ==========================================

export default function SilentSOSApp() {
  // --- State Management ---
  const [isArmed, setIsArmed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [location, setLocation] = useState({
    lat: 26.8467,
    lng: 80.9462,
    accuracy: 12,
    timestamp: new Date().toLocaleTimeString()
  });
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Ananya Sharma (Sister)', phone: '+91 98765 43210', status: 'Pending' },
    { id: 2, name: 'Local Police Control', phone: '112', status: 'Pending' },
    { id: 3, name: 'Rahul Verma (Colleague)', phone: '+91 91234 56789', status: 'Pending' }
  ]);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), message: 'System initialized. Ready for silent activation.' }
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isDecoyActive, setIsDecoyActive] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');

  const holdTimerRef = useRef(null);
  const holdDuration = 2000; // 2 seconds hold requirement

  // --- Add Log Helper ---
  const addLog = (message) => {
    const timeStr = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timeStr, message }, ...prev]);
  };

  // --- Location Tracking Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0002,
        lng: prev.lng + (Math.random() - 0.5) * 0.0002,
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- SOS Hold Mechanics ---
  const startSosHold = (e) => {
    e.preventDefault();
    if (isArmed) return;

    const startTime = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / holdDuration, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        clearInterval(holdTimerRef.current);
        triggerEmergencySOS();
      }
    }, 20);
  };

  const cancelSosHold = () => {
    if (isArmed) return;
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  };

  const triggerEmergencySOS = () => {
    setIsArmed(true);
    addLog('CRITICAL: Silent SOS triggered successfully.');

    contacts.forEach((contact, index) => {
      setTimeout(() => {
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'Sent' } : c));
        addLog(`Alert dispatched to ${contact.name} (${contact.phone})`);

        setTimeout(() => {
          setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'Acknowledged' }