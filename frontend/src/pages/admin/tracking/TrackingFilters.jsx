import { Search, RefreshCw } from 'lucide-react';
import { STAGES } from './trackingConstants';
import styles from './TrackingFilters.module.css';

export default function TrackingFilters({
  search,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  onRefresh,
}) {
  const filters = [{ step: 0, label: 'Todos' }, ...STAGES.map((s) => ({ step: s.step, label: s.label }))];

  return (
    <div className={styles.row}>
      <div className={styles.searchBar}>
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar cliente por nombre o email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar cliente"
        />
      </div>
      <div className={styles.stageFilters} role="group" aria-label="Filtrar por etapa">
        {filters.map((f) => (
          <button
            key={f.step}
            type="button"
            onClick={() => onStageFilterChange(f.step)}
            className={`${styles.filterBtn} ${stageFilter === f.step ? styles.active : ''}`}
            aria-pressed={stageFilter === f.step}
          >
            {f.label}
          </button>
        ))}
        <button type="button" onClick={onRefresh} className={styles.refreshBtn}>
          <RefreshCw size={14} aria-hidden="true" /> Actualizar
        </button>
      </div>
    </div>
  );
}
