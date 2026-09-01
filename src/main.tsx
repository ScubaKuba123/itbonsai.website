import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/globals.css';
import { AppShell } from './components/AppShell';
import { OfficeSunsetShell } from './components/OfficeSunsetShell';
import { YgrassilPremiumHost } from './YgrassilPremiumHost';
import { ForestPage } from './forest/ForestPage';
const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const hash = window.location.hash.toLowerCase();
const ygrassil = pathname.startsWith('/ygrassil') || hash === '#ygrassil';
const forest = pathname.startsWith('/forest') || pathname.startsWith('/bonsai-forest') || hash === '#forest';
const office = pathname.startsWith('/office') || hash === '#office';
document.title = office ? 'BonsAI Office - Centrum dowodzenia' : forest ? 'BonsAI Forest - Ecosystem Map' : ygrassil ? 'Ygrassil - Autonomous Sales Engine' : 'BonsAI City';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {office ? <OfficeSunsetShell /> : forest ? <ForestPage /> : ygrassil ? <YgrassilPremiumHost /> : <AppShell />}
  </React.StrictMode>,
);
