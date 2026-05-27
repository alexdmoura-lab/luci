import { NUTRI_DIAS, SUPLEMENTOS } from '@/lib/plan-data';
import { todayISO } from '@/lib/dates';
import { getDailyLog } from '@/lib/queries';
import { NutriClient } from './nutri-client';

export const dynamic = 'force-dynamic';

export default async function NutricaoPage() {
  const today = await getDailyLog(todayISO());
  return (
    <NutriClient
      dias={NUTRI_DIAS}
      suplementos={SUPLEMENTOS}
      todayLog={today}
    />
  );
}
